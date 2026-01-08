/**
 * Fiscal Printer Utility
 * Handles fiscal receipt printing via Tremol/DAVID fiscal printer
 * 
 * Requirements:
 * - ZFPLab Server running on localhost:4444
 * - Tremol SDK files (fp_core.js, fp.js) loaded in the browser
 * - Fiscal printer connected to the system
 */

// Operator passwords to try (different printers may have different defaults)
const OPERATOR_PASSWORDS = ["0 ", "0000", "1   ", "0001"];

/**
 * Check if the Tremol library is available
 */
export const isFiscalPrinterAvailable = () => {
    return typeof window !== 'undefined' && 
           typeof window.Tremol !== 'undefined' && 
           typeof window.Tremol.FP === 'function';
};

/**
 * Connect to the fiscal printer
 * @returns {Object|null} FP instance if connected, null otherwise
 */
export const connectFiscalPrinter = () => {
    if (!isFiscalPrinterAvailable()) {
        console.error('Tremol fiscal printer library not loaded. Please add fp_core.js and fp.js to /libs/');
        return null;
    }

    try {
        const fp = new window.Tremol.FP();
        
        // Connect to ZFPLab Server
        fp.ServerSetSettings("http://localhost", 4444);
        
        // Try to find the connected printer
        const device = fp.ServerFindDevice();
        
        if (device) {
            fp.ServerSetDeviceSerialSettings(
                device.serialPort,
                device.baudRate,
                true // keepPortOpen
            );
            console.log('Fiscal printer connected:', device);
            return fp;
        } else {
            console.error('No fiscal printer device found');
            return null;
        }
    } catch (error) {
        console.error('Failed to connect to fiscal printer:', error.message);
        return null;
    }
};

/**
 * Check printer status and handle any blocking conditions
 * @param {Object} fp - Tremol FP instance
 * @returns {Object} Status object with isReady flag and any warnings
 */
export const checkPrinterStatus = (fp) => {
    const result = { isReady: false, warnings: [], errors: [] };
    
    try {
        const status = fp.ReadStatus();
        
        // Check for blocking errors
        if (status.Printer_not_ready_no_paper) {
            result.errors.push('Printer is out of paper');
        }
        if (status.Printer_not_ready_overheat) {
            result.errors.push('Printer is overheated');
        }
        if (status.FM_full) {
            result.errors.push('Fiscal memory is full');
        }
        if (status.Blocking_after_24_hours_without_report) {
            result.errors.push('24h timeout - Z-report required');
        }
        
        // Check for warnings
        if (status.DateTime_not_set) {
            result.warnings.push('Printer date/time not set');
        }
        if (status.OptionFiscalReceiptOpen === 1) {
            result.warnings.push('A fiscal receipt is currently open');
        }
        
        result.isReady = result.errors.length === 0;
        return result;
    } catch (error) {
        result.errors.push(`Failed to read status: ${error.message}`);
        return result;
    }
};

/**
 * Ensure any open receipt is closed before starting a new one
 * @param {Object} fp - Tremol FP instance
 */
export const ensureReceiptClosed = (fp) => {
    // Try to close non-fiscal receipt first
    try {
        fp.CloseNonFiscReceipt();
    } catch (e) {
        // Ignore if not open
    }
    
    // Check if fiscal receipt is open
    try {
        const status = fp.ReadStatus();
        if (status.OptionFiscalReceiptOpen === 1) {
            // Try to close it properly
            try {
                const info = fp.ReadCurrentRecInfo();
                if (info.OptionFinalizedPayment === 1) {
                    fp.CloseReceipt();
                    return true;
                }
            } catch (e) {
                // Continue to next method
            }
            
            // Try to pay and close
            try {
                const sub = fp.Subtotal(1, 1);
                if (sub > 0) {
                    fp.PayExactSum("0"); // Pay with cash
                }
                fp.CloseReceipt();
                return true;
            } catch (e) {
                // Last resort: emergency cancel
                try {
                    fp.DirectCommand(";");
                    return true;
                } catch (e2) {
                    return false;
                }
            }
        }
        return true;
    } catch (e) {
        return true; // Assume closed if we can't check
    }
};

/**
 * Open a fiscal receipt with self-healing password handling
 * @param {Object} fp - Tremol FP instance
 * @param {string} receiptType - '1' for fiscal, '0' for storno
 * @returns {boolean} True if receipt opened successfully
 */
const openReceipt = (fp, receiptType = '1') => {
    for (const pass of OPERATOR_PASSWORDS) {
        try {
            fp.OpenReceiptOrStorno(1, pass, receiptType, '0');
            return true;
        } catch (e) {
            const errorMsg = e.message || '';
            // If it's a password error, try next password
            if (errorMsg.toLowerCase().includes("password") || 
                errorMsg.includes("0x39")) {
                continue;
            }
            // For other errors, throw immediately
            throw e;
        }
    }
    throw new Error("Operator login failed - invalid password");
};

/**
 * Center text helper for 42-character width (79mm paper)
 */
const centerText = (text, width = 42) => {
    if (!text || text.trim().length === 0) return ' '.repeat(width);
    const trimmedText = text.trim();
    if (trimmedText.length >= width) return trimmedText.substring(0, width);
    const leftPad = Math.floor((width - trimmedText.length) / 2) + 3;
    const rightPad = width - trimmedText.length - leftPad;
    return " ".repeat(Math.max(0, leftPad)) + trimmedText + " ".repeat(Math.max(0, rightPad));
};

/**
 * Update fiscal printer header with business name
 * @param {Object} fp - Tremol FP instance
 * @param {string} businessName - Business name to display
 */
const updateFiscalHeader = (fp, businessName) => {
    try {
        // Clear line 1
        fp.ProgHeader('1', ' ');
        // Set business name on line 2 (centered)
        fp.ProgHeader('2', centerText(businessName || 'Restaurant'));
        // Clear remaining lines (3-8)
        for (let i = 3; i <= 8; i++) {
            fp.ProgHeader(i.toString(), ' ');
        }
    } catch (error) {
        console.warn('Failed to update fiscal header:', error.message);
        // Non-critical error, continue with receipt
    }
};

/**
 * Print a fiscal receipt for an order
 * @param {Object} order - The order object with items and total
 * @param {string} paymentMethod - 'cash' or 'card'
 * @param {string} businessName - Business name for receipt header
 * @returns {Object} Result object with success flag and any errors
 */
export const printFiscalReceipt = async (order, paymentMethod = 'cash', businessName = null) => {
    const result = { success: false, error: null, receiptNumber: null };
    
    if (!isFiscalPrinterAvailable()) {
        result.error = 'Fiscal printer library not available. Please install Tremol SDK.';
        return result;
    }
    
    let fp = null;
    
    try {
        // Connect to printer
        fp = connectFiscalPrinter();
        if (!fp) {
            result.error = 'Could not connect to fiscal printer. Check ZFPLab Server and printer connection.';
            return result;
        }
        
        // Check printer status
        const status = checkPrinterStatus(fp);
        if (!status.isReady) {
            result.error = `Printer not ready: ${status.errors.join(', ')}`;
            return result;
        }
        
        // Ensure no receipt is currently open
        ensureReceiptClosed(fp);
        
        // Update header with business name
        if (businessName) {
            updateFiscalHeader(fp, businessName);
        }
        
        // Open fiscal receipt
        openReceipt(fp, '1');
        
        // Register items
        if (order.items && order.items.length > 0) {
            for (const item of order.items) {
                const itemName = (item.name || 'Artikull').substring(0, 20); // Max 20 chars
                const vatClass = 'А'; // VAT class (Cyrillic A = standard VAT)
                const price = parseFloat(item.price) || 0;
                const quantity = parseFloat(item.quantity) || 1;
                
                // Register the item
                // '1' = Macedonian goods
                fp.SellPLUwithSpecifiedVAT(itemName, vatClass, price, '1', quantity);
            }
        }
        
        // Calculate subtotal and process payment
        try {
            const hwTotal = fp.Subtotal(1, 1); // 1 = print, 1 = display
            const paymentType = paymentMethod === 'card' ? 1 : 0;
            fp.Payment(paymentType, 0, hwTotal);
        } catch (e) {
            // Fallback: Use automatic exact sum payment
            const paymentType = paymentMethod === 'card' ? '1' : '0';
            fp.PayExactSum(paymentType);
        }
        
        // Close the receipt
        fp.CloseReceipt();
        
        // Get receipt number
        try {
            const receiptNum = fp.ReadLastReceiptNum();
            result.receiptNumber = receiptNum;
        } catch (e) {
            // Not critical if we can't get receipt number
        }
        
        result.success = true;
        console.log('Fiscal receipt printed successfully');
        
    } catch (error) {
        result.error = error.message || 'Unknown error during fiscal printing';
        console.error('Fiscal print error:', error);
        
        // Try to recover - close any open receipt
        if (fp) {
            try {
                ensureReceiptClosed(fp);
            } catch (e) {
                // Ignore recovery errors
            }
        }
    }
    
    return result;
};

/**
 * Print a storno (refund) fiscal receipt
 * @param {Object} order - The order object with items and total
 * @param {string} paymentMethod - 'cash' or 'card'
 * @param {string} businessName - Business name for receipt header
 * @returns {Object} Result object with success flag and any errors
 */
export const printStornoReceipt = async (order, paymentMethod = 'cash', businessName = null) => {
    const result = { success: false, error: null, receiptNumber: null };
    
    if (!isFiscalPrinterAvailable()) {
        result.error = 'Fiscal printer library not available. Please install Tremol SDK.';
        return result;
    }
    
    let fp = null;
    
    try {
        // Connect to printer
        fp = connectFiscalPrinter();
        if (!fp) {
            result.error = 'Could not connect to fiscal printer';
            return result;
        }
        
        // Check printer status
        const status = checkPrinterStatus(fp);
        if (!status.isReady) {
            result.error = `Printer not ready: ${status.errors.join(', ')}`;
            return result;
        }
        
        // Ensure no receipt is currently open
        ensureReceiptClosed(fp);
        
        // Update header with business name
        if (businessName) {
            updateFiscalHeader(fp, businessName);
        }
        
        // Open storno receipt (receipt type: '0')
        openReceipt(fp, '0');
        
        // Register items
        if (order.items && order.items.length > 0) {
            for (const item of order.items) {
                const itemName = (item.name || 'Artikull').substring(0, 20);
                const vatClass = 'А';
                const price = parseFloat(item.price) || 0;
                const quantity = parseFloat(item.quantity) || 1;
                
                fp.SellPLUwithSpecifiedVAT(itemName, vatClass, price, '1', quantity);
            }
        }
        
        // Process payment and close
        try {
            const hwTotal = fp.Subtotal(1, 1);
            const paymentType = paymentMethod === 'card' ? 1 : 0;
            fp.Payment(paymentType, 0, hwTotal);
        } catch (e) {
            const paymentType = paymentMethod === 'card' ? '1' : '0';
            fp.PayExactSum(paymentType);
        }
        
        fp.CloseReceipt();
        
        result.success = true;
        console.log('Storno receipt printed successfully');
        
    } catch (error) {
        result.error = error.message || 'Unknown error during storno printing';
        console.error('Storno print error:', error);
        
        if (fp) {
            try {
                ensureReceiptClosed(fp);
            } catch (e) {
                // Ignore
            }
        }
    }
    
    return result;
};

/**
 * Print X-Report (status report without resetting totals)
 * @returns {Object} Result object
 */
export const printXReport = async () => {
    const result = { success: false, error: null };
    
    if (!isFiscalPrinterAvailable()) {
        result.error = 'Fiscal printer library not available';
        return result;
    }
    
    try {
        const fp = connectFiscalPrinter();
        if (!fp) {
            result.error = 'Could not connect to fiscal printer';
            return result;
        }
        
        ensureReceiptClosed(fp);
        fp.PrintDailyReport("X");
        result.success = true;
        
    } catch (error) {
        result.error = error.message;
    }
    
    return result;
};

/**
 * Print Z-Report (end of day report, resets totals)
 * @returns {Object} Result object
 */
export const printZReport = async () => {
    const result = { success: false, error: null };
    
    if (!isFiscalPrinterAvailable()) {
        result.error = 'Fiscal printer library not available';
        return result;
    }
    
    try {
        const fp = connectFiscalPrinter();
        if (!fp) {
            result.error = 'Could not connect to fiscal printer';
            return result;
        }
        
        ensureReceiptClosed(fp);
        fp.PrintDailyReport("Z");
        result.success = true;
        
    } catch (error) {
        result.error = error.message;
    }
    
    return result;
};

/**
 * Test the fiscal printer connection
 * @returns {Object} Result object with connection status and device info
 */
export const testFiscalPrinterConnection = async () => {
    const result = { 
        success: false, 
        error: null, 
        libraryLoaded: false,
        serverConnected: false,
        printerFound: false,
        deviceInfo: null,
        printerStatus: null
    };
    
    // Check library
    result.libraryLoaded = isFiscalPrinterAvailable();
    if (!result.libraryLoaded) {
        result.error = 'Tremol library not loaded. Add fp_core.js and fp.js to /libs/';
        return result;
    }
    
    try {
        const fp = new window.Tremol.FP();
        fp.ServerSetSettings("http://localhost", 4444);
        
        // Try to find device
        const device = fp.ServerFindDevice();
        result.serverConnected = true;
        
        if (device) {
            result.printerFound = true;
            result.deviceInfo = device;
            
            // Connect and check status
            fp.ServerSetDeviceSerialSettings(device.serialPort, device.baudRate, true);
            
            const status = checkPrinterStatus(fp);
            result.printerStatus = status;
            result.success = status.isReady;
            
            if (!status.isReady) {
                result.error = status.errors.join(', ');
            }
        } else {
            result.error = 'No fiscal printer found. Check USB/COM connection.';
        }
        
    } catch (error) {
        if (error.message && error.message.includes('Failed to fetch')) {
            result.error = 'ZFPLab Server not running. Start ZFPLab Server on port 4444.';
        } else {
            result.error = error.message;
        }
    }
    
    return result;
};

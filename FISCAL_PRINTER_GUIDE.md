# Fiscal Printer Connection and Printing Guide

This guide explains how to connect the Tremol/DAVID fiscal printer to your POS software and how to print fiscal receipts using the provided JavaScript libraries.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Library Files](#library-files)
4. [Connecting the Printer](#connecting-the-printer)
5. [Printing Fiscal Receipts](#printing-fiscal-receipts)
6. [Common Operations](#common-operations)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The fiscal printer integration uses a **Client-Server-Device** architecture:

```
POS Application (Browser) → ZFPLab Server (localhost:4444) → Fiscal Printer (COM/USB/LAN)
```

The browser cannot directly access COM ports, so the **ZFPLab Server** acts as a middleware bridge between your web application and the physical printer.

---

## Prerequisites

Before you begin, ensure you have:

1. **ZFPLab Server installed and running**
   - The server must be running in the background
   - Default port: `4444`
   - The server handles communication with the physical printer

2. **Fiscal printer connected**
   - Connected via COM port, USB, or LAN/WiFi
   - Printer is powered on and ready

3. **Library files included in your HTML**
   - `fp_core.js` - Core communication layer (DO NOT MODIFY)
   - `fp.js` - Main API wrapper with all printer commands

---

## Library Files

### File Structure

The fiscal printer integration requires these files:

- **`fp_core.d.ts`** - TypeScript type definitions for the core library
- **`fp_core.js`** - Core communication layer that handles HTTP requests to ZFPLab Server
- **`fp.d.ts`** - TypeScript type definitions for printer commands
- **`fp.js`** - Main API wrapper with all available printer commands

### Including the Libraries

Add these scripts to your HTML file (typically in the `<head>` section):

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Fiscal Printer SDK -->
    <script src="/libs/fp_core.js"></script>
    <script src="/libs/fp.js"></script>
</head>
<body>
    <!-- Your application -->
</body>
</html>
```

**Important:** The scripts must be loaded before your application code runs. The library creates a global `Tremol` namespace.

---

## Connecting the Printer

### Step 1: Initialize the FP Object

Create an instance of the Tremol.FP class:

```javascript
// Create a new FP instance
const fp = new Tremol.FP();
```

### Step 2: Connect to ZFPLab Server

Configure the connection to the local ZFPLab Server:

```javascript
// Set server address and port (default: localhost:4444)
fp.ServerSetSettings("http://localhost", 4444);
```

### Step 3: Find and Connect to the Physical Printer

The library can automatically detect the printer connected to your computer:

```javascript
try {
    // Find the connected printer device
    const device = fp.ServerFindDevice();
    
    if (device) {
        // Connect using the detected settings
        fp.ServerSetDeviceSerialSettings(
            device.serialPort,  // e.g., "COM1", "COM3"
            device.baudRate,    // e.g., 115200, 9600
            true                // keepPortOpen: keep connection alive
        );
        console.log('Printer connected successfully!');
    } else {
        console.error('No printer device found');
    }
} catch (error) {
    console.error('Connection error:', error.message);
}
```

### Alternative: Manual Connection Settings

If automatic detection fails, you can manually specify connection settings:

#### For Serial/COM Port:
```javascript
fp.ServerSetDeviceSerialSettings("COM1", 115200, true);
```

#### For TCP/LAN Connection:
```javascript
fp.ServerSetDeviceTcpSettings("192.168.1.100", 9100, "password");
```

#### For Bluetooth (Android only):
```javascript
fp.ServerSetAndroidBluetoothDeviceSettings("ZK900001");
```

### Step 4: Verify Connection

Check if the printer is connected and ready:

```javascript
try {
    const status = fp.ReadStatus();
    console.log('Printer status:', status);
    
    // Check for blocking conditions
    if (status.Printer_not_ready_no_paper) {
        console.warn('Printer is out of paper!');
    }
    if (status.DateTime_not_set) {
        console.warn('Printer date/time not set!');
    }
} catch (error) {
    console.error('Failed to read printer status:', error);
}
```

---

## Printing Fiscal Receipts

### Basic Receipt Printing Workflow

The standard workflow for printing a fiscal receipt follows these steps:

1. **Open a fiscal receipt**
2. **Register items** (products/services)
3. **Calculate subtotal**
4. **Process payment**
5. **Close the receipt**

### Complete Example: Print a Simple Receipt

```javascript
async function printReceipt(items, paymentMethod = 'cash') {
    try {
        const fp = new Tremol.FP();
        
        // Step 1: Connect to server and printer
        fp.ServerSetSettings("http://localhost", 4444);
        const device = fp.ServerFindDevice();
        if (device) {
            fp.ServerSetDeviceSerialSettings(device.serialPort, device.baudRate, true);
        } else {
            throw new Error('Printer not found');
        }
        
        // Step 2: Open fiscal receipt
        // Operator number: 1
        // Password: "0 " (note the trailing space - some printers require this)
        // Receipt type: '1' = Fiscal receipt, '0' = Storno receipt
        // Print type: '0' = Step-by-step printing
        fp.OpenReceiptOrStorno(1, "0 ", '1', '0');
        
        // Step 3: Register items
        for (const item of items) {
            const itemName = (item.name || 'Artikull').substring(0, 20); // Max 20 chars
            const vatClass = 'А'; // VAT class (Cyrillic A = standard VAT)
            const price = parseFloat(item.price) || 0;
            const quantity = parseFloat(item.quantity) || 1;
            
            // Register the item
            // '1' = Macedonian goods (use '0' for importation)
            fp.SellPLUwithSpecifiedVAT(itemName, vatClass, price, '1', quantity);
        }
        
        // Step 4: Calculate subtotal and process payment
        try {
            // Get the exact subtotal from the printer
            const hwTotal = fp.Subtotal(1, 1); // 1 = print, 1 = display
            
            // Process payment
            // Payment type: 0 = Cash, 1 = Card, 2 = Voucher, 3 = Credit, 4 = Currency
            // Change option: 0 = With change, 1 = Without change
            const paymentType = paymentMethod === 'card' ? 1 : 0;
            fp.Payment(paymentType, 0, hwTotal);
        } catch (e) {
            // Fallback: Use automatic exact sum payment
            const paymentType = paymentMethod === 'card' ? '1' : '0';
            fp.PayExactSum(paymentType);
        }
        
        // Step 5: Close the receipt
        fp.CloseReceipt();
        
        console.log('Receipt printed successfully!');
        return { success: true };
        
    } catch (error) {
        console.error('Print error:', error.message);
        return { success: false, error: error.message };
    }
}

// Usage example
const items = [
    { name: 'Product 1', price: 100.00, quantity: 1 },
    { name: 'Product 2', price: 250.50, quantity: 2 }
];

printReceipt(items, 'cash');
```

### Operator Password Handling

Many fiscal printers require specific password formats. Implement a "self-healing" password system:

```javascript
const OPERATOR_PASSWORDS = ["0 ", "0000", "1   ", "0001"]; // Try multiple formats
let opened = false;

for (const pass of OPERATOR_PASSWORDS) {
    try {
        fp.OpenReceiptOrStorno(1, pass, '1', '0');
        opened = true;
        break;
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

if (!opened) {
    throw new Error("Operator login failed - invalid password");
}
```

### Storno (Refund) Receipt

To print a refund/storno receipt, change the receipt type parameter:

```javascript
// Open storno receipt (receipt type: '0')
fp.OpenReceiptOrStorno(1, "0 ", '0', '0'); // '0' = Storno receipt

// Register items (same as regular receipt)
for (const item of items) {
    const itemName = (item.name || 'Artikull').substring(0, 20);
    const vatClass = 'А';
    const price = parseFloat(item.price) || 0;
    const quantity = parseFloat(item.quantity) || 1;
    
    fp.SellPLUwithSpecifiedVAT(itemName, vatClass, price, '1', quantity);
}

// Process payment and close (same as regular receipt)
const hwTotal = fp.Subtotal(1, 1);
fp.Payment(0, 0, hwTotal);
fp.CloseReceipt();
```

---

## Common Operations

### 1. Update Printer Headers (Shop Name/Address)

Program the shop name and address that appear on receipts:

```javascript
// Center text helper for 42-character width (79mm paper)
function centerText(text, width = 42) {
    if (!text || text.trim().length === 0) return ' '.repeat(width);
    const trimmedText = text.trim();
    if (trimmedText.length >= width) return trimmedText.substring(0, width);
    const leftPad = Math.floor((width - trimmedText.length) / 2) + 3;
    const rightPad = width - trimmedText.length - leftPad;
    return " ".repeat(Math.max(0, leftPad)) + trimmedText + " ".repeat(Math.max(0, rightPad));
}

// Update headers (must be done when no receipt is open)
fp.ProgHeader('1', ' '); // Clear line 1
fp.ProgHeader('2', centerText('MY SHOP NAME')); // Shop name
fp.ProgHeader('3', centerText('STREET ADDRESS')); // Address
// Clear remaining lines (4-8)
for (let i = 4; i <= 8; i++) {
    fp.ProgHeader(i.toString(), ' ');
}
```

### 2. Print Daily Reports

#### X-Report (Status Report - No Reset)
```javascript
// Print X-report (shows current totals without resetting)
fp.PrintDailyReport("X");
```

#### Z-Report (End of Day - Resets Totals)
```javascript
// Ensure no receipt is open first
// Print Z-report (finalizes day and resets totals)
fp.PrintDailyReport("Z");
```

**Important:** Z-reports are required every 24 hours. The printer will block if 24 hours pass without a Z-report.

### 3. Check Printer Status

```javascript
const status = fp.ReadStatus();

// Check for common issues
if (status.Printer_not_ready_no_paper) {
    console.error('Printer is out of paper!');
}
if (status.Printer_not_ready_overheat) {
    console.error('Printer is overheated!');
}
if (status.DateTime_not_set) {
    console.error('Printer date/time not set!');
}
if (status.FM_full) {
    console.error('Fiscal memory is full!');
}
if (status.Blocking_after_24_hours_without_report) {
    console.error('24h timeout - need Z-report!');
}
if (status.OptionFiscalReceiptOpen === 1) {
    console.warn('A fiscal receipt is currently open');
}
```

### 4. Read Current Receipt Information

```javascript
const receiptInfo = fp.ReadCurrentRecInfo();

console.log('Receipt opened:', receiptInfo.OptionIsReceiptOpened);
console.log('Payment initiated:', receiptInfo.OptionInitiatedPayment);
console.log('Payment finalized:', receiptInfo.OptionFinalizedPayment);
```

### 5. Open Cash Drawer

```javascript
fp.CashDrawerOpen();
```

### 6. Print Free Text (Non-Fiscal Receipt)

```javascript
// Open non-fiscal receipt
fp.OpenNonFiscalReceipt(1, "0 ");

// Print text (max 42 characters per line)
fp.PrintText("This is a non-fiscal receipt");
fp.PrintText("It does not affect fiscal totals");

// Close non-fiscal receipt
fp.CloseNonFiscReceipt();
```

### 7. Set Date and Time

```javascript
const now = new Date();
fp.SetDateTime(now);
```

---

## Troubleshooting

### Common Errors and Solutions

#### Error: "Server connection error"
**Solution:** Ensure ZFPLab Server is running on port 4444.

#### Error: "No printer device found"
**Solution:**
- Check that the printer is powered on
- Verify the printer is connected (COM/USB/LAN)
- Try manually specifying connection settings

#### Error: "0x32 - Command Illegal" or "Receipt Already Open"
**Solution:** A receipt is already open. Close it first:

```javascript
// Emergency recovery: Close any open receipt
try {
    fp.CloseNonFiscReceipt();
} catch (e) { /* ignore */ }

try {
    const status = fp.ReadStatus();
    if (status.OptionFiscalReceiptOpen === 1) {
        // Try to close the receipt
        try {
            const sub = fp.Subtotal(1, 1);
            if (sub > 0) {
                fp.PayExactSum("0"); // Pay with cash
            }
            fp.CloseReceipt();
        } catch (e) {
            // Last resort: Emergency cancel
            fp.DirectCommand(";");
        }
    }
} catch (e) {
    console.error('Recovery failed:', e);
}
```

#### Error: "0x39 - Invalid Password"
**Solution:** Try different password formats:
- `"0 "` (with trailing space)
- `"0000"`
- `"1   "` (with trailing spaces)
- `"0001"`

#### Error: "0x35 - Receipt Already Open"
**Solution:** Use the recovery logic above to close the open receipt.

#### Error: "Printer not ready - no paper"
**Solution:** Add paper to the printer and retry.

#### Error: "24h timeout - need Z-report"
**Solution:** Print a Z-report immediately:
```javascript
fp.PrintDailyReport("Z");
```

### Recovery Function

Here's a complete recovery function to handle stuck receipts:

```javascript
async function ensureReceiptClosed() {
    const fp = new Tremol.FP();
    
    // Step 1: Close non-fiscal receipt
    try {
        fp.CloseNonFiscReceipt();
    } catch (e) {
        // Ignore if not open
    }
    
    // Step 2: Check if fiscal receipt is open
    let receiptIsOpen = false;
    try {
        const status = fp.ReadStatus();
        receiptIsOpen = status.OptionFiscalReceiptOpen === 1;
    } catch (e) {
        // Try alternative method
        try {
            const info = fp.ReadCurrentRecInfo();
            receiptIsOpen = info.OptionIsReceiptOpened === 1;
        } catch (e2) {
            // Can't determine, assume closed
            return true;
        }
    }
    
    if (!receiptIsOpen) {
        return true; // No receipt open
    }
    
    // Step 3: Try to close the receipt
    try {
        const info = fp.ReadCurrentRecInfo();
        // If payment is finalized, just close
        if (info.OptionFinalizedPayment === 1) {
            fp.CloseReceipt();
            return true;
        }
    } catch (e) {
        // Continue to next method
    }
    
    // Step 4: Pay residue and close
    try {
        const sub = fp.Subtotal(1, 1);
        if (sub > 0) {
            fp.PayExactSum("0"); // Pay with cash
        }
        fp.CloseReceipt();
        return true;
    } catch (e) {
        // Continue to emergency method
    }
    
    // Step 5: Emergency cancel (last resort)
    try {
        fp.DirectCommand(";");
        return true;
    } catch (e) {
        return false;
    }
}
```

---

## API Reference Summary

### Connection Methods
- `ServerSetSettings(ip, port)` - Set ZFPLab Server address
- `ServerFindDevice()` - Auto-detect connected printer
- `ServerSetDeviceSerialSettings(port, baudRate, keepOpen)` - Connect via COM/USB
- `ServerSetDeviceTcpSettings(ip, port, password)` - Connect via LAN/WiFi

### Receipt Operations
- `OpenReceiptOrStorno(operator, password, receiptType, printType)` - Open fiscal receipt
- `SellPLUwithSpecifiedVAT(name, vatClass, price, goodsType, quantity)` - Register item
- `Subtotal(print, display)` - Calculate subtotal
- `Payment(paymentType, changeOption, amount)` - Process payment
- `PayExactSum(paymentType)` - Pay exact amount automatically
- `CloseReceipt()` - Close fiscal receipt
- `CashPayCloseReceipt()` - Pay and close in one command

### Status & Information
- `ReadStatus()` - Get printer status
- `ReadCurrentRecInfo()` - Get current receipt information
- `ReadLastReceiptNum()` - Get last receipt number
- `ReadDateTime()` - Get printer date/time

### Reports
- `PrintDailyReport("X")` - Print X-report (status)
- `PrintDailyReport("Z")` - Print Z-report (end of day)

### Configuration
- `ProgHeader(line, text)` - Program header line
- `SetDateTime(date)` - Set printer date/time
- `ProgOperator(number, name, password)` - Program operator

### Emergency
- `DirectCommand(command)` - Send raw command to printer
- `CloseNonFiscReceipt()` - Close non-fiscal receipt

---

## Best Practices

1. **Always wrap printer calls in try-catch blocks** - Printer errors can crash your application
2. **Check printer status before operations** - Verify printer is ready (has paper, not overheated, etc.)
3. **Implement recovery logic** - Handle stuck receipts gracefully
4. **Use self-healing passwords** - Try multiple password formats automatically
5. **Query hardware for totals** - Don't send manual `0` amounts, use `Subtotal()` first
6. **Close receipts properly** - Always ensure receipts are closed before opening new ones
7. **Handle 24-hour timeout** - Print Z-reports daily to prevent blocking
8. **Test error scenarios** - Test paper out, power loss, network issues

---

## Additional Resources

- **ZFPLab Server Documentation** - Refer to Tremol documentation for server setup
- **Printer Manual** - Consult your fiscal printer's hardware manual
- **Integration Guide** - See `integration_guide.md` for advanced integration patterns

---

## Support

For issues with:
- **ZFPLab Server**: Contact Tremol support (zfplab@tremol.bg)
- **Library files**: These are provided by Tremol and should not be modified
- **Integration issues**: Refer to the troubleshooting section above

---

*Last updated: Based on fp_core.js v1.0.1.0 and fp.js implementation*

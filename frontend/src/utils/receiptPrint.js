/**
 * Direct print utility for receipts without showing a modal
 * Creates a temporary hidden receipt element, prints it, and cleans up
 */

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const printReceipt = (order, businessName) => {
    if (!order) {
        console.error('No order provided for printing');
        return;
    }

    // Create a temporary container for the receipt
    const printContainer = document.createElement('div');
    printContainer.id = 'receipt-print-container';
    printContainer.style.position = 'fixed';
    printContainer.style.left = '-9999px';
    printContainer.style.top = '0';
    printContainer.style.width = '80mm';
    printContainer.style.maxWidth = '80mm';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.padding = '16px';
    printContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    printContainer.style.color = 'black';

    // Build the receipt HTML
    const receiptHTML = `
        <div style="width: 100%; max-width: 80mm; margin: 0 auto;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #1f2937; padding-bottom: 16px;">
                <h1 style="font-size: 18px; font-weight: bold; color: #111827; margin-bottom: 4px; margin: 0 0 4px 0;">${businessName || 'Restaurant'}</h1>
                <p style="font-size: 12px; color: #4b5563; margin: 0;">RECEIPT</p>
            </div>

            <!-- Order Info -->
            <div style="margin-bottom: 24px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #4b5563;">Date:</span>
                    <span style="font-weight: 600;">${formatDate(order.created_at)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #4b5563;">Time:</span>
                    <span style="font-weight: 600;">${formatTime(order.created_at)}</span>
                </div>
            </div>

            <!-- Items -->
            <div style="margin-bottom: 24px;">
                <div style="border-top: 2px solid #1f2937; padding-top: 12px; margin-bottom: 12px;">
                    <h3 style="font-weight: bold; color: #111827; margin-bottom: 12px; font-size: 14px; margin: 0 0 12px 0;">ITEMS</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${order.items && order.items.length > 0 
                        ? order.items.map((item) => `
                            <div style="display: flex; justify-content: space-between; font-size: 12px;">
                                <div style="flex: 1;">
                                    <span style="font-weight: 600;">${item.quantity}x</span> ${item.name}
                                </div>
                                <div style="font-weight: 600; margin-left: 16px;">
                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)} MKD
                                </div>
                            </div>
                        `).join('')
                        : '<div style="font-size: 12px; color: #6b7280;">No items</div>'
                    }
                </div>
            </div>

            <!-- Total -->
            <div style="border-top: 2px solid #1f2937; padding-top: 16px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 16px; font-weight: bold; color: #111827;">TOTAL</span>
                    <span style="font-size: 18px; font-weight: bold; color: #111827;">
                        ${parseFloat(order.total_amount).toFixed(2)} MKD
                    </span>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; font-size: 12px; color: #4b5563; border-top: 1px solid #d1d5db; padding-top: 16px;">
                <p style="margin: 0;">Thank you for your visit!</p>
                <p style="margin: 4px 0 0 0;">Please come again</p>
            </div>
        </div>
    `;

    printContainer.innerHTML = receiptHTML;

    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.id = 'receipt-print-styles';
    printStyles.textContent = `
        @media print {
            @page {
                margin: 0;
                size: auto;
            }
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                height: auto !important;
            }
            body * {
                visibility: hidden;
            }
            #receipt-print-container {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                width: 80mm !important;
                max-width: 80mm !important;
                margin: 0 auto !important;
                padding: 16px !important;
                background: white !important;
                visibility: visible !important;
            }
            #receipt-print-container * {
                visibility: visible !important;
            }
        }
    `;

    // Append to body
    document.body.appendChild(printStyles);
    document.body.appendChild(printContainer);

    // Trigger print after a small delay to ensure DOM is ready
    setTimeout(() => {
        window.print();

        // Clean up after printing (with a delay to ensure print dialog has opened)
        setTimeout(() => {
            if (printContainer.parentNode) {
                printContainer.parentNode.removeChild(printContainer);
            }
            if (printStyles.parentNode) {
                printStyles.parentNode.removeChild(printStyles);
            }
        }, 1000);
    }, 100);
};


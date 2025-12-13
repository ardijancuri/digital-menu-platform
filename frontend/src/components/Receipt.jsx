import { useRef } from 'react';

const Receipt = ({ order, businessName, onClose }) => {
    const receiptRef = useRef();

    const handlePrint = () => {
        window.print();
    };

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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto print:max-w-xs print:shadow-none print:rounded-none">
                {/* Receipt Content */}
                <div ref={receiptRef} className="p-8 print:p-4">
                    {/* Header */}
                    <div className="text-center mb-6 border-b-2 border-gray-800 pb-4 print:mb-3 print:pb-2">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1 print:text-lg print:mb-0.5">{businessName}</h1>
                        <p className="text-sm text-gray-600 print:text-xs">RECEIPT</p>
                    </div>

                    {/* Order Info */}
                    <div className="mb-6 text-sm print:mb-3 print:text-xs">
                        <div className="flex justify-between mb-1 print:mb-0.5">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-semibold">{formatDate(order.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-semibold">{formatTime(order.created_at)}</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="mb-6 print:mb-3">
                        <div className="border-t-2 border-gray-800 pt-3 mb-3 print:pt-2 print:mb-2">
                            <h3 className="font-bold text-gray-900 mb-3 print:text-sm print:mb-2">ITEMS</h3>
                        </div>
                        <div className="space-y-2 print:space-y-1">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm print:text-xs">
                                    <div className="flex-1">
                                        <span className="font-semibold">{item.quantity}x</span> {item.name}
                                    </div>
                                    <div className="font-semibold ml-4 print:ml-2">
                                        {(parseFloat(item.price) * item.quantity).toFixed(2)} MKD
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t-2 border-gray-800 pt-4 mb-6 print:pt-2 print:mb-3">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900 print:text-base">TOTAL</span>
                            <span className="text-2xl font-bold text-gray-900 print:text-lg">
                                {parseFloat(order.total_amount).toFixed(2)} MKD
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600 border-t border-gray-300 pt-4 print:text-xs print:pt-2">
                        <p>Thank you for your visit!</p>
                        <p className="mt-1 print:mt-0.5">Please come again</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 p-4 bg-gray-50 border-t border-gray-200 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-print"></i>
                        Print Receipt
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
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
                    .fixed.inset-0 {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                        background: transparent !important;
                    }
                    .fixed.inset-0 > div {
                        margin: 0 auto;
                        max-width: 80mm;
                        width: 80mm;
                    }
                    .fixed.inset-0, .fixed.inset-0 * {
                        visibility: visible;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .bg-white {
                        box-shadow: none;
                        background: white !important;
                    }
                    .bg-black\\/50 {
                        background: transparent !important;
                    }
                    * {
                        color: black !important;
                    }
                    .fixed.inset-0 > div > div {
                        background: white !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Receipt;

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="inline-block align-bottom bg-white rounded-[2.5rem] text-left overflow-hidden shadow-xl transform transition-all w-full max-w-xs sm:my-8 sm:align-middle sm:max-w-sm">
                    <div className="bg-white px-4 pt-4 pb-4 sm:p-5 sm:pb-4 relative">
                        {title && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            </div>
                        )}
                        <div>{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;

const Modal = ({ isOpen, onClose, title, children, rounded = 'xl' }) => {
    if (!isOpen) return null;

    const roundedClass = rounded === 'large' ? 'rounded-[2.5rem]' : rounded === 'xl' ? 'rounded-xl' : 'rounded-lg';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className={`relative bg-white ${roundedClass} text-left overflow-hidden shadow-xl transform transition-all w-full max-w-xs sm:max-w-2xl`}>
                    <div className="bg-white px-4 pt-4 pb-4 sm:p-5 sm:pb-5 relative">
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

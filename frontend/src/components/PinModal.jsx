import { useState, useRef, useEffect } from 'react';

const PinModal = ({ isOpen, onClose, onConfirm, staffName, error: externalError }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setPin('');
            setError('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (externalError) {
            setError(externalError);
        }
    }, [externalError]);

    const handlePinChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 6) {
            setPin(value);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pin.length < 4) {
            setError('PIN must be at least 4 digits');
            return;
        }
        await onConfirm(pin);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

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
                <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all w-full max-w-sm sm:my-8 sm:align-middle">
                    <div className="bg-white px-6 pt-6 pb-6 relative">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Enter Staff PIN
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {staffName ? (
                                    <>Confirm staff member: <span className="font-semibold">{staffName}</span></>
                                ) : (
                                    <>Enter your PIN to continue</>
                                )}
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <input
                                        ref={inputRef}
                                        type="password"
                                        value={pin}
                                        onChange={handlePinChange}
                                        onKeyPress={handleKeyPress}
                                        className="w-full text-center text-3xl font-bold tracking-widest px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        placeholder="••••"
                                        maxLength={6}
                                        autoComplete="off"
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm mt-2">{error}</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PinModal;


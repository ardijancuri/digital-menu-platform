import { useState, useRef, useEffect } from 'react';

const PinModal = ({ isOpen, onClose, onConfirm, staffName, error: externalError }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);
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
            setVerifying(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (externalError) {
            setError(externalError);
        }
    }, [externalError]);

    // Auto-verify when PIN reaches 4 digits
    useEffect(() => {
        if (pin.length === 4 && !verifying && isOpen) {
            handleAutoVerify(pin);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin]);

    const handleAutoVerify = async (pinValue) => {
        setVerifying(true);
        setError('');
        try {
            await onConfirm(pinValue);
            // If successful, onConfirm will close the modal
        } catch (err) {
            // On error, reset PIN and allow retry
            setVerifying(false);
            setPin('');
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handlePinChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 6) {
            setPin(value);
            setError('');
            setVerifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pin.length < 4) {
            setError('PIN must be at least 4 digits');
            return;
        }
        if (pin.length === 4 && !verifying) {
            await handleAutoVerify(pin);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handleNumberClick = (number) => {
        if (verifying) return;
        const newPin = pin + number;
        if (newPin.length <= 4) {
            setPin(newPin);
            setError('');
        }
    };

    const handleBackspace = () => {
        if (verifying) return;
        setPin(prev => prev.slice(0, -1));
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-4 text-center">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="relative bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all w-full max-w-sm">
                    <div className="bg-white px-6 pt-6 pb-6 relative">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Enter Staff PIN
                            </h3>


                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <input
                                        ref={inputRef}
                                        type="password"
                                        value={pin}
                                        onChange={handlePinChange}
                                        onKeyPress={handleKeyPress}
                                        disabled={verifying}
                                        className="w-full text-center text-3xl font-bold tracking-widest px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="••••"
                                        maxLength={4}
                                        autoComplete="off"
                                    />
                                    {verifying && (
                                        <p className="text-blue-600 text-sm mt-2 flex items-center justify-center gap-2">
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Verifying PIN...
                                        </p>
                                    )}
                                    {error && !verifying && (
                                        <p className="text-red-500 text-sm mt-2">{error}</p>
                                    )}
                                </div>

                                {/* Numeric Keyboard */}
                                <div className="mb-4">
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => handleNumberClick(num.toString())}
                                                disabled={verifying || pin.length >= 4}
                                                className="px-6 py-5 bg-white hover:bg-blue-50 active:bg-blue-100 border-2 border-gray-300 hover:border-blue-400 rounded-xl text-2xl font-bold text-gray-800 shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={handleBackspace}
                                            disabled={verifying || pin.length === 0}
                                            className="px-6 py-5 bg-white hover:bg-red-50 active:bg-red-100 border-2 border-gray-300 hover:border-red-400 rounded-xl text-xl font-bold text-gray-800 shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
                                        >
                                            <i className="fas fa-backspace"></i>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleNumberClick('0')}
                                            disabled={verifying || pin.length >= 4}
                                            className="px-6 py-5 bg-white hover:bg-blue-50 active:bg-blue-100 border-2 border-gray-300 hover:border-blue-400 rounded-xl text-2xl font-bold text-gray-800 shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
                                        >
                                            0
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={verifying}
                                        className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
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


import { useAuth } from '../../context/AuthContext';

const PreviewPage = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Menu Preview</h2>
            <div className="card">
                <p className="mb-4 text-gray-600">
                    Your public menu is available at:
                </p>
                <a
                    href={`/menu/${user?.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-lg font-medium"
                >
                    /menu/{user?.slug} →
                </a>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Tip:</strong> Share this link with your customers or add a QR code to your tables!
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <iframe
                    src={`/menu/${user?.slug}`}
                    className="w-full h-[600px] border-2 border-gray-300 rounded-lg"
                    title="Menu Preview"
                />
            </div>
        </div>
    );
};

export default PreviewPage;

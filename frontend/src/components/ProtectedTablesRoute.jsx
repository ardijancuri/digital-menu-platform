import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import TableManagement from '../pages/pos/TableManagement';

const ProtectedTablesRoute = () => {
    const [loading, setLoading] = useState(true);
    const [isTakeawayOnly, setIsTakeawayOnly] = useState(false);

    useEffect(() => {
        checkSettings();
    }, []);

    const checkSettings = async () => {
        try {
            const response = await userAPI.getSettings();
            const takeawayOnly = response.data.settings?.takeaway_only || false;
            setIsTakeawayOnly(takeawayOnly);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            setIsTakeawayOnly(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (isTakeawayOnly) {
        return <Navigate to="/pos" replace />;
    }

    return <TableManagement />;
};

export default ProtectedTablesRoute;

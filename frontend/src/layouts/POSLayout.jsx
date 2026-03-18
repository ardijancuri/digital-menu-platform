import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const POSLayout = () => {
    const { user, logout, isManager } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [settings, setSettings] = useState(null);
    const manager = isManager();

    const allNavItems = [
        { path: '/pos', label: 'Dashboard', icon: 'fa-home' },
        { path: '/pos/order', label: 'New Order', icon: 'fa-plus-circle' },
        { path: '/pos/tables', label: 'Tables', icon: 'fa-chair' },
        { path: '/pos/orders', label: manager ? 'Active Orders' : 'Order History', icon: 'fa-list' },
        { path: '/pos/staff', label: 'Staff', icon: 'fa-users' },
        { path: '/pos/reports', label: 'Reports', icon: 'fa-chart-bar' },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await userAPI.getSettings();
            setSettings(response.data.settings || {});
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            setSettings({ takeaway_only: false });
        }
    };

    // Filter navigation items based on user role and settings
    const navItems = (() => {
        let filtered = allNavItems;
        
        // For managers, hide Reports
        if (manager) {
            filtered = filtered.filter(item => item.path !== '/pos/reports');
        }
        
        // If takeaway_only is enabled, hide Tables
        if (settings?.takeaway_only) {
            filtered = filtered.filter(item => item.path !== '/pos/tables');
        }
        
        return filtered;
    })();

    const currentSection = navItems.find(item => location.pathname === item.path)?.label || 'POS';
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-gray-900 text-white flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">POS System</h1>
                        <p className="text-sm text-gray-400 mt-1">{user?.business_name}</p>
                    </div>
                    {/* Close button (Mobile only) */}
                    <button
                        onClick={closeSidebar}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <i className={`fas ${item.icon} w-5`}></i>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-700 space-y-2">
                    {!manager && (
                    <button
                        onClick={() => {
                            navigate('/dashboard');
                            closeSidebar();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                    >
                        <i className="fas fa-arrow-left w-5"></i>
                        <span>Back to Dashboard</span>
                    </button>
                    )}
                    <button
                        onClick={() => {
                            logout();
                            closeSidebar();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <i className="fas fa-sign-out-alt w-5"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu (Mobile) */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-gray-600 hover:text-gray-800"
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <div>
                            <h2 className="text-lg lg:text-xl font-bold text-gray-800">{currentSection}</h2>
                            <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">Manage your restaurant operations</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="text-xs lg:text-sm text-gray-600 hidden sm:block">
                            <i className="fas fa-clock mr-2"></i>
                            {currentTime}
                        </div>
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm lg:text-base">
                            {user?.business_name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default POSLayout;

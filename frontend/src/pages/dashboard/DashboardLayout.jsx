import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { path: '/dashboard/settings', label: 'Settings', icon: 'fa-cog' },
        { path: '/dashboard/categories', label: 'Categories', icon: 'fa-folder' },
        { path: '/dashboard/products', label: 'Products', icon: 'fa-utensils' },
        { path: '/dashboard/preview', label: 'Preview', icon: 'fa-eye' },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 md:hidden">
                <div className="px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button onClick={toggleSidebar} className="text-gray-600 hover:text-blue-600">
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <span className="font-bold text-gray-900">{user?.business_name}</span>
                    </div>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:min-h-screen
            `}>
                <div className="p-6 border-b border-gray-100 hidden md:block">
                    <h1 className="text-xl font-bold text-gray-900 truncate">{user?.business_name}</h1>
                    <p className="text-sm text-gray-500">Menu Dashboard</p>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${location.pathname === item.path
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            <i className={`fas ${item.icon} text-lg w-6 text-center`}></i>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 mt-auto">
                    <a
                        href={`/menu/${user?.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 text-blue-600 hover:text-blue-700 font-medium transition-colors rounded-lg hover:bg-blue-50 mb-2"
                    >
                        <i className="fas fa-external-link-alt text-lg w-6 text-center"></i>
                        <span>View Public Menu</span>
                    </a>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 font-medium transition-colors rounded-lg hover:bg-red-50"
                    >
                        <i className="fas fa-sign-out-alt text-lg w-6 text-center"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-57px)] md:h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;

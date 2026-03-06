import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { posAPI } from '../../services/posAPI';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const POSDashboard = () => {
    const { isManager } = useAuth();
    const canViewTodaySales = !isManager();
    const [stats, setStats] = useState({
        todaySales: 0,
        activeOrders: 0,
        occupiedTables: 0,
        totalTables: 0,
        staffCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        fetchDashboardData();
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

    const fetchDashboardData = async () => {
        try {
            // Fetch all necessary data
            const fetchPromises = [posAPI.getTables()];

            if (canViewTodaySales) {
                fetchPromises.unshift(posAPI.getOrders('history'));
            }

            // Only fetch staff data if user is not a manager
            if (!isManager()) {
                fetchPromises.push(posAPI.getStaff());
            }

            const results = await Promise.all(fetchPromises);
            const ordersResponse = canViewTodaySales ? results[0] : null;
            const tablesResponse = canViewTodaySales ? results[1] : results[0];
            const staffResponse = !isManager()
                ? results[canViewTodaySales ? 2 : 1]
                : null;

            // Calculate today's sales from completed orders
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todaySales = canViewTodaySales
                ? ordersResponse.data.orders
                    .filter(order => order.status === 'completed')
                    .filter(order => {
                        const orderDate = new Date(order.created_at);
                        orderDate.setHours(0, 0, 0, 0);
                        return orderDate.getTime() === today.getTime();
                    })
                    .reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
                : 0;

            // Count active orders (preparing only)
            const activeOrdersResponse = await posAPI.getOrders('active');
            const activeOrders = activeOrdersResponse.data.orders.length;

            // Count occupied tables
            const tables = tablesResponse.data.tables;
            const occupiedTables = tables.filter(table => table.status === 'occupied').length;
            const totalTables = tables.length;

            // Count staff (only for non-managers)
            const staffCount = staffResponse ? staffResponse.data.staff.length : 0;

            setStats({
                todaySales,
                activeOrders,
                occupiedTables,
                totalTables,
                staffCount
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    const tableCapacityPercent = stats.totalTables > 0
        ? Math.round((stats.occupiedTables / stats.totalTables) * 100)
        : 0;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Stats Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${
                settings?.takeaway_only 
                    ? (isManager() ? 'lg:grid-cols-1' : 'lg:grid-cols-3')
                    : (isManager() ? 'lg:grid-cols-2' : 'lg:grid-cols-4')
            } gap-6 mb-8`}>
                {canViewTodaySales && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 p-3 rounded-lg text-green-600">
                                <i className="fas fa-dollar-sign text-xl"></i>
                            </div>
                            <span className="text-sm text-gray-500 font-medium">Today's Sales</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{Math.round(stats.todaySales)} MKD</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Completed orders today
                        </p>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                            <i className="fas fa-clipboard-list text-xl"></i>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">Active Orders</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.activeOrders}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Being prepared
                    </p>
                </div>

                {!settings?.takeaway_only && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                                <i className="fas fa-chair text-xl"></i>
                            </div>
                            <span className="text-sm text-gray-500 font-medium">Occupied Tables</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.occupiedTables} / {stats.totalTables}</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            {tableCapacityPercent}% capacity
                        </p>
                    </div>
                )}

                {!isManager() && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                            <i className="fas fa-users text-xl"></i>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">Staff Members</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.staffCount}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Total staff
                    </p>
                </div>
                )}
            </div>

            {/* Quick Actions */}
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className={`grid grid-cols-1 ${settings?.takeaway_only ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
                <Link to="/pos/order" className="bg-blue-600 text-white rounded-xl p-6 shadow-lg hover:bg-blue-700 transition-colors flex flex-col items-center text-center group">
                    <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <i className="fas fa-plus text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold mb-2">New Order</h4>
                    <p className="text-blue-100 text-sm">Create a new order for table or takeaway</p>
                </Link>

                {!settings?.takeaway_only && (
                    <Link to="/pos/tables" className="bg-white text-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center group">
                        <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <i className="fas fa-th text-2xl"></i>
                        </div>
                        <h4 className="text-xl font-bold mb-2">Manage Tables</h4>
                        <p className="text-gray-500 text-sm">View layout and update status</p>
                    </Link>
                )}

                <Link to="/pos/orders" className="bg-white text-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center group">
                    <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <i className="fas fa-history text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Order History</h4>
                    <p className="text-gray-500 text-sm">View past orders and receipts</p>
                </Link>
            </div>
        </div>
    );
};

export default POSDashboard;

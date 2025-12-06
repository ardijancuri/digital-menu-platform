import { useState, useEffect } from 'react';
import { posAPI } from '../../services/posAPI';

const Reports = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        topProducts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            // In a real app, we would have a dedicated reports endpoint
            // For now, we'll calculate from order history
            const response = await posAPI.getOrders('history');
            const orders = response.data.orders;

            const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
            const totalOrders = orders.length;
            const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

            // Calculate top products
            const productCounts = {};
            orders.forEach(order => {
                order.items.forEach(item => {
                    if (!productCounts[item.name]) {
                        productCounts[item.name] = { name: item.name, quantity: 0, revenue: 0 };
                    }
                    productCounts[item.name].quantity += item.quantity;
                    productCounts[item.name].revenue += item.quantity * parseFloat(item.price);
                });
            });

            const topProducts = Object.values(productCounts)
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 5);

            setStats({
                totalSales,
                totalOrders,
                averageOrderValue,
                topProducts
            });
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading reports...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Reports</h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalSales.toFixed(2)} MKD</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Average Order Value</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.averageOrderValue.toFixed(2)} MKD</p>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Top Selling Products</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-600 text-sm">Product</th>
                            <th className="px-6 py-3 font-semibold text-gray-600 text-sm text-right">Units Sold</th>
                            <th className="px-6 py-3 font-semibold text-gray-600 text-sm text-right">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stats.topProducts.map((product, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-right text-gray-600">{product.quantity}</td>
                                <td className="px-6 py-4 text-right text-gray-900 font-medium">
                                    {product.revenue.toFixed(2)} MKD
                                </td>
                            </tr>
                        ))}
                        {stats.topProducts.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                    No sales data available yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;

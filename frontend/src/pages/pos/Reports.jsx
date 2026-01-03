import { useState, useEffect } from 'react';
import { posAPI } from '../../services/posAPI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        dailyRevenue: []
    });
    const [loading, setLoading] = useState(true);
    const [chartPeriod, setChartPeriod] = useState('7days');
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        if (stats.dailyRevenue.length > 0) {
            generateChartData();
        }
    }, [chartPeriod, stats.dailyRevenue]);

    const fetchReports = async () => {
        try {
            // Fetch daily revenue from daily_revenue table
            const dailyRevenueResponse = await posAPI.getDailyRevenue();
            const storedDailyRevenue = dailyRevenueResponse.data.dailyRevenue || [];

            // Calculate totals from stored daily revenue only
            const totalSales = storedDailyRevenue.reduce((sum, day) => sum + parseFloat(day.total_revenue || 0), 0);
            const totalOrders = storedDailyRevenue.reduce((sum, day) => sum + (day.order_count || 0), 0);
            const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

            // Convert stored daily revenue to format expected by chart
            const dailyRevenue = storedDailyRevenue.map(day => {
                // Parse date correctly to avoid timezone issues
                // Handle both string dates (YYYY-MM-DD) and Date objects from database
                let date;
                let dateKey;
                
                if (day.date instanceof Date) {
                    // If it's a Date object from PostgreSQL, use local date components
                    // PostgreSQL DATE is stored as midnight UTC, but we want local date
                    date = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate());
                    date.setHours(0, 0, 0, 0);
                    dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                } else {
                    // If it's a string (YYYY-MM-DD), parse it using local timezone
                const dateParts = day.date.split('-');
                    date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                    date.setHours(0, 0, 0, 0);
                    dateKey = `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
                }
                
                return {
                    date: date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }),
                    dateKey: dateKey, // Normalized date string for matching
                    dateObj: date,
                    revenue: parseFloat(day.total_revenue || 0),
                    orderCount: day.order_count || 0,
                    staffRevenue: day.staff_revenue || {}
                };
            }).sort((a, b) => a.dateObj - b.dateObj);

            setStats({
                totalSales,
                totalOrders,
                averageOrderValue,
                dailyRevenue
            });
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateChartData = () => {
        const now = new Date();
        let chartData = [];

        // Helper function to format date as YYYY-MM-DD in local timezone
        const formatDateKey = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        if (chartPeriod === '7days') {
            // Daily for 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0); // Normalize to midnight
                const dateKey = formatDateKey(date);
                
                // Find matching day data - try both dateKey and direct date string comparison
                const dayData = stats.dailyRevenue.find(d => {
                    // Compare dateKey strings
                    if (d.dateKey === dateKey) return true;
                    // Also try comparing the date object directly
                    if (d.dateObj && d.dateObj.getTime() === date.getTime()) return true;
                    // Fallback: compare formatted date strings
                    const dbDateKey = formatDateKey(d.dateObj || new Date(d.dateKey));
                    return dbDateKey === dateKey;
                });
                
                chartData.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    revenue: dayData ? dayData.revenue : 0
                });
            }
        } else if (chartPeriod === '1month') {
            // Daily for 30 days
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0); // Normalize to midnight
                const dateKey = formatDateKey(date);
                
                // Find matching day data - try both dateKey and direct date string comparison
                const dayData = stats.dailyRevenue.find(d => {
                    // Compare dateKey strings
                    if (d.dateKey === dateKey) return true;
                    // Also try comparing the date object directly
                    if (d.dateObj && d.dateObj.getTime() === date.getTime()) return true;
                    // Fallback: compare formatted date strings
                    const dbDateKey = formatDateKey(d.dateObj || new Date(d.dateKey));
                    return dbDateKey === dateKey;
                });
                
                chartData.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    revenue: dayData ? dayData.revenue : 0
                });
            }
        } else if (chartPeriod === '3months') {
            // Weekly for 12 weeks
            const weeklyData = {};

            for (let i = 11; i >= 0; i--) {
                const weekKey = `Week ${12 - i}`;
                weeklyData[weekKey] = { date: weekKey, revenue: 0, weekStart: new Date(now) };
                weeklyData[weekKey].weekStart.setDate(weeklyData[weekKey].weekStart.getDate() - (i * 7));
            }

            stats.dailyRevenue.forEach(day => {
                const diffTime = now - day.dateObj;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 84) {
                    const weekIndex = Math.floor(diffDays / 7);
                    const weekKey = `Week ${12 - weekIndex}`;
                    if (weeklyData[weekKey]) {
                        weeklyData[weekKey].revenue += day.revenue;
                    }
                }
            });

            chartData = Object.values(weeklyData);
        } else if (chartPeriod === '1year') {
            // Monthly for 12 months
            const monthlyData = {};

            for (let i = 11; i >= 0; i--) {
                const monthDate = new Date(now);
                monthDate.setMonth(monthDate.getMonth() - i);
                const monthKey = monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                monthlyData[monthKey] = {
                    date: monthKey,
                    revenue: 0,
                    month: monthDate.getMonth(),
                    year: monthDate.getFullYear()
                };
            }

            stats.dailyRevenue.forEach(day => {
                const monthKey = day.dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                if (monthlyData[monthKey]) {
                    monthlyData[monthKey].revenue += day.revenue;
                }
            });

            chartData = Object.values(monthlyData);
        }

        setChartData(chartData);
    };

    if (loading) return <div className="p-8 text-center">Loading reports...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900">{Math.round(stats.totalSales)} MKD</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Average Order Value</h3>
                    <p className="text-3xl font-bold text-gray-900">{Math.round(stats.averageOrderValue)} MKD</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Revenue Trend</h3>
                        <p className="text-sm text-gray-500 mt-1">Revenue over time</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['7days', '1month', '3months', '1year'].map(period => (
                            <button
                                key={period}
                                onClick={() => setChartPeriod(period)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${chartPeriod === period
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {period === '7days' ? '7 Days' : period === '1month' ? '1 Month' : period === '3months' ? '3 Months' : '1 Year'}
                            </button>
                        ))}
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '8px 12px'
                            }}
                            formatter={(value) => [`${Math.round(value)} MKD`, 'Revenue']}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ fill: '#2563eb', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Daily Revenue</h3>
                    <p className="text-sm text-gray-500 mt-1">Last 10 days breakdown</p>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-600 text-sm">Date</th>
                            <th className="px-6 py-3 font-semibold text-gray-600 text-sm text-right">Orders</th>
                            <th className="px-6 py-3 font-semibold text-gray-600 text-sm text-right">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stats.dailyRevenue.slice(-10).reverse().map((day, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{day.date}</td>
                                <td className="px-6 py-4 text-right text-gray-600">{day.orderCount}</td>
                                <td className="px-6 py-4 text-right text-gray-900 font-medium">
                                    {Math.round(day.revenue)} MKD
                                </td>
                            </tr>
                        ))}
                        {stats.dailyRevenue.length === 0 && (
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

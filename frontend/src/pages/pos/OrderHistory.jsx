import { useState, useEffect } from 'react';
import { posAPI } from '../../services/posAPI';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active'); // 'active' or 'history'

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await posAPI.getOrders(filter);
            setOrders(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await posAPI.updateOrderStatus(id, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update status');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
                <div className="bg-gray-100 p-1 rounded-lg flex">
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'active' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Active Orders
                    </button>
                    <button
                        onClick={() => setFilter('history')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'history' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Order History
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center">Loading orders...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col">
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'ready' ? 'bg-green-100 text-green-700' :
                                                order.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600 font-medium mt-1">
                                    {order.table_name ? `Table: ${order.table_name}` : 'Takeaway'}
                                </p>
                                {order.staff_name && (
                                    <p className="text-sm text-blue-600 font-medium mt-1">
                                        <i className="fas fa-user mr-1"></i>Staff: {order.staff_name}
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-gray-100 py-3 mb-3 flex-1">
                                <ul className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-800">
                                                <span className="font-bold mr-1">{item.quantity}x</span>
                                                {item.name}
                                            </span>
                                            <span className="text-gray-600">{parseFloat(item.price).toFixed(2)} MKD</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t border-gray-100 pt-3 mb-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-medium text-gray-600">Total</span>
                                    <span className="text-xl font-bold text-gray-900">{parseFloat(order.total_amount).toFixed(2)} MKD</span>
                                </div>
                                <p className="text-sm text-gray-500 text-right mt-1">{order.payment_method || 'Unpaid'}</p>
                            </div>

                            {filter === 'active' && (
                                <div className="flex flex-col gap-2">
                                    {order.status === 'preparing' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'ready')}
                                            className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                        >
                                            Mark Ready
                                        </button>
                                    )}
                                    {order.status === 'ready' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900"
                                        >
                                            Complete Order
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                        className="w-full px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                            No orders found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;

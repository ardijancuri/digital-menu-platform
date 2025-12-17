import { useState, useEffect } from 'react';
import { posAPI } from '../../services/posAPI';
import { useAuth } from '../../context/AuthContext';
import { printReceipt } from '../../utils/receiptPrint';

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active'); // 'active' or 'history'
    const [changingTableOrderId, setChangingTableOrderId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
        fetchTables();
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

    const fetchTables = async () => {
        try {
            const response = await posAPI.getTables();
            setTables(response.data.tables || []);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleTableChange = async (orderId, newTableId) => {
        try {
            await posAPI.updateOrderTable(orderId, newTableId === 'null' ? null : parseInt(newTableId));
            setChangingTableOrderId(null);
            fetchOrders();
            fetchTables(); // Refresh tables to update status
        } catch (error) {
            console.error('Error updating order table:', error);
            alert('Failed to update table');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await posAPI.updateOrderStatus(id, { status: newStatus });
            
            // If completing an order, print receipt directly after status update
            if (newStatus === 'completed') {
                const completedOrder = orders.find(o => o.id === id);
                if (completedOrder) {
                    // Update the order status locally for printing
                    const orderToPrint = { ...completedOrder, status: 'completed' };
                    printReceipt(orderToPrint, user?.business_name || 'Restaurant');
                }
            }
            
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update status');
        }
    };

    const handlePrintReceipt = (order) => {
        printReceipt(order, user?.business_name || 'Restaurant');
    };

    return (
        <div>
            <div className="mb-4 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by table or order number..."
                        className="w-full sm:w-80 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                        onClick={() => setFilter('active')}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all text-center ${filter === 'active' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <i className="fas fa-fire mr-2"></i>
                        Active Orders
                    </button>
                    <button
                        onClick={() => setFilter('history')}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all text-center ${filter === 'history' ? 'bg-gray-800 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <i className="fas fa-history mr-2"></i>
                        Order History
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center">Loading orders...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {orders
                        .filter(order => {
                            if (!searchTerm.trim()) return true;
                            const term = searchTerm.trim().toLowerCase();
                            const orderMatch = order.id?.toString().includes(term);
                            const tableMatch = (order.table_name || '').toLowerCase().includes(term);
                            return orderMatch || tableMatch;
                        })
                        .map(order => (
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
                                <div className="text-sm text-gray-600 font-medium mt-1 flex items-center gap-2">
                                    {changingTableOrderId === order.id ? (
                                        <select
                                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            defaultValue={order.table_id || 'null'}
                                            onChange={(e) => handleTableChange(order.id, e.target.value)}
                                            onBlur={() => setChangingTableOrderId(null)}
                                            autoFocus
                                        >
                                            <option value="null">Takeaway</option>
                                            {tables.map(table => (
                                                <option key={table.id} value={table.id}>
                                                    {table.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <>
                                            <span>{order.table_name ? `Table: ${order.table_name}` : 'Takeaway'}</span>
                                            <button
                                                onClick={() => setChangingTableOrderId(order.id)}
                                                className="text-blue-600 hover:text-blue-800 text-xs ml-1"
                                                title="Change table"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                                {order.staff_name && (
                                    <p className="text-sm text-blue-600 font-medium mt-1">
                                        <i className="fas fa-user mr-1"></i>Staff: {order.staff_name}
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-gray-100 py-3 mb-3 flex-1">
                                <ul className="space-y-2">
                                    {(() => {
                                        // Sort items by creation time
                                        const sortedItems = [...order.items].sort((a, b) =>
                                            new Date(a.created_at || 0) - new Date(b.created_at || 0)
                                        );

                                        if (sortedItems.length === 0) return null;

                                        // Find the timestamp of the last item
                                        const lastItemTime = new Date(sortedItems[sortedItems.length - 1].created_at || 0).getTime();

                                        // Group items: New Round (latest batch) vs Previous
                                        // We treat the set of items with the latest timestamp as the "New Round"
                                        // A small 1-second buffer handles any minor db variations, though transaction time should be identical.
                                        const ROUND_THRESHOLD_MS = 1000;

                                        // Skip grouping for history or completed orders
                                        if (filter === 'history' || order.status === 'completed' || order.status === 'cancelled') {
                                            return sortedItems.map((item, idx) => (
                                                <li key={idx} className="flex justify-between text-sm">
                                                    <span className="text-gray-800">
                                                        <span className="font-bold mr-1">{item.quantity}x</span>
                                                        {item.name}
                                                    </span>
                                                    <span className="text-gray-600">{`${Math.round(parseFloat(item.price))} MKD`}</span>
                                                </li>
                                            ));
                                        }

                                        const previousItems = [];
                                        const newItems = [];

                                        sortedItems.forEach(item => {
                                            const itemTime = new Date(item.created_at || 0).getTime();
                                            if (lastItemTime - itemTime < ROUND_THRESHOLD_MS) {
                                                newItems.push(item);
                                            } else {
                                                previousItems.push(item);
                                            }
                                        });

                                        // If everything is in one round (e.g. new order), just show all as one list without label
                                        // Unless we specifically want to mark "New Round" even for single round? 
                                        // User said "group only the items from the last round", implying separation from old.
                                        // If no previous items, then "New Round" label might be redundant or confusing?
                                        // Let's assume if previousItems is empty, we just show mapped items normally (no label).

                                        return (
                                            <>
                                                {/* Previous Items */}
                                                {previousItems.map((item, idx) => (
                                                    <li key={`prev-${idx}`} className="flex justify-between text-sm opacity-75">
                                                        <span className="text-gray-800">
                                                            <span className="font-bold mr-1">{item.quantity}x</span>
                                                            {item.name}
                                                        </span>
                                                        <span className="text-gray-600">{`${Math.round(parseFloat(item.price))} MKD`}</span>
                                                    </li>
                                                ))}

                                                {/* Separator if we have both old and new items */}
                                                {previousItems.length > 0 && newItems.length > 0 && (
                                                    <li className="flex items-center gap-2 py-2">
                                                        <div className="h-px bg-blue-200 flex-1"></div>
                                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-full">
                                                            New Round
                                                        </span>
                                                        <div className="h-px bg-blue-200 flex-1"></div>
                                                    </li>
                                                )}

                                                {/* New/Latest Items */}
                                                {newItems.map((item, idx) => (
                                                    <li key={`new-${idx}`} className="flex justify-between text-sm">
                                                        <span className="text-gray-900 font-medium">
                                                            <span className="font-bold mr-1">{item.quantity}x</span>
                                                            {item.name}
                                                        </span>
                                                        <span className="text-gray-800 font-medium">{`${Math.round(parseFloat(item.price))} MKD`}</span>
                                                    </li>
                                                ))}
                                            </>
                                        );
                                    })()}
                                </ul>
                            </div>

                            <div className="border-t border-gray-100 pt-3 mb-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-medium text-gray-600">Total</span>
                                    <span className="text-xl font-bold text-gray-900">{`${Math.round(parseFloat(order.total_amount))} MKD`}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {filter === 'active' && (
                                    <>
                                        {order.status === 'preparing' && (
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
                                    </>
                                )}
                                {filter === 'history' && (
                                    <button
                                        onClick={() => handlePrintReceipt(order)}
                                        className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-print"></i>
                                        Print Receipt
                                    </button>
                                )}
                            </div>
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

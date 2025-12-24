import { useState, useEffect } from 'react';
import { posAPI } from '../../services/posAPI';
import { useAuth } from '../../context/AuthContext';
import { printReceipt } from '../../utils/receiptPrint';
import Modal from '../../components/Modal';

const OrderHistory = () => {
    const { user, isAdmin, isUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active'); // 'active' or 'history'
    const [changingTableOrderId, setChangingTableOrderId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tableSearchTerm, setTableSearchTerm] = useState('');

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

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            return;
        }
        
        try {
            await posAPI.updateOrderStatus(id, { status: 'cancelled' });
            fetchOrders();
            fetchTables(); // Refresh tables in case the order was occupying a table
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order');
        }
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
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-base text-gray-800 font-semibold flex items-center gap-2">
                                        <span>{order.table_name ? `Table: ${order.table_name}` : 'Takeaway'}</span>
                                        <button
                                            onClick={() => setChangingTableOrderId(order.id)}
                                            className="text-blue-600 hover:text-blue-800 bg-blue-100 py-1 px-1.5 rounded-md transition-colors"
                                            title="Change table"
                                        >
                                            <i className="fas fa-edit text-lg"></i>
                                        </button>
                                    </div>
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
                                        {(isAdmin() || isUser()) && (
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="w-full px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                                            >
                                                <i className="fas fa-trash"></i>
                                                Delete Order
                                            </button>
                                        )}
                                    </>
                                )}
                                {filter === 'history' && (
                                    <>
                                        <button
                                            onClick={() => handlePrintReceipt(order)}
                                            className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                                        >
                                            <i className="fas fa-print"></i>
                                            Print Receipt
                                        </button>
                                        {(isAdmin() || isUser()) && (
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="w-full px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                                            >
                                                <i className="fas fa-trash"></i>
                                                Delete Order
                                            </button>
                                        )}
                                    </>
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

            {/* Table Selection Modal */}
            {changingTableOrderId && (() => {
                const currentOrder = orders.find(o => o.id === changingTableOrderId);
                const filteredTables = tables.filter(table => 
                    table.name.toLowerCase().includes(tableSearchTerm.toLowerCase())
                );
                
                return (
                    <Modal
                        isOpen={!!changingTableOrderId}
                        onClose={() => {
                            setChangingTableOrderId(null);
                            setTableSearchTerm('');
                        }}
                        title={null}
                    >
                        <div className="space-y-3">
                            {/* Custom Header with Title and Search */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Select Table</h3>
                                <input
                                    type="text"
                                    value={tableSearchTerm}
                                    onChange={(e) => setTableSearchTerm(e.target.value)}
                                    placeholder="Search tables..."
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                                />
                            </div>

                            {/* Takeaway Option */}
                            <button
                                onClick={() => {
                                    handleTableChange(changingTableOrderId, 'null');
                                }}
                                className="w-full text-center px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-200 hover:border-gray-300"
                            >
                                <span className="text-gray-900 font-medium">Takeaway</span>
                            </button>

                            {/* Tables Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {filteredTables.map(table => {
                                    const isOccupied = table.order_id && table.id !== currentOrder?.table_id;
                                    const isCurrentTable = table.id === currentOrder?.table_id;
                                    
                                    return (
                                        <button
                                            key={table.id}
                                            onClick={() => {
                                                if (!isOccupied) {
                                                    handleTableChange(changingTableOrderId, table.id.toString());
                                                }
                                            }}
                                            disabled={isOccupied}
                                            className={`h-16 rounded-lg transition-colors border-2 text-center flex items-center justify-center ${
                                                isOccupied
                                                    ? 'bg-orange-50 border-orange-400 text-orange-600 cursor-not-allowed'
                                                    : isCurrentTable
                                                    ? 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100'
                                                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900'
                                            }`}
                                        >
                                            <span className={`font-medium text-sm ${isOccupied ? 'italic' : ''}`}>
                                                {table.name}
                                                {isOccupied && <span className="block text-xs mt-0.5">(Occupied)</span>}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Modal>
                );
            })()}
        </div>
    );
};

export default OrderHistory;

import { useState, useEffect } from 'react';
import { posAPI } from '../../services/posAPI';
import { userAPI } from '../../services/api';

const OrderTaking = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [tables, setTables] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1 = Select Table, 2 = Select Products

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catsRes, prodsRes, tablesRes, staffRes] = await Promise.all([
                userAPI.getCategories(),
                userAPI.getMenuItems(),
                posAPI.getTables(),
                posAPI.getStaff()
            ]);

            setCategories(catsRes.data.categories || []);
            setProducts(prodsRes.data.items || []);
            setTables(tablesRes.data.tables || []);
            setStaffList(staffRes.data.staff || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setProcessing(true);
        try {
            const orderData = {
                table_id: selectedTable === 'to-go' ? null : selectedTable,
                staff_id: selectedStaff || null,
                items: cart.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    notes: ''
                })),
                total_amount: cartTotal,
                payment_method: 'cash'
            };

            await posAPI.createOrder(orderData);
            setCart([]);
            setSelectedTable(null);
            setSelectedStaff('');
            setStep(1);
            // Refresh tables to update their status
            await fetchData();
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order');
        } finally {
            setProcessing(false);
        }
    };

    const handleTableSelect = (tableId) => {
        setSelectedTable(tableId);
        setStep(2);
    };

    const handleBackToTables = async () => {
        setStep(1);
        setCart([]);
        // Refresh tables to get updated status
        await fetchData();
    };

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'all' || p.category_id === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) return <div className="p-8 text-center">Loading POS...</div>;

    // Step 1: Table Selection
    if (step === 1) {
        return (
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Table or Order Type</h2>
                    <p className="text-gray-600">Choose a table to start a new order</p>
                </div>

                {/* To Go and Staff Selection Row */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* To Go Option */}
                    <button
                        onClick={() => handleTableSelect('to-go')}
                        className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                    >
                        <i className="fas fa-shopping-bag text-2xl"></i>
                        <div className="text-left">
                            <div className="text-xl font-bold">To Go Order</div>
                            <div className="text-sm opacity-90">Takeaway / Delivery</div>
                        </div>
                    </button>

                    {/* Staff Selection */}
                    <div className="flex flex-col justify-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign to Staff (Optional)
                        </label>
                        <select
                            className="w-full p-4 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                        >
                            <option value="">No staff assigned</option>
                            {staffList.map(staff => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.name} ({staff.role})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tables Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {tables.map(table => (
                        <button
                            key={table.id}
                            onClick={() => handleTableSelect(table.id)}
                            disabled={table.status === 'occupied'}
                            className={`p-6 rounded-xl shadow-md transition-all relative ${table.status === 'available'
                                ? 'bg-white hover:bg-blue-50 hover:shadow-lg border-2 border-gray-200 hover:border-blue-500'
                                : table.status === 'reserved'
                                    ? 'bg-yellow-50 border-2 border-yellow-400 hover:bg-yellow-100'
                                    : 'bg-gray-100 border-2 border-gray-300 cursor-not-allowed opacity-60'
                                }`}
                        >
                            {/* Status Badge */}
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${table.status === 'available' ? 'bg-green-500 text-white' :
                                table.status === 'reserved' ? 'bg-yellow-500 text-white' :
                                    'bg-red-500 text-white'
                                }`}>
                                {table.status === 'available' ? 'Free' :
                                    table.status === 'reserved' ? 'Reserved' :
                                        'Occupied'}
                            </div>

                            <div className="text-center mt-2">
                                <i className={`fas fa-chair text-4xl mb-3 ${table.status === 'available' ? 'text-green-600' :
                                    table.status === 'reserved' ? 'text-yellow-600' :
                                        'text-gray-400'
                                    }`}></i>
                                <div className="font-bold text-gray-800 text-xl">{table.name}</div>
                            </div>
                        </button>
                    ))}
                </div>

                {tables.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <i className="fas fa-chair text-4xl mb-3"></i>
                        <p>No tables available. Add tables in Table Management.</p>
                    </div>
                )}
            </div>
        );
    }

    // Step 2: Product Selection
    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] gap-4 lg:gap-6">
            {/* Left Side: Menu */}
            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header with Back Button */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={handleBackToTables}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                        >
                            <i className="fas fa-arrow-left"></i>
                            <span className="hidden sm:inline">Back to Tables</span>
                        </button>
                        <div className="text-sm font-medium text-gray-700">
                            {selectedTable === 'to-go' ? (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                    <i className="fas fa-shopping-bag mr-1"></i> To Go
                                </span>
                            ) : (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    <i className="fas fa-chair mr-1"></i>
                                    {tables.find(t => t.id === selectedTable)?.name || 'Table'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="p-4 border-b border-gray-100 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === 'all'
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All Items
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 hover:shadow-lg hover:border-blue-500 transition-all text-left group flex flex-col h-full"
                            >
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm md:text-base mb-1 group-hover:text-blue-600 line-clamp-2">
                                        {product.name}
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-500 line-clamp-2 hidden sm:block">
                                        {product.description}
                                    </p>
                                </div>
                                <div className="mt-2 md:mt-3 font-bold text-gray-900 text-sm md:text-base">
                                    {parseFloat(product.price).toFixed(2)} MKD
                                </div>
                            </button>
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <i className="fas fa-search text-4xl mb-3"></i>
                            <p>No products found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Cart */}
            <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden max-h-[50vh] lg:max-h-full">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center justify-between">
                        <span>Current Order</span>
                        <span className="text-sm font-normal text-gray-600">{cart.length} items</span>
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                            <i className="fas fa-shopping-basket text-4xl mb-3"></i>
                            <p className="text-sm">Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{parseFloat(item.price).toFixed(2)} MKD</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-500 text-sm"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-green-500 text-sm"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4 text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>{cartTotal.toFixed(2)} MKD</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || processing}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${cart.length === 0 || processing
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30'
                            }`}
                    >
                        {processing ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderTaking;

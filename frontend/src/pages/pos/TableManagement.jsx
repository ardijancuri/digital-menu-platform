import { useState, useEffect } from 'react';
import { posAPI } from '../../services/posAPI';
import { useAuth } from '../../context/AuthContext';

const TableManagement = () => {
    const { isManager } = useAuth();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTable, setNewTable] = useState({ name: '', capacity: 4 });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await posAPI.getTables();
            setTables(response.data.tables);
        } catch (error) {
            console.error('Error fetching tables:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTable = async (e) => {
        e.preventDefault();
        try {
            await posAPI.createTable(newTable);
            setShowAddModal(false);
            setNewTable({ name: '', capacity: 4 });
            fetchTables();
        } catch (error) {
            console.error('Error creating table:', error);
            alert('Failed to create table');
        }
    };

    const handleDeleteTable = async (id) => {
        if (!window.confirm('Are you sure you want to delete this table?')) return;
        try {
            await posAPI.deleteTable(id);
            fetchTables();
        } catch (error) {
            console.error('Error deleting table:', error);
            alert('Failed to delete table');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await posAPI.updateTableStatus(id, status);
            fetchTables();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredTables = tables.filter(table =>
        table.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Loading tables...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Table Management</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search tables..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                    />
                    {!isManager() && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <i className="fas fa-plus"></i>
                        Add Table
                    </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                {filteredTables.map(table => (

                    <div
                        key={table.id}
                        className={`bg-white rounded-xl shadow-sm border-2 p-6 relative group transition-all ${table.status === 'occupied' ? 'border-orange-200 bg-orange-50' :
                            table.status === 'reserved' ? 'border-purple-200 bg-purple-50' :
                                'border-gray-100 hover:border-blue-200'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${table.status === 'occupied' ? 'bg-orange-100 text-orange-600' :
                                table.status === 'reserved' ? 'bg-purple-100 text-purple-600' :
                                    'bg-green-100 text-green-600'
                                }`}>
                                <i className="fas fa-chair"></i>
                            </div>
                            {!isManager() && (
                            <button
                                onClick={() => handleDeleteTable(table.id)}
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{table.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{table.capacity} Seats</p>

                        {table.status === 'occupied' && table.staff_name && (
                            <p className="text-xs text-blue-600 font-medium mb-3">
                                <i className="fas fa-user mr-1"></i>{table.staff_name}
                            </p>
                        )}

                        <select
                            value={table.status}
                            onChange={(e) => handleStatusChange(table.id, e.target.value)}
                            className={`w-full text-sm font-medium rounded-lg p-2 border focus:outline-none focus:ring-2 ${table.status === 'occupied' ? 'bg-orange-100 text-orange-700 border-orange-200 focus:ring-orange-500' :
                                table.status === 'reserved' ? 'bg-purple-100 text-purple-700 border-purple-200 focus:ring-purple-500' :
                                    'bg-green-100 text-green-700 border-green-200 focus:ring-green-500'
                                }`}
                        >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="reserved">Reserved</option>
                        </select>
                    </div>
                ))}
                {filteredTables.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <i className="fas fa-search text-4xl mb-3"></i>
                        <p>No tables found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>

            {/* Add Table Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-bold mb-4">Add New Table</h3>
                        <form onSubmit={handleAddTable}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Table 5 or Patio 1"
                                    value={newTable.name}
                                    onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={newTable.capacity}
                                    onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Table
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableManagement;

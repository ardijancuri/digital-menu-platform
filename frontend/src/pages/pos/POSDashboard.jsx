import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { posAPI } from '../../services/api'; // We'll create this later

const POSDashboard = () => {
    // Mock data for now
    const stats = {
        todaySales: 1250.50,
        activeOrders: 5,
        occupiedTables: 3,
        staffOnline: 4
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-lg text-green-600">
                            <i className="fas fa-dollar-sign text-xl"></i>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">Today's Sales</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">${stats.todaySales.toFixed(2)}</h3>
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                        <i className="fas fa-arrow-up mr-1"></i>
                        12% vs yesterday
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                            <i className="fas fa-clipboard-list text-xl"></i>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">Active Orders</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.activeOrders}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Pending processing
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                            <i className="fas fa-chair text-xl"></i>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">Occupied Tables</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.occupiedTables}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        45% capacity
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                            <i className="fas fa-users text-xl"></i>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">Staff Online</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.staffOnline}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Shift ends in 2h
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/pos/order" className="bg-blue-600 text-white rounded-xl p-6 shadow-lg hover:bg-blue-700 transition-colors flex flex-col items-center text-center group">
                    <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <i className="fas fa-plus text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold mb-2">New Order</h4>
                    <p className="text-blue-100 text-sm">Create a new order for table or takeaway</p>
                </Link>

                <Link to="/pos/tables" className="bg-white text-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center group">
                    <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <i className="fas fa-th text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Manage Tables</h4>
                    <p className="text-gray-500 text-sm">View layout and update status</p>
                </Link>

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

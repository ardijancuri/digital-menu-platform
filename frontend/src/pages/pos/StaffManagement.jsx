import { useState, useEffect } from 'react';
import { posAPI } from '../../services/posAPI';
import { useAuth } from '../../context/AuthContext';

const StaffManagement = () => {
    const { isManager } = useAuth();
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStaff, setNewStaff] = useState({ name: '', pin_code: '', role: 'server' });
    const [resettingRevenue, setResettingRevenue] = useState(false);
    const [generatingReportFor, setGeneratingReportFor] = useState(null);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await posAPI.getStaff();
            setStaffList(response.data.staff);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await posAPI.createStaff(newStaff);
            setShowAddModal(false);
            setNewStaff({ name: '', pin_code: '', role: 'server' });
            fetchStaff();
        } catch (error) {
            console.error('Error creating staff:', error);
            alert('Failed to create staff member');
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;
        try {
            await posAPI.deleteStaff(id);
            fetchStaff();
        } catch (error) {
            console.error('Error deleting staff:', error);
            alert('Failed to delete staff member');
        }
    };

    const handleResetRevenue = async () => {
        const confirmMessage = 'Are you sure you want to generate report? This will:\n' +
            '1. Store revenue in the reports\n' +
            '2. Delete all current orders\n' +
            '3. Generate a PDF report of all orders being deleted\n\n' +
            'This action cannot be undone!';
        
        if (!window.confirm(confirmMessage)) return;

        setResettingRevenue(true);
        try {
            const response = await posAPI.resetStaffRevenue();
            
            // Create blob URL for PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Create iframe for printing
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            iframe.src = url;
            
            document.body.appendChild(iframe);
            
            // Wait for PDF to load, then print
            iframe.onload = () => {
                setTimeout(() => {
                    try {
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    } catch (error) {
                        console.error('Error printing PDF:', error);
                        // Fallback: open in new tab if print fails
                        window.open(url, '_blank');
                    }
                    
                    // Clean up after printing
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                        window.URL.revokeObjectURL(url);
                    }, 1000);
                }, 250);
            };

            fetchStaff(); // Refresh staff list to show reset revenue
        } catch (error) {
            console.error('Error resetting revenue:', error);
            alert(error.response?.data?.message || 'Failed to reset revenue');
        } finally {
            setResettingRevenue(false);
        }
    };

    const handleGenerateStaffReport = async (staffId) => {
        setGeneratingReportFor(staffId);
        try {
            const response = await posAPI.getStaffReport(staffId);
            
            // Create blob URL for PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Create iframe for printing
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            iframe.src = url;
            
            document.body.appendChild(iframe);
            
            // Wait for PDF to load, then print
            iframe.onload = () => {
                setTimeout(() => {
                    try {
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    } catch (error) {
                        console.error('Error printing PDF:', error);
                        // Fallback: open in new tab if print fails
                        window.open(url, '_blank');
                    }
                    
                    // Clean up after printing
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                        window.URL.revokeObjectURL(url);
                    }, 1000);
                }, 250);
            };
        } catch (error) {
            console.error('Error generating staff report:', error);
            alert(error.response?.data?.message || 'Failed to generate staff report');
        } finally {
            setGeneratingReportFor(null);
        }
    };


    const totalRevenue = staffList.reduce((sum, staff) => sum + (staff.revenue || 0), 0);

    if (loading) return <div className="p-8 text-center">Loading staff...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Staff Management</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                    {!isManager() && (
                        <button
                            onClick={handleResetRevenue}
                            disabled={resettingRevenue}
                            className="bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-1 sm:flex-none justify-center"
                        >
                            <i className="fas fa-sync-alt"></i>
                            <span className="hidden sm:inline">{resettingRevenue ? 'Resetting...' : 'Generate Report'}</span>
                            <span className="sm:hidden">{resettingRevenue ? 'Resetting...' : 'Report'}</span>
                        </button>
                    )}
                    {!isManager() && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm sm:text-base flex-1 sm:flex-none justify-center"
                        >
                            <i className="fas fa-plus"></i>
                            <span className="hidden sm:inline">Add Staff</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Revenue</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {staffList.map(staff => (
                            <tr key={staff.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{staff.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${staff.role === 'admin' ? 'bg-red-100 text-red-600' :
                                            staff.role === 'manager' ? 'bg-purple-100 text-purple-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        {staff.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    {Math.round(staff.revenue || 0).toLocaleString()} MKD
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => handleGenerateStaffReport(staff.id)}
                                            disabled={generatingReportFor === staff.id}
                                            className="bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Generate Report"
                                        >
                                            <i className="fas fa-file-pdf"></i>
                                            {generatingReportFor === staff.id ? 'Generating...' : 'Report'}
                                        </button>
                                        {!isManager() && (
                                            <button
                                                onClick={() => handleDeleteStaff(staff.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete Staff"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {staffList.length > 0 && (
                            <tr className="bg-gray-100 font-bold">
                                <td className="px-6 py-4 text-gray-900" colSpan="2">
                                    Total Revenue
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                    {Math.round(totalRevenue).toLocaleString()} MKD
                                </td>
                                <td className="px-6 py-4"></td>
                            </tr>
                        )}
                        {staffList.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No staff members found. Add your first employee!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {staffList.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                        No staff members found. Add your first employee!
                    </div>
                ) : (
                    <>
                        {staffList.map(staff => (
                            <div key={staff.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{staff.name}</h3>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold uppercase ${staff.role === 'admin' ? 'bg-red-100 text-red-600' :
                                                staff.role === 'manager' ? 'bg-purple-100 text-purple-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            {staff.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Revenue</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {Math.round(staff.revenue || 0).toLocaleString()} MKD
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleGenerateStaffReport(staff.id)}
                                        disabled={generatingReportFor === staff.id}
                                        className="flex-1 bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Generate Report"
                                    >
                                        <i className="fas fa-file-pdf"></i>
                                        {generatingReportFor === staff.id ? 'Generating...' : 'Report'}
                                    </button>
                                    {!isManager() && (
                                        <button
                                            onClick={() => handleDeleteStaff(staff.id)}
                                            className="px-4 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Staff"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="bg-gray-100 rounded-xl border border-gray-200 p-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total Revenue</span>
                                <span className="font-bold text-gray-900">
                                    {Math.round(totalRevenue).toLocaleString()} MKD
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-bold mb-4">Add Staff Member</h3>
                        <form onSubmit={handleAddStaff}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={newStaff.name}
                                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code (4 digits)</label>
                                <input
                                    type="password"
                                    required
                                    maxLength="4"
                                    pattern="\d{4}"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={newStaff.pin_code}
                                    onChange={(e) => setNewStaff({ ...newStaff, pin_code: e.target.value })}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={newStaff.role}
                                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                                >
                                    <option value="server">Server</option>
                                    <option value="manager">Manager</option>
                                    <option value="kitchen">Kitchen Staff</option>
                                </select>
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
                                    Add Staff
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;

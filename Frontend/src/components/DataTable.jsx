
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { api } from '../api';

const DataTable = ({ location, onBack }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        fetchData();
    }, [location]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await api.getDataByLocation(location);
            setData(result);
        } catch(error) {
            console.error("Failed to fetch data", error);
            setModal({
                title: 'Error',
                message: `Could not fetch data for ${location}.\n\nError: ${error.message}`,
                onConfirm: () => { setModal(null); onBack(); }
            });
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allRowIds = data.map(item => item.id);
            setSelectedRows(allRowIds);
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (e, id) => {
        if (e.target.checked) {
            setSelectedRows([...selectedRows, id]);
        } else {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedRows.length === 0) {
            setModal({
                title: 'No Selection',
                message: 'Please select rows to delete.',
                onConfirm: () => setModal(null)
            });
            return;
        }

        setModal({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete ${selectedRows.length} selected lead(s)? This action cannot be undone.`, 
            onConfirm: async () => {
                setModal(null);
                setIsLoading(true);
                try {
                    await api.deleteMultipleLeads(location, selectedRows);
                    
                    setModal({
                        title: 'Success',
                        message: 'Successfully deleted selected leads.',
                        onConfirm: () => {
                            setModal(null);
                            fetchData(); // Refresh data
                        }
                    });
                    setSelectedRows([]); // Clear selection
                } catch (error) {
                    console.error("Failed to delete leads", error);
                    setModal({
                        title: 'Error',
                        message: `Could not delete selected leads.\n\nError: ${error.message}`,
                        onConfirm: () => setModal(null)
                    });
                } finally {
                    setIsLoading(false);
                }
            },
            onCancel: () => setModal(null)
        });
    };
    
    // Helper function to format date strings
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
    };

    if (isLoading) return <div className="text-center p-10">Loading data for {location}...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Viewing Data for: <span className="text-indigo-600">{location}</span></h2>
                <div>
                    {selectedRows.length > 0 && (
                        <button onClick={handleDeleteSelected} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 mr-4">
                            Delete Selected ({selectedRows.length})
                        </button>
                    )}
                    <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        &larr; Back
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={data.length > 0 && selectedRows.length === data.length}
                                />
                            </th>
                            {/* UPDATED: Added all table headers */}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">Sr.No</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-16 bg-gray-50 z-10">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact 1</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact 2</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family Members</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BHK</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Required</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caller Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Attended By</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit SM Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interested Project</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup/Drop</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Confirmation</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cate</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Followup Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P1SM</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P2SM</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P3SM</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P4SM</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P5SM</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banking Remark</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GH/DT/CC</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr><td colSpan="36" className="text-center py-10 text-gray-500">No data found for this location.</td></tr>
                        ) : data.map(item => (
                            <tr key={item.id} className={`hover:bg-gray-50 ${selectedRows.includes(item.id) ? 'bg-yellow-100' : ''}`}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleSelectRow(e, item.id)}
                                        checked={selectedRows.includes(item.id)}
                                    />
                                </td>
                                {/* UPDATED: Added all table data cells */}
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sticky left-0 bg-white z-10">{item.sr_no}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sticky left-16 bg-white z-10">{item.name}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.contact1}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.contact2}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.lead_date)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.visit_date)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.visit_status}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.dob)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_family_members}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.categories}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.locations}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.property_type}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.bhk}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.budget}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.loan_req}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.loan_amount}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.caller_name}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.meeting_attended_by}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.visit_sm_name}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.interested_project}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.reference}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.pickup_drop}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.booking_confirmation}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.cate}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.followup_date)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.p1sm}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.p2sm}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.p3sm}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.p4sm}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.p5sm}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.remark_date)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={item.remark}>{item.remark}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={item.banking_remark}>{item.banking_remark}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.gh_dt_cc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modal && <Modal {...modal} />}
        </div>
    );
};

export default DataTable;

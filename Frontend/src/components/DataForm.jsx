
import React, { useState} from 'react';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import Modal from './Modal';
import { api } from '../api';
import { initialFormData } from '../config';

const DataForm = ({ location, srNo, onBack, onFormSubmit }) => {
    const [formData, setFormData] = useState({ ...initialFormData, locations: location, sr_no: srNo });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modal, setModal] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Create a copy of formData to send, ensuring numeric fields are numbers
            const submissionData = { ...formData };
            const numericFields = ['budget', 'loanAmount', 'totalFamilyMembers'];
            numericFields.forEach(field => {
                if (submissionData[field] === '') {
                    submissionData[field] = null;
                } else if (submissionData[field] !== null) {
                    submissionData[field] = Number(submissionData[field]);
                }
            });

            await api.submitData(submissionData);
            setModal({
                title: 'Success',
                message: 'Data submitted successfully!',
                onConfirm: () => { setModal(null); onFormSubmit(); }
            });
        } catch (error) {
            console.error("Submission failed", error);
            setModal({
                title: 'Submission Error',
                message: `Failed to submit data. Please try again.\n\nError: ${error.message}`,
                onConfirm: () => setModal(null)
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">New Entry for: <span className="text-indigo-600">{location}</span></h2>
                <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                    &larr; Back
                </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* CORRECTED: All 'name' props are now camelCase */}
                    <InputField label="Sr. No." name="sr_no" value={formData.sr_no} onChange={() => {}} type="text" />
                    <InputField label="Lead Date" name="leadDate" value={formData.leadDate} onChange={handleChange} type="date" required />
                    <InputField label="Visit Date" name="visitDate" value={formData.visitDate} onChange={handleChange} type="date" />
                    <InputField label="Visit Status" name="visitStatus" value={formData.visitStatus} onChange={handleChange} />
                    
                    <InputField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="Contact 1" name="contact1" value={formData.contact1} onChange={handleChange} type="tel" required />
                    <InputField label="Contact 2" name="contact2" value={formData.contact2} onChange={handleChange} type="tel" />
                    <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                    <InputField label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} type="date" />
                    <InputField label="Total Family Members" name="totalFamilyMembers" value={formData.totalFamilyMembers} onChange={handleChange} type="number" />

                    <InputField label="Categories" name="categories" value={formData.categories} onChange={handleChange} />
                    <InputField label="Property Type" name="propertyType" value={formData.propertyType} onChange={handleChange} />
                    <InputField label="BHK" name="bhk" value={formData.bhk} onChange={handleChange} />
                    <InputField label="Budget" name="budget" value={formData.budget} onChange={handleChange} type="number" />
                    <InputField label="Loan Required" name="loanReq" value={formData.loanReq} onChange={handleChange} />
                    <InputField label="Loan Amount" name="loanAmount" value={formData.loanAmount} onChange={handleChange} type="number" />

                    <InputField label="Caller Name" name="callerName" value={formData.callerName} onChange={handleChange} />
                    <InputField label="Meeting Attended By" name="meetingAttendedBy" value={formData.meetingAttendedBy} onChange={handleChange} />
                    <InputField label="Visit SM Name" name="visitSmName" value={formData.visitSmName} onChange={handleChange} />
                    <InputField label="Interested Project" name="interestedProject" value={formData.interestedProject} onChange={handleChange} />
                    <InputField label="Reference" name="reference" value={formData.reference} onChange={handleChange} />
                    <InputField label="Pickup/Drop" name="pickupDrop" value={formData.pickupDrop} onChange={handleChange} />
                    <InputField label="Booking Confirmation" name="bookingConfirmation" value={formData.bookingConfirmation} onChange={handleChange} />
                    <InputField label="Category (Cate)" name="cate" value={formData.cate} onChange={handleChange} />
                    <InputField label="Follow-up Date" name="followupDate" value={formData.followupDate} onChange={handleChange} type="date" />
                    
                    <InputField label="P1SM" name="p1sm" value={formData.p1sm} onChange={handleChange} />
                    <InputField label="P2SM" name="p2sm" value={formData.p2sm} onChange={handleChange} />
                    <InputField label="P3SM" name="p3sm" value={formData.p3sm} onChange={handleChange} />
                    <InputField label="P4SM" name="p4sm" value={formData.p4sm} onChange={handleChange} />
                    <InputField label="P5SM" name="p5sm" value={formData.p5sm} onChange={handleChange} />
                    
                    <InputField label="Remark Date" name="remarkDate" value={formData.remarkDate} onChange={handleChange} type="date" />
                    <InputField label="GH/DT/CC" name="ghDtCc" value={formData.ghDtCc} onChange={handleChange} />

                    <TextAreaField label="Remark" name="remark" value={formData.remark} onChange={handleChange} />
                    <TextAreaField label="Banking Remark" name="bankingRemark" value={formData.bankingRemark} onChange={handleChange} />
                </div>
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="px-6 py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                        {isSubmitting ? 'Submitting...' : 'Submit Data'}
                    </button>
                </div>
            </form>
            {modal && <Modal {...modal} />}
        </div>
    );
};

export default DataForm;

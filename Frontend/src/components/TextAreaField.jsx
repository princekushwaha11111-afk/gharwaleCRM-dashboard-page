
import React from 'react';

const TextAreaField = ({ label, name, value, onChange }) => (
     <div className="flex flex-col md:col-span-2 lg:col-span-3">
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
    </div>
);

export default TextAreaField;

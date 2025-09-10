
import React from 'react';

const InputField = ({ label, name, value, onChange, type = 'text', required = false }) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value || ''}
            onChange={onChange}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
    </div>
);

export default InputField;

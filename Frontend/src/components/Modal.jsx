
import React from 'react';

const Modal = ({ title, message, onConfirm, onCancel, confirmText, cancelText }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">{title}</h3>
            <p className="text-gray-600 mb-6 whitespace-pre-wrap">{message}</p>
            <div className="flex justify-end space-x-4">
                {onCancel && <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">{cancelText || 'Cancel'}</button>}
                <button onClick={onConfirm} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{confirmText || 'OK'}</button>
            </div>
        </div>
    </div>
);

export default Modal;

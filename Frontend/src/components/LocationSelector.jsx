
import React from 'react';
import { LOCATIONS } from '../config';

const LocationSelector = ({ title, onSelect, onBack }) => (
    <div className="w-full max-w-4xl mx-auto text-center">
        <div className="flex justify-between items-center mb-8">
             <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                &larr; Back to Menu
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <div className="w-24"></div> {/* Spacer */}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LOCATIONS.map(loc => (
                <button key={loc} onClick={() => onSelect(loc)} className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-indigo-50 transition-all transform hover:-translate-y-1">
                    <span className="text-lg font-semibold text-gray-700">{loc}</span>
                </button>
            ))}
        </div>
    </div>
);

export default LocationSelector;

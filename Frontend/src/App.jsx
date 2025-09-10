
import React, { useState } from 'react';
import DataForm from './components/DataForm';
import DataTable from './components/DataTable';
import LocationSelector from './components/LocationSelector';
import Modal from './components/Modal';
import { api } from './api';


export default function App() {
    const [view, setView] = useState('main'); // 'main', 'selectLocationForEntry', 'form', 'selectLocationForView', 'viewData'
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [nextSrNo, setNextSrNo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState(null);

    const handleSelectLocationForEntry = async (location) => {
        setIsLoading(true);
        setSelectedLocation(location);
        try {
            const srNo = await api.getNextSrNo(location);
            setNextSrNo(srNo);
            setView('form');
        } catch (error) {
            console.error("Failed to fetch next serial number:", error);
            setModal({
                title: 'API Error',
                message: `Could not fetch the next serial number. Please check the connection and try again.\n\nDetails: ${error.message}`,
                onConfirm: () => setModal(null)
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelectLocationForView = (location) => {
        setSelectedLocation(location);
        setView('viewData');
    };

    const resetToMain = () => {
        setView('main');
        setSelectedLocation(null);
        setNextSrNo(null);
    };

    const renderContent = () => {
        if (isLoading) {
             return <div className="text-center p-10">Loading...</div>;
        }
        
        switch (view) {
            case 'form':
                return <DataForm location={selectedLocation} srNo={nextSrNo} onBack={() => setView('selectLocationForEntry')} onFormSubmit={resetToMain} />;
            case 'selectLocationForEntry':
                return <LocationSelector title="Select Location to Add New Data" onSelect={handleSelectLocationForEntry} onBack={resetToMain} />;
            case 'viewData':
                return <DataTable location={selectedLocation} onBack={() => setView('selectLocationForView')} />;
            case 'selectLocationForView':
                 return <LocationSelector title="Select Location to View Data" onSelect={handleSelectLocationForView} onBack={resetToMain} />;
            case 'main':
            default:
                return (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Menu</h2>
                        <div className="space-x-4">
                            <button onClick={() => setView('selectLocationForEntry')} className="px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105">
                                Enter New Data
                            </button>
                            <button onClick={() => setView('selectLocationForView')} className="px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105">
                                View All Data
                            </button>
                        </div>
                    </div>
                );
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <header className="w-full text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                    Office Data Entry Dashboard
                </h1>
            </header>
            <main className="w-full flex items-center justify-center">
                {renderContent()}
            </main>
            {modal && <Modal {...modal} />}
        </div>
    );
}

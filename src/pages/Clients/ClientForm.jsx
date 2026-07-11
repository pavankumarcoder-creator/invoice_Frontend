import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';

export const ClientForm = ({ client, onClose }) => {
    const { addClient, updateClient } = useApp();
    const { showToast } = useToast();
    const [businessName, setBusinessName] = useState('');
    const [address, setAddress] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [website, setWebsite] = useState('');
    const [errors, setErrors] = useState({});
    const clearErr = (key) => setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    const [isLoading, setIsLoading] = useState(false);

    // Load client details if editing
    useEffect(() => {
        if (client) {
            setBusinessName(client.businessName);
            setAddress(client.address || '');
            setExtraInfo(client.extraInfo || '');
            setWebsite(client.website || '');
        }
    }, [client]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!businessName) {
            newErrors.businessName = 'Name is required';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showToast('error', 'Form Error', 'Please check validation issues');
            return;
        }
        setErrors({});
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const payload = {
                businessName,
                username: businessName.toLowerCase().replace(/\s+/g, '-'),
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address,
                extraInfo,
                website
            };
            if (client) {
                updateClient(client.id, payload);
                showToast('success', 'Client Profile Updated', `${businessName} details updated.`);
            }
            else {
                addClient(payload);
                showToast('success', 'Client Registered', `${businessName} added to directory.`);
            }
            onClose();
        }, 600);
    };

    return (<form onSubmit={handleSubmit} className="space-y-5 font-sans text-slate-700 dark:text-slate-300">
      
      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-y-4 pt-2">
        
        {/* Client Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Name*</label>
          <input type="text" value={businessName} onChange={(e) => { setBusinessName(e.target.value); clearErr('businessName'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.businessName ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
          {errors.businessName && <p className="text-xs font-medium text-red-500">⚠ {errors.businessName}</p>}
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
        </div>

        {/* Extra Info */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Extra Info</label>
          <textarea value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={2}/>
        </div>

        {/* Website */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Website</label>
          <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 font-medium"/>
        </div>

      </div>

      {/* Footer Submit Buttons */}
      <div className="flex justify-start gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-sm shadow-blue-500/10 active:scale-95 transition-all flex items-center justify-center min-w-[125px]">
          {isLoading ? (client ? 'Saving...' : 'Adding...') : client ? 'Save Changes' : 'Add New Client'}
        </button>
      </div>

    </form>);
};

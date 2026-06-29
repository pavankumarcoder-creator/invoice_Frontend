import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
export const ClientForm = ({ client, onClose }) => {
    const { addClient, updateClient, clients } = useApp();
    const { showToast } = useToast();
    const [mode, setMode] = useState('create');
    const [selectedClientId, setSelectedClientId] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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
            setUsername(client.username);
            setEmail(client.email);
            setPassword(client.password ?? '');
            setFirstName(client.firstName ?? '');
            setLastName(client.lastName ?? '');
            setAddress(client.address);
            setExtraInfo(client.extraInfo);
            setWebsite(client.website);
        }
    }, [client]);
    // Handle dropdown linking client
    const handleSelectClient = (e) => {
        const cid = e.target.value;
        setSelectedClientId(cid);
        const found = clients.find(c => c.id === cid);
        if (found) {
            setBusinessName(found.businessName);
            setEmail(found.email);
            setAddress(found.address);
            setExtraInfo(found.extraInfo);
            setWebsite(found.website);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (mode === 'link' && !client) {
            if (!selectedClientId)
                newErrors.selectedClientId = 'Please select an existing client';
            if (!businessName)
                newErrors.businessName = 'Business/Client Name is required';
        }
        else {
            if (!businessName)
                newErrors.businessName = 'Business/Client Name is required';
            if (!email) {
                newErrors.email = 'Email address is required';
            }
            else if (!/\S+@\S+\.\S+/.test(email)) {
                newErrors.email = 'Invalid email address';
            }
            if (!username)
                newErrors.username = 'Username is required';
            if (!password)
                newErrors.password = 'Password is required';
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
                username: username || businessName.toLowerCase().replace(/\s+/g, '-'),
                email,
                password,
                firstName,
                lastName,
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
                showToast('success', 'Client Registered', `${businessName} added to ledger database.`);
            }
            onClose();
        }, 600);
    };
    return (<form onSubmit={handleSubmit} className="space-y-5 font-sans text-slate-700 dark:text-slate-300">
      
      {/* WordPress Instruction Info Box */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed relative">
        To create a new client, choose either an existing WordPress user to associate with the client, or create a new user. For help see our support page about <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline font-semibold">Clients</a>.
      </div>

      {/* Mode Radio Toggles Selector */}
      {!client && (<div className="space-y-2 pb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Add new client from:</span>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
              <input type="radio" name="clientMode" checked={mode === 'link'} onChange={() => setMode('link')} className="rounded-full text-primary focus:ring-primary h-4 w-4"/>
              Existing User
            </label>
            <label className="flex items-center gap-2.5 font-semibold text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300">
              <input type="radio" name="clientMode" checked={mode === 'create'} onChange={() => setMode('create')} className="rounded-full text-primary focus:ring-primary h-4 w-4"/>
              Create New User
            </label>
          </div>
        </div>)}

      {/* Main 12-Column Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4 items-start pt-4 border-t border-slate-100 dark:border-slate-800">
        
        {/* SELECT EXISTING CLIENT (mode === 'link' only) */}
        {mode === 'link' && !client && (<>
            <div className="md:col-span-3 pt-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Select Existing User:*</label>
            </div>
            <div className="md:col-span-9">
              <select value={selectedClientId} onChange={handleSelectClient} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.selectedClientId ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'}`}>
                <option value="">Choose client</option>
                {clients.map(c => (<option key={c.id} value={c.id}>{c.businessName}</option>))}
              </select>
              {errors.selectedClientId && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.selectedClientId}</p>}
            </div>
          </>)}

        {/* Business/Client Name* */}
        <div className="md:col-span-3 pt-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Business/Client Name*</label>
        </div>
        <div className="md:col-span-9">
          <input type="text" value={businessName} onChange={(e) => { setBusinessName(e.target.value); clearErr('businessName'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.businessName ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
          {errors.businessName && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.businessName}</p>}
        </div>

        {/* E-mail* */}
        {(mode === 'create' || client) && (<>
            <div className="md:col-span-3 pt-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">E-mail*</label>
            </div>
            <div className="md:col-span-9">
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearErr('email'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
              {errors.email && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.email}</p>}
            </div>
          </>)}

        {/* Username* */}
        {(mode === 'create' || client) && (<>
            <div className="md:col-span-3 pt-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Username*</label>
            </div>
            <div className="md:col-span-9">
              <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); clearErr('username'); }} className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.username ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
              {errors.username && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.username}</p>}
            </div>
          </>)}

        {/* Password* */}
        {(mode === 'create' || client) && (<>
            <div className="md:col-span-3 pt-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Password*</label>
            </div>
            <div className="md:col-span-9 space-y-1">
              <div className="flex items-center gap-2">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); clearErr('password'); }} className={`flex-1 rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'}`}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-[10px] font-extrabold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap cursor-pointer transition-colors">
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>
              {errors.password && <p className="text-xs font-medium text-red-500 mt-1">⚠ {errors.password}</p>}
            </div>
          </>)}

        {/* Address */}
        <div className="md:col-span-3 pt-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Address</label>
        </div>
        <div className="md:col-span-9">
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
        </div>

        {/* Extra Info */}
        <div className="md:col-span-3 pt-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Extra Info</label>
        </div>
        <div className="md:col-span-9">
          <textarea value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100" rows={3}/>
        </div>

        {/* First Name */}
        {(mode === 'create' || client) && (<>
            <div className="md:col-span-3 pt-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">First Name</label>
            </div>
            <div className="md:col-span-9">
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
            </div>
          </>)}

        {/* Last Name */}
        {(mode === 'create' || client) && (<>
            <div className="md:col-span-3 pt-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Last Name</label>
            </div>
            <div className="md:col-span-9">
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100"/>
            </div>
          </>)}

        {/* Website */}
        {(mode === 'create' || client) && (<>
            <div className="md:col-span-3 pt-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Website</label>
            </div>
            <div className="md:col-span-9">
              <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden text-slate-900 dark:text-slate-100 font-medium"/>
            </div>
          </>)}

      </div>

      {/* Footer Submit Buttons */}
      <div className="flex justify-start gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-sm shadow-blue-500/10 active:scale-95 transition-all flex items-center justify-center min-w-[125px]">
          {isLoading ? 'Adding...' : client ? 'Save Changes' : 'Add New Client'}
        </button>
      </div>

    </form>);
};

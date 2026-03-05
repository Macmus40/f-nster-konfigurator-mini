import React, { useState } from 'react';
import { AppState, Profile, Product, Accessory } from '../types';
import { TRANSLATIONS } from '../constants';
import { supabase } from '../supabaseClient';
import { Settings, X, Upload, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AdminPanelProps {
    state: AppState;
    updateState: (updates: Partial<AppState>) => void;
    syncWithSupabase: () => Promise<void>;
}

export default function AdminPanel({ state, updateState, syncWithSupabase }: AdminPanelProps) {
    const T = TRANSLATIONS[state.currentLanguage];
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const correctPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
        if (password === correctPass) {
            updateState({ isAdminAuthenticated: true });
        } else {
            alert(T.admin_pass_error);
        }
    };

    const closeAdmin = () => {
        updateState({ isAdminOpen: false, isAdminAuthenticated: false });
    };

    const toggleProfileStatus = (profileName: string) => {
        const disabled = state.disabledProfiles.includes(profileName)
            ? state.disabledProfiles.filter(p => p !== profileName)
            : [...state.disabledProfiles, profileName];
        updateState({ disabledProfiles: disabled });
    };

    const toggleProductInProfile = (profileName: string, productName: string) => {
        const map = { ...state.profileProductMap };
        if (!map[profileName]) map[profileName] = [];
        
        if (map[profileName].includes(productName)) {
            map[profileName] = map[profileName].filter(p => p !== productName);
        } else {
            map[profileName].push(productName);
        }
        updateState({ profileProductMap: map });
    };

    const toggleAccessory = (accId: string) => {
        const enabled = state.enabledAccessories.includes(accId)
            ? state.enabledAccessories.filter(id => id !== accId)
            : [...state.enabledAccessories, accId];
        updateState({ enabledAccessories: enabled });
    };

    if (!state.isAdminOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div onClick={closeAdmin} className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
            
            {!state.isAdminAuthenticated ? (
                <div className="glass w-full max-w-md rounded-3xl overflow-hidden relative shadow-2xl border-2 border-[#C5A059]/50 p-10 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C5A059]/30">
                        <Settings className="w-8 h-8 text-[#C5A059]" />
                    </div>
                    <h2 className="text-xl font-black font-montserrat text-[#C5A059] uppercase tracking-tighter mb-2">{T.admin_pass_title}</h2>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mb-8">{T.admin_pass_desc}</p>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={T.admin_pass_placeholder} 
                            required 
                            className="tech-input text-center text-lg tracking-[0.5em]" 
                        />
                        <button type="submit" className="w-full btn-gold py-4 rounded-xl text-[10px]">{T.admin_pass_btn}</button>
                    </form>
                    <button onClick={closeAdmin} className="mt-6 text-[9px] text-[var(--text-muted)] uppercase font-bold hover:text-white transition-colors">CLOSE</button>
                </div>
            ) : (
                <div className="glass w-full max-w-4xl rounded-3xl overflow-hidden relative shadow-2xl max-h-[90vh] flex flex-col border-2 border-[#C5A059]/50 animate-in fade-in zoom-in duration-300">
                    <div className="p-8 border-b border-[var(--border-color)] bg-[#C5A059]/5 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black font-montserrat text-[#C5A059] uppercase tracking-tighter">{T.admin_title}</h2>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mt-2">{T.admin_desc}</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 pr-6 border-r border-[var(--border-color)]">
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">SUPABASE CLOUD</p>
                                    <p className={`text-[8px] uppercase mt-1 ${state.supabaseStatus === 'error' ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                                        {state.supabaseStatus === 'connected' ? 'SYNCED' : state.supabaseStatus === 'loading' ? 'SYNCING...' : state.supabaseStatus === 'error' ? 'ERROR' : 'NOT CONFIGURED'}
                                    </p>
                                </div>
                                <button onClick={syncWithSupabase} className={`w-10 h-10 rounded-xl border border-[#C5A059]/30 flex items-center justify-center hover:bg-[#C5A059]/10 transition-all ${state.supabaseStatus === 'loading' ? 'animate-spin' : ''}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" className="w-5 h-5"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto p-8 custom-scroll">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Profiles & Products */}
                            <div className="space-y-12">
                                <h3 className="text-xs font-black text-[#C5A059] tracking-[0.3em] uppercase mb-8">{T.admin_profiles}</h3>
                                {state.profiles.map(profile => {
                                    const isDisabled = state.disabledProfiles.includes(profile.name);
                                    return (
                                        <div key={profile.name} className={`space-y-4 p-6 rounded-2xl border ${isDisabled ? 'bg-red-500/5 border-red-500/20 opacity-60' : 'bg-white/5 border-white/10'}`}>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest border-l-4 border-[#C5A059] pl-4">{profile.name}</h3>
                                                <button onClick={() => toggleProfileStatus(profile.name)} className={`text-[8px] font-black px-3 py-1 rounded border ${isDisabled ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                                                    {isDisabled ? T.admin_disabled : T.admin_active}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {state.products.map(product => {
                                                    const isChecked = state.profileProductMap[profile.name]?.includes(product.name);
                                                    return (
                                                        <div key={product.name} onClick={() => toggleProductInProfile(profile.name, product.name)} className={`cursor-pointer p-2 rounded-lg border transition-all flex items-center gap-2 ${isChecked ? 'bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059]' : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-muted)]'}`}>
                                                            <div className={`w-3 h-3 rounded border flex items-center justify-center ${isChecked ? 'bg-[#C5A059] border-[#C5A059]' : 'border-[var(--border-color)]'}`}>
                                                                {isChecked && <Check size={10} className="text-black" strokeWidth={4} />}
                                                            </div>
                                                            <span className="text-[8px] font-black uppercase tracking-tight truncate">{product.name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Accessories */}
                            <div className="space-y-12">
                                <h3 className="text-xs font-black text-[#C5A059] tracking-[0.3em] uppercase mb-8">{T.admin_acc}</h3>
                                <div className="space-y-8">
                                    {['Ventilation', 'Handles', 'Colors'].map(cat => (
                                        <div key={cat} className="space-y-4">
                                            <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{cat}</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {state.accessories.filter(a => a.category === cat).map(acc => {
                                                    const isEnabled = state.enabledAccessories.includes(acc.id);
                                                    return (
                                                        <div key={acc.id} onClick={() => toggleAccessory(acc.id)} className={`cursor-pointer p-4 rounded-xl border transition-all flex justify-between items-center ${isEnabled ? 'bg-[#C5A059]/10 border-[#C5A059]' : 'bg-[var(--bg-subtle)] border-[var(--border-color)]'}`}>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isEnabled ? 'text-[#C5A059]' : 'text-[var(--text-muted)]'}`}>{acc.name}</span>
                                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${isEnabled ? 'bg-[#C5A059]' : 'bg-gray-700'}`}>
                                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isEnabled ? 'left-6' : 'left-1'}`}></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-[var(--bg-subtle)] border-t border-[var(--border-color)] flex justify-end">
                        <button onClick={closeAdmin} className="btn-gold px-10 py-3 rounded-xl text-[10px]">CLOSE ADMIN</button>
                    </div>
                </div>
            )}
        </div>
    );
}

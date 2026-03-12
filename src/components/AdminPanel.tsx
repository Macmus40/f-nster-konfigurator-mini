import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, Profile, Product, Accessory } from '../types';
import { TRANSLATIONS } from '../constants';
import { supabase } from '../supabaseClient';
import { Settings, X, Upload, Download, CheckCircle2, AlertCircle, Loader2, Check, Github, Plus, Edit2, Trash2, Save } from 'lucide-react';

interface AdminPanelProps {
    state: AppState;
    updateState: (updates: Partial<AppState>) => void;
    syncWithSupabase: () => Promise<any>;
    persistToSupabase: () => Promise<void>;
}

export default function AdminPanel({ state, updateState, syncWithSupabase, persistToSupabase }: AdminPanelProps) {
    const T = TRANSLATIONS[state.currentLanguage];
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'profiles' | 'products' | 'accessories'>('profiles');
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [isAddingProfile, setIsAddingProfile] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
    const [isAddingAccessory, setIsAddingAccessory] = useState(false);
    
    const [profileForm, setProfileForm] = useState<Profile>({
        name: '',
        type: 'PVC',
        specs: { Uw: '', dB: '', chambers: '', depth: '' },
        imageSrc: '',
        sectionImageSrc: '',
        description: { sv: '', da: '', de: '', en: '' }
    });

    const [productForm, setProductForm] = useState<Product>({
        name: '',
        category: 'Fönster',
        imageSrc: ''
    });

    const [accessoryForm, setAccessoryForm] = useState<Accessory>({
        id: '',
        name: { sv: '', da: '', de: '', en: '' },
        category: 'Colors',
        imageSrc: ''
    });

    const [isUploading, setIsUploading] = useState<string | null>(null);

    const [localMessage, setLocalMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
        setLocalMessage({ text, type });
        setTimeout(() => setLocalMessage(null), 3000);
    };

    const uploadImage = async (file: File, folder: string) => {
        if (!supabase) return null;
        setIsUploading(folder);
        try {
            // Sanitize filename: remove special characters, replace spaces with underscores
            const cleanName = file.name
                .replace(/[#ÖÄÅöäå]/g, (m) => {
                    const map: Record<string, string> = { '#': '_hash', 'Ö': 'O', 'Ä': 'A', 'Å': 'A', 'ö': 'o', 'ä': 'a', 'å': 'a' };
                    return map[m] || m;
                })
                .replace(/\s+/g, '_');
            
            const fileName = `${Date.now()}_${cleanName}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('konfigurator-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('konfigurator-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Upload error:', error);
            showMessage('Failed to upload image. Please try again.', 'error');
            return null;
        } finally {
            setIsUploading(null);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageSrc' | 'sectionImageSrc' | 'productImage' | 'accessoryImage') => {
        const file = e.target.files?.[0];
        if (!file) return;

        let folder = 'PROFILE';
        if (field === 'productImage') folder = 'PRODUCT';
        if (field === 'accessoryImage') folder = 'ACCESSORY';
        
        const url = await uploadImage(file, folder);
        if (url) {
            if (field === 'productImage') {
                setProductForm(prev => ({ ...prev, imageSrc: url }));
            } else if (field === 'accessoryImage') {
                setAccessoryForm(prev => ({ ...prev, imageSrc: url }));
            } else {
                setProfileForm(prev => ({ ...prev, [field]: url }));
            }
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const correctPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
        if (password === correctPass) {
            updateState({ isAdminAuthenticated: true });
        } else {
            showMessage(T.admin_pass_error, 'error');
        }
    };

    const closeAdmin = () => {
        updateState({ isAdminOpen: false, isAdminAuthenticated: false });
        setIsAddingProfile(false);
        setEditingProfile(null);
    };

    const toggleProfileStatus = (profileName: string) => {
        const disabled = state.disabledProfiles.includes(profileName)
            ? state.disabledProfiles.filter(p => p !== profileName)
            : [...state.disabledProfiles, profileName];
        updateState({ disabledProfiles: disabled });
    };

    const toggleProductInProfile = (profileName: string, productName: string) => {
        const map = { ...state.profileProductMap };
        if (!map[profileName]) {
            map[profileName] = state.products.map(p => p.name);
        }
        
        if (map[profileName].includes(productName)) {
            map[profileName] = map[profileName].filter(p => p !== productName);
        } else {
            map[profileName].push(productName);
        }
        updateState({ profileProductMap: map });
    };

    const toggleAccessoryInProfile = (profileName: string, accId: string) => {
        const map = { ...state.profileAccessoryMap };
        if (!map[profileName]) {
            map[profileName] = state.accessories.map(a => a.id);
        }
        
        if (map[profileName].includes(accId)) {
            map[profileName] = map[profileName].filter(id => id !== accId);
        } else {
            map[profileName].push(accId);
        }
        updateState({ profileAccessoryMap: map });
    };

    const handleAddProduct = () => {
        setProductForm({
            name: '',
            category: 'Fönster',
            imageSrc: '',
            sort_order: 0
        });
        setIsAddingProduct(true);
        setEditingProduct(null);
    };

    const handleEditProduct = (product: Product) => {
        setProductForm({ ...product });
        setEditingProduct(product);
        setIsAddingProduct(false);
    };

    const handleDeleteProduct = (productName: string) => {
        const newProducts = state.products.filter(p => p.name !== productName);
        updateState({ products: newProducts });
        showMessage(`Product "${productName}" deleted`);
    };

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productForm.name) {
            showMessage("Product name is required", "error");
            return;
        }

        let newProducts = [...state.products];
        if (editingProduct) {
            newProducts = newProducts.map(p => p.name === editingProduct.name ? productForm : p);
        } else {
            if (newProducts.find(p => p.name === productForm.name)) {
                showMessage("Product with this name already exists", "error");
                return;
            }
            newProducts.push(productForm);
        }

        newProducts.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        updateState({ products: newProducts });
        setIsAddingProduct(false);
        setEditingProduct(null);
        showMessage("Product saved successfully");
    };

    const handleAddAccessory = () => {
        setAccessoryForm({
            id: `acc_${Date.now()}`,
            name: { sv: '', da: '', de: '', en: '' },
            category: 'Colors',
            imageSrc: '',
            sort_order: 0
        });
        setIsAddingAccessory(true);
        setEditingAccessory(null);
    };

    const handleEditAccessory = (acc: Accessory) => {
        setAccessoryForm({ ...acc });
        setEditingAccessory(acc);
        setIsAddingAccessory(false);
    };

    const handleDeleteAccessory = (id: string) => {
        const newAccessories = state.accessories.filter(a => a.id !== id);
        updateState({ accessories: newAccessories });
        showMessage(`Accessory deleted`);
    };

    const handleSaveAccessory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessoryForm.id) {
            showMessage("Accessory ID is required", "error");
            return;
        }

        let newAccessories = [...state.accessories];
        if (editingAccessory) {
            newAccessories = newAccessories.map(a => a.id === editingAccessory.id ? accessoryForm : a);
        } else {
            if (newAccessories.find(a => a.id === accessoryForm.id)) {
                showMessage("Accessory with this ID already exists", "error");
                return;
            }
            newAccessories.push(accessoryForm);
        }

        newAccessories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        updateState({ accessories: newAccessories });
        setIsAddingAccessory(false);
        setEditingAccessory(null);
        showMessage("Accessory saved successfully");
    };
    const handleAddProfile = () => {
        setProfileForm({
            name: '',
            type: 'PVC',
            specs: { Uw: '', dB: '', chambers: '', depth: '' },
            imageSrc: '',
            sectionImageSrc: '',
            sort_order: 0,
            description: { sv: '', da: '', de: '', en: '' }
        });
        setIsAddingProfile(true);
        setEditingProfile(null);
    };

    const handleEditProfile = (profile: Profile) => {
        setProfileForm({ ...profile });
        setEditingProfile(profile);
        setIsAddingProfile(false);
    };

    const handleDeleteProfile = (profileName: string) => {
        const newProfiles = state.profiles.filter(p => p.name !== profileName);
        updateState({ profiles: newProfiles });
        showMessage(`Profile "${profileName}" deleted`);
    };

    const saveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        let newProfiles = [...state.profiles];
        
        if (editingProfile) {
            newProfiles = newProfiles.map(p => p.name === editingProfile.name ? profileForm : p);
        } else {
            if (newProfiles.some(p => p.name === profileForm.name)) {
                showMessage("Profile with this name already exists!", "error");
                return;
            }
            newProfiles.push(profileForm);
        }
        
        newProfiles.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        updateState({ profiles: newProfiles });
        setIsAddingProfile(false);
        setEditingProfile(null);
        showMessage("Profile saved successfully");
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
                <div className="glass w-full max-w-[95vw] rounded-3xl overflow-hidden relative shadow-2xl max-h-[90vh] flex flex-col border-2 border-[#C5A059]/50 animate-in fade-in zoom-in duration-300">
                    <div className="p-8 border-b border-[var(--border-color)] bg-[#C5A059]/5 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black font-montserrat text-[#C5A059] uppercase tracking-tighter">{T.admin_title}</h2>
                            <div className="flex gap-4 mt-4">
                                <button 
                                    onClick={() => setActiveTab('profiles')}
                                    className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'profiles' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
                                >
                                    Profiles
                                </button>
                                <button 
                                    onClick={() => setActiveTab('products')}
                                    className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'products' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
                                >
                                    Products
                                </button>
                                <button 
                                    onClick={() => setActiveTab('accessories')}
                                    className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'accessories' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
                                >
                                    Accessories
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <AnimatePresence>
                                {localMessage && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            localMessage.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}
                                    >
                                        {localMessage.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {state.syncMessage && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                        state.syncMessage.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}
                                >
                                    {state.syncMessage.text}
                                </motion.div>
                            )}
                            <button 
                                 onClick={syncWithSupabase}
                                 disabled={state.supabaseStatus === 'loading'}
                                 className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                 title="Load latest data from Supabase"
                            >
                                {state.supabaseStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                PULL FROM SUPABASE
                            </button>
                            <button 
                                 onClick={persistToSupabase}
                                 disabled={state.supabaseStatus === 'loading'}
                                 className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                 title="Save all changes to Supabase Database"
                            >
                                {state.supabaseStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                PUSH TO SUPABASE
                            </button>
                            <button 
                                onClick={activeTab === 'profiles' ? handleAddProfile : activeTab === 'products' ? handleAddProduct : handleAddAccessory}
                                className="flex items-center gap-2 bg-[#C5A059] text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059]/80 transition-all"
                            >
                                <Plus size={16} />
                                {activeTab === 'profiles' ? T.admin_add_profile : activeTab === 'products' ? "ADD PRODUCT" : "ADD ACCESSORY"}
                            </button>
                            <div className="flex items-center gap-3 pl-6 border-l border-[var(--border-color)]">
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">GITHUB REPO</p>
                                    <p className="text-[8px] uppercase mt-1 text-[var(--text-muted)]">CONNECTED</p>
                                </div>
                                <a 
                                    href="https://github.com/Macmus40/f-nster-konfigurator-mini" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl border border-[#C5A059]/30 flex items-center justify-center hover:bg-[#C5A059]/10 transition-all"
                                >
                                    <Github size={20} className="text-[#C5A059]" />
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto p-8 custom-scroll">
                        {activeTab === 'profiles' ? (
                            <>
                                {(isAddingProfile || editingProfile) && (
                            <div className="mb-12 p-8 rounded-3xl border-2 border-[#C5A059] bg-[#C5A059]/5 animate-in slide-in-from-top duration-300">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-lg font-black text-[#C5A059] uppercase tracking-widest">
                                        {editingProfile ? `${T.admin_edit}: ${editingProfile.name}` : T.admin_add_profile}
                                    </h3>
                                    <button onClick={() => { setIsAddingProfile(false); setEditingProfile(null); }} className="text-[var(--text-muted)] hover:text-white">
                                        <X size={24} />
                                    </button>
                                </div>
                                <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{T.admin_name}</label>
                                        <input 
                                            type="text" 
                                            value={profileForm.name}
                                            onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                                            className="tech-input" 
                                            required 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{T.admin_type}</label>
                                        <select 
                                            value={profileForm.type}
                                            onChange={e => setProfileForm({...profileForm, type: e.target.value})}
                                            className="tech-input"
                                        >
                                            <option value="PVC">PVC</option>
                                            <option value="ALU">ALU</option>
                                            <option value="WOOD">WOOD</option>
                                            <option value="WOOD-ALU">WOOD-ALU</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Kolejność (Order)</label>
                                        <input 
                                            type="number" 
                                            value={profileForm.sort_order || 0}
                                            onChange={e => setProfileForm({...profileForm, sort_order: parseInt(e.target.value) || 0})}
                                            className="tech-input" 
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{T.admin_image}</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={profileForm.imageSrc}
                                                onChange={e => setProfileForm({...profileForm, imageSrc: e.target.value})}
                                                className="tech-input flex-grow" 
                                                placeholder="https://..."
                                            />
                                            <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition-all flex items-center justify-center min-w-[48px]">
                                                {isUploading === 'imageSrc' ? <Loader2 size={18} className="animate-spin text-[#C5A059]" /> : <Upload size={18} className="text-[#C5A059]" />}
                                                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'imageSrc')} disabled={!!isUploading} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Section Image URL (_sektion)</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={profileForm.sectionImageSrc || ''}
                                                onChange={e => setProfileForm({...profileForm, sectionImageSrc: e.target.value})}
                                                className="tech-input flex-grow" 
                                                placeholder="https://..._sektion.png"
                                            />
                                            <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition-all flex items-center justify-center min-w-[48px]">
                                                {isUploading === 'sectionImageSrc' ? <Loader2 size={18} className="animate-spin text-[#C5A059]" /> : <Upload size={18} className="text-[#C5A059]" />}
                                                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'sectionImageSrc')} disabled={!!isUploading} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Uw</label>
                                            <input 
                                                type="text" 
                                                value={profileForm.specs.Uw}
                                                onChange={e => setProfileForm({...profileForm, specs: {...profileForm.specs, Uw: e.target.value}})}
                                                className="tech-input" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">dB</label>
                                            <input 
                                                type="text" 
                                                value={profileForm.specs.dB}
                                                onChange={e => setProfileForm({...profileForm, specs: {...profileForm.specs, dB: e.target.value}})}
                                                className="tech-input" 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">CHAMBERS</label>
                                            <input 
                                                type="text" 
                                                value={profileForm.specs.chambers}
                                                onChange={e => setProfileForm({...profileForm, specs: {...profileForm.specs, chambers: e.target.value}})}
                                                className="tech-input" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">DEPTH</label>
                                            <input 
                                                type="text" 
                                                value={profileForm.specs.depth}
                                                onChange={e => setProfileForm({...profileForm, specs: {...profileForm.specs, depth: e.target.value}})}
                                                className="tech-input" 
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{T.admin_desc_field}</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[8px] text-[var(--text-muted)] uppercase">SV</label>
                                                <textarea value={profileForm.description.sv} onChange={e => setProfileForm({...profileForm, description: {...profileForm.description, sv: e.target.value}})} className="tech-input min-h-[80px]" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] text-[var(--text-muted)] uppercase">DA</label>
                                                <textarea value={profileForm.description.da} onChange={e => setProfileForm({...profileForm, description: {...profileForm.description, da: e.target.value}})} className="tech-input min-h-[80px]" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] text-[var(--text-muted)] uppercase">DE</label>
                                                <textarea value={profileForm.description.de} onChange={e => setProfileForm({...profileForm, description: {...profileForm.description, de: e.target.value}})} className="tech-input min-h-[80px]" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] text-[var(--text-muted)] uppercase">EN</label>
                                                <textarea value={profileForm.description.en} onChange={e => setProfileForm({...profileForm, description: {...profileForm.description, en: e.target.value}})} className="tech-input min-h-[80px]" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                        <button 
                                            type="button"
                                            onClick={() => { setIsAddingProfile(false); setEditingProfile(null); }}
                                            className="px-8 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                                        >
                                            {T.admin_cancel}
                                        </button>
                                        <button 
                                            type="submit"
                                            className="btn-gold px-12 py-3 rounded-xl text-[10px] flex items-center gap-2"
                                        >
                                            <Save size={16} />
                                            {T.admin_save}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="space-y-12">
                            <h3 className="text-xs font-black text-[#C5A059] tracking-[0.3em] uppercase mb-8">{T.admin_profiles}</h3>
                            {state.profiles.map(profile => {
                                const isDisabled = state.disabledProfiles.includes(profile.name);
                                return (
                                    <div key={profile.name} className={`space-y-4 p-8 rounded-2xl border ${isDisabled ? 'bg-red-500/5 border-red-500/20 opacity-60' : 'bg-white/5 border-white/10'}`}>
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-6">
                                                <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-widest border-l-4 border-[#C5A059] pl-6">{profile.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleEditProfile(profile)}
                                                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all"
                                                        title={T.admin_edit}
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteProfile(profile.name)}
                                                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-red-500 hover:bg-red-500/10 transition-all"
                                                        title={T.admin_delete}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <button onClick={() => toggleProfileStatus(profile.name)} className={`text-[10px] font-black px-4 py-2 rounded border ${isDisabled ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                                                {isDisabled ? T.admin_disabled : T.admin_active}
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{T.step2}</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-4">
                                                {state.products.map(product => {
                                                    const isChecked = state.profileProductMap[profile.name] ? state.profileProductMap[profile.name].includes(product.name) : true;
                                                    return (
                                                        <div 
                                                            key={product.name} 
                                                            onClick={() => toggleProductInProfile(profile.name, product.name)} 
                                                            className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center gap-4 text-center ${isChecked ? 'bg-[#C5A059]/20 border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.1)]' : 'bg-[var(--bg-subtle)] border-[var(--border-color)] opacity-60 hover:opacity-100'}`}
                                                        >
                                                            <div className="w-full h-16 flex items-center justify-center bg-black/20 rounded-lg p-1">
                                                                <img src={product.imageSrc} alt={product.name} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isChecked ? 'bg-[#C5A059] border-[#C5A059]' : 'border-[var(--border-color)]'}`}>
                                                                    {isChecked && <Check size={12} className="text-black" strokeWidth={4} />}
                                                                </div>
                                                                <span className="text-[9px] font-black uppercase tracking-tight leading-tight">{product.name}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="mt-10 space-y-8">
                                            <h4 className="text-[11px] font-black text-[#C5A059] uppercase tracking-[0.2em] border-b border-[#C5A059]/20 pb-3">{T.admin_acc}</h4>
                                            
                                            {['Glass', 'Ventilation', 'Handles', 'Colors'].map(category => (
                                                <div key={category} className="space-y-4">
                                                    <h5 className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-50">{category}</h5>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-10 gap-3">
                                                        {state.accessories.filter(a => a.category === category).map(acc => {
                                                            const isChecked = state.profileAccessoryMap[profile.name] ? state.profileAccessoryMap[profile.name].includes(acc.id) : true;
                                                            return (
                                                                <div 
                                                                    key={acc.id} 
                                                                    onClick={() => toggleAccessoryInProfile(profile.name, acc.id)} 
                                                                    className={`cursor-pointer p-3 rounded-lg border transition-all flex flex-col items-center gap-3 ${isChecked ? 'bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059]' : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-muted)] opacity-60 hover:opacity-100'}`}
                                                                >
                                                                    {acc.imageSrc && (
                                                                        <div className="w-full h-12 flex items-center justify-center bg-black/20 rounded-md p-1">
                                                                            <img src={acc.imageSrc} alt={acc.name[state.currentLanguage]} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${isChecked ? 'bg-[#C5A059] border-[#C5A059]' : 'border-[var(--border-color)]'}`}>
                                                                            {isChecked && <Check size={10} className="text-black" strokeWidth={4} />}
                                                                        </div>
                                                                        <span className="text-[8px] font-black uppercase tracking-tight truncate max-w-[70px]">{acc.name[state.currentLanguage]}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                            </>
                        ) : activeTab === 'products' ? (
                            <div className="space-y-12">
                                {(isAddingProduct || editingProduct) && (
                                    <div className="mb-12 p-8 rounded-3xl border-2 border-[#C5A059] bg-[#C5A059]/5 animate-in slide-in-from-top duration-300">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-lg font-black text-[#C5A059] uppercase tracking-widest">
                                                {editingProduct ? `EDIT PRODUCT: ${editingProduct.name}` : "ADD NEW PRODUCT"}
                                            </h3>
                                            <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} className="text-[var(--text-muted)] hover:text-white">
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Product Name</label>
                                                <input 
                                                    type="text" 
                                                    value={productForm.name}
                                                    onChange={e => setProductForm({...productForm, name: e.target.value})}
                                                    className="tech-input" 
                                                    required 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Category</label>
                                                <select 
                                                    value={productForm.category}
                                                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                                                    className="tech-input"
                                                >
                                                    <option value="Fönster">Fönster</option>
                                                    <option value="Dörrar">Dörrar</option>
                                                    <option value="Skjutdörrar">Skjutdörrar</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Kolejność (Order)</label>
                                                <input 
                                                    type="number" 
                                                    value={productForm.sort_order || 0}
                                                    onChange={e => setProductForm({...productForm, sort_order: parseInt(e.target.value) || 0})}
                                                    className="tech-input" 
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Image URL</label>
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={productForm.imageSrc}
                                                        onChange={e => setProductForm({...productForm, imageSrc: e.target.value})}
                                                        className="tech-input flex-grow" 
                                                        placeholder="https://..."
                                                    />
                                                    <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition-all flex items-center justify-center min-w-[48px]">
                                                        {isUploading === 'PRODUCT' ? <Loader2 size={18} className="animate-spin text-[#C5A059]" /> : <Upload size={18} className="text-[#C5A059]" />}
                                                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'productImage')} disabled={!!isUploading} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                                <button 
                                                    type="button"
                                                    onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                                                    className="px-8 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                                                >
                                                    CANCEL
                                                </button>
                                                <button 
                                                    type="submit"
                                                    className="btn-gold px-12 py-3 rounded-xl text-[10px] flex items-center gap-2"
                                                >
                                                    <Save size={16} />
                                                    SAVE PRODUCT
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {state.products.map(product => (
                                        <div key={product.name} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4 relative group">
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button 
                                                    onClick={() => handleEditProduct(product)}
                                                    className="p-2 rounded-lg bg-black/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(product.name)}
                                                    className="p-2 rounded-lg bg-black/40 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="aspect-square bg-black/20 rounded-xl flex items-center justify-center p-4">
                                                <img src={product.imageSrc} alt={product.name} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-1">{product.category}</p>
                                                <h4 className="text-sm font-black uppercase tracking-widest">{product.name}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {(isAddingAccessory || editingAccessory) && (
                                    <div className="mb-12 p-8 rounded-3xl border-2 border-[#C5A059] bg-[#C5A059]/5 animate-in slide-in-from-top duration-300">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-lg font-black text-[#C5A059] uppercase tracking-widest">
                                                {editingAccessory ? `EDIT ACCESSORY: ${editingAccessory.id}` : "ADD NEW ACCESSORY"}
                                            </h3>
                                            <button onClick={() => { setIsAddingAccessory(false); setEditingAccessory(null); }} className="text-[var(--text-muted)] hover:text-white">
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <form onSubmit={handleSaveAccessory} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Accessory ID</label>
                                                <input 
                                                    type="text" 
                                                    value={accessoryForm.id}
                                                    onChange={e => setAccessoryForm({...accessoryForm, id: e.target.value})}
                                                    className="tech-input" 
                                                    required 
                                                    disabled={!!editingAccessory}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Category</label>
                                                <select 
                                                    value={accessoryForm.category}
                                                    onChange={e => setAccessoryForm({...accessoryForm, category: e.target.value as any})}
                                                    className="tech-input"
                                                >
                                                    <option value="Colors">Colors</option>
                                                    <option value="Handles">Handles</option>
                                                    <option value="Glass">Glass</option>
                                                    <option value="Ventilation">Ventilation</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Kolejność (Order)</label>
                                                <input 
                                                    type="number" 
                                                    value={accessoryForm.sort_order || 0}
                                                    onChange={e => setAccessoryForm({...accessoryForm, sort_order: parseInt(e.target.value) || 0})}
                                                    className="tech-input" 
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Names (Translations)</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] text-[var(--text-muted)] uppercase">SV</label>
                                                        <input type="text" value={accessoryForm.name.sv} onChange={e => setAccessoryForm({...accessoryForm, name: {...accessoryForm.name, sv: e.target.value}})} className="tech-input" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] text-[var(--text-muted)] uppercase">DA</label>
                                                        <input type="text" value={accessoryForm.name.da} onChange={e => setAccessoryForm({...accessoryForm, name: {...accessoryForm.name, da: e.target.value}})} className="tech-input" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] text-[var(--text-muted)] uppercase">DE</label>
                                                        <input type="text" value={accessoryForm.name.de} onChange={e => setAccessoryForm({...accessoryForm, name: {...accessoryForm.name, de: e.target.value}})} className="tech-input" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] text-[var(--text-muted)] uppercase">EN</label>
                                                        <input type="text" value={accessoryForm.name.en} onChange={e => setAccessoryForm({...accessoryForm, name: {...accessoryForm.name, en: e.target.value}})} className="tech-input" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Image URL</label>
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={accessoryForm.imageSrc || ''}
                                                        onChange={e => setAccessoryForm({...accessoryForm, imageSrc: e.target.value})}
                                                        className="tech-input flex-grow" 
                                                        placeholder="https://..."
                                                    />
                                                    <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition-all flex items-center justify-center min-w-[48px]">
                                                        {isUploading === 'ACCESSORY' ? <Loader2 size={18} className="animate-spin text-[#C5A059]" /> : <Upload size={18} className="text-[#C5A059]" />}
                                                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'accessoryImage')} disabled={!!isUploading} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                                <button 
                                                    type="button"
                                                    onClick={() => { setIsAddingAccessory(false); setEditingAccessory(null); }}
                                                    className="px-8 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                                                >
                                                    CANCEL
                                                </button>
                                                <button 
                                                    type="submit"
                                                    className="btn-gold px-12 py-3 rounded-xl text-[10px] flex items-center gap-2"
                                                >
                                                    <Save size={16} />
                                                    SAVE ACCESSORY
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    {['Colors', 'Handles', 'Glass', 'Ventilation'].map(cat => (
                                        <div key={cat} className="space-y-4">
                                            <h3 className="text-xs font-black text-[#C5A059] tracking-[0.3em] uppercase border-b border-[#C5A059]/20 pb-2">{cat}</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                {state.accessories.filter(a => a.category === cat).map(acc => (
                                                    <div key={acc.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-3 relative group">
                                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                            <button 
                                                                onClick={() => handleEditAccessory(acc)}
                                                                className="p-1.5 rounded-lg bg-black/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all"
                                                            >
                                                                <Edit2 size={12} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteAccessory(acc.id)}
                                                                className="p-1.5 rounded-lg bg-black/40 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                        <div className="aspect-square bg-black/20 rounded-lg flex items-center justify-center p-2">
                                                            {acc.imageSrc ? (
                                                                <img src={acc.imageSrc} alt={acc.name.en} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                                                            ) : (
                                                                <div className="text-[8px] text-[var(--text-muted)] uppercase">No Image</div>
                                                            )}
                                                        </div>
                                                        <div className="text-center">
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest truncate">{acc.name[state.currentLanguage] || acc.name.en}</h4>
                                                            <p className="text-[8px] text-[var(--text-muted)] mt-1">{acc.id}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-6 bg-[var(--bg-subtle)] border-t border-[var(--border-color)] flex justify-end">
                        <button onClick={closeAdmin} className="btn-gold px-10 py-3 rounded-xl text-[10px]">CLOSE ADMIN</button>
                    </div>
                </div>
            )}
        </div>
    );
}

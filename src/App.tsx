import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TRANSLATIONS, PROFILES, PRODUCTS, ACCESSORIES } from './constants';
import { AppState, FormEntry, Profile, Product, Accessory } from './types';
import { supabase } from './supabaseClient';
import { GoogleGenAI } from '@google/genai';
import { 
    Settings, ShieldAlert, Sun, Moon, Info, Trash2, Check, 
    Upload, Download, X, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import AdminPanel from './components/AdminPanel';

// Initialize AI
const apiKey = process.env.GEMINI_API_KEY || 'dummy_key';
const ai = new GoogleGenAI({ apiKey });

export default function App() {
    const [state, setState] = useState<AppState>({
        currentLanguage: 'sv',
        theme: 'dark',
        selectedProfile: null,
        selectedProduct: null,
        lastSelectedProfileName: null,
        pendingEntry: null,
        infoProfile: null,
        isAdminOpen: false,
        profiles: PROFILES,
        products: PRODUCTS,
        accessories: ACCESSORIES,
        profileProductMap: {},
        disabledProfiles: [],
        enabledAccessories: [],
        formEntries: [],
        submissionStatus: 'idle',
        aiMessage: "",
        aiIsLoading: false,
        supabaseStatus: 'disconnected',
        isAdminAuthenticated: false
    });

    const T = TRANSLATIONS[state.currentLanguage];

    // --- EFFECTS ---
    useEffect(() => {
        const saved = localStorage.getItem('offert_app_data_v1');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setState(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse saved state", e);
            }
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    useEffect(() => {
        const { profiles, products, accessories, profileProductMap, disabledProfiles, enabledAccessories, formEntries, lastSelectedProfileName } = state;
        localStorage.setItem('offert_app_data_v1', JSON.stringify({
            profiles, products, accessories, profileProductMap, disabledProfiles, enabledAccessories, formEntries, lastSelectedProfileName
        }));
    }, [state.profiles, state.products, state.accessories, state.profileProductMap, state.disabledProfiles, state.enabledAccessories, state.formEntries, state.lastSelectedProfileName]);

    // --- HANDLERS ---
    const updateState = (updates: Partial<AppState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const syncWithSupabase = async () => {
        if (!supabase) return;
        updateState({ supabaseStatus: 'loading' });

        try {
            const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
            if (pError) throw pError;
            
            const { data: products, error: prError } = await supabase.from('products').select('*');
            if (prError) throw prError;
            
            const { data: accessories, error: aError } = await supabase.from('accessories').select('*');
            if (aError) throw aError;
            
            const { data: mapping, error: mError } = await supabase.from('profile_product_map').select('*');
            
            const updates: Partial<AppState> = { supabaseStatus: 'connected' };
            if (profiles && profiles.length > 0) updates.profiles = profiles;
            if (products && products.length > 0) updates.products = products;
            if (accessories && accessories.length > 0) updates.accessories = accessories;
            
            if (!mError && mapping) {
                const newMap: Record<string, string[]> = {};
                mapping.forEach((row: any) => {
                    if (!newMap[row.profile_name]) newMap[row.profile_name] = [];
                    newMap[row.profile_name].push(row.product_name);
                });
                updates.profileProductMap = newMap;
            }

            updateState(updates);
        } catch (err) {
            console.error("Supabase Sync Error:", err);
            updateState({ supabaseStatus: 'error' });
        }
    };

    const toggleTheme = () => {
        updateState({ theme: state.theme === 'dark' ? 'light' : 'dark' });
    };

    const changeLang = (lang: 'sv' | 'pl' | 'en') => {
        updateState({ currentLanguage: lang });
    };

    const selectProfile = (profileName: string) => {
        if (state.disabledProfiles.includes(profileName)) return;
        const profile = state.profiles.find(p => p.name === profileName);
        if (profile) {
            updateState({ selectedProfile: profile, lastSelectedProfileName: profileName });
            scrollToSection('step-02');
        }
    };

    const addProduct = (productName: string) => {
        if (!state.selectedProfile) {
            alert(T.select_first);
            return;
        }
        const product = state.products.find(p => p.name === productName);
        if (product) {
            updateState({
                selectedProduct: product,
                pendingEntry: {
                    id: Date.now(),
                    product,
                    profile: state.selectedProfile,
                    width: 1000,
                    height: 1200,
                    quantity: 1,
                    glassType: '3-glas',
                    ventilation: 'utan',
                    colorOut: 'Biały',
                    colorIn: 'Biały'
                }
            });
            scrollToSection('step-03');
        }
    };

    const updatePendingEntry = (field: keyof FormEntry, val: string | number) => {
        if (state.pendingEntry) {
            updateState({
                pendingEntry: {
                    ...state.pendingEntry,
                    [field]: (field === 'width' || field === 'height' || field === 'quantity') ? Number(val) : val
                }
            });
        }
    };

    const confirmEntry = () => {
        if (state.pendingEntry) {
            updateState({
                formEntries: [...state.formEntries, state.pendingEntry],
                selectedProfile: null,
                selectedProduct: null,
                pendingEntry: null
            });
            scrollToSection('step-01');
        }
    };

    const removeEntry = (id: number) => {
        updateState({
            formEntries: state.formEntries.filter(e => e.id !== id)
        });
    };

    const scrollToSection = (id: string) => {
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    // --- RENDER HELPERS ---
    const renderFlags = () => (
        <div className="flex lg:flex-col gap-3 lg:gap-4">
            {(['sv', 'pl', 'en'] as const).map(lang => (
                <button key={lang} onClick={() => changeLang(lang)} className="group flex lg:flex-col items-center gap-1 transition-all">
                    <div className={`w-5 h-3 lg:w-6 lg:h-4 border border-white/10 overflow-hidden rounded-sm transition-transform group-hover:scale-110 ${state.currentLanguage === lang ? 'ring-1 ring-[#C5A059] opacity-100' : 'opacity-20'}`}>
                        {lang === 'sv' && <svg viewBox="0 0 5 3" className="w-full h-full"><rect width="5" height="3" fill="#006aa7"/><path d="M0 1h5M1.5 0v3" stroke="#fecc00" strokeWidth="1"/></svg>}
                        {lang === 'pl' && <svg viewBox="0 0 5 3" className="w-full h-full"><rect width="5" height="3" fill="#fff"/><rect width="5" height="1.5" y="1.5" fill="#dc143c"/></svg>}
                        {lang === 'en' && <svg viewBox="0 0 60 30" className="w-full h-full"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" clipPath="url(#s)"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#s)"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/></svg>}
                    </div>
                    <span className={`text-[7px] font-black tracking-tighter ${state.currentLanguage === lang ? 'text-[#C5A059]' : 'text-gray-600'}`}>{lang.toUpperCase()}</span>
                </button>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
            {/* SIDEBAR */}
            <nav className="fixed w-full lg:w-[60px] h-[60px] lg:h-screen bg-[var(--bg-sidebar)] border-b lg:border-b-0 lg:border-r border-[var(--border-color)] flex lg:flex-col items-center justify-between py-0 lg:py-8 px-4 lg:px-0 z-50 transition-colors duration-300">
                <div className="flex lg:flex-col items-center gap-4 lg:gap-8">
                    <div className="w-10 h-10 bg-[#C5A059] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                        <span className="text-black font-black text-xl font-montserrat tracking-tighter">H</span>
                    </div>
                    
                    <div className="hidden lg:flex flex-col gap-4 mt-4">
                        <button onClick={() => scrollToSection('step-01')} className="side-nav-icon active group relative" title={T.nav_config}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="1"></rect><path d="M3 12h18M12 3v18"></path></svg>
                        </button>
                    </div>
                </div>
                
                <div className="flex lg:flex-col items-center gap-6 lg:gap-10 lg:mt-auto lg:pb-4">
                    <button onClick={toggleTheme} className="hidden lg:flex side-nav-icon hover:text-[#C5A059] transition-colors" title="Toggle Theme">
                        {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    
                    {renderFlags()}
                    
                    <button onClick={() => updateState({ isAdminOpen: true })} className="opacity-10 hover:opacity-100 transition-opacity p-2 text-[var(--text-muted)] hover:text-[#C5A059]">
                        <Settings size={20} />
                    </button>

                    <button onClick={toggleTheme} className="lg:hidden side-nav-icon text-[#C5A059]">
                        {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main className="lg:ml-[60px] pt-[60px] lg:pt-0 min-h-screen pb-32">
                {/* Hero Section */}
                <section className="h-[35vh] lg:h-[45vh] flex items-center px-4 sm:px-6 lg:px-16 border-b border-[var(--border-color)] bg-[var(--bg-main)] transition-colors duration-300">
                    <div className="reveal w-full">
                        <p className="text-[#C5A059] font-black tracking-[0.3em] sm:tracking-[0.5em] text-[9px] sm:text-[10px] uppercase mb-4">Precision Engineering</p>
                        <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black font-montserrat tracking-tighter text-[var(--text-main)] leading-none uppercase break-words">
                            {T.header}
                        </h1>
                        <p className="text-xs sm:text-sm lg:text-base text-[var(--text-muted)] max-w-2xl mt-6 leading-relaxed font-medium">
                            {T.subheader}
                        </p>
                    </div>
                </section>

                <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 p-6 sm:p-12 lg:p-20">
                    {/* LEFT: CONFIGURATOR */}
                    <div className="lg:col-span-8 space-y-24">
                        
                        {/* STEP 1: PROFILES */}
                        <section id="step-01" className="reveal">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center space-x-6">
                                    <span className="text-3xl font-black text-[var(--text-muted)] opacity-20 font-montserrat">01</span>
                                    <h2 className="text-lg font-bold uppercase tracking-[0.3em] text-[#C5A059] font-montserrat">{T.step1}</h2>
                                </div>
                                {state.selectedProfile && (
                                    <button onClick={() => updateState({ selectedProfile: null, selectedProduct: null, pendingEntry: null })} className="text-[10px] font-black text-[#C5A059] border border-[#C5A059]/30 px-4 py-2 rounded-lg hover:bg-[#C5A059] hover:text-black transition-all uppercase tracking-widest">
                                        {T.btn_change}
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-6">
                                {state.profiles
                                    .filter(p => !state.disabledProfiles.includes(p.name))
                                    .filter(p => !state.selectedProfile || state.selectedProfile.name === p.name)
                                    .map(profile => {
                                        const isSelected = state.selectedProfile?.name === profile.name;
                                        const isLastUsed = state.lastSelectedProfileName === profile.name && !state.selectedProfile;
                                        
                                        return (
                                            <div 
                                                key={profile.name}
                                                onClick={() => !state.selectedProfile && selectProfile(profile.name)}
                                                className={`tech-card ${!state.selectedProfile ? 'cursor-pointer' : ''} flex flex-col md:flex-row items-center gap-6 md:gap-10 ${isSelected ? 'selected' : ''} ${isLastUsed ? 'border-[#C5A059]/40 bg-[#C5A059]/5' : ''}`}
                                            >
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); updateState({ infoProfile: profile }); }}
                                                    className="absolute top-3 left-3 sm:top-4 sm:left-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059] hover:text-black hover:scale-110 transition-all z-20 shadow-lg"
                                                    title="Information"
                                                >
                                                    <Info size={16} />
                                                </button>
                                                
                                                <div className="w-full md:w-1/3 h-48 md:h-64 p-6 bg-[var(--bg-subtle)] flex items-center justify-center rounded-xl border border-[var(--border-color)]">
                                                    <img src={profile.imageSrc} alt={profile.name} className="max-h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" />
                                                </div>
                                                
                                                <div className="w-full md:w-2/3 space-y-6">
                                                    <div>
                                                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-widest mb-2">{profile.name}</h3>
                                                        <p className="text-[10px] text-[#C5A059] font-bold tracking-[0.3em] uppercase">{profile.type}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-mono">
                                                        <div className="spec-item"><span className="text-[var(--text-muted)] block mb-1">Uw</span>{profile.specs.Uw}</div>
                                                        <div className="spec-item"><span className="text-[var(--text-muted)] block mb-1">dB</span>{profile.specs.dB}</div>
                                                        <div className="spec-item"><span className="text-[var(--text-muted)] block mb-1">Chambers</span>{profile.specs.chambers}</div>
                                                        <div className="spec-item"><span className="text-[var(--text-muted)] block mb-1">Depth</span>{profile.specs.depth}</div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="inline-flex items-center gap-2 bg-[#C5A059] text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest mt-4 shadow-[0_0_20px_rgba(197,160,89,0.4)]">
                                                            <Check size={14} /> {T.step_done}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </section>

                        {/* STEP 2: PRODUCTS */}
                        <section id="step-02" className={`reveal transition-opacity duration-500 ${!state.selectedProfile ? 'opacity-30 pointer-events-none' : ''}`}>
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center space-x-6">
                                    <span className="text-3xl font-black text-[var(--text-muted)] opacity-20 font-montserrat">02</span>
                                    <h2 className="text-lg font-bold uppercase tracking-[0.3em] text-[#C5A059] font-montserrat">{T.step2}</h2>
                                </div>
                                {state.selectedProduct && (
                                    <button onClick={() => updateState({ selectedProduct: null, pendingEntry: null })} className="text-[10px] font-black text-[#C5A059] border border-[#C5A059]/30 px-4 py-2 rounded-lg hover:bg-[#C5A059] hover:text-black transition-all uppercase tracking-widest">
                                        {T.btn_change}
                                    </button>
                                )}
                            </div>
                            
                            {['Okna', 'Drzwi', 'Suwanki'].map(cat => {
                                const catProducts = state.products.filter(p => p.category === cat);
                                if (catProducts.length === 0) return null;
                                
                                return (
                                    <div key={cat} className="space-y-6 mb-12">
                                        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] border-b border-[var(--border-color)] pb-2">
                                            {cat === 'Okna' ? T.cat_okna : cat === 'Drzwi' ? T.cat_drzwi : T.cat_suwanki}
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {catProducts.map(product => {
                                                const isAvailable = !state.selectedProfile || !state.profileProductMap[state.selectedProfile.name] || state.profileProductMap[state.selectedProfile.name].includes(product.name);
                                                const isSelected = state.selectedProduct?.name === product.name;
                                                
                                                return (
                                                    <div 
                                                        key={product.name}
                                                        onClick={() => isAvailable && addProduct(product.name)}
                                                        className={`tech-card cursor-pointer flex flex-col items-center text-center p-4 group ${isSelected ? 'selected' : ''} ${!isAvailable ? 'opacity-20 grayscale cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className="h-20 w-full mb-4 flex items-center justify-center">
                                                            <img src={product.imageSrc} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                        </div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest">{product.name}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </section>

                        {/* STEP 3: CONFIGURATION */}
                        <section id="step-03" className={`reveal transition-opacity duration-500 ${!state.pendingEntry ? 'opacity-30 pointer-events-none' : ''}`}>
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center space-x-6">
                                    <span className="text-3xl font-black text-[var(--text-muted)] opacity-20 font-montserrat">03</span>
                                    <h2 className="text-lg font-bold uppercase tracking-[0.3em] text-[#C5A059] font-montserrat">{T.step3}</h2>
                                </div>
                            </div>
                            
                            {state.pendingEntry && (
                                <div className="tech-card flex flex-col xl:flex-row items-start gap-10 p-6 sm:p-10 border-2 border-[#C5A059] overflow-hidden">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full xl:w-1/3 text-center sm:text-left border-b xl:border-b-0 xl:border-r border-[var(--border-color)] pb-8 xl:pb-0 xl:pr-10">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[var(--bg-subtle)] p-4 rounded-2xl border border-[var(--border-color)] flex-shrink-0 flex items-center justify-center shadow-inner">
                                            <img src={state.pendingEntry.product.imageSrc} className="w-full h-full object-contain drop-shadow-2xl" />
                                        </div>
                                        <div className="flex flex-col justify-center h-full">
                                            <p className="text-xs text-[#C5A059] font-bold uppercase tracking-[0.3em] mb-2">{state.pendingEntry.profile.name}</p>
                                            <p className="text-xl sm:text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter leading-none">{state.pendingEntry.product.name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-grow w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                        <div className="flex flex-col">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] mb-2 uppercase tracking-widest">{T.width}</label>
                                            <input type="number" value={state.pendingEntry.width} onChange={(e) => updatePendingEntry('width', e.target.value)} className="tech-input text-lg font-mono py-3 px-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] mb-2 uppercase tracking-widest">{T.height}</label>
                                            <input type="number" value={state.pendingEntry.height} onChange={(e) => updatePendingEntry('height', e.target.value)} className="tech-input text-lg font-mono py-3 px-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] mb-2 uppercase tracking-widest">{T.quantity}</label>
                                            <input type="number" value={state.pendingEntry.quantity} onChange={(e) => updatePendingEntry('quantity', e.target.value)} className="tech-input text-lg font-mono py-3 px-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] mb-2 uppercase tracking-widest">{T.glassType}</label>
                                            <select value={state.pendingEntry.glassType} onChange={(e) => updatePendingEntry('glassType', e.target.value)} className="tech-input text-[12px] bg-transparent font-bold py-3 px-4">
                                                <option value="3-glas">3-glas</option>
                                                <option value="2-glas">2-glas</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] mb-2 uppercase tracking-widest">{T.ventilation}</label>
                                            <select value={state.pendingEntry.ventilation} onChange={(e) => updatePendingEntry('ventilation', e.target.value)} className="tech-input text-[12px] bg-transparent font-bold py-3 px-4">
                                                <option value="utan">{T.vent_none}</option>
                                                <option value="med">{T.vent_with}</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] mb-2 uppercase tracking-widest">{T.colorOut}</label>
                                            <select value={state.pendingEntry.colorOut} onChange={(e) => updatePendingEntry('colorOut', e.target.value)} className="tech-input text-[12px] bg-transparent font-bold py-3 px-4">
                                                <option value="Biały">Biały (Standard)</option>
                                                <option value="Antracyt">Antracyt</option>
                                                <option value="Złoty Dąb">Złoty Dąb</option>
                                                <option value="Orzech">Orzech</option>
                                                <option value="Inny">Inny (Opisz w uwagach)</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] mb-2 uppercase tracking-widest">{T.colorIn}</label>
                                            <select value={state.pendingEntry.colorIn} onChange={(e) => updatePendingEntry('colorIn', e.target.value)} className="tech-input text-[12px] bg-transparent font-bold py-3 px-4">
                                                <option value="Biały">Biały (Standard)</option>
                                                <option value="Antracyt">Antracyt</option>
                                                <option value="Złoty Dąb">Złoty Dąb</option>
                                                <option value="Orzech">Orzech</option>
                                                <option value="Inny">Inny (Opisz w uwagach)</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full xl:w-auto mt-6 xl:mt-0 flex justify-end xl:self-end">
                                        <button onClick={confirmEntry} className="btn-gold w-full xl:w-auto py-4 px-10 rounded-xl text-[10px] flex items-center justify-center gap-3">
                                            <Check size={16} />
                                            {T.btn_confirm}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT: SUMMARY & FORM */}
                    <aside className="lg:col-span-4">
                        <div className="glass p-6 sm:p-10 sticky top-12 rounded-2xl shadow-2xl">
                            <h3 className="text-xs font-black font-montserrat uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-6 sm:mb-10 text-[#C5A059] border-b border-[var(--border-color)] pb-6">{T.summary}</h3>
                            
                            <div className="space-y-6 mb-12 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
                                {state.formEntries.length === 0 ? (
                                    <p className="text-[var(--text-muted)] text-center py-16 uppercase tracking-[0.2em] text-[9px] font-bold">{T.empty}</p>
                                ) : (
                                    state.formEntries.map((e, i) => (
                                        <div key={e.id} className="flex items-center space-x-5 pb-5 border-b border-[var(--border-color)] reveal">
                                            <div className="w-12 h-12 bg-[var(--bg-subtle)] p-2 flex-shrink-0 rounded-lg">
                                                <img src={e.product.imageSrc} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-main)]">{e.product.name}</p>
                                                <p className="text-[10px] text-[var(--text-main)] font-bold opacity-50 uppercase">{e.profile.name}</p>
                                                <p className="text-[10px] text-[#C5A059] font-mono mt-1">{e.width} x {e.height}mm | {e.quantity}st</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">OUT: {e.colorOut}</span>
                                                    <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">IN: {e.colorIn}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => removeEntry(e.id)} className="text-[var(--text-muted)] hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Submit logic here'); }}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" name="fName" placeholder={T.fName} required className="tech-input text-[10px] uppercase font-bold tracking-widest py-3" />
                                    <input type="text" name="lName" placeholder={T.lName} required className="tech-input text-[10px] uppercase font-bold tracking-widest py-3" />
                                </div>
                                <input type="email" name="email" placeholder={T.email} required className="tech-input text-[10px] uppercase font-bold tracking-widest py-3" />
                                <input type="tel" name="phone" placeholder={T.phone} required className="tech-input text-[10px] uppercase font-bold tracking-widest py-3" />
                                <input type="text" name="address" placeholder={T.address} required className="tech-input text-[10px] uppercase font-bold tracking-widest py-3" />
                                <textarea name="message" placeholder={T.message} rows={3} className="tech-input text-[10px] uppercase font-bold tracking-widest py-3 resize-none"></textarea>
                                
                                <button 
                                    type="submit" 
                                    disabled={state.formEntries.length === 0 || state.submissionStatus === 'sending'}
                                    className={`w-full btn-gold py-4 rounded-xl text-[10px] flex items-center justify-center gap-2 ${state.formEntries.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {state.submissionStatus === 'sending' ? (
                                        <span className="animate-pulse">{T.sending}</span>
                                    ) : state.submissionStatus === 'success' ? (
                                        <><CheckCircle2 size={16} /> {T.success}</>
                                    ) : (
                                        <>{T.btn_send}</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </aside>
                </div>
            </main>
            <AdminPanel state={state} updateState={updateState} syncWithSupabase={syncWithSupabase} />
        </div>
    );
}

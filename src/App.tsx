import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TRANSLATIONS, PROFILES, PRODUCTS, ACCESSORIES } from './constants';
import { AppState, FormEntry, Profile, Product, Accessory } from './types';
import { supabase } from './supabaseClient';
import { GoogleGenAI } from '@google/genai';
import { 
    Settings, ShieldAlert, Sun, Moon, Info, Trash2, Check, 
    Upload, Download, X, ChevronRight, CheckCircle2, AlertCircle,
    ShieldCheck, Lock, Waves, VolumeX, Sparkles
} from 'lucide-react';
import AdminPanel from './components/AdminPanel';

// Initialize AI
const apiKey = process.env.GEMINI_API_KEY || 'dummy_key';
const ai = new GoogleGenAI({ apiKey });

const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 bg-black/95 backdrop-blur-xl border border-[#C5A059]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[200] w-64 text-[11px] leading-relaxed text-white font-medium pointer-events-none text-center"
                    >
                        <div className="relative">
                            {text}
                            <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-black/95"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

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
        profileAccessoryMap: {},
        disabledProfiles: [],
        enabledAccessories: [],
        formEntries: [],
        submissionStatus: 'idle',
        aiMessage: "",
        aiIsLoading: false,
        supabaseStatus: 'disconnected',
        syncMessage: null,
        isAdminAuthenticated: false
    });

    const [showSection, setShowSection] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const preloadImages = (urls: string[]) => {
        urls.forEach(url => {
            if (!url || loadedImages.has(url)) return;
            const img = new Image();
            img.src = url;
            img.onload = () => {
                setLoadedImages(prev => new Set([...prev, url]));
            };
        });
    };

    const T = TRANSLATIONS[state.currentLanguage];

    // --- EFFECTS ---
    useEffect(() => {
        const initApp = async () => {
            // 1. Najpierw ładujemy z localStorage (szybki start)
            const saved = localStorage.getItem('offert_app_data_v1');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setState(prev => ({ ...prev, ...parsed }));
                } catch (e) {
                    console.error("Failed to parse saved state", e);
                }
            }
            
            // 2. Potem dociągamy świeże dane z Supabase (nadpisują localStorage)
            if (supabase) {
                await syncWithSupabase();
            } else {
                console.warn("Supabase client not initialized. Check your environment variables.");
            }
        };
        
        initApp();
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    useEffect(() => {
        const { profiles, products, accessories, profileProductMap, profileAccessoryMap, disabledProfiles, enabledAccessories, formEntries, lastSelectedProfileName } = state;
        localStorage.setItem('offert_app_data_v1', JSON.stringify({
            profiles, products, accessories, profileProductMap, profileAccessoryMap, disabledProfiles, enabledAccessories, formEntries, lastSelectedProfileName
        }));
    }, [state.profiles, state.products, state.accessories, state.profileProductMap, state.profileAccessoryMap, state.disabledProfiles, state.enabledAccessories, state.formEntries, state.lastSelectedProfileName]);

    // --- HANDLERS ---
    const updateState = (updates: Partial<AppState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const syncWithSupabase = async () => {
        if (!supabase) {
            updateState({ supabaseStatus: 'error' });
            return;
        }
        updateState({ supabaseStatus: 'loading' });

        const fixImageUrl = (url: string) => {
            if (!url) return url;
            return url
                .replace(/\/f%C3%B6nster\//g, '/fonster/')
                .replace(/\/d%C3%B6rr\//g, '/dorrar/');
        };

        try {
            // Pobieramy wszystko równolegle dla szybkości
            const [pRes, prRes, aRes, mRes, amRes, sRes] = await Promise.all([
                supabase.from('profiles').select('*').order('sort_order', { ascending: true }),
                supabase.from('products').select('*').order('sort_order', { ascending: true }),
                supabase.from('accessories').select('*').order('sort_order', { ascending: true }),
                supabase.from('profile_product_map').select('*'),
                supabase.from('profile_accessory_map').select('*'),
                supabase.from('app_settings').select('*').single()
            ]);

            if (pRes.error) throw pRes.error;
            if (prRes.error) throw prRes.error;
            if (aRes.error) throw aRes.error;
            
            const updates: Partial<AppState> = { supabaseStatus: 'connected' };
            
            updates.profiles = (pRes.data || []).map((p: any) => ({
                ...p,
                imageSrc: fixImageUrl(p.imageSrc),
                sectionImageSrc: fixImageUrl(p.sectionImageSrc)
            }));
            updates.products = (prRes.data || []).map((p: any) => ({
                ...p,
                category: p.category === 'Fönster' ? 'Okna' : 
                          p.category === 'Dörrar' ? 'Drzwi' : 
                          p.category === 'Skjutdörrar' ? 'terrassystem' : p.category,
                imageSrc: fixImageUrl(p.imageSrc)
            }));
            updates.accessories = (aRes.data || []).map((a: any) => ({
                ...a,
                imageSrc: fixImageUrl(a.imageSrc)
            }));
            
            if (!mRes.error && mRes.data) {
                const newMap: Record<string, string[]> = {};
                mRes.data.forEach((row: any) => {
                    if (!newMap[row.profile_name]) newMap[row.profile_name] = [];
                    newMap[row.profile_name].push(row.product_name);
                });
                updates.profileProductMap = newMap;
            }

            if (!amRes.error && amRes.data) {
                const newAccMap: Record<string, string[]> = {};
                amRes.data.forEach((row: any) => {
                    if (!newAccMap[row.profile_name]) newAccMap[row.profile_name] = [];
                    newAccMap[row.profile_name].push(row.accessory_id);
                });
                updates.profileAccessoryMap = newAccMap;
            }

            if (!sRes.error && sRes.data) {
                updates.disabledProfiles = sRes.data.disabled_profiles || [];
            }

            // Automatyczna korekta linków do obrazów
            // (Przeniesione wyżej do mapowania danych)
            
            if (updates.products) {
                const allImages = [
                    ...(updates.profiles?.map(p => p.imageSrc) || []),
                    ...(updates.profiles?.map(p => p.sectionImageSrc) || []),
                    ...(updates.products?.map(p => p.imageSrc) || []),
                    ...(updates.accessories?.slice(0, 20).map(a => a.imageSrc) || [])
                ].filter(Boolean) as string[];
                preloadImages(allImages);
            }

            updateState(updates);
            updateState({ 
                syncMessage: { text: "Data successfully pulled from Supabase", type: 'success' }
            });
            setTimeout(() => updateState({ syncMessage: null }), 3000);
            return true;
        } catch (err: any) {
            console.error("Supabase Sync Error:", err);
            updateState({ 
                supabaseStatus: 'error',
                syncMessage: { text: `Pull failed: ${err.message}`, type: 'error' }
            });
            setTimeout(() => updateState({ syncMessage: null }), 5000);
            return false;
        }
    };

    const persistToSupabase = async () => {
        if (!supabase) {
            alert("Supabase is not configured! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
            return;
        }
        updateState({ supabaseStatus: 'loading' });

        try {
            // 1. Clean up deleted items first (to avoid "boomerang" effect)
            const profileNames = state.profiles.map(p => p.name);
            const productNames = state.products.map(p => p.name);
            const accessoryIds = state.accessories.map(a => a.id);

            // Delete profiles not in current state
            if (profileNames.length > 0) {
                const { error: d1 } = await supabase.from('profiles').delete().filter('name', 'not.in', `(${profileNames.map(n => `"${n}"`).join(',')})`);
                if (d1) console.error("Delete profiles error:", d1);
            } else {
                await supabase.from('profiles').delete().neq('name', ''); 
            }

            // Delete products not in current state
            if (productNames.length > 0) {
                const { error: d2 } = await supabase.from('products').delete().filter('name', 'not.in', `(${productNames.map(n => `"${n}"`).join(',')})`);
                if (d2) console.error("Delete products error:", d2);
            } else {
                await supabase.from('products').delete().neq('name', '');
            }

            // Delete accessories not in current state
            if (accessoryIds.length > 0) {
                const { error: d3 } = await supabase.from('accessories').delete().filter('id', 'not.in', `(${accessoryIds.map(id => `"${id}"`).join(',')})`);
                if (d3) console.error("Delete accessories error:", d3);
            } else {
                await supabase.from('accessories').delete().neq('id', '');
            }

            // 2. Upsert current state
            const { error: pErr } = await supabase.from('profiles').upsert(state.profiles);
            if (pErr) throw pErr;
            
            const { error: prErr } = await supabase.from('products').upsert(state.products);
            if (prErr) throw prErr;
            
            const { error: aErr } = await supabase.from('accessories').upsert(state.accessories);
            if (aErr) throw aErr;

            // 3. Update Product Mappings
            // We already deleted profiles not in state, now we clean up mappings for remaining profiles
            await supabase.from('profile_product_map').delete().in('profile_name', profileNames);
            
            const mappingRows: any[] = [];
            Object.entries(state.profileProductMap).forEach(([profileName, productNames]) => {
                // Only map if both profile and product still exist in state
                if (profileNames.includes(profileName)) {
                    productNames.forEach(productName => {
                        if (state.products.some(p => p.name === productName)) {
                            mappingRows.push({ profile_name: profileName, product_name: productName });
                        }
                    });
                }
            });
            if (mappingRows.length > 0) {
                const { error: mErr } = await supabase.from('profile_product_map').insert(mappingRows);
                if (mErr) throw mErr;
            }

            // 4. Update Accessory Mappings
            await supabase.from('profile_accessory_map').delete().in('profile_name', profileNames);
            const accMappingRows: any[] = [];
            Object.entries(state.profileAccessoryMap).forEach(([profileName, accIds]) => {
                if (profileNames.includes(profileName)) {
                    accIds.forEach(accId => {
                        if (state.accessories.some(a => a.id === accId)) {
                            accMappingRows.push({ profile_name: profileName, accessory_id: accId });
                        }
                    });
                }
            });
            if (accMappingRows.length > 0) {
                const { error: amErr } = await supabase.from('profile_accessory_map').insert(accMappingRows);
                if (amErr) throw amErr;
            }

            // 5. Update Global Settings (Disabled Profiles)
            const { error: sErr } = await supabase.from('app_settings').upsert({ 
                id: 1, 
                disabled_profiles: state.disabledProfiles 
            });
            if (sErr) throw sErr;

            updateState({ 
                supabaseStatus: 'connected',
                syncMessage: { text: "Data successfully pushed to Supabase!", type: 'success' }
            });
            setTimeout(() => updateState({ syncMessage: null }), 3000);
        } catch (err: any) {
            console.error("Supabase Persist Error:", err);
            updateState({ 
                supabaseStatus: 'error',
                syncMessage: { text: `Push failed: ${err.message}`, type: 'error' }
            });
            setTimeout(() => updateState({ syncMessage: null }), 5000);
        }
    };

    const toggleTheme = () => {
        updateState({ theme: state.theme === 'dark' ? 'light' : 'dark' });
    };

    const changeLang = (lang: 'sv' | 'da' | 'de' | 'en') => {
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
        if (product && state.selectedProfile) {
            const profileName = state.selectedProfile.name;
            const allowedAccs = state.profileAccessoryMap[profileName];
            
            const getFirstValid = (category: string, fallback: string) => {
                const filtered = state.accessories.filter(a => a.category === category && (!allowedAccs || allowedAccs.includes(a.id)));
                if (category === 'Glass' && filtered.some(a => a.id === 'glass_3')) return 'glass_3';
                return filtered.length > 0 ? filtered[0].id : fallback;
            };

            updateState({
                selectedProduct: product,
                pendingEntry: {
                    id: Date.now(),
                    product,
                    profile: state.selectedProfile,
                    width: 1000,
                    height: 1200,
                    quantity: 1,
                    glassPanes: getFirstValid('Glass', 'glass_3'),
                    glassType: 'standard',
                    ventilation: getFirstValid('Ventilation', 'vent_none'),
                    handle: getFirstValid('Handles', 'handle_white'),
                    colorOut: getFirstValid('Colors', 'color_white'),
                    colorIn: getFirstValid('Colors', 'color_white')
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
            const currentProfile = state.pendingEntry.profile;
            updateState({
                formEntries: [...state.formEntries, state.pendingEntry],
                selectedProfile: currentProfile,
                selectedProduct: null,
                pendingEntry: null
            });
            scrollToSection('step-02');
        }
    };

    const removeEntry = (id: number) => {
        updateState({
            formEntries: state.formEntries.filter(e => e.id !== id)
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (state.formEntries.length === 0) return;
        
        updateState({ submissionStatus: 'sending' });
        
        const formData = new FormData(e.currentTarget);
        
        const data = {
            fName: formData.get('fName'),
            lName: formData.get('lName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            message: formData.get('message'),
            entries: state.formEntries.map((entry, index) => {
                const getAccName = (id: string) => {
                    const acc = state.accessories.find(a => a.id === id);
                    return acc ? acc.name[state.currentLanguage] : id;
                };
                
                const getGlassTypeName = (type: string) => {
                    return T[`glass_${type}`] || type;
                };

                const ensureAbsolute = (url: string) => {
                    if (!url) return '';
                    if (url.startsWith('http')) {
                        return url; // Already absolute, don't re-encode
                    }
                    // Relative URL
                    const absoluteUrl = `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
                    return encodeURI(absoluteUrl).replace(/\(/g, '%28').replace(/\)/g, '%29');
                };

                return {
                    position: index + 1,
                    product: entry.product.name,
                    productImage: ensureAbsolute(entry.product.imageSrc),
                    profile: entry.profile.name,
                    profileImage: ensureAbsolute(entry.profile.imageSrc),
                    dimensions: `${entry.width} x ${entry.height} mm`,
                    quantity: entry.quantity,
                    glass: `${getAccName(entry.glassPanes)} (${getGlassTypeName(entry.glassType)})`,
                    ventilation: getAccName(entry.ventilation),
                    handle: getAccName(entry.handle),
                    colorOut: getAccName(entry.colorOut),
                    colorIn: getAccName(entry.colorIn)
                };
            }),
            language: state.currentLanguage,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log("Form submitted successfully via Resend");
                updateState({ 
                    submissionStatus: 'success',
                    formEntries: [] // Clear entries on success
                });
                
                setTimeout(() => {
                    updateState({ submissionStatus: 'idle' });
                }, 5000);
            } else {
                throw new Error('Email submission failed');
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert(T.error);
            updateState({ submissionStatus: 'idle' });
        }
    };

    const scrollToSection = (id: string) => {
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    // --- RENDER HELPERS ---
    const renderFlags = () => (
        <div className="flex lg:flex-col gap-3 lg:gap-4">
            {(['sv', 'da', 'de', 'en'] as const).map(lang => (
                <button key={lang} onClick={() => changeLang(lang)} className="group flex lg:flex-col items-center gap-1 transition-all">
                    <div className={`w-5 h-3 lg:w-6 lg:h-4 border border-white/10 overflow-hidden rounded-sm transition-transform group-hover:scale-110 ${state.currentLanguage === lang ? 'ring-1 ring-[#C5A059] opacity-100' : 'opacity-20'}`}>
                        {lang === 'sv' && <svg viewBox="0 0 5 3" className="w-full h-full"><rect width="5" height="3" fill="#006aa7"/><path d="M0 1h5M1.5 0v3" stroke="#fecc00" strokeWidth="1"/></svg>}
                        {lang === 'da' && <svg viewBox="0 0 37 28" className="w-full h-full"><rect width="37" height="28" fill="#c8102e"/><rect width="6" height="28" x="12" fill="#fff"/><rect width="37" height="6" y="11" fill="#fff"/></svg>}
                        {lang === 'de' && <svg viewBox="0 0 5 3" className="w-full h-full"><rect width="5" height="1" fill="#000"/><rect width="5" height="1" y="1" fill="#dd0000"/><rect width="5" height="1" y="2" fill="#ffce00"/></svg>}
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
                                                
                                                <div className="w-full md:w-1/3 h-48 md:h-64 p-6 bg-[var(--bg-subtle)] flex items-center justify-center rounded-xl border border-[var(--border-color)] relative overflow-hidden group">
                                                    {!loadedImages.has(profile.imageSrc) && (
                                                        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
                                                            <div className="w-8 h-8 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin"></div>
                                                        </div>
                                                    )}
                                                    <img 
                                                        src={profile.imageSrc} 
                                                        alt={profile.name} 
                                                        className={`max-h-full object-contain drop-shadow-2xl transition-all duration-700 group-hover:scale-110 ${loadedImages.has(profile.imageSrc) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                                                        referrerPolicy="no-referrer"
                                                        onLoad={() => setLoadedImages(prev => new Set([...prev, profile.imageSrc]))}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:w-2/3 space-y-6">
                                                    <div>
                                                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-widest mb-2">{profile.name}</h3>
                                                        <p className="text-xs text-[#C5A059] font-bold tracking-[0.3em] uppercase">{profile.type}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-mono">
                                                        <Tooltip text={T.tip_uw}>
                                                            <div className="spec-item cursor-help"><span className="text-[var(--text-muted)] block mb-1">Uw</span>{profile.specs.Uw}</div>
                                                        </Tooltip>
                                                        <Tooltip text={T.tip_db}>
                                                            <div className="spec-item cursor-help"><span className="text-[var(--text-muted)] block mb-1">dB</span>{profile.specs.dB}</div>
                                                        </Tooltip>
                                                        <Tooltip text={T.tip_chambers}>
                                                            <div className="spec-item cursor-help"><span className="text-[var(--text-muted)] block mb-1">Chambers</span>{profile.specs.chambers}</div>
                                                        </Tooltip>
                                                        <Tooltip text={T.tip_depth}>
                                                            <div className="spec-item cursor-help"><span className="text-[var(--text-muted)] block mb-1">Depth</span>{profile.specs.depth}</div>
                                                        </Tooltip>
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
                        {state.selectedProfile && (
                        <section id="step-02" className="reveal transition-opacity duration-500">
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
                            
                            {['Okna', 'Drzwi', 'terrassystem'].map(cat => {
                                const catProducts = state.products.filter(p => p.category === cat);
                                if (catProducts.length === 0) return null;
                                
                                return (
                                    <div key={cat} className="space-y-6 mb-12">
                                        <h3 className="text-lg font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] border-b border-[var(--border-color)] pb-2">
                                            {cat === 'Okna' ? T.cat_okna : cat === 'Drzwi' ? T.cat_drzwi : T.cat_terrassystem}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {catProducts.filter(product => !state.selectedProfile || !state.profileProductMap[state.selectedProfile.name] || state.profileProductMap[state.selectedProfile.name].includes(product.name)).map(product => {
                                                const isSelected = state.selectedProduct?.name === product.name;
                                                
                                                return (
                                                    <div 
                                                        key={product.name}
                                                        onClick={() => addProduct(product.name)}
                                                        className={`tech-card cursor-pointer flex flex-col items-center text-center p-6 group ${isSelected ? 'selected' : ''}`}
                                                    >
                                                        <div className="h-32 w-full mb-6 flex items-center justify-center relative overflow-hidden">
                                                            {!loadedImages.has(product.imageSrc) && (
                                                                <div className="absolute inset-0 bg-white/5 animate-pulse rounded-xl"></div>
                                                            )}
                                                            <img 
                                                                src={product.imageSrc} 
                                                                alt={product.name} 
                                                                className={`max-h-full object-contain transition-all duration-500 group-hover:scale-110 ${loadedImages.has(product.imageSrc) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                                                                referrerPolicy="no-referrer"
                                                                onLoad={() => setLoadedImages(prev => new Set([...prev, product.imageSrc]))}
                                                            />
                                                        </div>
                                                        <p className="text-xs font-black uppercase tracking-widest">{product.name}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </section>
                        )}

                        {/* STEP 3: CONFIGURATION */}
                        {state.pendingEntry && (
                        <section id="step-03" className="reveal transition-opacity duration-500">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center space-x-6">
                                    <span className="text-3xl font-black text-[var(--text-muted)] opacity-20 font-montserrat">03</span>
                                    <h2 className="text-lg font-bold uppercase tracking-[0.3em] text-[#C5A059] font-montserrat">{T.step3}</h2>
                                </div>
                            </div>
                            
                            <div className="tech-card border-2 border-[#C5A059] overflow-hidden">
                                    <div className="flex flex-col xl:flex-row items-start gap-10 p-6 sm:p-10">
                                        <div className="flex flex-col items-start gap-4 w-full xl:w-1/3 border-b xl:border-b-0 xl:border-r border-[var(--border-color)] pb-8 xl:pb-0 xl:pr-10">
                                            <p className="text-xs text-[#C5A059] font-bold uppercase tracking-[0.3em]">{state.pendingEntry.profile.name}</p>
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[var(--bg-subtle)] p-4 rounded-2xl border border-[var(--border-color)] flex items-center justify-center shadow-inner">
                                                <img src={state.pendingEntry.product.imageSrc} className="w-full h-full object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
                                            </div>
                                            <p className="text-sm sm:text-base font-black text-[var(--text-main)] uppercase tracking-tighter leading-none">{state.pendingEntry.product.name}</p>
                                        </div>
                                        
                                        <div className="flex-grow w-full space-y-12">
                                            {/* 1. DIMENSIONS & QUANTITY */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                                            </div>

                                            {/* 2. GLASS TYPE */}
                                            <div className="space-y-8">
                                                <div className="flex flex-col gap-8">
                                                    {/* 2/3 PANE TOGGLE */}
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block">{T.glassType}</label>
                                                        <div className="flex bg-[var(--bg-subtle)] p-1 rounded-xl border border-[var(--border-color)] w-fit">
                                                            {['glass_2', 'glass_3'].map(id => {
                                                                const acc = state.accessories.find(a => a.id === id);
                                                                if (!acc) return null;
                                                                const isActive = state.pendingEntry!.glassPanes === id;
                                                                return (
                                                                    <button
                                                                        key={id}
                                                                        onClick={() => updatePendingEntry('glassPanes', id)}
                                                                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${isActive ? 'bg-[#C5A059] text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                                                                    >
                                                                        {acc.name[state.currentLanguage]}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* SPECIAL GLASS TYPES */}
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block">{T.glass_type_label}</label>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                                            {[
                                                                { id: 'standard', name: T.glass_standard, icon: Check },
                                                                { id: 'glass_tempered', name: T.glass_tempered, icon: ShieldCheck },
                                                                { id: 'glass_security', name: T.glass_security, icon: Lock },
                                                                { id: 'glass_frosted', name: T.glass_frosted, icon: Waves },
                                                                { id: 'glass_acoustic', name: T.glass_acoustic, icon: VolumeX },
                                                                { id: 'glass_solar', name: T.glass_solar, icon: Sun }
                                                            ].map(item => {
                                                                const isActive = state.pendingEntry!.glassType === item.id;
                                                                const Icon = item.icon;
                                                                return (
                                                                    <div 
                                                                        key={item.id} 
                                                                        onClick={() => updatePendingEntry('glassType', item.id)}
                                                                        className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center gap-3 text-center min-h-[100px] justify-center ${isActive ? 'bg-[#C5A059]/20 border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.1)]' : 'bg-[var(--bg-subtle)] border-[var(--border-color)] opacity-60 hover:opacity-100'}`}
                                                                    >
                                                                        <div className="w-10 h-10 flex items-center justify-center bg-black/20 rounded-lg shrink-0">
                                                                            <Icon size={20} className={isActive ? 'text-[#C5A059]' : 'text-[var(--text-muted)]'} />
                                                                        </div>
                                                                        <span className="text-[8px] font-black uppercase tracking-tight leading-[1.1] break-words w-full">{item.name}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3. VENTILATION */}
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{T.ventilation}</label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    {state.accessories.filter(a => a.category === 'Ventilation' && (!state.profileAccessoryMap[state.pendingEntry!.profile.name] || state.profileAccessoryMap[state.pendingEntry!.profile.name].includes(a.id))).map(acc => {
                                                        const isActive = state.pendingEntry!.ventilation === acc.id;
                                                        const isNone = acc.id === 'vent_none';
                                                        
                                                        return (
                                                            <div 
                                                                key={acc.id} 
                                                                onClick={() => updatePendingEntry('ventilation', acc.id)}
                                                                className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center gap-4 text-center min-h-[120px] justify-center ${isActive ? 'bg-[#C5A059]/20 border-[#C5A059] shadow-[0_0_15_rgba(197,160,89,0.1)]' : 'bg-[var(--bg-subtle)] border-[var(--border-color)] opacity-60 hover:opacity-100'}`}
                                                            >
                                                                <div className="w-full h-14 flex items-center justify-center bg-black/20 rounded-lg p-1 shrink-0">
                                                                    {isNone ? (
                                                                        <X size={24} className={isActive ? 'text-[#C5A059]' : 'text-[var(--text-muted)]'} />
                                                                    ) : (
                                                                        <img src={acc.imageSrc} alt={acc.name[state.currentLanguage]} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                                                                    )}
                                                                </div>
                                                                <span className="text-[9px] font-black uppercase tracking-tight leading-[1.1] break-words w-full">{acc.name[state.currentLanguage]}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* 4. HANDLES */}
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{T.handle}</label>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                                    {state.accessories.filter(a => a.category === 'Handles' && (!state.profileAccessoryMap[state.pendingEntry!.profile.name] || state.profileAccessoryMap[state.pendingEntry!.profile.name].includes(a.id))).map(acc => (
                                                        <div 
                                                            key={acc.id} 
                                                            onClick={() => updatePendingEntry('handle', acc.id)}
                                                            className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center gap-4 text-center min-h-[120px] justify-center ${state.pendingEntry!.handle === acc.id ? 'bg-[#C5A059]/20 border-[#C5A059] shadow-[0_0_15_rgba(197,160,89,0.1)]' : 'bg-[var(--bg-subtle)] border-[var(--border-color)] opacity-60 hover:opacity-100'}`}
                                                        >
                                                            <div className="w-full h-14 flex items-center justify-center bg-black/20 rounded-lg p-1 shrink-0">
                                                                <img src={acc.imageSrc} alt={acc.name[state.currentLanguage]} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                                                            </div>
                                                            <span className="text-[9px] font-black uppercase tracking-tight leading-[1.1] break-words w-full">{acc.name[state.currentLanguage]}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 5. COLORS */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-4">
                                                    <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{T.colorIn}</label>
                                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                                        {state.accessories.filter(a => a.category === 'Colors' && (!state.profileAccessoryMap[state.pendingEntry!.profile.name] || state.profileAccessoryMap[state.pendingEntry!.profile.name].includes(a.id))).map(acc => (
                                                            <div 
                                                                key={acc.id} 
                                                                onClick={() => updatePendingEntry('colorIn', acc.id)}
                                                                className={`cursor-pointer p-1.5 rounded-xl border transition-all flex flex-col items-center gap-2 text-center group ${state.pendingEntry!.colorIn === acc.id ? 'bg-[#C5A059]/20 border-[#C5A059] shadow-lg' : 'bg-[var(--bg-subtle)] border-[var(--border-color)] opacity-70 hover:opacity-100'}`}
                                                            >
                                                                <div className="w-full aspect-square rounded-lg border border-white/10 overflow-hidden bg-black/20">
                                                                    <img src={acc.imageSrc} alt={acc.name[state.currentLanguage]} className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                                                                </div>
                                                                <span className="text-[8px] font-bold uppercase tracking-tighter leading-tight h-5 flex items-center justify-center px-1">{acc.name[state.currentLanguage]}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{T.colorOut}</label>
                                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                                        {state.accessories.filter(a => a.category === 'Colors' && (!state.profileAccessoryMap[state.pendingEntry!.profile.name] || state.profileAccessoryMap[state.pendingEntry!.profile.name].includes(a.id))).map(acc => (
                                                            <div 
                                                                key={acc.id} 
                                                                onClick={() => updatePendingEntry('colorOut', acc.id)}
                                                                className={`cursor-pointer p-1.5 rounded-xl border transition-all flex flex-col items-center gap-2 text-center group ${state.pendingEntry!.colorOut === acc.id ? 'bg-[#C5A059]/20 border-[#C5A059] shadow-lg' : 'bg-[var(--bg-subtle)] border-[var(--border-color)] opacity-70 hover:opacity-100'}`}
                                                            >
                                                                <div className="w-full aspect-square rounded-lg border border-white/10 overflow-hidden bg-black/20">
                                                                    <img src={acc.imageSrc} alt={acc.name[state.currentLanguage]} className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                                                                </div>
                                                                <span className="text-[8px] font-bold uppercase tracking-tighter leading-tight h-5 flex items-center justify-center px-1">{acc.name[state.currentLanguage]}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 sm:p-10 pt-0 flex justify-center border-t border-[var(--border-color)] bg-[#C5A059]/5">
                                        <button onClick={confirmEntry} className="btn-gold w-full sm:w-auto py-5 px-16 rounded-xl text-[11px] flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                                            <Check size={18} />
                                            {T.btn_confirm}
                                        </button>
                                    </div>
                                </div>
                        </section>
                        )}
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
                                                <img src={e.product.imageSrc} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-main)]">{e.product.name}</p>
                                                <p className="text-[10px] text-[var(--text-main)] font-bold opacity-50 uppercase">{e.profile.name}</p>
                                                <p className="text-[10px] text-[#C5A059] font-mono mt-1">{e.width} x {e.height}mm | {e.quantity}st</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">OUT: {state.accessories.find(a => a.id === e.colorOut)?.name[state.currentLanguage] || e.colorOut}</span>
                                                    <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">IN: {state.accessories.find(a => a.id === e.colorIn)?.name[state.currentLanguage] || e.colorIn}</span>
                                                    <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">H: {state.accessories.find(a => a.id === e.handle)?.name[state.currentLanguage] || e.handle}</span>
                                                    <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">G: {state.accessories.find(a => a.id === e.glassPanes)?.name[state.currentLanguage]?.split(' ')[0] || e.glassPanes} | {T[e.glassType as keyof typeof T] || e.glassType}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => removeEntry(e.id)} className="text-[var(--text-muted)] hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            {state.formEntries.length > 0 && (
                                <div className="mb-8 p-4 bg-[#C5A059]/5 rounded-xl border border-[#C5A059]/20 space-y-2">
                                    <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest text-center">
                                        {T.units_count}: {state.formEntries.reduce((acc, e) => acc + e.quantity, 0)} / 10
                                    </p>
                                    <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest text-center">
                                        {state.formEntries.reduce((acc, e) => acc + e.quantity, 0) >= 10 ? (
                                            '🎉 ' + T.transport_home
                                        ) : (
                                            `${T.transport_terminal}, ${10 - state.formEntries.reduce((acc, e) => acc + e.quantity, 0)} ${T.transport_missing_prefix} ${T.transport_missing_suffix}`
                                        )}
                                    </p>
                                    <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest text-center border-t border-[#C5A059]/20 pt-2 mt-2">
                                        {T.anchors_total}: {state.formEntries.reduce((acc, e) => {
                                            const w = e.width;
                                            const h = e.height;
                                            // Simplified calculation: 2 top corners, 1 per side top, + intermediate
                                            const topAnchors = Math.max(2, Math.ceil(w / 600) + 1);
                                            const sideAnchors = Math.max(1, Math.ceil(h / 600));
                                            return acc + (topAnchors + 2 * sideAnchors) * e.quantity;
                                        }, 0)}
                                    </p>
                                </div>
                            )}
                            
                            <form className="space-y-4" onSubmit={handleSubmit}>
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
            <AdminPanel state={state} updateState={updateState} syncWithSupabase={syncWithSupabase} persistToSupabase={persistToSupabase} />

            {/* INFO MODAL */}
            <AnimatePresence>
                {state.infoProfile && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { updateState({ infoProfile: null }); setShowSection(false); }} 
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        ></motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass w-full max-w-4xl rounded-3xl overflow-hidden relative shadow-2xl border-2 border-[#C5A059]/50 flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button 
                                onClick={() => { updateState({ infoProfile: null }); setShowSection(false); }}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all z-10"
                            >
                                <X size={24} />
                            </button>

                                <div className="w-full md:w-1/2 p-8 sm:p-12 bg-[#C5A059]/5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[var(--border-color)] relative overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={showSection ? 'section' : 'profile'}
                                            className="relative w-full h-full flex items-center justify-center"
                                        >
                                            {(!loadedImages.has(showSection && state.infoProfile.sectionImageSrc ? state.infoProfile.sectionImageSrc : state.infoProfile.imageSrc)) && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-12 border-4 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                            <motion.img 
                                                initial={{ opacity: 0, x: showSection ? 20 : -20 }}
                                                animate={{ opacity: loadedImages.has(showSection && state.infoProfile.sectionImageSrc ? state.infoProfile.sectionImageSrc : state.infoProfile.imageSrc) ? 1 : 0, x: 0 }}
                                                exit={{ opacity: 0, x: showSection ? -20 : 20 }}
                                                src={showSection && state.infoProfile.sectionImageSrc ? state.infoProfile.sectionImageSrc : state.infoProfile.imageSrc} 
                                                alt={state.infoProfile.name} 
                                                className="max-h-[300px] md:max-h-[450px] object-contain drop-shadow-[0_0_50px_rgba(197,160,89,0.2)]" 
                                                onLoad={() => {
                                                    const url = showSection && state.infoProfile.sectionImageSrc ? state.infoProfile.sectionImageSrc : state.infoProfile.imageSrc;
                                                    setLoadedImages(prev => new Set([...prev, url]));
                                                }}
                                            />
                                        </motion.div>
                                    </AnimatePresence>

                                {state.infoProfile.sectionImageSrc && (
                                    <div className="mt-8 flex bg-black/20 p-1 rounded-xl border border-white/10">
                                        <button 
                                            onClick={() => setShowSection(false)}
                                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${!showSection ? 'bg-[#C5A059] text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            {T.info_view_profile}
                                        </button>
                                        <button 
                                            onClick={() => setShowSection(true)}
                                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${showSection ? 'bg-[#C5A059] text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            {T.info_view_section}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="w-full md:w-1/2 p-8 sm:p-12 overflow-y-auto custom-scroll">
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[#C5A059] font-black tracking-[0.4em] text-[10px] uppercase mb-3">{state.infoProfile.type} SYSTEM</p>
                                        <h2 className="text-3xl sm:text-4xl font-black font-montserrat tracking-tighter uppercase leading-none">{state.infoProfile.name}</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Tooltip text={T.tip_uw}>
                                            <div className="spec-item p-4 rounded-xl bg-white/5 border border-white/10 cursor-help w-full">
                                                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">{T.info_uw}</span>
                                                <span className="text-lg font-mono font-bold text-[#C5A059]">{state.infoProfile.specs.Uw}</span>
                                            </div>
                                        </Tooltip>
                                        <Tooltip text={T.tip_db}>
                                            <div className="spec-item p-4 rounded-xl bg-white/5 border border-white/10 cursor-help w-full">
                                                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">{T.info_acoustics}</span>
                                                <span className="text-lg font-mono font-bold text-[#C5A059]">{state.infoProfile.specs.dB} dB</span>
                                            </div>
                                        </Tooltip>
                                        <Tooltip text={T.tip_chambers}>
                                            <div className="spec-item p-4 rounded-xl bg-white/5 border border-white/10 cursor-help w-full">
                                                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">{T.info_chambers}</span>
                                                <span className="text-lg font-mono font-bold text-[#C5A059]">{state.infoProfile.specs.chambers}</span>
                                            </div>
                                        </Tooltip>
                                        <Tooltip text={T.tip_depth}>
                                            <div className="spec-item p-4 rounded-xl bg-white/5 border border-white/10 cursor-help w-full">
                                                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">{T.info_depth}</span>
                                                <span className="text-lg font-mono font-bold text-[#C5A059]">{state.infoProfile.specs.depth}</span>
                                            </div>
                                        </Tooltip>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] border-b border-white/10 pb-2">{T.info_description}</h4>
                                        <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                                            {state.infoProfile.description[state.currentLanguage]}
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            if (state.infoProfile) selectProfile(state.infoProfile.name);
                                            updateState({ infoProfile: null });
                                            setShowSection(false);
                                        }}
                                        className="w-full btn-gold py-4 rounded-xl text-[10px] font-black uppercase tracking-widest mt-8"
                                    >
                                        {T.info_select}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

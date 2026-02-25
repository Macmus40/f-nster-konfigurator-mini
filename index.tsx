
import { GoogleGenAI } from "@google/genai";

// --- EXTERNAL TYPE DECLARATIONS ---
declare const emailjs: any;

declare global {
    interface Window {
        changeLang: (l: string) => void;
        selectProfile: (n: string) => void;
        addProduct: (n: string) => void;
        updateEntry: (id: number, field: string, val: string) => void;
        updatePendingEntry: (field: string, val: string) => void;
        confirmEntry: () => void;
        resetStep: (step: number) => void;
        removeEntry: (id: number) => void;
        toggleAI: () => void;
        renderAIAssistant: () => void;
        handleFinalSubmit: (e: any) => Promise<void>;
        scrollToSection: (id: string, triggerAI?: boolean) => void;
        setUIScale: (s: string) => void;
        toggleTheme: () => void;
        showInfo: (n: string, e: Event) => void;
        closeInfo: () => void;
    }
}

// --- DATA ---
const PROFILES = [
    { 
        name: 'Iglo5', 
        type: 'PVC', 
        specs: { Uw: '0.89', dB: '32-44', chambers: '5', depth: '70mm' }, 
        imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/IGLO5-m6tka1j4.png',
        description: 'Detta 5-kammarsystem kännetecknas av väldigt goda värmeisoleringsparametrar. En snövit profil i A-klass, tillverkad av enbart primärmaterial, vilket garanterar högsta kvalitet. Lämpar sig för både varmt och kallt klimat.'
    },
    { 
        name: 'Iglo5 Classic', 
        type: 'PVC', 
        specs: { Uw: '0.89', dB: '32-44', chambers: '5', depth: '70mm' }, 
        imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/IGLO5clasicc-m6tka35j.png',
        description: 'Samma höga kvalitet som Iglo 5 men med en klassisk, rak profil. 5-kammarsystem med utmärkta isoleringsegenskaper och hållbarhet.'
    },
    { 
        name: 'Iglo Energy', 
        type: 'PVC', 
        specs: { Uw: '0.60', dB: '35-46', chambers: '7', depth: '82mm' }, 
        imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/IGLO-Energy-m6tk9xpm.png',
        description: 'Innovativt 7-kammarsystem med central tätning av skummat EPDM. Världens första system med denna lösning, vilket garanterar de bästa parametrarna avseende energieffektivitet.'
    },
    { 
        name: 'Iglo Light', 
        type: 'PVC', 
        specs: { Uw: '0.80', dB: '34-45', chambers: '5', depth: '70mm' }, 
        imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/IGLO-Light-m6tk9yz0.png',
        description: 'Smala profiler för maximalt ljusinsläpp. 5-kammarsystem med stilren design och smäckra ramar som ger upp till 10% mer ljus än standardfönster.'
    },
    { 
        name: 'Iglo Premier', 
        type: 'PVC', 
        specs: { Uw: '0.79', dB: '34-44', chambers: '7', depth: '82mm' }, 
        imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/IGLO-Priner-m6tka08l.png',
        description: 'Ett modernt 5-kammarsystem som kombinerar estetik med funktionalitet. Ger god isolering och stabilitet för krävande miljöer.'
    },
    { 
        name: 'Softline', 
        type: 'TRÄ', 
        specs: { Uw: '0.80-1.2', dB: '32-42', chambers: 'Wood', depth: '68-88mm' }, 
        imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/softline-m6tka5ul.png',
        description: 'Träfönster i furu eller meranti med klassisk elegans. Rundade profiler och hög motståndskraft mot väder tack vare aluminiumdränering.'
    },
    { 
        name: 'Duoline', 
        type: 'TRÄ/ALU', 
        specs: { Uw: '0.79-1.1', dB: '33-43', chambers: 'Hyb', depth: '68-88mm' }, 
        imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/duoline-m6tk9v1o.png',
        description: 'Hybridfönster som förenar träets värme med aluminiumets hållbarhet. Perfekt för nordiskt klimat med minimalt underhållsbehov.'
    },
    { 
        name: 'Alu-MB70', 
        type: 'ALU', 
        specs: { Uw: '0.90-1.3', dB: '35-45', chambers: 'Alu', depth: '70mm' }, 
        imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/MB70-m6tka4ha.png',
        description: 'Robust aluminiumsystem för alla väderförhållanden. Pulverlackerat för högsta kvalitet, lämpar sig för både privata hem och offentliga byggnader.'
    },
];

const PRODUCTS = [
    { name: '1-luft-F', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/1-LUFT-F-m6tj689t.gif' },
    { name: '1-luft-K', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/animated-k-m7vm8hg4.gif' },
    { name: '1-luft-DH', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/1-LUFT-DH-m6tj64n6.gif' },
    { name: '1-luft-DKH', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/1-LUFT-DKH-m6tj671w.gif' },
    { name: 'Top Swing', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/animated-top-swing-m7vmqp7d.gif' },
    { name: '2-LUFT DKV/DKH', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/2-LUFT-DKV_DKH-m6tj6c89.gif' },
    { name: '3-LUFT DKV/F/DKH', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/3-LUFT-DKV_F_DKH-m6tj6e2o.gif' },
    { name: 'Dörr-1-LUFT DH-utat', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/dorr-1-LUFT-DHutat-m6tj6fyl.gif' },
    { name: 'Dörr-1-LUFT DKH-inat', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/dorr-1-LUFT-DKHinat-m6tj6i0z.gif' },
    { name: 'Dörr-2-LUFT utat', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/dorr2-LUFT-DVA_DHutat-m6tj6oym.gif' },
    { name: 'Dörr-2-LUFT inat', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/dorr-2-LUFT-DV_DKHinat-m6tj6ltx.gif' },
    { name: 'Skjutdörr-2-LUFT', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/skjutdorr2-LUFT-SKH_FF-m6tj793g.gif' },
    { name: 'Skjutdörr-HS-2-LUFT', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/skjutdorr-HS-2-LUFT-HSH_FF-m6tj6y12.gif' },
    { name: 'Skjutdörr-HS-4-LUFT', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/skjutdorr-HS-4-LUFT-FF_HSVA_HSH_FF-m6tj73ym.gif' },
];

const TRANSLATIONS: any = {
    sv: {
        header: 'OFFERTFÖRFRÅGAN',
        subheader: 'Professionellt fönstersystem för nordiskt klimat. Skapa din offertförfrågan nedan.',
        step1: 'VÄLJ PROFIL', step2: 'VÄLJ PRODUKT', step3: 'KONFIGURERA ENHETER',
        btn_send: 'SKICKA FÖRFRÅGAN', btn_add: 'LÄGG TILL ENHET', summary: 'DIN PROJEKTLISTA',
        empty: 'Välj en produkt för att börja.', ai: 'G-Assistant: Redo för teknisk analys.',
        width: 'BREDD (MM)', height: 'HÖJD (MM)', quantity: 'ANTAL', glassType: 'GLAS TYP',
        ventilation: 'VENTILATION', fName: 'FÖRNAMN', lName: 'EFTERNAMN', email: 'E-POSTADRESS',
        phone: 'TELEFONNUMMER', address: 'ADRESS (GATA & STAD)', message: 'MEDDELANDE / ÖVRIGT...',
        success: 'Förfrågan har skickats!', error: 'Ett fel uppstod vid sändning.', sending: 'SÄNDER...',
        vent_none: 'UTAN', vent_with: 'MED', profile_label: 'PROFIL', select_first: 'Vänligen välj en profil först!',
        nav_config: 'Konfiguration', nav_tech: 'Teknisk Analys',
        ui_scale: 'UI SKALA', btn_confirm: 'LÄGG TILL I PROJEKTLISTA', btn_change: 'ÄNDRA', step_done: 'VALD',
        last_used: 'SENAST VALD'
    },
    pl: {
        header: 'ZAPYTANIE OFERTOWE',
        subheader: 'Profesjonalne systemy okienne na nordycki klimat. Stwórz zapytanie ofertowe.',
        step1: 'WYBIERZ PROFIL', step2: 'WYBIERZ PRODUKT', step3: 'KONFIGURACJA JEDNOSTEK',
        btn_send: 'WYŚLIJ ZAPYTANIE', btn_add: 'DODAJ JEDNOSTKĘ', summary: 'LISTA PROJEKTOWA',
        empty: 'Wybierz produkt, aby rozpocząć.', ai: 'G-Assistant: Gotowy do analizy.',
        width: 'SZEROKOŚĆ (MM)', height: 'WYSOKOŚĆ (MM)', quantity: 'ILOŚĆ', glassType: 'TYP SZKŁA',
        ventilation: 'WENTYLACJA', fName: 'IMIĘ', lName: 'NAZWISKO', email: 'ADRES E-MAIL',
        phone: 'NUMER TELEFONU', address: 'ADRES (ULICA I MIASTO)', message: 'WIADOMOŚĆ / UWAGI...',
        success: 'Zapytanie zostało wysłane!', error: 'Wystąpił błąd podczas wysyłania.', sending: 'WYSYŁANIE...',
        vent_none: 'BEZ', vent_with: 'Z VENT', profile_label: 'PROFIL', select_first: 'Proszę najpierw wybrać profil!',
        nav_config: 'Konfiguracja', nav_tech: 'Analiza Techniczna',
        ui_scale: 'ROZMIAR INTERFEJSU', btn_confirm: 'DODAJ DO LISTY PROJEKTU', btn_change: 'ZMIEŃ', step_done: 'WYBRANO',
        last_used: 'OSTATNIO WYBRANY'
    },
    en: {
        header: 'QUOTE REQUEST',
        subheader: 'Professional window systems for the Nordic climate. Create your quote request below.',
        step1: 'SELECT PROFILE', step2: 'SELECT PRODUCT', step3: 'CONFIGURE UNITS',
        btn_send: 'SEND INQUIRY', btn_add: 'ADD UNIT', summary: 'YOUR PROJECT LIST',
        empty: 'Select a product to begin.', ai: 'G-Assistant: Ready for technical analysis.',
        width: 'WIDTH (MM)', height: 'HEIGHT (MM)', quantity: 'QUANTITY', glassType: 'GLASS TYPE',
        ventilation: 'VENTILATION', fName: 'FIRST NAME', lName: 'LAST NAME', email: 'EMAIL ADDRESS',
        phone: 'PHONE NUMBER', address: 'ADDRESS (STREET & CITY)', message: 'MESSAGE / NOTES...',
        success: 'Inquiry has been sent!', error: 'An error occurred while sending.', sending: 'SENDING...',
        vent_none: 'WITHOUT', vent_with: 'WITH', profile_label: 'PROFILE', select_first: 'Please select a profile first!',
        nav_config: 'Configuration', nav_tech: 'Technical Analysis',
        ui_scale: 'UI SCALE', btn_confirm: 'ADD TO PROJECT LIST', btn_change: 'CHANGE', step_done: 'SELECTED',
        last_used: 'LAST SELECTED'
    }
};

const ICONS = {
    window: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="1"></rect><path d="M3 12h18M12 3v18"></path></svg>`,
    therm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
    flag_sv: `<svg viewBox="0 0 5 3"><rect width="5" height="3" fill="#006aa7"/><path d="M0 1h5M1.5 0v3" stroke="#fecc00" stroke-width="1"/></svg>`,
    flag_pl: `<svg viewBox="0 0 5 3"><rect width="5" height="3" fill="#fff"/><rect width="5" height="1.5" y="1.5" fill="#dc143c"/></svg>`,
    flag_en: `<svg viewBox="0 0 60 30"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" clip-path="url(#s)"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4" clip-path="url(#s)"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></svg>`,
};

// --- STATE ---
let state: any = {
    currentLanguage: 'sv',
    uiScale: 'M',
    theme: 'dark',
    selectedProfile: null,
    selectedProduct: null,
    lastSelectedProfileName: null,
    pendingEntry: null,
    infoProfile: null,
    formEntries: [],
    submissionStatus: 'idle',
    aiMessage: "",
    aiIsLoading: false,
};

// --- AI ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAITip = async (data: any) => {
    if (state.aiIsLoading) return;
    state.aiIsLoading = true;
    window.renderAIAssistant();
    const langNames: any = { sv: 'szwedzku', pl: 'polsku', en: 'angielsku' };
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Podaj jedną techniczną zaletę okien ${data.name} po ${langNames[state.currentLanguage]}. Bardzo krótko (max 8 słów).`
        });
        state.aiMessage = response.text || "";
    } catch {
        state.aiMessage = TRANSLATIONS[state.currentLanguage].ai;
    } finally {
        state.aiIsLoading = false;
        window.renderAIAssistant();
    }
};

// --- RENDER ---
const renderApp = () => {
    const root = document.getElementById('root');
    if (!root) return;
    const T = TRANSLATIONS[state.currentLanguage];
    
    root.innerHTML = `
        <!-- Sidebar / Top Nav -->
        <div class="fixed left-0 top-0 w-full h-[60px] lg:w-[60px] lg:h-full bg-[var(--bg-sidebar)] border-b lg:border-b-0 lg:border-r border-[var(--border-color)] z-50 flex lg:flex-col items-center justify-between lg:justify-start px-4 lg:px-0 lg:py-8 transition-colors duration-300">
            
            <!-- Main Navigation -->
            <div class="flex lg:flex-col gap-4 lg:gap-6">
                <button onclick="scrollToSection('step-01')" class="side-nav-icon active group relative" title="${T.nav_config}">
                    ${ICONS.window}
                    <span class="hidden lg:block absolute left-full ml-4 px-2 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-color)] text-[9px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60]">
                        ${T.nav_config}
                    </span>
                </button>
                <button onclick="scrollToSection('step-03', true)" class="side-nav-icon group relative" title="${T.nav_tech}">
                    ${ICONS.therm}
                    <span class="hidden lg:block absolute left-full ml-4 px-2 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-color)] text-[9px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60]">
                        ${T.nav_tech}
                    </span>
                </button>
                
                <!-- Theme Toggle (Mobile) -->
                <button onclick="toggleTheme()" class="lg:hidden side-nav-icon text-[#C5A059]">
                    ${state.theme === 'dark' ? ICONS.sun : ICONS.moon}
                </button>
            </div>

            <!-- Bottom/Right Controls -->
            <div class="flex lg:flex-col items-center gap-6 lg:gap-10 lg:mt-auto lg:pb-4">
                <!-- Theme Toggle (Desktop) -->
                <button onclick="toggleTheme()" class="hidden lg:flex side-nav-icon hover:text-[#C5A059] transition-colors" title="Toggle Theme">
                    ${state.theme === 'dark' ? ICONS.sun : ICONS.moon}
                </button>

                <!-- UI Scale Controls -->
                <div class="hidden sm:flex lg:flex-col items-center gap-2 lg:gap-3">
                    <span class="text-[7px] font-black text-gray-600 uppercase tracking-[0.2em] hidden lg:block">${T.ui_scale}</span>
                    <div class="flex lg:flex-col gap-1.5">
                        ${['S', 'M', 'L'].map(s => `
                            <button onclick="setUIScale('${s}')" class="w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center text-[8px] lg:text-[9px] font-black border transition-all ${state.uiScale === s ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'text-gray-500 border-white/5 hover:border-white/20'}">
                                ${s}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Language Selector -->
                <div class="flex lg:flex-col gap-3 lg:gap-4">
                    ${['sv', 'pl', 'en'].map(lang => `
                        <button onclick="changeLang('${lang}')" class="group flex lg:flex-col items-center gap-1 transition-all">
                            <div class="w-5 h-3 lg:w-6 lg:h-4 border border-white/10 overflow-hidden rounded-sm transition-transform group-hover:scale-110 ${state.currentLanguage === lang ? 'ring-1 ring-[#C5A059] opacity-100' : 'opacity-20'}">
                                ${ICONS['flag_' + lang as keyof typeof ICONS]}
                            </div>
                            <span class="text-[7px] font-black tracking-tighter ${state.currentLanguage === lang ? 'text-[#C5A059]' : 'text-gray-600'}">${lang.toUpperCase()}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>

        <main class="lg:ml-[60px] pt-[60px] lg:pt-0 min-h-screen pb-32">
            <!-- Hero Section -->
            <section class="h-[35vh] lg:h-[45vh] flex items-center px-4 sm:px-6 lg:px-16 border-b border-[var(--border-color)] bg-[var(--bg-main)] transition-colors duration-300">
                <div class="reveal w-full">
                    <p class="text-[#C5A059] font-black tracking-[0.3em] sm:tracking-[0.5em] text-[9px] sm:text-[10px] uppercase mb-4">Precision Engineering</p>
                    <h1 class="text-2xl sm:text-5xl lg:text-7xl font-black font-montserrat tracking-tighter text-[var(--text-main)] leading-none uppercase break-words">
                        ${state.selectedProfile ? state.selectedProfile.name : T.header}
                    </h1>
                    <p class="text-xs sm:text-sm lg:text-md text-[var(--text-muted)] font-light max-w-xl mt-4 sm:mt-6 lg:mt-8 leading-relaxed">${T.subheader}</p>
                </div>
            </section>

            <div class="p-4 sm:p-8 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                <div class="lg:col-span-8 space-y-24">
                    
                    <!-- Step 01: Profile -->
                    <section id="step-01" class="reveal">
                        <div class="flex items-center justify-between mb-12">
                            <div class="flex items-center space-x-6">
                                <span class="text-3xl font-black text-[var(--text-muted)] opacity-20 font-montserrat">01</span>
                                <h2 class="text-lg font-bold uppercase tracking-[0.3em] text-[#C5A059] font-montserrat">${T.step1}</h2>
                            </div>
                            ${state.selectedProfile ? `
                                <button onclick="resetStep(1)" class="text-[10px] font-black text-[#C5A059] border border-[#C5A059]/30 px-4 py-2 rounded-lg hover:bg-[#C5A059] hover:text-black transition-all uppercase tracking-widest">
                                    ${T.btn_change}
                                </button>
                            ` : ''}
                        </div>
                        <div class="space-y-6">
                            ${PROFILES.filter(p => !state.selectedProfile || state.selectedProfile.name === p.name).map(p => {
                                const isSelected = state.selectedProfile?.name === p.name;
                                const isLastUsed = state.lastSelectedProfileName === p.name && !state.selectedProfile;
                                return `
                                <div onclick="${!state.selectedProfile ? `selectProfile('${p.name}')` : ''}" class="tech-card ${!state.selectedProfile ? 'cursor-pointer' : ''} flex flex-col md:flex-row items-center gap-6 md:gap-10 ${isSelected ? 'selected' : ''} ${isLastUsed ? 'border-[#C5A059]/40 bg-[#C5A059]/5' : ''}">
                                    <!-- Info Icon -->
                                    <button onclick="showInfo('${p.name}', event)" class="absolute top-3 left-3 sm:top-4 sm:left-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059] hover:text-black hover:scale-110 transition-all z-20 shadow-lg" title="Information">
                                        ${ICONS.info}
                                    </button>

                                    ${isLastUsed ? `
                                        <div class="absolute top-4 right-4 bg-[#C5A059]/20 text-[#C5A059] text-[8px] px-2 py-1 font-black rounded uppercase tracking-widest border border-[#C5A059]/30 animate-pulse z-20">
                                            ${T.last_used}
                                        </div>
                                    ` : ''}

                                    <div class="w-32 h-32 sm:w-48 sm:h-48 bg-[var(--bg-subtle)] rounded-xl p-4 flex-shrink-0 flex items-center justify-center">
                                        <img src="${p.imageSrc}" class="w-full h-full object-contain ${isSelected ? 'scale-110' : 'opacity-70'} transition-transform duration-700">
                                    </div>
                                    <div class="flex-grow w-full">
                                        <div class="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                                            <div>
                                                <h3 class="text-xl sm:text-2xl font-black font-montserrat uppercase leading-tight">${p.name}</h3>
                                                <p class="text-[9px] sm:text-[10px] font-black text-[#C5A059] tracking-widest uppercase mt-1">${p.type} TECHNOLOGY</p>
                                            </div>
                                            ${isSelected ? `<div class="bg-[#C5A059] text-black text-[8px] sm:text-[9px] px-3 py-1 font-black rounded-full uppercase self-start sm:self-center">${T.step_done}</div>` : ''}
                                        </div>
                                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div class="spec-item"><p class="text-[7px] sm:text-[8px] opacity-40 uppercase">Isolering</p><p class="text-2xs sm:text-xs font-mono font-bold text-[#C5A059]">Uw ${p.specs.Uw}</p></div>
                                            <div class="spec-item"><p class="text-[7px] sm:text-[8px] opacity-40 uppercase">Akustik</p><p class="text-2xs sm:text-xs font-mono font-bold text-[#C5A059]">${p.specs.dB} dB</p></div>
                                            <div class="spec-item"><p class="text-[7px] sm:text-[8px] opacity-40 uppercase">Komrar</p><p class="text-2xs sm:text-xs font-mono font-bold text-[#C5A059]">${p.specs.chambers}</p></div>
                                            <div class="spec-item"><p class="text-[7px] sm:text-[8px] opacity-40 uppercase">Djup</p><p class="text-2xs sm:text-xs font-mono font-bold text-[#C5A059]">${p.specs.depth}</p></div>
                                        </div>
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                    </section>

                    <!-- Step 02: Product Selection -->
                    ${state.selectedProfile ? `
                    <section id="step-02" class="reveal">
                        <div class="flex items-center justify-between mb-12">
                            <div class="flex items-center space-x-6">
                                <span class="text-3xl font-black text-[var(--text-muted)] opacity-20 font-montserrat">02</span>
                                <h2 class="text-lg font-bold uppercase tracking-[0.3em] text-[#C5A059] font-montserrat">${T.step2}</h2>
                            </div>
                            ${state.selectedProduct ? `
                                <button onclick="resetStep(2)" class="text-[10px] font-black text-[#C5A059] border border-[#C5A059]/30 px-4 py-2 rounded-lg hover:bg-[#C5A059] hover:text-black transition-all uppercase tracking-widest">
                                    ${T.btn_change}
                                </button>
                            ` : ''}
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            ${PRODUCTS.filter(p => !state.selectedProduct || state.selectedProduct.name === p.name).map(p => `
                                <div onclick="${!state.selectedProduct ? `addProduct('${p.name}')` : ''}" class="tech-card ${!state.selectedProduct ? 'cursor-pointer' : ''} group text-center flex flex-col justify-between h-80 border-dashed border-[var(--border-color)] ${state.selectedProduct?.name === p.name ? 'border-[#C5A059] bg-[#C5A059]/5' : 'hover:border-[var(--hf-gold)]'}">
                                    <div class="h-48 flex items-center justify-center mb-6 bg-[var(--bg-subtle)] rounded-xl p-4">
                                        <img src="${p.imageSrc}" class="max-h-full ${state.selectedProduct?.name === p.name ? '' : 'grayscale group-hover:grayscale-0'} transition-all duration-500 scale-90 group-hover:scale-110 object-contain">
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-black uppercase tracking-widest ${state.selectedProduct?.name === p.name ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'} mb-4 group-hover:text-[var(--text-main)]">${p.name}</p>
                                        ${!state.selectedProduct ? `
                                            <div class="bg-[var(--bg-subtle)] text-[#C5A059] py-4 text-[9px] font-black uppercase tracking-[0.2em] group-hover:bg-[#C5A059] group-hover:text-black transition-all rounded-lg">
                                                ${T.btn_add}
                                            </div>
                                        ` : `
                                            <div class="bg-[#C5A059] text-black py-4 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg">
                                                ${T.step_done}
                                            </div>
                                        `}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                    ` : ''}

                    <!-- Step 03: Configuration -->
                    ${state.selectedProduct ? `
                    <section id="step-03" class="reveal">
                        <div class="flex items-center space-x-6 mb-12">
                            <span class="text-3xl font-black text-[var(--text-muted)] opacity-20 font-montserrat">03</span>
                            <h2 class="text-lg font-bold uppercase tracking-[0.3em] text-[#C5A059] font-montserrat">${T.step3}</h2>
                        </div>
                        <div class="space-y-10">
                            ${renderPendingEntry(state.pendingEntry, T)}
                            
                            <div class="flex justify-center pt-8">
                                <button onclick="confirmEntry()" class="btn-gold px-16 py-6 rounded-2xl text-xs shadow-[0_20px_50px_rgba(197,160,89,0.3)] hover:scale-105 transition-all">
                                    ${T.btn_confirm}
                                </button>
                            </div>
                        </div>
                    </section>
                    ` : ''}
                </div>

                <!-- Right Sidebar Summary -->
                <aside class="lg:col-span-4">
                    <div class="glass p-6 sm:p-10 sticky top-12 rounded-2xl shadow-2xl">
                        <h3 class="text-xs font-black font-montserrat uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-6 sm:mb-10 text-[#C5A059] border-b border-[var(--border-color)] pb-6">${T.summary}</h3>
                        
                        <div class="space-y-6 mb-12 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
                            ${state.formEntries.length === 0 ? `<p class="text-[var(--text-muted)] text-center py-16 uppercase tracking-[0.2em] text-[9px] font-bold">${T.empty}</p>` : 
                                state.formEntries.map((e: any) => `
                                <div class="flex items-center space-x-5 pb-5 border-b border-[var(--border-color)] reveal">
                                    <div class="w-12 h-12 bg-[var(--bg-subtle)] p-2 flex-shrink-0 rounded-lg">
                                        <img src="${e.product.imageSrc}" class="w-full h-full object-contain">
                                    </div>
                                    <div class="flex-grow">
                                        <p class="text-[9px] font-black uppercase tracking-widest text-[var(--text-main)]">${e.product.name}</p>
                                        <p class="text-[10px] text-[var(--text-main)] font-bold opacity-50 uppercase">${e.profile.name}</p>
                                        <p class="text-[10px] text-[#C5A059] font-mono mt-1">${e.width} x ${e.height}mm | ${e.quantity}st</p>
                                    </div>
                                    <button onclick="removeEntry(${e.id})" class="text-[var(--text-muted)] hover:text-red-500 transition-colors">
                                        ${ICONS.trash}
                                    </button>
                                </div>
                            `).join('')}
                        </div>

                        <form onsubmit="handleFinalSubmit(event)" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <input type="text" name="firstName" placeholder="${T.fName}" required class="tech-input text-[10px] uppercase font-bold tracking-widest">
                                <input type="text" name="lastName" placeholder="${T.lName}" required class="tech-input text-[10px] uppercase font-bold tracking-widest">
                            </div>
                            <input type="email" name="email" placeholder="${T.email}" required class="tech-input text-[10px] uppercase font-bold tracking-widest">
                            <input type="tel" name="phone" placeholder="${T.phone}" required class="tech-input text-[10px] uppercase font-bold tracking-widest">
                            <input type="text" name="address" placeholder="${T.address}" required class="tech-input text-[10px] uppercase font-bold tracking-widest">
                            <textarea name="message" placeholder="${T.message}" rows="3" class="tech-input text-[10px] uppercase font-bold tracking-widest"></textarea>
                            
                            <button type="submit" ${state.formEntries.length === 0 ? 'disabled' : ''} class="w-full btn-gold mt-6 rounded-lg text-[11px] shadow-lg">
                                ${state.submissionStatus === 'sending' ? T.sending : T.btn_send}
                            </button>
                        </form>
                    </div>
                </aside>
            </div>
        </main>

        <!-- AI Engine -->
        <div class="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50">
            <div id="ai-bubble" class="hidden absolute bottom-20 right-0 w-[calc(100vw-48px)] sm:w-80 glass p-6 sm:p-8 shadow-2xl rounded-2xl">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-2 h-2 bg-[#C5A059] rounded-full animate-ping"></div>
                    <p class="text-[8px] font-black tracking-[0.5em] text-[#C5A059] uppercase">G-Technical Engine</p>
                </div>
                <div id="ai-content" class="text-[11px] font-light text-[var(--text-muted)] leading-relaxed font-mono">
                    ${state.aiIsLoading ? 'PROCESSING PARAMETERS...' : state.aiMessage || T.ai}
                </div>
            </div>
            <button onclick="toggleAI()" class="w-14 h-14 bg-black border-2 border-[#C5A059] text-[#C5A059] flex items-center justify-center font-black hover:bg-[#C5A059] hover:text-black transition-all rounded-full shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                <span class="text-xl">G</span>
            </button>
        </div>

        <!-- Info Modal -->
        ${state.infoProfile ? `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div onclick="closeInfo()" class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <div class="glass w-full max-w-2xl rounded-3xl overflow-hidden relative reveal shadow-2xl max-h-[95vh] flex flex-col">
                <div class="p-5 sm:p-12 overflow-y-auto custom-scroll flex-grow">
                    <button onclick="closeInfo()" class="absolute top-4 right-4 sm:top-6 sm:right-6 text-[var(--text-muted)] hover:text-white transition-colors z-30">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 sm:w-6 sm:h-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    
                    <div class="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start text-center md:text-left">
                        <div class="w-24 h-24 sm:w-32 sm:h-32 bg-[var(--bg-subtle)] rounded-2xl p-4 flex-shrink-0 flex items-center justify-center border border-[var(--border-color)]">
                            <img src="${state.infoProfile.imageSrc}" class="w-full h-full object-contain">
                        </div>
                        <div class="flex-grow w-full">
                            <p class="text-[#C5A059] font-black tracking-[0.3em] sm:tracking-[0.4em] text-[8px] sm:text-[10px] uppercase mb-2">${state.infoProfile.type} TECHNOLOGY</p>
                            <h2 class="text-xl sm:text-3xl font-black font-montserrat uppercase text-[var(--text-main)] mb-4 sm:mb-6 leading-tight">${state.infoProfile.name}</h2>
                            <p class="text-[var(--text-muted)] leading-relaxed text-[11px] sm:text-sm mb-6 sm:mb-8">${state.infoProfile.description}</p>
                            
                            <div class="grid grid-cols-2 gap-3 sm:gap-4">
                                <div class="spec-item"><p class="text-[7px] sm:text-[9px] opacity-40 uppercase mb-1">Isolering</p><p class="text-[11px] sm:text-sm font-mono font-bold text-[#C5A059]">Uw ${state.infoProfile.specs.Uw}</p></div>
                                <div class="spec-item"><p class="text-[7px] sm:text-[9px] opacity-40 uppercase mb-1">Akustik</p><p class="text-[11px] sm:text-sm font-mono font-bold text-[#C5A059]">${state.infoProfile.specs.dB} dB</p></div>
                                <div class="spec-item"><p class="text-[7px] sm:text-[9px] opacity-40 uppercase mb-1">Kamrar</p><p class="text-[11px] sm:text-sm font-mono font-bold text-[#C5A059]">${state.infoProfile.specs.chambers}</p></div>
                                <div class="spec-item"><p class="text-[7px] sm:text-[9px] opacity-40 uppercase mb-1">Djup</p><p class="text-[11px] sm:text-sm font-mono font-bold text-[#C5A059]">${state.infoProfile.specs.depth}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-[var(--bg-subtle)] p-4 sm:p-6 text-center border-t border-[var(--border-color)]">
                    <button onclick="closeInfo()" class="bg-[#C5A059] text-black font-black py-3 sm:py-4 px-8 sm:px-10 rounded-xl text-[9px] sm:text-[10px] w-full md:w-auto uppercase tracking-widest hover:bg-white transition-all">STÄNG FÖNSTER</button>
                </div>
            </div>
        </div>
        ` : ''}
    `;
};

const renderEntry = (e: any, index: number, T: any) => {
    return `
    <div class="tech-card flex flex-col lg:flex-row items-center gap-12 border-l-4 border-l-[#C5A059]">
        <!-- Product Info -->
        <div class="flex items-center space-x-8 w-full lg:w-1/4">
            <div class="w-24 h-24 bg-[var(--bg-subtle)] p-3 rounded-2xl border border-[var(--border-color)] flex-shrink-0 flex items-center justify-center">
                <img src="${e.product.imageSrc}" class="w-full h-full object-contain">
            </div>
            <div>
                <p class="text-[14px] font-black text-[var(--text-main)] uppercase tracking-wider leading-tight">${e.product.name}</p>
                <p class="text-[11px] text-[#C5A059] font-bold uppercase tracking-[0.2em] mt-2">${e.profile.name}</p>
            </div>
        </div>
        
        <!-- Configuration Inputs -->
        <div class="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-10 w-full">
            <div class="flex flex-col">
                <span class="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] mb-2 sm:mb-3 uppercase tracking-widest">${T.width}</span>
                <input type="number" onchange="updateEntry(${e.id}, 'width', this.value)" value="${e.width}" class="tech-input text-sm md:text-base font-mono py-2 sm:py-3">
            </div>
            <div class="flex flex-col">
                <span class="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] mb-2 sm:mb-3 uppercase tracking-widest">${T.height}</span>
                <input type="number" onchange="updateEntry(${e.id}, 'height', this.value)" value="${e.height}" class="tech-input text-sm md:text-base font-mono py-2 sm:py-3">
            </div>
            <div class="flex flex-col">
                <span class="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] mb-2 sm:mb-3 uppercase tracking-widest">${T.quantity}</span>
                <input type="number" onchange="updateEntry(${e.id}, 'quantity', this.value)" value="${e.quantity}" class="tech-input text-sm md:text-base font-mono py-2 sm:py-3">
            </div>
            <div class="flex flex-col">
                <span class="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] mb-2 sm:mb-3 uppercase tracking-widest">${T.glassType}</span>
                <select onchange="updateEntry(${e.id}, 'glassType', this.value)" class="tech-input text-[11px] sm:text-[12px] md:text-[13px] bg-transparent font-bold py-2 sm:py-3">
                    <option value="3-glas" ${e.glassType === '3-glas' ? 'selected' : ''}>3-glas (T4-16-4-16-4)</option>
                    <option value="2-glas" ${e.glassType === '2-glas' ? 'selected' : ''}>2-glas (T4-16-4)</option>
                </select>
            </div>
            <div class="flex flex-col">
                <span class="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] mb-2 sm:mb-3 uppercase tracking-widest">${T.ventilation}</span>
                <select onchange="updateEntry(${e.id}, 'ventilation', this.value)" class="tech-input text-[11px] sm:text-[12px] md:text-[13px] bg-transparent font-bold py-2 sm:py-3">
                    <option value="utan" ${e.ventilation === 'utan' ? 'selected' : ''}>${T.vent_none}</option>
                    <option value="med" ${e.ventilation === 'med' ? 'selected' : ''}>${T.vent_with}</option>
                </select>
            </div>
        </div>
    </div>
    `;
};

const renderPendingEntry = (e: any, T: any) => {
    return `
    <div class="tech-card flex flex-col lg:flex-row items-center gap-6 sm:gap-12 p-4 sm:p-10 border-2 border-[#C5A059]">
        <!-- Product Info -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 w-full lg:w-1/3 text-center sm:text-left">
            <div class="w-28 h-28 sm:w-40 sm:h-40 bg-[var(--bg-subtle)] p-4 sm:p-6 rounded-3xl border border-[var(--border-color)] flex-shrink-0 flex items-center justify-center">
                <img src="${e.product.imageSrc}" class="w-full h-full object-contain">
            </div>
            <div class="w-full">
                <p class="text-[9px] sm:text-[10px] font-black text-[#C5A059] tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2">${e.profile.name}</p>
                <p class="text-xl sm:text-3xl font-black text-[var(--text-main)] uppercase tracking-tight leading-none">${e.product.name}</p>
            </div>
        </div>
        
        <!-- Configuration Inputs -->
        <div class="flex-grow grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-12 w-full">
            <div class="flex flex-col">
                <span class="text-[10px] sm:text-[11px] font-black text-[var(--text-muted)] mb-3 sm:mb-4 uppercase tracking-widest">${T.width}</span>
                <input type="number" oninput="updatePendingEntry('width', this.value)" value="${e.width}" class="tech-input text-lg sm:text-xl font-mono py-3 sm:py-5 px-6 sm:px-8">
            </div>
            <div class="flex flex-col">
                <span class="text-[10px] sm:text-[11px] font-black text-[var(--text-muted)] mb-3 sm:mb-4 uppercase tracking-widest">${T.height}</span>
                <input type="number" oninput="updatePendingEntry('height', this.value)" value="${e.height}" class="tech-input text-lg sm:text-xl font-mono py-3 sm:py-5 px-6 sm:px-8">
            </div>
            <div class="flex flex-col">
                <span class="text-[10px] sm:text-[11px] font-black text-[var(--text-muted)] mb-3 sm:mb-4 uppercase tracking-widest">${T.quantity}</span>
                <input type="number" oninput="updatePendingEntry('quantity', this.value)" value="${e.quantity}" class="tech-input text-lg sm:text-xl font-mono py-3 sm:py-5 px-6 sm:px-8">
            </div>
            <div class="flex flex-col">
                <span class="text-[10px] sm:text-[11px] font-black text-[var(--text-muted)] mb-3 sm:mb-4 uppercase tracking-widest">${T.glassType}</span>
                <select onchange="updatePendingEntry('glassType', this.value)" class="tech-input text-[13px] sm:text-[14px] bg-transparent font-bold py-3 sm:py-5 px-6 sm:px-8">
                    <option value="3-glas" ${e.glassType === '3-glas' ? 'selected' : ''}>3-glas (T4-16-4-16-4)</option>
                    <option value="2-glas" ${e.glassType === '2-glas' ? 'selected' : ''}>2-glas (T4-16-4)</option>
                </select>
            </div>
            <div class="flex flex-col">
                <span class="text-[10px] sm:text-[11px] font-black text-[var(--text-muted)] mb-3 sm:mb-4 uppercase tracking-widest">${T.ventilation}</span>
                <select onchange="updatePendingEntry('ventilation', this.value)" class="tech-input text-[13px] sm:text-[14px] bg-transparent font-bold py-3 sm:py-5 px-6 sm:px-8">
                    <option value="utan" ${e.ventilation === 'utan' ? 'selected' : ''}>${T.vent_none}</option>
                    <option value="med" ${e.ventilation === 'med' ? 'selected' : ''}>${T.vent_with}</option>
                </select>
            </div>
        </div>
    </div>
    `;
};

// --- HANDLERS ---
window.changeLang = (l) => { state.currentLanguage = l; renderApp(); };
window.setUIScale = (s) => { 
    state.uiScale = s; 
    document.documentElement.setAttribute('data-scale', s);
    renderApp(); 
};
window.toggleTheme = () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    renderApp();
};
window.selectProfile = (n) => {
    state.selectedProfile = PROFILES.find(p => p.name === n);
    state.selectedProduct = null;
    state.pendingEntry = null;
    renderApp();
    getAITip(state.selectedProfile);
    window.scrollToSection('step-02');
};
window.showInfo = (n, e) => {
    e.stopPropagation();
    state.infoProfile = PROFILES.find(p => p.name === n);
    renderApp();
};
window.closeInfo = () => {
    state.infoProfile = null;
    renderApp();
};
window.addProduct = (n) => {
    const T = TRANSLATIONS[state.currentLanguage];
    if (!state.selectedProfile) { alert(T.select_first); return; }
    const p = PRODUCTS.find(prod => prod.name === n);
    state.selectedProduct = p;
    state.pendingEntry = { 
        id: Date.now(), product: p, profile: state.selectedProfile,
        width: 1000, height: 1200, quantity: 1, glassType: '3-glas', ventilation: 'utan'
    };
    renderApp();
    window.scrollToSection('step-03');
};
window.updatePendingEntry = (field, val) => {
    if (state.pendingEntry) {
        state.pendingEntry[field] = (field === 'width' || field === 'height' || field === 'quantity') ? Number(val) : val;
        // No full render here to avoid losing focus on input, but we need it for select/other logic
        if (field === 'glassType' || field === 'ventilation') renderApp();
    }
};
window.confirmEntry = () => {
    if (state.pendingEntry) {
        state.formEntries.push({...state.pendingEntry});
        state.lastSelectedProfileName = state.selectedProfile?.name;
        state.selectedProfile = null;
        state.selectedProduct = null;
        state.pendingEntry = null;
        renderApp();
        window.scrollToSection('step-01');
    }
};
window.resetStep = (step) => {
    if (step === 1) {
        state.selectedProfile = null;
        state.selectedProduct = null;
        state.pendingEntry = null;
    } else if (step === 2) {
        state.selectedProduct = null;
        state.pendingEntry = null;
    }
    renderApp();
};
window.updateEntry = (id, field, val) => {
    const e = state.formEntries.find((ent: any) => ent.id === id);
    if (e) { e[field] = (field === 'width' || field === 'height' || field === 'quantity') ? Number(val) : val; renderApp(); }
};
window.removeEntry = (id) => { state.formEntries = state.formEntries.filter((e: any) => e.id !== id); renderApp(); };
window.toggleAI = () => { const b = document.getElementById('ai-bubble'); if (b) b.classList.toggle('hidden'); };
window.renderAIAssistant = () => { const c = document.getElementById('ai-content'); if (c) c.innerHTML = state.aiIsLoading ? 'PROCESSING...' : state.aiMessage; };

window.scrollToSection = (id, triggerAI = false) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update active class in sidebar
        document.querySelectorAll('.side-nav-icon').forEach(icon => icon.classList.remove('active'));
        const activeIcon = id === 'step-01' ? 0 : 1;
        document.querySelectorAll('.side-nav-icon')[activeIcon]?.classList.add('active');
        
        if (triggerAI) {
            const bubble = document.getElementById('ai-bubble');
            if (bubble) bubble.classList.remove('hidden');
        }
    }
};

window.handleFinalSubmit = async (ev) => {
    ev.preventDefault();
    const T = TRANSLATIONS[state.currentLanguage];
    state.submissionStatus = 'sending'; renderApp();
    const data = Object.fromEntries(new FormData(ev.target).entries());
    
    let productDetails = `CONFIGURATIONS:\n\n`;
    state.formEntries.forEach((e: any, i: number) => {
        productDetails += `ITEM ${i+1}:\n- Profile: ${e.profile.name}\n- Product: ${e.product.name}\n- Size: ${e.width}x${e.height}mm\n- Qty: ${e.quantity}\n- Glass: ${e.glassType}\n- Vent: ${e.ventilation}\n\n`;
    });

    const fullMessage = `CUSTOMER:\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone}\nAddress: ${data.address}\n\nNOTES:\n${data.message}\n\n${productDetails}`;

    try {
        await emailjs.send("service_3p2lhzg", "template_2822udm", { 
            to_email: "info@housefactors.se", 
            from_name: `${data.firstName} ${data.lastName}`, 
            reply_to: data.email, 
            selected_products: fullMessage 
        });
        state.submissionStatus = 'success'; state.formEntries = []; alert(T.success);
    } catch (err) { alert(T.error); state.submissionStatus = 'error'; } 
    finally { renderApp(); }
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof emailjs !== 'undefined') emailjs.init("nkABopy-OhY0pGK5w");
    document.documentElement.setAttribute('data-scale', state.uiScale);
    document.documentElement.setAttribute('data-theme', state.theme);
    renderApp();
});

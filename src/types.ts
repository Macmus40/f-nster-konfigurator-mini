export interface Profile {
    name: string;
    type: string;
    specs: { Uw: string; dB: string; chambers: string; depth: string };
    imageSrc: string;
    sectionImageSrc?: string;
    description: { sv: string; da: string; de: string; en: string };
}

export interface Product {
    name: string;
    category: string;
    imageSrc: string;
}

export interface Accessory {
    id: string;
    name: { sv: string; da: string; de: string; en: string };
    category: string;
    imageSrc?: string;
}

export interface FormEntry {
    id: number;
    product: Product;
    profile: Profile;
    width: number;
    height: number;
    quantity: number;
    glassPanes: string;
    glassType: string;
    ventilation: string;
    handle: string;
    colorOut: string;
    colorIn: string;
}

export interface AppState {
    currentLanguage: 'sv' | 'da' | 'de' | 'en';
    theme: 'dark' | 'light';
    selectedProfile: Profile | null;
    selectedProduct: Product | null;
    lastSelectedProfileName: string | null;
    pendingEntry: FormEntry | null;
    infoProfile: Profile | null;
    isAdminOpen: boolean;
    profiles: Profile[];
    products: Product[];
    accessories: Accessory[];
    profileProductMap: Record<string, string[]>;
    profileAccessoryMap: Record<string, string[]>;
    disabledProfiles: string[];
    enabledAccessories: string[];
    formEntries: FormEntry[];
    submissionStatus: 'idle' | 'sending' | 'success' | 'error';
    aiMessage: string;
    aiIsLoading: boolean;
    supabaseStatus: 'disconnected' | 'loading' | 'connected' | 'error';
    isAdminAuthenticated: boolean;
}

export interface Profile {
    name: string;
    type: string;
    specs: { Uw: string; dB: string; chambers: string; depth: string };
    imageSrc: string;
    description: string;
}

export interface Product {
    name: string;
    category: string;
    imageSrc: string;
}

export interface Accessory {
    id: string;
    name: string;
    category: string;
}

export interface FormEntry {
    id: number;
    product: Product;
    profile: Profile;
    width: number;
    height: number;
    quantity: number;
    glassType: string;
    ventilation: string;
    colorOut: string;
    colorIn: string;
}

export interface AppState {
    currentLanguage: 'sv' | 'pl' | 'en';
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
    disabledProfiles: string[];
    enabledAccessories: string[];
    formEntries: FormEntry[];
    submissionStatus: 'idle' | 'sending' | 'success' | 'error';
    aiMessage: string;
    aiIsLoading: boolean;
    supabaseStatus: 'disconnected' | 'loading' | 'connected' | 'error';
    isAdminAuthenticated: boolean;
}

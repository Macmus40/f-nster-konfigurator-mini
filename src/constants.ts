import { Profile, Product, Accessory } from './types';

export const ACCESSORIES: Accessory[] = [
    { id: 'vent_standard', name: 'Nawiewnik Standard', category: 'Ventilation' },
    { id: 'handle_gold', name: 'Klamka Złota', category: 'Handles' },
    { id: 'handle_silver', name: 'Klamka Srebrna', category: 'Handles' },
    { id: 'color_anthracite', name: 'Antracyt', category: 'Colors' },
    { id: 'color_oak', name: 'Złoty Dąb', category: 'Colors' },
];

export const PROFILES: Profile[] = [
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

export const PRODUCTS: Product[] = [
    { name: '1-luft-F', category: 'Okna', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/1-LUFT-F-m6tj689t.gif' },
    { name: '1-luft-K', category: 'Okna', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/animated-k-m7vm8hg4.gif' },
    { name: '1-luft-DH', category: 'Okna', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/1-LUFT-DH-m6tj64n6.gif' },
    { name: '1-luft-DKH', category: 'Okna', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/1-LUFT-DKH-m6tj671w.gif' },
    { name: 'Top Swing', category: 'Okna', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/animated-top-swing-m7vmqp7d.gif' },
    { name: '2-LUFT DKV/DKH', category: 'Okna', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/2-LUFT-DKV_DKH-m6tj6c89.gif' },
    { name: '3-LUFT DKV/F/DKH', category: 'Okna', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/3-LUFT-DKV_F_DKH-m6tj6e2o.gif' },
    { name: 'Dörr-1-LUFT DH-utat', category: 'Drzwi', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/dorr-1-LUFT-DHutat-m6tj6fyl.gif' },
    { name: 'Dörr-1-LUFT DKH-inat', category: 'Drzwi', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/dorr-1-LUFT-DKHinat-m6tj6i0z.gif' },
    { name: 'Dörr-2-LUFT utat', category: 'Drzwi', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/dorr2-LUFT-DVA_DHutat-m6tj6oym.gif' },
    { name: 'Dörr-2-LUFT inat', category: 'Drzwi', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/dorr-2-LUFT-DV_DKHinat-m6tj6ltx.gif' },
    { name: 'Skjutdörr-2-LUFT', category: 'Suwanki', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/skjutdorr2-LUFT-SKH_FF-m6tj793g.gif' },
    { name: 'Skjutdörr-HS-2-LUFT', category: 'Suwanki', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/skjutdorr-HS-2-LUFT-HSH_FF-m6tj6y12.gif' },
    { name: 'Skjutdörr-HS-4-LUFT', category: 'Suwanki', imageSrc: 'https://www.fonsterfaktor.se/lib/uid2kb/skjutdorr-HS-4-LUFT-FF_HSVA_HSH_FF-m6tj73ym.gif' },
];

export const TRANSLATIONS: Record<string, any> = {
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
        btn_confirm: 'LÄGG TILL I PROJEKTLISTA', btn_change: 'ÄNDRA', step_done: 'VALD',
        last_used: 'SENAST VALD',
        cat_okna: 'Fönster', cat_drzwi: 'Dörrar', cat_suwanki: 'Skjutdörrar',
        colorOut: 'FÄRG UTSIDA', colorIn: 'FÄRG INSIDA'
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
        btn_confirm: 'DODAJ DO LISTY PROJEKTU', btn_change: 'ZMIEŃ', step_done: 'WYBRANO',
        last_used: 'OSTATNIO WYBRANY',
        admin_title: 'ADMIN: PRZYPISANIE PRODUKTÓW', admin_desc: 'Wybierz, które produkty są dostępne dla każdego profilu.',
        admin_profiles: 'ZARZĄDZANIE PROFILAMI', admin_acc: 'ZARZĄDZANIE DODATKAMI',
        admin_status: 'STATUS', admin_active: 'AKTYWNY', admin_disabled: 'WYŁĄCZONY',
        cat_okna: 'Okna', cat_drzwi: 'Drzwi', cat_suwanki: 'Suwanki',
        colorOut: 'KOLOR ZEWNĄTRZ', colorIn: 'KOLOR WEWNĄTRZ',
        admin_add_profile: 'DODAJ PROFIL', admin_add_product: 'DODAJ PRODUKT', admin_add_acc: 'DODAJ DODATEK',
        admin_name: 'NAZWA', admin_type: 'TYP', admin_image: 'URL OBRAZU', admin_desc_field: 'OPIS',
        admin_import_csv: 'IMPORTUJ Z CSV', admin_import_desc: 'Wgraj plik CSV, aby masowo dodać dane.',
        admin_import_btn: 'WYBIERZ PLIK', admin_download_template: 'POBIERZ SZABLON',
        admin_pass_title: 'DOSTĘP ZABLOKOWANY', admin_pass_desc: 'Wprowadź hasło administratora, aby kontynuować.',
        admin_pass_placeholder: 'HASŁO', admin_pass_btn: 'ZALOGUJ', admin_pass_error: 'Błędne hasło!'
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
        btn_confirm: 'ADD TO PROJECT LIST', btn_change: 'CHANGE', step_done: 'SELECTED',
        last_used: 'LAST SELECTED',
        admin_title: 'ADMIN: PRODUCT ASSIGNMENT', admin_desc: 'Select which products are available for each profile.',
        admin_profiles: 'PROFILE MANAGEMENT', admin_acc: 'ACCESSORIES MANAGEMENT',
        admin_status: 'STATUS', admin_active: 'ACTIVE', admin_disabled: 'DISABLED',
        cat_okna: 'Windows', cat_drzwi: 'Doors', cat_suwanki: 'Sliding Doors',
        colorOut: 'COLOR OUTSIDE', colorIn: 'COLOR INSIDE',
        admin_add_profile: 'ADD PROFILE', admin_add_product: 'ADD PRODUCT', admin_add_acc: 'ADD ACCESSORY',
        admin_name: 'NAME', admin_type: 'TYPE', admin_image: 'IMAGE URL', admin_desc_field: 'DESCRIPTION',
        admin_import_csv: 'IMPORT FROM CSV', admin_import_desc: 'Upload a CSV file to bulk add data.',
        admin_import_btn: 'CHOOSE FILE', admin_download_template: 'DOWNLOAD TEMPLATE',
        admin_pass_title: 'ACCESS RESTRICTED', admin_pass_desc: 'Enter admin password to continue.',
        admin_pass_placeholder: 'PASSWORD', admin_pass_btn: 'LOGIN', admin_pass_error: 'Incorrect password!'
    }
};

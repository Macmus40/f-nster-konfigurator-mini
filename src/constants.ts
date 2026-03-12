import { Profile, Product, Accessory } from './types';

export const ACCESSORIES: Accessory[] = [
    { id: 'vent_none', name: { sv: 'Utan ventilation', da: 'Uden ventilation', de: 'Ohne Belüftung', en: 'Without ventilation' }, category: 'Ventilation', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/ventilation/none.png' },
    { id: 'vent_standard', name: { sv: 'Areco AMO', da: 'Areco AMO', de: 'Areco AMO', en: 'Areco AMO' }, category: 'Ventilation', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/ventilation/Areco%20AMO.png' },
    { id: 'vent_hygro', name: { sv: 'Aereco EMM', da: 'Aereco EMM', de: 'Aereco EMM', en: 'Aereco EMM' }, category: 'Ventilation', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/ventilation/Aereco%20EMM.png' },
    { id: 'vent_press', name: { sv: 'Ventair Simpress', da: 'Ventair Simpress', de: 'Ventair Simpress', en: 'Ventair Simpress' }, category: 'Ventilation', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/ventilation/Ventair%20Simpress.png' },
    
    { id: 'handle_white', name: { sv: 'Vit (Standard)', da: 'Hvid (Standard)', de: 'Weiß (Standard)', en: 'White (Standard)' }, category: 'Handles', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/handtag/vit.png' },
    { id: 'handle_silver', name: { sv: 'Silver', da: 'Sølv', de: 'Silber', en: 'Silver' }, category: 'Handles', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/handtag/silver.png' },
    { id: 'handle_black', name: { sv: 'Svart', da: 'Sort', de: 'Schwarz', en: 'Black' }, category: 'Handles', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/handtag/svart.png' },
    { id: 'handle_button', name: { sv: 'Vit med knapp', da: 'Hvid med knap', de: 'Weiß mit Knopf', en: 'White with button' }, category: 'Handles', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/handtag/med%20knapp%20vit.png' },
    { id: 'handle_key', name: { sv: 'Med nyckel', da: 'Med nøgle', de: 'Mit Schlüssel', en: 'With key' }, category: 'Handles', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/handtag/med%20nyckel.png' },
    { id: 'handle_child', name: { sv: 'Barnsäker', da: 'Børnesikret', de: 'Kindersicher', en: 'Child-safe' }, category: 'Handles', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/handtag/BARNS%C3%84KERT.png' },
    
    { id: 'color_white', name: { sv: 'Vit (Standard)', da: 'Hvid (Standard)', de: 'Weiß (Standard)', en: 'White (Standard)' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Vit.png' },
    { id: 'color_anthracite', name: { sv: 'Antracit', da: 'Antracit', de: 'Anthrazit', en: 'Anthracite' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Anthracite.png' },
    { id: 'color_oak', name: { sv: 'Guld ek', da: 'Gylden eg', de: 'Goldene Eiche', en: 'Golden Oak' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Ek.png' },
    { id: 'color_walnut', name: { sv: 'Valnöt', da: 'Valnød', de: 'Walnuss', en: 'Walnut' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Turner%20oak.png' },
    { id: 'color_winchester', name: { sv: 'Winchester', da: 'Winchester', de: 'Winchester', en: 'Winchester' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Winchester.png' },
    { id: 'color_grey', name: { sv: 'Grå', da: 'Grå', de: 'Grau', en: 'Grey' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Grey%23.png' },
    { id: 'color_jet_black', name: { sv: 'Jet Svart', da: 'Jet Sort', de: 'Jet Schwarz', en: 'Jet Black' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Jet%20Black.png' },
    { id: 'color_iron_grey', name: { sv: 'Järngrå', da: 'Jern Grå', de: 'Eisengrau', en: 'Iron Grey' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Iron_grey_hash.png' },
    { id: 'color_blue', name: { sv: 'Blå', da: 'Blå', de: 'Blau', en: 'Blue' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Blue_hash.png' },
    { id: 'color_green', name: { sv: 'Grön', da: 'Grøn', de: 'Grün', en: 'Green' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Green_hash.png' },
    { id: 'color_red', name: { sv: 'Röd', da: 'Rød', de: 'Rot', en: 'Red' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Rod.png' },
    { id: 'color_aluminium', name: { sv: 'Aluminium', da: 'Aluminium', de: 'Aluminium', en: 'Aluminium' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/aluminium_hash.png' },
    { id: 'color_morkgron', name: { sv: 'Mörkgrön', da: 'Mørkegrøn', de: 'Dunkelgrün', en: 'Dark Green' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/morkgron.png' },
    { id: 'color_mossgron', name: { sv: 'Mossgrön', da: 'Mosgrøn', de: 'Moosgrün', en: 'Moss Green' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/mossgron.png' },
    { id: 'color_antrazyt', name: { sv: 'Antracit 2', da: 'Antracit 2', de: 'Anthrazit 2', en: 'Anthracite 2' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Antrazyt.png' },
    { id: 'color_muse_grey', name: { sv: 'Muse Grå', da: 'Muse Grå', de: 'Muse Grau', en: 'Muse Grey' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/Muse_Grey_hash.png' },
    { id: 'color_diamant', name: { sv: 'Diamant', da: 'Diamant', de: 'Diamant', en: 'Diamond' }, category: 'Colors', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/farg/diamant.png' },
    
    { id: 'glass_2', name: { sv: '2-Sidor', da: '2-lags', de: '2-fach', en: '2-pane' }, category: 'Glass', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/glass/glass_2.png' },
    { id: 'glass_3', name: { sv: '3-Sidor', da: '3-lags', de: '3-fach', en: '3-pane' }, category: 'Glass', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/glass/glass_3.png' },
    { id: 'glass_4', name: { sv: '4-Sidor (Premium)', da: '4-lags (Premium)', de: '4-fach (Premium)', en: '4-pane (Premium)' }, category: 'Glass', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/glass/glass_4.png' },
    { id: 'glass_tempered', name: { sv: 'Härdat', da: 'Hærdet', de: 'Gehärtet', en: 'Tempered' }, category: 'Glass', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/glass/glass_tempered.png' },
    { id: 'glass_security', name: { sv: 'Säkerhetsglas', da: 'Sikkerhedsglas', de: 'Sicherheitsglas', en: 'Security glass' }, category: 'Glass', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/glass/glass_security.png' },
    { id: 'glass_frosted', name: { sv: 'Frostat', da: 'Frostet', de: 'Matt', en: 'Frosted' }, category: 'Glass', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/glass/glass_frosted.png' },
    { id: 'glass_acoustic', name: { sv: 'Ljudisolerat', da: 'Lydisoleret', de: 'Schallschutz', en: 'Acoustic' }, category: 'Glass', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/glass/glass_acoustic.png' },
    { id: 'glass_solar', name: { sv: 'Solskydd', da: 'Solbeskyttelse', de: 'Sonnenschutz', en: 'Solar control' }, category: 'Glass', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/glass/glass_solar.png' },
];

// UWAGA: Wszystkie obrazy produktów można teraz wrzucać do folderu /public/images/
// z podziałem na podkatalogi: /fonster, /dorrar, /terrassystem
// i odwoływać się do nich poprzez ścieżkę: '/images/[KATEGORIA]/nazwa_pliku.jpg'
// Przykład: imageSrc: '/images/fonster/okno-1.png'

export const PROFILES: Profile[] = [
    // PVC
    { 
        name: 'Iglo5', 
        type: 'PVC', 
        specs: { Uw: '0.89', dB: '32-44', chambers: '5', depth: '70mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%205.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%205_sektion.png',
        description: { 
            sv: 'Detta 5-kammarsystem kännetecknas av väldigt goda värmeisoleringsparametrar. En snövit profil i A-klass, tillverkad av enbart primärmaterial, vilket garanterar hógsta kvalitet. Lämpar sig för både varmt och kallt klimat.',
            da: 'Dette 5-kammersystem er kendetegnet ved meget gode varmeisoleringsparametre. En snehvid profil i A-klasse, fremstillet udelukkende af primære materialer, hvilket garanterer højeste kvalitet. Velegnet til både varmt og koldt klima.',
            de: 'Dieses 5-Kammer-System zeichnet sich durch sehr gute Wärmedämmparameter aus. Ein schneeweißes Profil der A-Klasse, hergestellt ausschließlich aus Primärmaterialien, was höchste Qualität garantiert. Geeignet für warmes und kaltes Klima.',
            en: 'This 5-chamber system is characterized by very good thermal insulation parameters. A snow-white A-class profile, made exclusively from primary materials, which guarantees the highest quality. Suitable for both hot and cold climates.'
        }
    },
    { 
        name: 'Iglo5 Classic', 
        type: 'PVC', 
        specs: { Uw: '0.89', dB: '32-44', chambers: '5', depth: '70mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%205%20Classic.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%205%20Classic_sektion.png',
        description: { 
            sv: 'Samma höga kvalitet som Iglo 5 men med en klassisk, rak profil. 5-kammarsystem med utmärkta isoleringsegenskaper och hållbarhet.',
            da: 'Samme høje kvalitet som Iglo 5, men med en klassisk, lige profil. 5-kammersystem med fremragende isoleringsegenskaber og holdbarhed.',
            de: 'Gleiche hohe Qualität wie Iglo 5, jedoch mit einem klassischen, geraden Profil. 5-Kammer-System mit hervorragenden Isoliereigenschaften und Langlebigkeit.',
            en: 'The same high quality as Iglo 5 but with a classic, straight profile. 5-chamber system with excellent insulation properties and durability.'
        }
    },
    { 
        name: 'Iglo Energy', 
        type: 'PVC', 
        specs: { Uw: '0.60', dB: '35-46', chambers: '7', depth: '82mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%20Energy.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%20Energy_sektion.png',
        description: { 
            sv: 'Innovativt 7-kammarsystem med central tätning av skummat EPDM. Världens första system med denna lösning, vilket garanterar de bästa parametrarna avseende energieffektivitet.',
            da: 'Innovativt 7-kammersystem med central tætning af skummet EPDM. Verdens første system med denne løsning, hvilket garanterer de bedste parametre for energieffektivitet.',
            de: 'Innovatives 7-Kammer-System mit zentraler Dichtung aus geschäumtem EPDM. Das weltweit erste System mit dieser Lösung, das die besten Parameter für Energieeffizienz garantiert.',
            en: 'Innovative 7-chamber system with central sealing made of foamed EPDM. The world\'s first system with this solution, which guarantees the best parameters regarding energy efficiency.'
        }
    },
    { 
        name: 'Iglo Light', 
        type: 'PVC', 
        specs: { Uw: '0.80', dB: '34-45', chambers: '5', depth: '70mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%20Light.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%20Light_sektion.png',
        description: { 
            sv: 'Smala profiler for maximalt ljusinsläpp. 5-kammarsystem med stilren design och smäckra ramar som ger upp till 10% mer ljus än standardfönster.',
            da: 'Slanke profiler for maksimalt lysindfald. 5-kammersystem med stilrent design og slanke rammer, der giver op til 10% mere lys end standardvinduer.',
            de: 'Schlanke Profile für maximalen Lichteinfall. 5-Kammer-System mit stilvollem Design und schlanken Rahmen, die bis zu 10% mehr Licht bieten als Standardfenster.',
            en: 'Slim profiles for maximum light intake. 5-chamber system with stylish design and slender frames that provide up to 10% more light than standard windows.'
        }
    },
    { 
        name: 'Iglo Premier', 
        type: 'PVC', 
        specs: { Uw: '0.79', dB: '34-44', chambers: '7', depth: '82mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/Iglo%20Premier.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/Iglo%20Premier_sektion.png',
        description: { 
            sv: 'Ett modernt 5-kammarsystem som kombinerar estetik med funktionalitet. Ger god isolering och stabilitet för krävande miljöer.',
            da: 'Et moderne 5-kammersystem, der kombinerer æstetik med funktionalitet. Giver god isolering og stabilitet til krævende miljøer.',
            de: 'Ein modernes 5-Kammer-System, das Ästhetik mit Funktionalität verbindet. Bietet gute Isolierung und Stabilität für anspruchsvolle Umgebungen.',
            en: 'A modern 5-chamber system that combines aesthetics with functionality. Provides good insulation and stability for demanding environments.'
        }
    },
    { 
        name: 'Iglo Edge', 
        type: 'PVC', 
        specs: { Uw: '0.66', dB: '36-47', chambers: '7', depth: '82mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%20EDGE.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%20EDGE_sektion.png',
        description: { 
            sv: 'Våra nya, mest teknologiskt avancerade fönster kännetecknas av en utmärkt värmeisoleringsparameter: Uw = 0,66 W/(m2K)* och en modern, kantad form.',
            da: 'Vores nye, mest teknologisk avancerede vinduer er kendetegnet ved en fremragende varmeisoleringsparameter: Uw = 0,66 W/(m2K)* og en moderne, kantet form.',
            de: 'Unsere neuen, technologisch fortschrittlichsten Fenster zeichnen sich durch einen hervorragenden Wärmedämmparameter aus: Uw = 0,66 W/(m2K)* und eine moderne, kantige Form.',
            en: 'Our new, most technologically advanced windows are characterized by an excellent thermal insulation parameter: Uw = 0.66 W/(m2K)* and a modern, angular shape.'
        }
    },
    { 
        name: 'Iglo Energy Alucover', 
        type: 'PVC', 
        specs: { Uw: '0.60', dB: '35-46', chambers: '7', depth: '82mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%20ENERGY%20ALUCOVER.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%20ENERGY%20ALUCOVER_sektion.png',
        description: { 
            sv: 'En kombination av fantastiska värmeisoleringsparametrar i Iglo Energy-systemet och modern aluminiumdesign.',
            da: 'En kombination af fantastiske varmeisoleringsparametre i Iglo Energy-systemet og moderne aluminiumdesign.',
            de: 'Eine Kombination aus fantastischen Wärmedämmparametern des Iglo Energy-Systems und modernem Aluminiumdesign.',
            en: 'A combination of fantastic thermal insulation parameters in the Iglo Energy system and modern aluminium design.'
        }
    },
    { 
        name: 'Iglo EXT', 
        type: 'PVC', 
        specs: { Uw: '0.89', dB: '34', chambers: '5', depth: '70mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/Iglo%20EXT.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/Iglo%20EXT_sektion.png',
        description: { 
            sv: 'Dessa utåtgående balkongfönster och dörrar kännetecknas av modern design och fantastiska värmeisoleringsparametrar.',
            da: 'Disse udadgående altanvinduer og døre er kendetegnet ved moderne design og fantastiske varmeisoleringsparametre.',
            de: 'Diese nach außen öffnenden Balkonfenster und Türen zeichnen sich durch modernes Design und fantastische Wärmedämmparameter aus.',
            en: 'These outward-opening balcony windows and doors are characterized by modern design and fantastic thermal insulation parameters.'
        }
    },
    { 
        name: 'Ideal 7000 NL', 
        type: 'PVC', 
        specs: { Uw: '0.82', dB: '36', chambers: '5', depth: '120mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/ideal_7000.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/ideal_7000_sektion.png',
        description: { 
            sv: 'Systemet Ideal 7000 NL kännetecnas av en modern design och utmärkta värmeisoleringsparametrar, speciellt anpassat för den holländska marknaden.',
            da: 'Systemet Ideal 7000 NL er kendetegnet ved et moderne design og fremragende varmeisoleringsparametre, specielt tilpasset det hollandske marked.',
            de: 'Das System Ideal 7000 NL zeichnet sich durch ein modernes Design und hervorragende Wärmedämmparameter aus, speziell angepasst an den niederländischen Markt.',
            en: 'The Ideal 7000 NL system is characterized by a modern design and excellent thermal insulation parameters, specially adapted for the Dutch market.'
        }
    },
    { 
        name: 'Iglo-HS', 
        type: 'PVC', 
        specs: { Uw: '0.71', dB: '36-44', chambers: '7', depth: '194mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO-HS.jpg',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/iglo-hs_sektion.png',
        description: { 
            sv: 'En perfekt lösning för stora moderiktiga glasterrasser och balkonger som ger interiören en unik karaktär.',
            da: 'En perfekt løsning til store, moderne glasterrasser og altaner, der giver interiøret en unik karakter.',
            de: 'Eine perfekte Lösung für große, moderne Glasterrassen und Balkone, die dem Interieur einen einzigartigen Charakter verleiht.',
            en: 'A perfect solution for large, fashionable glass terraces and balconies that gives the interior a unique character.'
        }
    },
    { 
        name: 'Iglo Edge Slide', 
        type: 'PVC', 
        specs: { Uw: '0.65', dB: '36-44', chambers: '6', depth: '163mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%20EDGE%20SLIDE.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/IGLO%20EDGE%20SLIDE_sektion.png',
        description: { 
            sv: 'Nytt terrassystem kännetecknas av en hög värmeisolering med ett värde na Uw = 0,65 W/(m2K)* samt en modern, kantad profilform.',
            da: 'Nyt terrassesystem er kendetegnet ved en høj varmeisolering med en værdi på Uw = 0,65 W/(m2K)* samt en moderne, kantet profilform.',
            de: 'Neues Terrassensystem, das sich durch eine hohe Wärmedämmung mit einem Wert von Uw = 0,65 W/(m2K)* sowie eine moderne, kantige Profilform auszeichnet.',
            en: 'New terrace system characterized by high thermal insulation with a value of Uw = 0.65 W/(m2K)* and a modern, angular profile shape.'
        }
    },
    // ALU
    { 
        name: 'Alu-MB70', 
        type: 'ALU', 
        specs: { Uw: '0.90-1.3', dB: '35-45', chambers: 'Alu', depth: '70mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/MB-70.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/MB-70_sektion.png',
        description: { 
            sv: 'Robust aluminiumsystem för alla väderförhållanden. Pulverlackerat för högsta kvalitet, lämpar sig för både privata hem och offentliga byggnader.',
            da: 'Robust aluminiumsystem til alle vejrforhold. Pulverlakeret for højeste kvalitet, velegnet til både private hjem og offentlige bygninger.',
            de: 'Robustes Aluminiumsystem für alle Wetterbedingungen. Pulverbeschichtet für höchste Qualität, geeignet für sowohl Privathäuser als auch öffentliche Gebäude.',
            en: 'Robust aluminium system for all weather conditions. Powder-coated for highest quality, suitable for both private homes and public buildings.'
        }
    },
    { 
        name: 'MB-86N SI', 
        type: 'ALU', 
        specs: { Uw: '0.76', dB: '36-45', chambers: 'Alu', depth: '77mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/MB-86N%20SI.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/MB-86N%20SI_sektion.png',
        description: { 
            sv: 'Aluminiumfönster MB-86N SI kännetecknas av utmärkta värmeisoleringsparametrar i kombination med modern design i aluminium.',
            da: 'Aluminiumsvinduer MB-86N SI er kendetegnet ved fremragende varmeisoleringsparametre i kombination med moderne aluminiumdesign.',
            de: 'Aluminiumfenster MB-86N SI zeichnen sich durch hervorragende Wärmedämmparameter in Kombination mit modernem Aluminiumdesign aus.',
            en: 'Aluminium windows MB-86N SI are characterized by excellent thermal insulation parameters combined with modern aluminium design.'
        }
    },
    { 
        name: 'MB-86 Fold Line HD', 
        type: 'ALU', 
        specs: { Uw: '1.1', dB: '36-45', chambers: 'Alu', depth: '86mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/MB-86%20Fold%20Line.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/MB-86%20Fold%20Line_sektion.png',
        description: { 
            sv: 'Ett unikt vikdörrsystem som lämpar sig utmärkt för utrymmen med stora glaspartier som t.ex. balkonger och terrasser.',
            da: 'Et unikt foldedørsystem, der er yderst velegnet til rum med store glaspartier, såsom altaner og terrasser.',
            de: 'Ein einzigartiges Falttürsystem, das sich hervorragend für Räume mit großen Glasflächen wie Balkone und Terrassen eignet.',
            en: 'A unique folding door system that is excellently suited for spaces with large glass areas such as balconies and terraces.'
        }
    },
    // TRÄ
    { 
        name: 'Softline', 
        type: 'TRÄ', 
        specs: { Uw: '0.80-1.2', dB: '32-42', chambers: 'Wood', depth: '68-88mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/SOFTLINE%20-%2068.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/SOFTLINE%20-%2068_sektion.png',
        description: { 
            sv: 'Träfönster i furu eller meranti med klassisk elegans. Rundade profiler och hög motståndskraft mot väder tack vare aluminiumdränering.',
            da: 'Trævinduer i fyr eller meranti med klassisk elegance. Afrundede profiler og høj modstandsdygtighed over for vejret takket være aluminiumdræning.',
            de: 'Holzfenster aus Kiefer oder Meranti mit klassischer Eleganz. Abgerundete Profile und hohe Wetterbeständigkeit dank Aluminiumentwässerung.',
            en: 'Wooden windows in pine or meranti with classic elegance. Rounded profiles and high resistance to weather thanks to aluminium drainage.'
        }
    },
    // TRÄ/ALU
    { 
        name: 'Duoline', 
        type: 'TRÄ/ALU', 
        specs: { Uw: '0.79-1.1', dB: '33-43', chambers: 'Hyb', depth: '68-88mm' }, 
        imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/DUOLINE%20-%2068.png',
        sectionImageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/PROFILE/DUOLINE%20-%2068_sektion.png',
        description: { 
            sv: 'Hybridfönster som förenar träets värme med aluminiumets hållbarhet. Perfekt för nordiskt klimat med minimalt underhållsbehov.',
            da: 'Hybridvinduer, der forener træets varme med aluminiums holdbarhed. Perfekt til det nordiske klima med minimalt vedligeholdelsesbehov.',
            de: 'Hybridfenster, die die Wärme von Holz mit der Langlebigkeit von Aluminium verbinden. Perfekt für das nordische Klima mit minimalem Wartungsaufwand.',
            en: 'Hybrid windows that combine the warmth of wood with the durability of aluminium. Perfect for the Nordic climate with minimal maintenance needs.'
        }
    }
];

export const PRODUCTS: Product[] = [
    // Okna (fonster)
    { name: '1-LUFT(BH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_1-LUFT(BH).png' },
    { name: '1-LUFT(DH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_1-LUFT(DH).png' },
    { name: '1-LUFT(DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_1-LUFT(DKH).png' },
    { name: '1-LUFT(DKV)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_1-LUFT(DKV).png' },
    { name: '1-LUFT(DV)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_1-LUFT(DV).png' },
    { name: '1-LUFT(F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_1-LUFT(F).png' },
    { name: '1-LUFT(FF)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_1-LUFT(FF).png' },
    { name: '2-LUFT(DKV+DH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_2-LUFT(DKV+DH).png' },
    { name: '2-LUFT(DKV+DH) Sł.Ruchomy', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_2-LUFT(DKV+DH)_flytb_mit.png' },
    { name: '2-LUFT(DKV+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_2-LUFT(DKV+DKH).png' },
    { name: '2-LUFT(DKV+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_2-LUFT(DKV+F).png' },
    { name: '2-LUFT(DV+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_2-LUFT(DV+DKH).png' },
    { name: '2-LUFT(DV+DKH) Sł.Ruchomy', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_2-LUFT(DV+DKH)_flytb_mit.png' },
    { name: '2-LUFT(F+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_2-LUFT(F+DKH).png' },
    { name: '2-LUFT(F+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_2-LUFT(F+F).png' },
    { name: '3-LUFT(DKV+DKV+DKV)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_3-LUFT(DKV+DKV+DKV).png' },
    { name: '3-LUFT(DKV+F+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_3-LUFT(DKV+F+DKH).png' },
    { name: '3-LUFT(F+DKV+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_3-LUFT(F+DKV+F).png' },
    { name: '3-LUFT(F+F+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_3-LUFT(F+F+F).png' },
    { name: 'ALU 1-LUFT(BH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_1-LUFT(BH).png' },
    { name: 'ALU 1-LUFT(DH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_1-LUFT(DH).png' },
    { name: 'ALU 1-LUFT(DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_1-LUFT(DKH).png' },
    { name: 'ALU 1-LUFT(DKV)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_1-LUFT(DKV).png' },
    { name: 'ALU 1-LUFT(DV)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_1-LUFT(DV).png' },
    { name: 'ALU 1-LUFT(F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_1-LUFT(F).png' },
    { name: 'ALU 1-LUFT(FF)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_1-LUFT(FF).png' },
    { name: 'ALU 2-LUFT(DKV+DH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_2-LUFT(DKV+DH).png' },
    { name: 'ALU 2-LUFT(DKV+DH) Sł.Ruchomy', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_2-LUFT(DKV+DH)_flytb_mit.png' },
    { name: 'ALU 2-LUFT(DKV+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_2-LUFT(DKV+DKH).png' },
    { name: 'ALU 2-LUFT(DKV+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_2-LUFT(DKV+F).png' },
    { name: 'ALU 2-LUFT(DV+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_2-LUFT(DV+DKH).png' },
    { name: 'ALU 2-LUFT(DV+DKH) Sł.Ruchomy', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_2-LUFT(DV+DKH)_flytb_mit.png' },
    { name: 'ALU 2-LUFT(F+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_2-LUFT(F+DKH).png' },
    { name: 'ALU 2-LUFT(F+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_2-LUFT(F+F).png' },
    { name: 'ALU 3-LUFT(DKV+DKV+DKV)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_3-LUFT(DKV+DKV+DKV).png' },
    { name: 'ALU 3-LUFT(DKV+F+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_3-LUFT(DKV+F+DKH).png' },
    { name: 'ALU 3-LUFT(F+DKV+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_3-LUFT(F+DKV+F).png' },
    { name: 'ALU 3-LUFT(F+F+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_ALU_3-LUFT(F+F+F).png' },
    { name: 'TRÄ 1-LUFT(DH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_1-LUFT(DH).png' },
    { name: 'TRÄ 1-LUFT(DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_1-LUFT(DKH).png' },
    { name: 'TRÄ 1-LUFT(DKV)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_1-LUFT(DKV).png' },
    { name: 'TRÄ 1-LUFT(DV)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_1-LUFT(DV).png' },
    { name: 'TRÄ 1-LUFT(F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_1-LUFT(F).png' },
    { name: 'TRÄ 1-LUFT(FF)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_1-LUFT(FF).png' },
    { name: 'TRÄ 1-LUFT(K)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_1-LUFT(K).png' },
    { name: 'TRÄ 2-LUFT(DKV+DH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_2-LUFT(DKV+DH).png' },
    { name: 'TRÄ 2-LUFT(DKV+DH) Sł.Ruchomy', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_2-LUFT(DKV+DH)_flytb_mit.png' },
    { name: 'TRÄ 2-LUFT(DKV+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_2-LUFT(DKV+DKH).png' },
    { name: 'TRÄ 2-LUFT(DKV+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_2-LUFT(DKV+F).png' },
    { name: 'TRÄ 2-LUFT(DV+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_2-LUFT(DV+DKH).png' },
    { name: 'TRÄ 2-LUFT(DV+DKH) Sł.Ruchomy', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_2-LUFT(DV+DKH)_flytb_mit.png' },
    { name: 'TRÄ 2-LUFT(F+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_2-LUFT(F+DKH).png' },
    { name: 'TRÄ 2-LUFT(F+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_2-LUFT(F+F).png' },
    { name: 'TRÄ 3-LUFT(DKV+DKV+DKV)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_3-LUFT(DKV+DKV+DKV).png' },
    { name: 'TRÄ 3-LUFT(DKV+F+DKH)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_3-LUFT(DKV+F+DKH).png' },
    { name: 'TRÄ 3-LUFT(F+DKV+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_3-LUFT(F+DKV+F).png' },
    { name: 'TRÄ 3-LUFT(F+F+F)', category: 'Okna', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/fonster/fonster_TRA_3-LUFT(F+F+F).png' },



    // Drzwi (dorrar)
    { name: 'ALU Balkong inåtgående 1-LUFT(DH)', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/ALU_Balkong_inatgaende_1-LUFT(DH).png' },
    { name: 'ALU Balkong inåtgående 1-LUFT(DKH)', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/ALU_Balkong_inatgaende_1-LUFT(DKH).png' },
    { name: 'ALU Balkong inåtgående 1-LUFT(DKV)', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/ALU_Balkong_inatgaende_1-LUFT(DKV).png' },
    { name: 'ALU Balkong inåtgående 1-LUFT(DV)', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/ALU_Balkong_inatgaende_1-LUFT(DV).png' },
    { name: 'Balkong inåtgående 1-LUFT(DH)', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/Balkong_inatgaende_1-LUFT(DH).png' },
    { name: 'Balkong inåtgående 1-LUFT(DKH)', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/Balkong_inatgaende_1-LUFT(DKH).png' },
    { name: 'Balkong inåtgående 1-LUFT(DKV)', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/Balkong_inatgaende_1-LUFT(DKV).png' },
    { name: 'Balkong inåtgående 1-LUFT(DV)', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/Balkong_inatgaende_1-LUFT(DV).png' },
    { name: 'Balkong inåtgående TRÄ 1-LUFT(DH)', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/Balkong_inatgaende_TRA_1-LUFT(DH).png' },
    { name: 'Balkong inåtgående TRÄ 1-LUFT(DV)', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/Balkong_inatgaende_TRA_1-LUFT(DV).png' },
    { name: 'Dörr utåt 1-luft master DH', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/Dorr_utat_1-luft_master_DH.png' },
    { name: 'Dörr utåt 1-luft master DV', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/Dorr_utat_1-luft_master_DV.png' },
    { name: 'Dörr utåt 2-luft master H', category: 'Drzwi', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/dorrar/Dorr_utat_2-luft_master_H.png' },



    // Terrassystem
    { name: 'Lyftglidparti HS.A.L', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Lyftglidparti_HS.A.L.png' },
    { name: 'Lyftglidparti HS.A.P', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Lyftglidparti_HS.A.P.png' },
    { name: 'Lyftglidparti HS.G2.L', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Lyftglidparti_HS.G2.L.png' },
    { name: 'Lyftglidparti HS.G2.P', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Lyftglidparti_HS.G2.P.png' },
    { name: 'Vik dörr F L FS202 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS202_interior.png' },
    { name: 'Vik dörr F L FS220 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS220_interior.png' },
    { name: 'Vik dörr F L FS303 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS303_interior.png' },
    { name: 'Vik dörr F L FS312 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS312_interior.png' },
    { name: 'Vik dörr F L FS321 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS321_interior.png' },
    { name: 'Vik dörr F L FS330 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS330_interior.png' },
    { name: 'Vik dörr F L FS404 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS404_interior.png' },
    { name: 'Vik dörr F L FS413 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS413_interior.png' },
    { name: 'Vik dörr F L FS431 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS431_interior.png' },
    { name: 'Vik dörr F L FS440 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS440_interior.png' },
    { name: 'Vik dörr F L FS505 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS505_interior.png' },
    { name: 'Vik dörr F L FS514 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS514_interior.png' },
    { name: 'Vik dörr F L FS541 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS541_interior.png' },
    { name: 'Vik dörr F L FS550 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS550_interior.png' },
    { name: 'Vik dörr F L FS606 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS606_interior.png' },
    { name: 'Vik dörr F L FS615 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS615_interior.png' },
    { name: 'Vik dörr F L FS651 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS651_interior.png' },
    { name: 'Vik dörr F L FS660 interior', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/Vik_dorr_F_L_FS660_interior.png' },
    { name: 'skjut dörr F+UP', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_F+UP.png' },
    { name: 'skjut dörr FF+UP', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_FF+UP.png' },
    { name: 'skjut dörr I7ED SL A', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_I7ED_SL_A.png' },
    { name: 'skjut dörr I7ED SL C', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_I7ED_SL_C.png' },
    { name: 'skjut dörr I7ED SL C L', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_I7ED_SL_C_L.png' },
    { name: 'skjut dörr I7ED SL L', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_I7ED_SL_L.png' },
    { name: 'skjut dörr UP+F', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_UP+F.png' },
    { name: 'skjut dörr UP+FF', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_UP+FF.png' },
    { name: 'skjut dörr UP+UP.SR(1.2)', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_UP+UP.SR(1.2).png' },
    { name: 'skjut dörr UP+UP.SR(2.1)', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_UP+UP.SR(2.1).png' },
    { name: 'skjut dörr UP-L', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_I7ED_SL_L.png' },
    { name: 'skjut dörr UP.P', category: 'terrassystem', imageSrc: 'https://wyjykasevullaqvhnuef.supabase.co/storage/v1/object/public/konfigurator-images/terrassystem/skjut_dorr_I7ED_SL_C.png' },

];

export const TRANSLATIONS: Record<string, any> = {
    sv: {
        header: 'OFFERTFÖRFRÅGAN',
        subheader: 'Professionellt fönstersystem för nordiskt klimat. Skapa din offertförfrågan nedan.',
        step1: 'VÄLJ PROFIL', step2: 'VÄLJ PRODUKT', step3: 'KONFIGURERA ENHETER',
        btn_send: 'SKICKA FÖRFRÅGAN', btn_add: 'LÄGG TILL ENHET', summary: 'DIN PROJEKTLISTA',
        empty: 'Välj en produkt för att börja.', ai: 'G-Assistant: Redo för teknisk analys.',
        width: 'BREDD (MM)', height: 'HÖJD (MM)', quantity: 'ANTAL', glassType: 'GLAS TYP', glass_type_label: 'GLASTYP',
        glass_standard: 'Standard', glass_tempered: 'Härdat', glass_security: 'Säkerhetsglas', glass_frosted: 'Frostat', glass_acoustic: 'Ljudisolerat', glass_solar: 'Solskydd',
        ventilation: 'VENTILATION', handle: 'HANDTAG', fName: 'FÖRNAMN', lName: 'EFTERNAMN', email: 'E-POSTADRESS',
        phone: 'TELEFONNUMMER', address: 'ADRESS (GATA & STAD)', message: 'MEDDELANDE / ÖVRIGT...',
        success: 'Förfrågan har skickats!', error: 'Ett fel uppstod vid sändning.', sending: 'SÄNDER...',
        vent_none: 'UTAN', vent_with: 'MED', profile_label: 'PROFIL', select_first: 'Vänligen välj en profil först!',
        vent_none_acc: 'Utan ventilation', vent_standard: 'Areco AMO', vent_hygro: 'Aereco EMM', vent_press: 'Ventair Simpress',
        handle_white: 'Vit (Standard)', handle_silver: 'Silver', handle_black: 'Svart', handle_button: 'Vit med knapp', handle_key: 'Med nyckel', handle_child: 'Barnsäker',
        nav_config: 'Konfiguration', nav_tech: 'Teknisk Analys',
        btn_confirm: 'LÄGG TILL I PROJEKTLISTA', btn_change: 'ÄNDRA', step_done: 'VALD',
        last_used: 'SENAST VALD',
        cat_okna: 'Fönster', cat_drzwi: 'Dörrar', cat_terrassystem: 'terrassystem',
        colorOut: 'FÄRG UTSIDA', colorIn: 'FÄRG INSIDA',
        admin_title: 'ADMIN: PRODUKTTILLDELNING', admin_desc: 'Välj vilka produkter som är tillgängliga för varje profil.',
        admin_profiles: 'PROFILHANTERING', admin_acc: 'TILLBEHÖRSHANTERING',
        admin_status: 'STATUS', admin_active: 'AKTIV', admin_disabled: 'INAKTIVERAD',
        admin_add_profile: 'LÄGG TILL PROFIL', admin_name: 'NAMN', admin_type: 'TYP',
        admin_image: 'BILD-URL', admin_desc_field: 'BESKRIVNING',
        admin_pass_title: 'ÅTKOMST BEGRÄNSAD', admin_pass_desc: 'Ange administratörslösenord för att fortsätta.',
        admin_pass_placeholder: 'LÖSENORD', admin_pass_btn: 'LOGGA IN', admin_pass_error: 'Felaktigt lösenord!',
        admin_edit: 'REDIGERA', admin_delete: 'TA BORT', admin_save: 'SPARA', admin_cancel: 'AVBRYT',
        info_uw: 'Uw-värde', info_acoustics: 'Akustik', info_chambers: 'Kamrar', info_depth: 'Djup', info_description: 'Beskrivning', info_select: 'Välj denna profil',
        info_view_profile: 'Profilvy', info_view_section: 'Sektionsvy',
        anchors_total: 'Rekommenderat antal ankare',
        transport_terminal: 'Fri frakt till terminal',
        transport_missing_prefix: 'saknas',
        transport_missing_suffix: 'för frakt till hemadress inkl. lossning',
        transport_home: 'Du har fri frakt till hemadress inkl. lossning',
        units_count: 'Antal enheter'
    },
    da: {
        header: 'TILBUDSANMODNING',
        subheader: 'Professionelt vinduessystem til det nordiske klima. Opret din tilbudsanmodning nedenfor.',
        step1: 'VÆLG PROFIL', step2: 'VÆLG PRODUKT', step3: 'KONFIGURER ENHEDER',
        btn_send: 'SEND ANMODNING', btn_add: 'TILFØJ ENHED', summary: 'DIN PROJEKTLISTE',
        empty: 'Vælg et produkt for at starte.', ai: 'G-Assistant: Klar til teknisk analyse.',
        width: 'BREDDE (MM)', height: 'HØJDE (MM)', quantity: 'ANTAL', glassType: 'GLASTYPE', glass_type_label: 'GLASTYPE',
        glass_standard: 'Standard', glass_tempered: 'Hærdet', glass_security: 'Sikkerhedsglas', glass_frosted: 'Frostet', glass_acoustic: 'Lydisoleret', glass_solar: 'Solbeskyttelse',
        ventilation: 'VENTILATION', handle: 'HÅNDTAG', fName: 'FORNAVN', lName: 'EFTERNAVN', email: 'E-MAILADRESSE',
        phone: 'TELEFONNUMMER', address: 'ADRESSE (GADE & BY)', message: 'BESKED / BEMÆRKNINGER...',
        success: 'Anmodning er sendt!', error: 'En fejl opstod under afsendelse.', sending: 'SENDER...',
        vent_none: 'UDEN', vent_with: 'MED', profile_label: 'PROFIL', select_first: 'Vælg venligst en profil først!',
        vent_none_acc: 'Uden ventilation', vent_standard: 'Areco AMO', vent_hygro: 'Aereco EMM', vent_press: 'Ventair Simpress',
        handle_white: 'Hvid (Standard)', handle_silver: 'Sølv', handle_black: 'Sort', handle_button: 'Hvid med knap', handle_key: 'Med nøgle', handle_child: 'Børnesikret',
        nav_config: 'Konfiguration', nav_tech: 'Teknisk Analyse',
        btn_confirm: 'TILFØJ TIL PROJEKTLISTE', btn_change: 'ÆNDR', step_done: 'VALGT',
        last_used: 'SIDST VALGT',
        cat_okna: 'Vinduer', cat_drzwi: 'Døre', cat_terrassystem: 'terrassesystemer',
        colorOut: 'FARVE UDSIDE', colorIn: 'FARVE INDSIDE',
        admin_title: 'ADMIN: PRODUKT TILDELING', admin_desc: 'Vælg hvilke produkter der er tilgængelige for hver profil.',
        admin_profiles: 'PROFILSTYRING', admin_acc: 'TILBEHØRSSTYRING',
        admin_status: 'STATUS', admin_active: 'AKTIV', admin_disabled: 'DEAKTIVERET',
        admin_add_profile: 'TILFØJ PROFIL', admin_name: 'NAVN', admin_type: 'TYPE',
        admin_image: 'BILLEDE-URL', admin_desc_field: 'BESKRIVELSE',
        admin_pass_title: 'ADGANG BEGRÆNSET', admin_pass_desc: 'Indtast administratoradgangskode for at fortsætte.',
        admin_pass_placeholder: 'ADGANGSKODE', admin_pass_btn: 'LOG IND', admin_pass_error: 'Forkert adgangskode!',
        admin_edit: 'REDIGER', admin_delete: 'SLET', admin_save: 'GEM', admin_cancel: 'ANNULLER',
        info_uw: 'Uw-værdi', info_acoustics: 'Akustik', info_chambers: 'Kamre', info_depth: 'Dybde', info_description: 'Beskrivelse', info_select: 'Vælg denne profil',
        info_view_profile: 'Profilvisning', info_view_section: 'Sektionsvisning',
        anchors_total: 'Foreslået antal ankre',
        transport_terminal: 'Fri fragt til terminal',
        transport_missing_prefix: 'mangler',
        transport_missing_suffix: 'for fragt til hjemmeadresse inkl. aflæsning',
        transport_home: 'Du har fri fragt til hjemmeadresse inkl. aflæsning',
        units_count: 'Antal enheder'
    },
    de: {
        header: 'ANGEBOTSANFRAGE',
        subheader: 'Professionelles Fenstersystem für das nordische Klima. Erstellen Sie Ihre Angebotsanfrage unten.',
        step1: 'PROFIL WÄHLEN', step2: 'PRODUKT WÄHLEN', step3: 'EINHEITEN KONFIGURIEREN',
        btn_send: 'ANFRAGE SENDEN', btn_add: 'EINHEIT HINZUFÜGEN', summary: 'IHRE PROJEKTLISTE',
        empty: 'Wählen Sie ein Produkt, um zu beginnen.', ai: 'G-Assistant: Bereit für technische Analyse.',
        width: 'BREITE (MM)', height: 'HÖHE (MM)', quantity: 'MENGE', glassType: 'GLASTYP', glass_type_label: 'GLASTYP',
        glass_standard: 'Standard', glass_tempered: 'Gehärtet', glass_security: 'Sicherheitsglas', glass_frosted: 'Matt', glass_acoustic: 'Schallschutz', glass_solar: 'Sonnenschutz',
        ventilation: 'BELÜFTUNG', handle: 'GRIFF', fName: 'VORNAME', lName: 'NACHNAME', email: 'E-MAIL-ADRESSE',
        phone: 'TELEFONNUMMER', address: 'ADRESSE (STRASSE & STADT)', message: 'NACHRICHT / ANMERKUNGEN...',
        success: 'Anfrage wurde gesendet!', error: 'Beim Senden ist ein Fehler aufgetreten.', sending: 'WIRD GESENDET...',
        vent_none: 'OHNE', vent_with: 'MIT', profile_label: 'PROFIL', select_first: 'Bitte wählen Sie zuerst ein Profil!',
        vent_none_acc: 'Ohne Belüftung', vent_standard: 'Areco AMO', vent_hygro: 'Aereco EMM', vent_press: 'Ventair Simpress',
        handle_white: 'Weiß (Standard)', handle_silver: 'Silber', handle_black: 'Schwarz', handle_button: 'Weiß mit Knopf', handle_key: 'Mit Schlüssel', handle_child: 'Kindersicher',
        nav_config: 'Konfiguration', nav_tech: 'Technische Analyse',
        btn_confirm: 'ZUR PROJEKTLISTE HINZUFÜGEN', btn_change: 'ÄNDERN', step_done: 'AUSGEWÄHLT',
        last_used: 'ZULETZT GEWÄHLT',
        cat_okna: 'Fenster', cat_drzwi: 'Türen', cat_terrassystem: 'Terrassensysteme',
        colorOut: 'FARBE AUSSEN', colorIn: 'FARBE INNEN',
        admin_title: 'ADMIN: PRODUKTZUWEISUNG', admin_desc: 'Wählen Sie aus, welche Produkte für jedes Profil verfügbar sind.',
        admin_profiles: 'PROFILVERWALTUNG', admin_acc: 'ZUBEHÖRVERWALTUNG',
        admin_status: 'STATUS', admin_active: 'AKTIV', admin_disabled: 'DEAKTIVIERT',
        admin_add_profile: 'PROFIL HINZUFÜGEN', admin_name: 'NAME', admin_type: 'TYP',
        admin_image: 'BILD-URL', admin_desc_field: 'BESCHREIBUNG',
        admin_pass_title: 'ZUGRIFF EINGESCHRÄNKT', admin_pass_desc: 'Geben Sie das Administrator-Passwort ein, um fortzufahren.',
        admin_pass_placeholder: 'PASSWORT', admin_pass_btn: 'ANMELDEN', admin_pass_error: 'Falsches Passwort!',
        admin_edit: 'BEARBEITEN', admin_delete: 'LÖSCHEN', admin_save: 'SPEICHERN', admin_cancel: 'ABBRECHEN',
        info_uw: 'Uw-Wert', info_acoustics: 'Akustik', info_chambers: 'Kammern', info_depth: 'Tiefe', info_description: 'Beschreibung', info_select: 'Dieses Profil wählen',
        info_view_profile: 'Profilansicht', info_view_section: 'Sektionsansicht',
        anchors_total: 'Empfohlene Anzahl an Ankern',
        transport_terminal: 'Versandkostenfrei zum Terminal',
        transport_missing_prefix: 'es fehlen',
        transport_missing_suffix: 'für frei Haus inkl. Entladung',
        transport_home: 'Sie haben versandkostenfrei frei Haus inkl. Entladung',
        units_count: 'Anzahl der Einheiten'
    },
    en: {
        header: 'QUOTE REQUEST',
        subheader: 'Professional window systems for the Nordic climate. Create your quote request below.',
        step1: 'SELECT PROFILE', step2: 'SELECT PRODUCT', step3: 'CONFIGURE UNITS',
        btn_send: 'SEND INQUIRY', btn_add: 'ADD UNIT', summary: 'YOUR PROJECT LIST',
        empty: 'Select a product to begin.', ai: 'G-Assistant: Ready for technical analysis.',
        width: 'WIDTH (MM)', height: 'HEIGHT (MM)', quantity: 'QUANTITY', glassType: 'GLASS TYPE', glass_type_label: 'GLASS TYPE',
        glass_standard: 'Standard', glass_tempered: 'Tempered', glass_security: 'Security glass', glass_frosted: 'Frosted', glass_acoustic: 'Acoustic', glass_solar: 'Solar control',
        ventilation: 'VENTILATION', handle: 'HANDLE', fName: 'FIRST NAME', lName: 'LAST NAME', email: 'EMAIL ADDRESS',
        phone: 'PHONE NUMBER', address: 'ADDRESS (STREET & CITY)', message: 'MESSAGE / NOTES...',
        success: 'Inquiry has been sent!', error: 'An error occurred while sending.', sending: 'SENDING...',
        vent_none: 'WITHOUT', vent_with: 'WITH', profile_label: 'PROFILE', select_first: 'Please select a profile first!',
        vent_none_acc: 'Without ventilation', vent_standard: 'Areco AMO', vent_hygro: 'Aereco EMM', vent_press: 'Ventair Simpress',
        handle_white: 'White (Standard)', handle_silver: 'Silver', handle_black: 'Black', handle_button: 'White with button', handle_key: 'With key', handle_child: 'Child-safe',
        nav_config: 'Configuration', nav_tech: 'Technical Analysis',
        btn_confirm: 'ADD TO PROJECT LIST', btn_change: 'CHANGE', step_done: 'SELECTED',
        last_used: 'LAST SELECTED',
        admin_title: 'ADMIN: PRODUCT ASSIGNMENT', admin_desc: 'Select which products are available for each profile.',
        admin_profiles: 'PROFILE MANAGEMENT', admin_acc: 'ACCESSORIES MANAGEMENT',
        admin_status: 'STATUS', admin_active: 'ACTIVE', admin_disabled: 'DISABLED',
        cat_okna: 'Windows', cat_drzwi: 'Doors', cat_terrassystem: 'terrace systems',
        colorOut: 'COLOR OUTSIDE', colorIn: 'COLOR INSIDE',
        admin_add_profile: 'ADD PROFILE', admin_add_product: 'ADD PRODUCT', admin_add_acc: 'ADD ACCESSORY',
        admin_name: 'NAME', admin_type: 'TYPE', admin_image: 'IMAGE URL', admin_desc_field: 'DESCRIPTION',
        admin_import_csv: 'IMPORT FROM CSV', admin_import_desc: 'Upload a CSV file to bulk add data.',
        admin_import_btn: 'CHOOSE FILE', admin_download_template: 'DOWNLOAD TEMPLATE',
        admin_pass_title: 'ACCESS RESTRICTED', admin_pass_desc: 'Enter admin password to continue.',
        admin_pass_placeholder: 'PASSWORD', admin_pass_btn: 'LOGIN', admin_pass_error: 'Incorrect password!',
        admin_edit: 'EDIT', admin_delete: 'DELETE', admin_save: 'SAVE', admin_cancel: 'CANCEL',
        info_uw: 'Uw Value', info_acoustics: 'Acoustics', info_chambers: 'Chambers', info_depth: 'Depth', info_description: 'Description', info_select: 'Select this profile',
        info_view_profile: 'Profile View', info_view_section: 'Section View',
        anchors_total: 'Suggested number of anchors',
        transport_terminal: 'Free shipping to terminal',
        transport_missing_prefix: 'missing',
        transport_missing_suffix: 'for home delivery incl. unloading',
        transport_home: 'You have free shipping to home address incl. unloading',
        units_count: 'Number of units'
    }
};

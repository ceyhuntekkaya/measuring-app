'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/i18n/locales/en';
import { tr } from '@/i18n/locales/tr';

type Language = 'en' | 'tr';
type Translations = typeof en;
type TranslationValue = string | number | Record<string, unknown>;
type TranslationParams = Record<string, string | number>;

interface LanguageContextType {
    language: Language;
    translations: Translations;
    changeLanguage: (lang: Language) => void;
    t: (key: string, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
    en,
    tr
};

function getNestedValue(obj: Record<string, TranslationValue>, path: string): TranslationValue | undefined {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
        if (current === undefined || typeof current !== 'object' || current === null) {
            return undefined;
        }

        current = current[key] as Record<string, TranslationValue>;
    }

    return current;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('tr');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tr')) {
            setLanguage(savedLanguage);
        }
    }, []);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string, params?: TranslationParams): string => {
        const value = getNestedValue(translations[language], key);

        if (value === undefined || typeof value !== 'string') {
            return key;
        }

        if (params) {
            return Object.entries(params).reduce((str, [param, val]) => {
                return str.replace(new RegExp(`{{${param}}}`, 'g'), String(val));
            }, value);
        }

        return value;
    };

    const value: LanguageContextType = {
        language,
        translations: translations[language],
        changeLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
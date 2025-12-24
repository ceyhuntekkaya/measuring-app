type DateFormat = 'tr' | 'trFull' | 'trMedium' | 'us' | 'iso' | 'time' | 'timeWithSeconds' | 'dateTime' | 'custom';

interface FormatOptions extends Intl.DateTimeFormatOptions {
    locale?: string;
    custom?: boolean;
}

interface PresetFormats {
    [key: string]: FormatOptions;
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(amount);
};


/**
 * Tarihi istenen formatta biçimlendirir
 * @param {Date | string} date - Formatlanacak tarih
 * @param {DateFormat} format - Çıktı formatı
 * @param {FormatOptions} options - Özel format seçenekleri
 * @returns {string} Formatlanmış tarih string'i
 */
export const formatDate = (
    date: Date | string,
    format: DateFormat = 'tr',
    options: FormatOptions = {}
): string => {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
        throw new Error('Geçersiz tarih formatı');
    }

    if(!date || date ==="" ) return "-"

    const formats: PresetFormats = {
        tr: {
            // Türkiye formatı (GG.AA.YYYY)
            dateStyle: undefined,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            locale: 'tr-TR'
        },
        trFull: {
            // Türkiye tam format (1 Ocak 2024 Pazartesi)
            dateStyle: 'full',
            locale: 'tr-TR'
        },
        trMedium: {
            // Türkiye orta format (1 Oca 2024)
            dateStyle: 'medium',
            locale: 'tr-TR'
        },
        us: {
            // Amerikan formatı (MM/DD/YYYY)
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            locale: 'en-US'
        },
        iso: {
            // ISO formatı (YYYY-MM-DD)
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            locale: 'sv-SE' // ISO format için İsveç lokali kullanılır
        },
        time: {
            // Saat formatı (HH:mm)
            hour: '2-digit',
            minute: '2-digit',
            locale: 'tr-TR'
        },
        timeWithSeconds: {
            // Saniyeli saat formatı (HH:mm:ss)
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            locale: 'tr-TR'
        },
        dateTime: {
            // Tarih ve saat (DD.MM.YYYY HH:mm)
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            locale: 'tr-TR'
        }
    };

    try {
        // Eğer özel format seçenekleri varsa onları kullan
        const formatOptions = options.custom ? options : formats[format] || formats.tr;
        return dateObj.toLocaleString(formatOptions.locale || 'tr-TR', formatOptions);
    } catch (error) {
        console.error('Tarih formatlanırken hata oluştu:', error);
        return '';
    }
};

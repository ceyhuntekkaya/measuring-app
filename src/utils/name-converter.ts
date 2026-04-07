import {Department, Permission, Role} from "@/types/auth";

export const roleConverter = (role?: Role) => {
    const typeLabels = {
        ADMIN: 'Sistem Admin',
        USER: 'Kullanıcı',
        LEARNER: 'Katılımcı',
        MANAGER: 'Yönetici',
        REFEREE: 'Hakem',
        WRITER: 'Yazar',
        OBSERVER: 'Gözetmen',
    };
    return role ? typeLabels[role] || role : '';
};


export const permissionConverter = (role?: Permission) => {
    const typeLabels = {
        ADD: 'Ekle',
        DELETE: 'Sil',
        UPDATE: 'Güncelle',
        LIST: 'Listele',
        VIEW: 'Görüntüle',
        APPROVE: 'Onayla',
    };
    return role ? typeLabels[role] || role : '';
};



export const departmentConverter = (role?: Department) => {
    const typeLabels = {
        TURKISH: 'Türkçe',
        ENGLISH: 'İngilizce',
        GERMAN: 'Almanca',
        CHINESE: 'Çince',
        ARABIC: 'Arapça',
        FRENCH: 'Fransızca',
        JAPANESE: 'Japonca',
        RUSSIAN: 'Rusça',
        KOREAN: 'Korece',
        GREEK: 'Yunanca',
        PERSIAN: 'Farsça',
    };
    return role ? typeLabels[role] || role : '';
};


import {Department, Permission, Role} from "@/types/auth";

export const roleConverter = (role?: Role) => {
    const typeLabels = {
        ADMIN: 'Yönetici',
        USER: 'Kullanıcı',
        LEARNER: 'Katılımcı',
        INSTRUCTOR: 'Yazar',
        OBSERVER: 'Gözetmen',
        COMPANY: 'Dış Firma'
    };
    return role ? typeLabels[role] || role : '';
};


export const permissionConverter = (role?: Permission) => {
    const typeLabels = {
        APPROVAL: 'SORU YAZMA',
        USER_CREATE: 'SORU ONAYLAMA',
        GENERAL: 'SINAV TANIMLAMA',
        FINANCE_OPERATION: 'OTURUM PLANLAMA',
        ACCOUNTING_OPERATION: 'SORU DEĞERLENDİRME',
        DELIVERY_OPERATION: 'SINAV DEĞERLENDİRME',
        CUSTOMER_OPERATION: 'GÖZETMENLİK',
        OFFER_OPERATION: 'OKULLANICI OLUŞTURMA',
        ORDER_OPERATION: 'KATILIMCI EKLEME',
        SUPPLIER_OPERATION: 'RAPORLAMA',
        TRANSPORTATION_OPERATION: 'SINAV TİPLERİ',
        DELIVERY_DOCUMENT: 'SORU TİPLERİ',
        SETTING: 'SORU BÖLÜMLERİ'
    };
    return role ? typeLabels[role] || role : '';
};



export const departmentConverter = (role?: Department) => {
    const typeLabels = {
        GRADER: 'Değerlendirme Ekibi',
        SUPERVISOR: 'Gözetmen Ekibi',
        MANAGEMENT: 'Yönetim Ekibi',
        IT: 'Teknik Ekip',
        AUTHOR_REVIEWER: 'Yazar Ekibi',
        ADMIN: 'Üst Yönetici',
        REVIEWER: 'İzleyici'
    };
    return role ? typeLabels[role] || role : '';
};


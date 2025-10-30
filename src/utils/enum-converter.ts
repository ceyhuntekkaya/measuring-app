import {EExamType, EStatus} from "@/types/exam/enum";

export const examTypeConverter = (examType: EExamType) => {

    switch (examType) {
        case EExamType.CERTIFICATE:
            return 'SERTİFİKA'
        case EExamType.COURSE_EXAM:
            return 'KUR SINAVI'
        case EExamType.LEVEL_DETERMINATION:
            return 'SEVİYE TESPİT'
        case EExamType.PRACTICE:
            return 'PRATİK'
        case EExamType.DEGREE:
            return 'DİPLOMA'
        default:
            return ''
    }
}


export const statusConverter = (status: EStatus) => {

    switch (status) {
        case EStatus.ACTIVE:
            return 'AKTİF'               // Sistem veya kullanıcı aktif durumda
        case EStatus.PASSIVE:
            return 'PASİF'               // Devre dışı
        case EStatus.DELETED:
            return 'SİLİNMİŞ'            // Kalıcı olarak kaldırılmış
        case EStatus.WAITING:
            return 'BEKLİYOR'            // Onay veya işlem bekliyor
        case EStatus.CONFIRMED:
            return 'ONAYLANDI'           // Yönetici veya sistem tarafından onaylandı
        case EStatus.REJECTED:
            return 'REDDEDİLDİ'          // Onay süreci olumsuz sonuçlandı
        case EStatus.CANCELLED:
            return 'İPTAL EDİLDİ'        // Kullanıcı veya sistem tarafından iptal edildi
        case EStatus.PENDING:
            return 'ASKIDA'              // Beklemede / geçici durdurulmuş
        case EStatus.SUSPENDED:
            return 'ASKIYA ALINDI'       // Dondurulmuş veya geçici olarak kapalı
        default:
            return ''
    }
}










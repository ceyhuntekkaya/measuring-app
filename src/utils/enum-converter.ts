import {EExamType, EStatus, EApprovalStatus, EDifficulty} from "@/types/exam/enum";

export const examTypeConverter = (examType?: EExamType) => {
    if (!examType) return 'Belirtilmedi';

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
            return examType || 'Belirtilmedi'
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


export const approvalStatusConverter = (status?: EApprovalStatus | string) => {
    if (!status) return 'Belirtilmedi';

    switch (status) {
        case EApprovalStatus.PENDING:
        case 'PENDING':
            return 'Beklemede'
        case EApprovalStatus.APPROVED:
        case 'APPROVED':
            return 'Onaylandı'
        case EApprovalStatus.REJECTED:
        case 'REJECTED':
            return 'Reddedildi'
        case EApprovalStatus.CANCELLED:
        case 'CANCELLED':
            return 'İptal Edildi'
        case EApprovalStatus.EXPIRED:
        case 'EXPIRED':
            return 'Süresi Doldu'
        default:
            return status || 'Belirtilmedi'
    }
}

export const difficultyConverter = (difficulty?: EDifficulty | string) => {
    if (!difficulty) return 'Belirtilmedi';
    switch (difficulty) {
        case EDifficulty.EASY:
        case 'EASY':
            return 'Kolay';
        case EDifficulty.MEDIUM:
        case 'MEDIUM':
            return 'Orta';
        case EDifficulty.HARD:
        case 'HARD':
            return 'Zor';
        default:
            return typeof difficulty === 'string' ? difficulty : 'Belirtilmedi';
    }
};

export const getApprovalStatusColor = (status?: EApprovalStatus | string) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';

    switch (status) {
        case EApprovalStatus.APPROVED:
        case 'APPROVED':
            return 'bg-green-100 text-green-800 border-green-200';
        case EApprovalStatus.PENDING:
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case EApprovalStatus.REJECTED:
        case 'REJECTED':
            return 'bg-red-100 text-red-800 border-red-200';
        case EApprovalStatus.CANCELLED:
        case 'CANCELLED':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        case EApprovalStatus.EXPIRED:
        case 'EXPIRED':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}










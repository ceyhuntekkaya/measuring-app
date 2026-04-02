export function getSessionStateLabel(state?: string | null): string {
  switch (state) {
    case 'NOT_STARTED':
      return 'Başlamadı';
    case 'IN_PROGRESS':
      return 'Devam Ediyor';
    case 'FINISHED':
      return 'Tamamlandı';
    case 'PAUSED':
      return 'Duraklatıldı';
    case 'CANCELLED':
      return 'İptal Edildi';
    case 'NOT_SET':
    case undefined:
    case null:
    case '':
      return 'Belirtilmedi';
    default:
      return state;
  }
}


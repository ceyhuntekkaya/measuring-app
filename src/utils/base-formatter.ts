export function formatNumberToMoney(value: number): string {
    return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


export function formatSqlDate(isoDate: string) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('tr-TR');
}

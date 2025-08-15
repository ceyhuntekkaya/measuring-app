import {Badge} from "@/components/ui/badge";
import React from "react";


export const getStatusBadge = (status: string) => {
    switch (status) {
        case 'NEW':
            return <Badge className="bg-blue-500">Yeni</Badge>;
        case 'PROCESSING':
            return <Badge className="bg-yellow-500">İşlemde</Badge>;
        case 'WAITING_FOR_APPROVAL':
            return <Badge className="bg-orange-500">Onay Bekliyor</Badge>;
        case 'APPROVED':
            return <Badge className="bg-green-500">Onaylandı</Badge>;
        case 'REJECTED':
            return <Badge className="bg-red-500">Reddedildi</Badge>;
        case 'ACTIVE':
            return <Badge className="bg-green-500">Aktif</Badge>;
        case 'INACTIVE':
            return <Badge className="bg-yellow-500">İnaktif</Badge>;
        case 'PENDING':
            return <Badge className="bg-blue-500">Onay Bekliyor</Badge>;
        case 'SUSPENDED':
            return <Badge className="bg-orange-500">Askıya Alındı</Badge>;
        case 'DELETED':
            return <Badge className="bg-red-500">Silindi</Badge>;
        case 'PLANNED':
            return <Badge className="bg-blue-500">Planlandı</Badge>;
        case 'IN_TRANSIT':
            return <Badge className="bg-yellow-500">Yolda</Badge>;
        case 'DELIVERED':
            return <Badge className="bg-green-500">Teslim Edildi</Badge>;
        case 'DELAYED':
            return <Badge className="bg-orange-500">Gecikti</Badge>;
        case 'CANCELLED':
            return <Badge className="bg-red-500">İptal Edildi</Badge>;
        case 'COMPLETED':
            return <Badge className="bg-green-700">Tamamlandı</Badge>;
        default:
            return <Badge className="bg-gray-500">{status}</Badge>;
    }
};
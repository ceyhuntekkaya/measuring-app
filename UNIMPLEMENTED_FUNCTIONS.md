# Implement Edilmemiş Fonksiyonlar ve Backend Gereksinimleri

Bu dosya, frontend'de implement edilmemiş veya backend API'si gerektiren fonksiyonları içerir.

## 1. Sidebar onCloseAction Fonksiyonu

**Dosya:** `src/app/(protected)/admin/layout.tsx` ve `src/app/(protected)/app/layout.tsx`

**Durum:** Mobile sidebar'ı kapatmak için kullanılıyor ancak şu anda `throw new Error` ile placeholder olarak bırakılmış.

**Çözüm:** Frontend'de state yönetimi ile çözülebilir. Backend gerektirmez.

**Not:** Sidebar mobile responsive için kullanılıyor. `isOpen` state'i ile kontrol ediliyor.

---

## 2. Dashboard İstatistikleri (Hardcoded Değerler)

**Dosya:** `src/app/(protected)/admin/page.tsx`

**Durum:** Dashboard'daki tüm sayılar hardcoded:
- Devam Eden Sınavlar: 0
- Bu Hafta Planlanan Sınavlar: 1
- Yazımı Beklenen Soru Sayısı: 45
- Onaydaki Soru Sayısı: 23
- Değerlendirme Bekleyen Sınavlar: 0
- Onay Bekleyen İşlemlerim: 0
- Bu Ay Verilen Sertifika Sayısı: 0
- Bugün Yapılan Başvurular: 2
- Kayıt Alınan Oturum Sayısı: 1
- Dolan Oturum Sayısı: 0

**Backend Gereksinimi:** 
Aşağıdaki endpoint'ler gerekiyor:

```typescript
// Dashboard istatistikleri için endpoint
GET /api/admin/dashboard/statistics

Response:
{
  ongoingExams: number;
  weeklyPlannedExams: number;
  pendingQuestions: number;
  approvalPendingQuestions: number;
  evaluationPendingExams: number;
  myPendingApprovals: number;
  monthlyCertificates: number;
  todayApplications: number;
  registeredSessions: number;
  fullSessions: number;
}
```

---

## 3. Boş Sayfalar

### 3.1. Sertifikalar Sayfası
**Dosya:** `src/app/(protected)/admin/certificates/page.tsx`

**Durum:** Sadece "Henüz sertifikaya hak kazanan başvuru bulunmamaktadır." mesajı gösteriliyor.

**Backend Gereksinimi:**
```typescript
GET /api/admin/certificates
// Sertifika listesi endpoint'i
```

### 3.2. Application Grader Detail
**Dosya:** `src/app/(protected)/admin/application-grader/[id]/page.tsx`

**Durum:** Sadece "BOŞ" yazıyor.

**Backend Gereksinimi:**
```typescript
GET /api/admin/application-grader/:id
// Application grader detay endpoint'i
```

### 3.3. Onay Ayarları
**Dosya:** `src/app/(protected)/admin/settings/approval/page.tsx`

**Durum:** "Onay ayarlarını değiştirme yetkini bulanmamaktadır.." mesajı gösteriliyor.

**Backend Gereksinimi:**
```typescript
GET /api/admin/settings/approval
PUT /api/admin/settings/approval
// Onay ayarları endpoint'leri
```

---

## 4. Eksik API Endpoint'leri

Aşağıdaki sayfalar için API endpoint'leri eksik veya kullanılmıyor olabilir:

1. **Attends (Katılımlar)**
   - `src/app/(protected)/admin/attends/page.tsx`
   - `src/app/(protected)/admin/attends/add/page.tsx`

2. **Approvals Add**
   - `src/app/(protected)/admin/approvals/add/page.tsx`

---

## Öncelik Sırası

1. **Yüksek Öncelik:**
   - Dashboard istatistikleri endpoint'i (kullanıcı deneyimi için kritik)

2. **Orta Öncelik:**
   - Sertifikalar listesi endpoint'i
   - Application grader detay endpoint'i

3. **Düşük Öncelik:**
   - Onay ayarları endpoint'leri (yetki kontrolü gerekebilir)
   - Attends endpoint'leri (kullanım durumu belirsiz)

---

## Notlar

- Tüm endpoint'ler için TypeScript type tanımlamaları `src/api/generated/model` altında olmalı
- Orval config ile otomatik generate ediliyor olmalı
- Response format'ları mevcut API pattern'lerine uygun olmalı

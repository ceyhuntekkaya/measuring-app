
## 1. MULTIPLE_CHOICE (Çoktan Seçmeli)

**Kontrol Edilen Alanlar:**
- `template.correctOptionIndex` (number | undefined)
- `template.options.choices` (array)

**Kontrol Mantığı:**
1. `correctOptionIndex` undefined veya null ise → `false`
2. `correctOptionIndex < 0` veya `correctOptionIndex >= choices.length` ise → `false`
3. `choices.length < 2` ise → `false`
4. Tüm kontroller geçerse → `true`

**Kod:**
```typescript
const correctIndex = mcTemplate.correctOptionIndex;
const choices = mcTemplate.options?.choices || [];

if (correctIndex === undefined || correctIndex === null) return false;
if (correctIndex < 0 || correctIndex >= choices.length) return false;
if (choices.length < 2) return false;
return true;
```

**Potansiyel Sorunlar:**
- `correctOptionIndex` 0 değeri geçerli (ilk seçenek)
- `options` null/undefined olabilir, bu durumda `choices = []` olur
- `correctOptionIndex` string olarak gelirse kontrol başarısız olur

---

## 2. MULTIPLE_RESPONSE (Çoklu Seçim)

**Kontrol Edilen Alanlar:**
- `template.correctOptionIndices` (number[] | undefined)
- `template.options.choices` (array)

**Kontrol Mantığı:**
1. `correctOptionIndices` boş array veya undefined ise → `false`
2. `correctOptionIndices` içinde geçersiz index varsa (index < 0 veya index >= choices.length) → `false`
3. `choices.length < 2` ise → `false`
4. Tüm kontroller geçerse → `true`

**Kod:**
```typescript
const correctIndices = mrTemplate.correctOptionIndices || [];
const choices = mrTemplate.options?.choices || [];

if (correctIndices.length === 0) return false;
const invalidIndices = correctIndices.some(index => index < 0 || index >= choices.length);
if (invalidIndices) return false;
if (choices.length < 2) return false;
return true;
```

**Potansiyel Sorunlar:**
- `correctOptionIndices` null gelirse `|| []` ile boş array'e dönüşür
- Array içinde string değerler varsa kontrol başarısız olur

---

## 3. TRUE_FALSE (Doğru/Yanlış)

**Kontrol Edilen Alanlar:**
- `template.correctAnswer` (boolean | undefined)

**Kontrol Mantığı:**
1. `correctAnswer === undefined` veya `correctAnswer === null` ise → `false`
2. Aksi halde → `true`

**Kod:**
```typescript
// correctAnswer hem root'ta hem de options içinde olabilir
const correctAnswer = tfTemplate.correctAnswer ?? tfTemplate.options?.correctAnswer;

if (correctAnswer === undefined || correctAnswer === null) {
    return false;
}
return true;
```

**✅ DÜZELTME YAPILDI:**
- `TrueFalseTemplateDto` içinde hem `correctAnswer` hem de `options.correctAnswer` var
- Şu anda her ikisi de kontrol ediliyor: `template.correctAnswer ?? template.options?.correctAnswer`
- `TrueFalseQuestion.tsx`'te de aynı mantık kullanılıyor (satır 50)

**Potansiyel Sorunlar:**
- `correctAnswer` false değeri geçerli (yanlış cevap da bir cevaptır)
- Ancak şu anda false değeri de geçerli kabul ediliyor (doğru)
- `correctAnswer` string olarak "true"/"false" gelirse kontrol başarısız olur

---

## 4. FILL_IN_THE_BLANKS (Boşluk Doldurma)

**Kontrol Edilen Alanlar:**
- `template.options.blanks` (array)
- Her blank için: `blank.acceptableAnswers` (array)
- Her acceptableAnswer için: `answer` (string)

**Kontrol Mantığı:**
1. `blanks.length === 0` ise → `false`
2. Her blank için:
   - `acceptableAnswers.length === 0` ise → `false`
   - Tüm `acceptableAnswers` boş string veya sadece whitespace ise → `false`
3. Tüm kontroller geçerse → `true`

**Kod:**
```typescript
const blanks = fitbTemplate.options?.blanks || [];

if (blanks.length === 0) return false;

const invalidBlanks = blanks.some(blank => {
    const acceptableAnswers = blank.acceptableAnswers || [];
    return acceptableAnswers.length === 0 || 
           acceptableAnswers.every(answer => !answer || !answer.trim());
});

if (invalidBlanks) return false;
return true;
```

**Potansiyel Sorunlar:**
- `options` null/undefined olabilir
- `blank.acceptableAnswers` null/undefined olabilir
- `answer` null/undefined olabilir

---

## 5. SHORT_ANSWER (Kısa Cevap)

**Kontrol Edilen Alanlar:**
- `template.options.acceptableAnswers` (array)
- Her acceptableAnswer için: `answer.answer` (string)

**Kontrol Mantığı:**
1. `acceptableAnswers.length === 0` ise → `false`
2. Herhangi bir `answer.answer` boş string veya sadece whitespace ise → `false`
3. Tüm kontroller geçerse → `true`

**Kod:**
```typescript
const acceptableAnswers = saTemplate.options?.acceptableAnswers || [];

if (acceptableAnswers.length === 0) return false;

const invalidAnswers = acceptableAnswers.some(answer => !answer.answer || !answer.answer.trim());
if (invalidAnswers) return false;
return true;
```

**Potansiyel Sorunlar:**
- `options` null/undefined olabilir
- `answer` objesi null/undefined olabilir
- `answer.answer` null/undefined olabilir

---

## 6. MATCHING (Eşleştirme)

**Kontrol Edilen Alanlar:**
- `template.options.pairs` (array)

**Kontrol Mantığı:**
1. `pairs.length === 0` ise → `false`
2. Aksi halde → `true`

**⚠️ ÖNEMLİ SORUN:**
- Sadece pairs'in varlığı kontrol ediliyor
- Pair'lerin içeriği (left, right, correctMatch vb.) kontrol edilmiyor
- **Kontrol edilmesi gereken:** Pair'lerin doğru eşleştirme bilgisi var mı?

**Kod:**
```typescript
const pairs = matchingTemplate.options?.pairs || [];

if (pairs.length === 0) {
    return false;
}

return true;
```

---

## 7. ORDERING (Sıralama)

**Kontrol Edilen Alanlar:**
- `template.options.items` (array)
- Her item için: `item.correctPosition` (number)

**Kontrol Mantığı:**
1. `items.length < 2` ise → `false`
2. Herhangi bir item için:
   - `correctPosition === undefined` veya `correctPosition === null` ise → `false`
   - `correctPosition < 1` ise → `false`
3. Tüm kontroller geçerse → `true`

**Kod:**
```typescript
const items = orderingTemplate.options?.items || [];

if (items.length < 2) return false;

const invalidItems = items.some(item => 
    item.correctPosition === undefined || 
    item.correctPosition === null ||
    item.correctPosition < 1
);

if (invalidItems) return false;
return true;
```

**Potansiyel Sorunlar:**
- `correctPosition` 0 değeri geçersiz kabul ediliyor (1'den başlamalı)
- `correctPosition` string olarak gelirse kontrol başarısız olur

---

## 8. HOT_SPOT (Sıcak Nokta)

**Kontrol Edilen Alanlar:**
- `template.options.hotSpots` (array)
- Her hotSpot için: `spot.isCorrect` (boolean)

**Kontrol Mantığı:**
1. `hotSpots.length === 0` ise → `false`
2. En az bir `spot.isCorrect === true` olmalı → `false` (yoksa)
3. Tüm kontroller geçerse → `true`

**Kod:**
```typescript
const hotSpots = hotSpotTemplate.options?.hotSpots || [];

if (hotSpots.length === 0) return false;

const hasCorrectSpot = hotSpots.some(spot => spot.isCorrect === true);
if (!hasCorrectSpot) return false;
return true;
```

**Potansiyel Sorunlar:**
- `spot.isCorrect` undefined/null ise `some()` false döner
- `isCorrect` string olarak "true"/"false" gelirse kontrol başarısız olur

---

## 9. DRAG_AND_DROP (Sürükle-Bırak)

**Kontrol Edilen Alanlar:**
- `template.options.draggableItems` (array)
- `template.options.dropZones` (array)

**Kontrol Mantığı:**
1. `draggableItems.length === 0` ise → `false`
2. `dropZones.length === 0` ise → `false`
3. Tüm kontroller geçerse → `true`

**⚠️ ÖNEMLİ SORUN:**
- Sadece items ve zones'un varlığı kontrol ediliyor
- Doğru eşleştirme bilgisi (hangi item hangi zone'a gidecek) kontrol edilmiyor
- **Kontrol edilmesi gereken:** Item'ların doğru dropZone bilgisi var mı?

**Kod:**
```typescript
const draggableItems = dndTemplate.options?.draggableItems || [];
const dropZones = dndTemplate.options?.dropZones || [];

if (draggableItems.length === 0) return false;
if (dropZones.length === 0) return false;
return true;
```

---

## 10. ESSAY, AUDIO_RESPONSE, VIDEO_RESPONSE, IMAGE_RESPONSE

**Kontrol Mantığı:**
- Bu soru tipleri için manuel değerlendirme yapıldığından → **Her zaman `true` döner**

**Kod:**
```typescript
case EQuestionType.ESSAY:
case EQuestionType.AUDIO_RESPONSE:
case EQuestionType.VIDEO_RESPONSE:
case EQuestionType.IMAGE_RESPONSE:
    return true;
```

---

## Tespit Edilen Potansiyel Sorunlar

### 1. ✅ TRUE_FALSE - correctAnswer Konumu (DÜZELTİLDİ)
**Sorun:** `TrueFalseTemplateDto` içinde hem `correctAnswer` hem de `options.correctAnswer` var.
**Çözüm:** Her ikisi de kontrol ediliyor:
```typescript
const correctAnswer = tfTemplate.correctAnswer ?? tfTemplate.options?.correctAnswer;
```

### 2. Type Mismatch
**Sorun:** API'den gelen değerler string olabilir (örn: "true", "false", "0", "1")
**Çözüm:** Type kontrolü ve dönüşüm yapılmalı

### 3. Null/Undefined Kontrolleri
**Sorun:** Bazı alanlar null/undefined olabilir ama kontrol edilmiyor
**Çözüm:** Optional chaining (`?.`) kullanılıyor, bu doğru

### 4. MATCHING ve DRAG_AND_DROP
**Sorun:** Sadece varlık kontrolü yapılıyor, doğru cevap bilgisi kontrol edilmiyor
**Çözüm:** Pair'lerin ve item'ların doğru eşleştirme bilgisi kontrol edilmeli

---

## Test Edilmesi Gerekenler

1. **TRUE_FALSE:** `correctAnswer` hem root'ta hem `options` içinde kontrol edilmeli
2. **Type Kontrolü:** String olarak gelen boolean/number değerleri
3. **Null/Undefined:** Tüm alanlar için null/undefined durumları
4. **Empty Arrays:** Boş array'lerin kontrolü
5. **Edge Cases:** 0 değeri, false değeri, boş string'ler

---

## Debug İçin Öneriler

1. Console.log ekleyerek gelen template yapısını kontrol edin
2. Her soru tipi için hangi alanların dolu olduğunu kontrol edin
3. API'den gelen veri yapısını inceleyin
4. `questionType` değerinin doğru gelip gelmediğini kontrol edin

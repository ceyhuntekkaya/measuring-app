'use client';

import React, {useEffect, useState, useImperativeHandle, forwardRef, useRef} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {NumberInput} from "@/components/ui/number-input";
import {FillInTheBlanksTemplateDto, FillInTheBlanksOptions, BlankAnswer} from "@/types/exam/questionTemplates";
import {Plus, Trash2} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";

interface FillInTheBlanksTemplateFormData {
    textWithBlanks: string;
    options: FillInTheBlanksOptions;
    caseSensitive: boolean;
    exactMatch: boolean;
    explanation: string;
}

interface FillInTheBlanksTemplateFormErrors {
    textWithBlanks?: string;
    options?: string;
}

interface FillInTheBlanksTemplateFormProps {
    value?: FillInTheBlanksTemplateDto | null;
    onChange: (data: FillInTheBlanksTemplateDto) => void;
    loading?: boolean;
}

// Validation handle için ref interface
export interface FillInTheBlanksTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => FillInTheBlanksTemplateFormErrors;
}

const FillInTheBlanksTemplateForm = forwardRef<FillInTheBlanksTemplateFormHandle, FillInTheBlanksTemplateFormProps>(({
                                                                                                                         value,
                                                                                                                         onChange,
                                                                                                                     }, ref) => {
    const [formData, setFormData] = useState<FillInTheBlanksTemplateFormData>({
        textWithBlanks: '',
        options: {blanks: []},
        caseSensitive: false,
        exactMatch: false,
        explanation: ''
    });

    const [errors, setErrors] = useState<FillInTheBlanksTemplateFormErrors>({});

    // Value değiştiğinde form data'yı güncelle (Update modu için)
    useEffect(() => {
        if (value) {
            setFormData({
                textWithBlanks: value.textWithBlanks || '',
                options: value.options || {blanks: []},
                caseSensitive: value.caseSensitive || false,
                exactMatch: value.exactMatch || false,
                explanation: '' // UI'dan kaldırıldı, her zaman boş string
            });
        }
    }, []);

    // NOT: caseSensitive ve exactMatch güncellemeleri artık textWithBlanks useEffect'inde yapılıyor
    // Bu useEffect'i kaldırdık çünkü sonsuz döngüye neden oluyordu

    // Form data değiştiğinde parent'a bildir (Anlık güncelleme)
    // useRef ile son gönderilen değeri takip ederek gereksiz güncellemeleri önle
    const lastSentRef = useRef<string>('');
    
    // handleChange'den sonra parent'a bildir
    useEffect(() => {
        // İlk render'da boş form için onChange tetikleme
        if (formData.textWithBlanks || (formData.options.blanks ?? []).length > 0) {
            // Tüm boşlukların feedback'ini boş string yap ve ana şablon ayarlarını uygula
            const blanksWithDefaults = formData.options.blanks?.map(blank => ({
                ...blank,
                caseSensitive: formData.caseSensitive,
                exactMatch: formData.exactMatch,
                feedback: ''
            })) || [];

            const templateData: FillInTheBlanksTemplateDto = {
                ...value,
                textWithBlanks: formData.textWithBlanks,
                options: {
                    ...formData.options,
                    blanks: blanksWithDefaults
                },
                caseSensitive: formData.caseSensitive,
                exactMatch: formData.exactMatch,
                explanation: ''
            };
            
            // Basit bir key oluştur (sonsuz döngüyü önlemek için)
            const dataKey = `${formData.textWithBlanks}|${formData.caseSensitive}|${formData.exactMatch}|${blanksWithDefaults.length}`;
            
            if (dataKey !== lastSentRef.current) {
                lastSentRef.current = dataKey;
                onChange(templateData);
            }
        }
    }, [formData.textWithBlanks, formData.caseSensitive, formData.exactMatch, formData.options.blanks?.length || 0]);

    // Boşlukları güncelleme fonksiyonu
    const updateBlanksFromText = (text: string, currentBlanks: BlankAnswer[], caseSensitive: boolean, exactMatch: boolean): BlankAnswer[] => {
        const blankIdsInText = extractBlankIdsFromText(text);
        
        // Mevcut boşlukların ID'lerini al
        const currentBlankIds = currentBlanks.map(blank => {
            const id = blank.blankId || '';
            return id.startsWith('[') && id.endsWith(']') ? id : `[${id}]`;
        });

        // Yeni eklenen boşlukları bul
        const newBlankIds = blankIdsInText.filter(id => !currentBlankIds.includes(id));
        
        // Silinen boşlukları bul
        const removedBlankIds = currentBlankIds.filter(id => !blankIdsInText.includes(id));

        // Eğer değişiklik yoksa mevcut boşlukları döndür
        if (newBlankIds.length === 0 && removedBlankIds.length === 0 && 
            blankIdsInText.length === currentBlankIds.length) {
            return currentBlanks;
        }

        // Mevcut boşlukları koru (metinde hala var olanlar) ve blankId'lerini formatla
        const keptBlanks = currentBlanks
            .filter(blank => {
                const id = blank.blankId || '';
                const formattedId = id.startsWith('[') && id.endsWith(']') ? id : `[${id}]`;
                return blankIdsInText.includes(formattedId);
            })
            .map(blank => {
                const id = blank.blankId || '';
                const formattedId = id.startsWith('[') && id.endsWith(']') ? id : `[${id}]`;
                return {
                    ...blank,
                    blankId: formattedId,
                    caseSensitive: caseSensitive,
                    exactMatch: exactMatch,
                    feedback: ''
                };
            });

        // Yeni boşlukları ekle
        const addedBlanks: BlankAnswer[] = newBlankIds.map(blankId => {
            return {
                blankId: blankId,
                acceptableAnswers: [''],
                caseSensitive: caseSensitive,
                exactMatch: exactMatch,
                score: 1,
                feedback: ''
            };
        });

        // Tüm boşlukları birleştir ve sırala
        const allBlanks = [...keptBlanks, ...addedBlanks];
        
        return allBlanks.sort((a, b) => {
            const numA = parseInt((a.blankId || '').match(/blank_(\d+)/)?.[1] || '0');
            const numB = parseInt((b.blankId || '').match(/blank_(\d+)/)?.[1] || '0');
            return numA - numB;
        });
    };

    const handleChange = <T extends keyof FillInTheBlanksTemplateFormData>(
        field: T,
        newValue: FillInTheBlanksTemplateFormData[T]
    ) => {
        setFormData(prev => {
            const updatedData = {
            ...prev,
            [field]: newValue
            };

            // Eğer textWithBlanks değiştiyse, boşlukları güncelle
            if (field === 'textWithBlanks') {
                const updatedBlanks = updateBlanksFromText(
                    newValue as string,
                    prev.options.blanks || [],
                    prev.caseSensitive,
                    prev.exactMatch
                );
                updatedData.options = {
                    ...prev.options,
                    blanks: updatedBlanks
                };
            }
            // Eğer caseSensitive veya exactMatch değiştiyse, tüm boşlukları güncelle
            else if (field === 'caseSensitive' || field === 'exactMatch') {
                const updatedBlanks = (prev.options.blanks || []).map(blank => ({
                    ...blank,
                    caseSensitive: field === 'caseSensitive' ? (newValue as boolean) : prev.caseSensitive,
                    exactMatch: field === 'exactMatch' ? (newValue as boolean) : prev.exactMatch,
                    feedback: ''
                }));
                updatedData.options = {
                    ...prev.options,
                    blanks: updatedBlanks
                };
            }

            return updatedData;
        });

        // Hata varsa temizle
        if (errors[field as keyof FillInTheBlanksTemplateFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Boşluklu metinden [blank_X] formatındaki boşluk ID'lerini çıkar (tekrarları kaldırarak)
    const extractBlankIdsFromText = (text: string): string[] => {
        const regex = /\[blank_\d+\]/g;
        const matches = text.match(regex);
        if (!matches) return [];
        // Tekrarları kaldır ve sırala
        const uniqueMatches = [...new Set(matches)];
        // Numara sırasına göre sırala
        return uniqueMatches.sort((a, b) => {
            const numA = parseInt(a.match(/blank_(\d+)/)?.[1] || '0');
            const numB = parseInt(b.match(/blank_(\d+)/)?.[1] || '0');
            return numA - numB;
        });
    };

    // Boşluk ID'sinden görüntülenecek metni al ([blank_1] formatında)
    const getBlankDisplayText = (blankId: string | undefined): string => {
        if (!blankId) return '';
        // Eğer zaten [blank_X] formatındaysa direkt döndür
        if (blankId.startsWith('[') && blankId.endsWith(']')) {
            return blankId;
        }
        // Değilse [blank_X] formatına çevir
        return `[${blankId}]`;
    };

    // NOT: Boşluk yönetimi artık handleChange içinde yapılıyor, useEffect kullanmıyoruz

    const updateBlank = <K extends keyof BlankAnswer>(
        index: number,
        field: K,
        newValue: BlankAnswer[K]
    ) => {
        const updatedBlanks = formData.options.blanks?.map((blank, i) =>
            i === index ? {...blank, [field]: newValue} : blank
        ) || [];

        handleChange('options', {...formData.options, blanks: updatedBlanks});
    };

    const addAcceptableAnswer = (blankIndex: number) => {
        const updatedBlanks = formData.options.blanks?.map((blank, i) =>
            i === blankIndex
                ? {...blank, acceptableAnswers: [...(blank.acceptableAnswers || []), '']}
                : blank
        ) || [];

        handleChange('options', {...formData.options, blanks: updatedBlanks});
    };

    const removeAcceptableAnswer = (blankIndex: number, answerIndex: number) => {
        const updatedBlanks = formData.options.blanks?.map((blank, i) =>
            i === blankIndex
                ? {
                    ...blank,
                    acceptableAnswers: blank.acceptableAnswers?.filter((_, j) => j !== answerIndex) || []
                }
                : blank
        ) || [];

        handleChange('options', {...formData.options, blanks: updatedBlanks});
    };

    const updateAcceptableAnswer = (blankIndex: number, answerIndex: number, newValue: string) => {
        const updatedBlanks = formData.options.blanks?.map((blank, i) =>
            i === blankIndex
                ? {
                    ...blank,
                    acceptableAnswers: blank.acceptableAnswers?.map((answer, j) =>
                        j === answerIndex ? newValue : answer
                    ) || []
                }
                : blank
        ) || [];

        handleChange('options', {...formData.options, blanks: updatedBlanks});
    };

    // Validation fonksiyonu - parent tarafından çağrılacak
    const validateForm = (): boolean => {
        const newErrors: FillInTheBlanksTemplateFormErrors = {};

        if (!formData.textWithBlanks.trim()) {
            newErrors.textWithBlanks = 'Boşluklu metin zorunludur';
        }

        if (!formData.options.blanks || formData.options.blanks.length === 0) {
            newErrors.options = 'En az bir boşluk tanımlanmalıdır';
        } else {
            const invalidBlanks = formData.options.blanks.some(blank =>
                !blank.acceptableAnswers || blank.acceptableAnswers.length === 0 ||
                blank.acceptableAnswers.some(answer => !answer.trim())
            );
            if (invalidBlanks) {
                newErrors.options = 'Tüm boşluklar için en az bir kabul edilebilir cevap girilmelidir';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Parent component'in validate fonksiyonunu çağırabilmesi için
    useImperativeHandle(ref, () => ({
        validate: validateForm,
        getErrors: () => errors
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Boşluk Doldurma Şablon Detayları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Boşluklu Metin */}
                    <div className="space-y-2">
                        <Label htmlFor="textWithBlanks">Boşluklu Metin *</Label>
                        <Textarea
                            id="textWithBlanks"
                            value={formData.textWithBlanks}
                            onChange={(e) => handleChange('textWithBlanks', e.target.value)}
                            className={`min-h-[120px] ${errors.textWithBlanks ? 'border-red-500' : ''}`}
                            placeholder="Metni giriniz. Boşlukları [blank_1], [blank_2] şeklinde işaretleyiniz."
                        />
                        <p className="text-sm text-gray-500">
                            İpucu: Boşlukları [blank_1], [blank_2], [blank_3] şeklinde numaralandırarak işaretleyin.
                        </p>
                        {errors.textWithBlanks && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.textWithBlanks}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Genel Ayarlar */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="caseSensitive"
                                checked={formData.caseSensitive}
                                onChange={(checked) => handleChange('caseSensitive', !!checked)}
                            />
                            <Label htmlFor="caseSensitive">Büyük/Küçük Harf Duyarlı</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="exactMatch"
                                checked={formData.exactMatch}
                                onChange={(checked) => handleChange('exactMatch', !!checked)}
                            />
                            <Label htmlFor="exactMatch">Tam Eşleşme Gerekli</Label>
                        </div>
                    </div>

                    {/* Boşluk Tanımları */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Boşluk Tanımları *</Label>
                            <p className="text-sm text-gray-500">
                                Metne [blank_1], [blank_2] gibi boşluklar ekleyerek otomatik olarak boşluk tanımları oluşturulur.
                            </p>
                        </div>

                        {formData.options.blanks?.map((blank, blankIndex) => (
                            <div key={`${blank.blankId || 'blank'}-${blankIndex}`} className="p-4 border rounded-lg space-y-4">
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-2">
                                        <Label>Boşluk</Label>
                                        <Input
                                            value={getBlankDisplayText(blank.blankId)}
                                            disabled
                                            placeholder="[blank_1]"
                                            className="bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label>Puan</Label>
                                        <NumberInput
                                            inputType={"number"}
                                            value={blank.score || 1}
                                            onChange={(val) => updateBlank(blankIndex, 'score', val)}
                                            minValue={0}
                                            decimalPlaces={0}
                                        />
                                    </div>

                                    <div className="col-span-8 flex justify-end">
                                        <p className="text-sm text-gray-500 self-center">
                                            Boşluğu silmek için metinden [blank_X] ifadesini kaldırın.
                                        </p>
                                    </div>
                                </div>

                                {/* Kabul Edilebilir Cevaplar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Kabul Edilebilir Cevaplar *</Label>
                                        <Button
                                            type="button"
                                            onClick={() => addAcceptableAnswer(blankIndex)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                            size="sm"
                                        >
                                            <Plus className="w-4 h-4 mr-2"/>
                                            Cevap Ekle
                                        </Button>
                                    </div>

                                    {blank.acceptableAnswers?.map((answer, answerIndex) => (
                                        <div key={`${blank.blankId || 'blank'}-${blankIndex}-answer-${answerIndex}`} className="flex gap-2">
                                            <Input
                                                value={answer}
                                                onChange={(e) => updateAcceptableAnswer(blankIndex, answerIndex, e.target.value)}
                                                placeholder={`Kabul edilebilir cevap ${answerIndex + 1}`}
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => removeAcceptableAnswer(blankIndex, answerIndex)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {errors.options && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.options}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Açıklama - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş string gönderiliyor */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="explanation">Açıklama</Label>
                        <Textarea
                            id="explanation"
                            value={formData.explanation}
                            onChange={(e) => handleChange('explanation', e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Soru açıklaması (opsiyonel)"
                        />
                    </div> */}

                    {/* KAYDET BUTONU KALDIRILDI - Parent component'te olacak */}
                </div>
            </CardContent>
        </Card>
    );
});

FillInTheBlanksTemplateForm.displayName = 'FillInTheBlanksTemplateForm';

export default FillInTheBlanksTemplateForm;
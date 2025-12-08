'use client';
import React, {useEffect, useState} from "react";
import ExamSectionsList from "@/components/take/SectionList";
import {ExamSectionDto} from "@/types/exam/examTemplates";
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";
import ExamApplicationScreen from "@/components/take/ExamApplicationScreen";
import {QuestionGroupDto} from "@/types/exam/examEntities";

export interface SectionQuestionCounts {
    sectionId: string;
    questionCount: number;
    completedQuestionCount: number;
    unDoneQuestionCount: number;
}

export default function Page() {
    const {exam: examState, examSections, getExamData} = useExamApplicationContext();
    const [sectionQuestionStatics, setSectionQuestionStatics] = useState<SectionQuestionCounts[]>([]);
    const [questionGroups, setQuestionGroups] = useState<QuestionGroupDto[]>([]);
    const [activeScreen, setActiveScreen] = useState<'SECTION' | 'SECTION_DESCRIPTION' | 'QUESTION_GROUPS'>('SECTION');
    const [selectedSection, setSelectedSection] = useState<ExamSectionDto | null>(null);

    console.log(setSectionQuestionStatics)

    useEffect(() => {
        const loadInitialData = async () => {
            if (examState) {
                getExamData(examState.id)
            }
        };
        if (examState && examSections.length == 0)
            loadInitialData();
    }, [examState]);


    function getUQuestionGroupsFromSelectedSection() {
        if (!selectedSection || !examState || !examState.questionGroups) {
            setQuestionGroups([]);
            return;
        }
        const filteredQuestionGroups = examState.questionGroups.filter(
            qg => qg.examSection?.id === selectedSection.id
        );
        setQuestionGroups(filteredQuestionGroups);
    }

    useEffect(() => {
        if (selectedSection) {
            getUQuestionGroupsFromSelectedSection()
        }

    }, [selectedSection]);

    const selectSection = (section: ExamSectionDto) => {
        setSelectedSection(section);
        setActiveScreen("SECTION_DESCRIPTION");
    }

    const handleDescriptionConfirm = () => {
        setActiveScreen("QUESTION_GROUPS");
    }

    const getSectionDescription = (sectionName: string | undefined): string => {
        if (!sectionName) {
            return getDefaultDescription();
        }

        const upperName = sectionName.toUpperCase();

        // OKUMA - ANLAMA veya OKUMA ANLAMA
        if (upperName.includes('OKUMA') && upperName.includes('ANLAMA')) {
            return `Bu bölümde okuma ve anlama becerileriniz ölçülecektir. Size verilen metinleri dikkatlice okuyun ve soruları cevaplayın. 
            Metinlerdeki detaylara dikkat edin ve her soruyu metne göre cevaplamaya özen gösterin. 
            Zamanınızı iyi kullanın ve tüm soruları cevaplamaya çalışın. Başarılar dileriz!`;
        }

        // DİNLEME ANLAMA
        if (upperName.includes('DİNLEME') && upperName.includes('ANLAMA')) {
            return `Bu bölümde dinleme ve anlama becerileriniz ölçülecektir. Size dinletilecek ses kayıtlarını dikkatlice dinleyin ve soruları cevaplayın. 
            Ses kayıtlarını tamamlamadan soruları cevaplamaya çalışmayın. Not almak isterseniz kağıt ve kalem kullanabilirsiniz. 
            Her ses kaydını bir kez dinleyeceksiniz, bu yüzden dikkatli olun. Başarılar dileriz!`;
        }

        // KARŞILIKLI KONUŞMA
        if (upperName.includes('KARŞILIKLI') && upperName.includes('KONUŞMA')) {
            return `Bu bölümde karşılıklı konuşma becerileriniz ölçülecektir. Size verilen durumlara uygun şekilde konuşmanız beklenmektedir. 
            Doğal ve akıcı konuşmaya çalışın. Verilen süre içinde düşüncelerinizi açık ve anlaşılır bir şekilde ifade edin. 
            Konuşma sırasında uygun dil yapılarını ve kelimeleri kullanmaya özen gösterin. Başarılar dileriz!`;
        }

        // SÖZLÜ ANLATIM
        if (upperName.includes('SÖZLÜ') && upperName.includes('ANLATIM')) {
            return `Bu bölümde sözlü anlatım becerileriniz ölçülecektir. Size verilen konu hakkında belirli bir süre içinde konuşmanız beklenmektedir. 
            Konuşmanızı planlayın, düşüncelerinizi mantıklı bir sırayla sunun. Açık ve anlaşılır konuşmaya özen gösterin. 
            Verilen süreyi verimli kullanın ve konuyu kapsamlı bir şekilde ele alın. Başarılar dileriz!`;
        }

        // YAZILI ANLATIM
        if (upperName.includes('YAZILI') && upperName.includes('ANLATIM')) {
            return `Bu bölümde yazılı anlatım becerileriniz ölçülecektir. Size verilen konu hakkında belirli bir süre içinde yazı yazmanız beklenmektedir. 
            Yazınızı planlayın, giriş, gelişme ve sonuç bölümlerini içeren düzenli bir yapı oluşturun. 
            Dilbilgisi kurallarına dikkat edin, noktalama işaretlerini doğru kullanın. Verilen süreyi iyi değerlendirin. Başarılar dileriz!`;
        }

        // Default metin
        return getDefaultDescription();
    }

    const getDefaultDescription = (): string => {
        return `Bu bölümde çeşitli sorular bulunmaktadır. Lütfen her soruyu dikkatlice okuyun ve doğru cevapları seçin. 
        Soruları atlamadan sırayla cevaplamanız önemlidir. Her soru için yeterli süreniz bulunmaktadır. 
        Başarılar dileriz!`;
    }

    return (
        <div className="space-y-6">
            {
                activeScreen === 'SECTION' &&
                <ExamSectionsList sectionQuestionStatics={sectionQuestionStatics} sections={examSections}
                                  onSectionSelect={selectSection}/>
            }

            {
                activeScreen === 'SECTION_DESCRIPTION' && selectedSection && (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-2xl border-4 border-blue-400 p-8 max-w-3xl w-full mx-4">
                            <div className="text-center">
                                <div className="mb-6">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                        {selectedSection.name || 'Bölüm Açıklaması'}
                                    </h2>
                                </div>
                                <div className="bg-white rounded-lg p-6 mb-6 text-left">
                                    <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                                        {getSectionDescription(selectedSection.name)}
                                    </p>
                                </div>
                                <button
                                    onClick={handleDescriptionConfirm}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
                                >
                                    Tamam
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                questionGroups && questionGroups.length > 0 && activeScreen === 'QUESTION_GROUPS' &&

                <ExamApplicationScreen questionGroups={questionGroups}
                                       onExitExam={() => setActiveScreen('SECTION')}/>
            }
        </div>
    );
}
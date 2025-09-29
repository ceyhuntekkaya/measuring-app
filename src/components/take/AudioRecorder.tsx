"use client";
import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface AudioRecorderProps {
    setStep: (step: 'login' | 'welcome' | 'camera' | 'audio' | 'section-selection' | 'exam-taking' | 'completed') => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({setStep}) => {




  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioURL('');

      // Timer başlat
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Mikrofon erişim hatası:', error);
      alert('Mikrofona erişim izni gerekli!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Ses Kaydedici
        </h2>

        <div className="flex flex-col items-center space-y-6">
          {/* Kayıt süresi */}
          {isRecording && (
            <div className="text-4xl font-mono text-purple-600 font-bold">
              {formatTime(recordingTime)}
            </div>
          )}

          {/* Kontrol butonları */}
          <div className="flex gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-6 transition-all transform hover:scale-105 shadow-lg"
              >
                <Mic size={32} />
              </button>
            ) : (
              <>
                <button
                  onClick={pauseRecording}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-6 transition-all transform hover:scale-105 shadow-lg"
                >
                  {isPaused ? <Play size={32} /> : <Pause size={32} />}
                </button>
                <button
                  onClick={stopRecording}
                  className="bg-gray-700 hover:bg-gray-800 text-white rounded-full p-6 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Square size={32} />
                </button>
              </>
            )}
          </div>

          {/* Durum mesajı */}
          <div className="text-center">
            {isRecording && !isPaused && (
              <p className="text-red-500 font-semibold flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                Kayıt devam ediyor...
              </p>
            )}
            {isRecording && isPaused && (
              <p className="text-yellow-600 font-semibold">Kayıt duraklatıldı</p>
            )}
            {!isRecording && !audioURL && (
              <p className="text-gray-500">Kayda başlamak için butona tıklayın</p>
            )}
          </div>

          {/* Ses oynatıcı */}
          {audioURL && !isRecording && (
            <div className="w-full mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2 font-semibold">Kaydedilen Ses:</p>

              <audio controls className="w-full" src={audioURL}>
                Tarayıcınız ses oynatmayı desteklemiyor.
              </audio>

                <button className={"btn btn-success"} onClick={()=>setStep("section-selection")}>SONRAKİ</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AudioRecorder;
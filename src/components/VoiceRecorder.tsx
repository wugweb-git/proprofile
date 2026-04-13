import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Save, Trash2, Volume2, Clock, Shield, ShieldOff } from 'lucide-react';
import { cn } from '../lib/utils';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export const VoiceRecorder = ({ onSave }: { onSave: (data: any) => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isGated, setIsGated] = useState(true);
  const [title, setTitle] = useState('');
  const [transcript, setTranscript] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isRecording) {
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              setTranscript(prev => prev + event.results[i][0].transcript + ' ');
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      setAudioBlob(null);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  const handleSave = () => {
    if (audioBlob && title) {
      onSave({
        title,
        content: transcript, // Save the transcript as content
        duration,
        isGated,
        timestamp: new Date().toISOString(),
        audioUrl: URL.createObjectURL(audioBlob),
        tags: ['RAW_INSIGHT', 'VOICE_TO_TEXT']
      });
      reset();
    }
  };

  const reset = () => {
    setAudioBlob(null);
    setDuration(0);
    setTitle('');
    setTranscript('');
    setIsRecording(false);
  };

  return (
    <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 space-y-6">
      <div className="flex justify-between items-center">
        <DotMatrixText color="text-red-600">STRATEGIC_SPARK_CAPTURE</DotMatrixText>
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/20">
          <Clock size={12} />
          <span className={cn(duration >= 25 ? "text-red-600" : "")}>{duration}s / 30s</span>
        </div>
      </div>

      <div className="space-y-4">
        <input 
          placeholder="INSIGHT_TITLE"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white font-display font-bold outline-none focus:border-red-600 transition-all"
        />

        {transcript && (
          <div className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-2">
            <DotMatrixText color="text-red-600">VOICE_TO_TEXT_TRANSCRIPT</DotMatrixText>
            <p className="text-white/60 text-xs leading-relaxed italic">
              "{transcript}"
            </p>
          </div>
        )}

        <div className="flex items-center justify-between bg-black/20 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3">
            {isGated ? <Shield size={18} className="text-red-600" /> : <ShieldOff size={18} className="text-white/20" />}
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest">Hybrid Gate</span>
          </div>
          <button 
            onClick={() => setIsGated(!isGated)}
            className={cn(
              "w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center",
              isGated ? "bg-red-600" : "bg-white/10"
            )}
          >
            <motion.div 
              animate={{ x: isGated ? 24 : 0 }}
              className="w-4 h-4 bg-white rounded-full"
            />
          </button>
        </div>

        <div className="flex items-center justify-center py-8">
          <AnimatePresence mode="wait">
            {!isRecording && !audioBlob ? (
              <motion.button
                key="start"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={startRecording}
                className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl shadow-red-600/40 hover:scale-110 transition-transform"
              >
                <Mic size={32} />
              </motion.button>
            ) : isRecording ? (
              <motion.button
                key="stop"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={stopRecording}
                className="w-24 h-24 rounded-full bg-black border-4 border-red-600 flex items-center justify-center text-red-600 shadow-2xl shadow-red-600/20"
              >
                <div className="w-8 h-8 bg-red-600 rounded-sm animate-pulse" />
              </motion.button>
            ) : (
              <motion.div
                key="preview"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <button onClick={reset} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white">
                    <Trash2 size={20} />
                  </button>
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-red-600">
                    <Volume2 size={32} />
                  </div>
                  <button onClick={handleSave} disabled={!title} className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white disabled:opacity-20">
                    <Save size={20} />
                  </button>
                </div>
                <DotMatrixText color="text-red-600">INSIGHT_CAPTURED</DotMatrixText>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isRecording && (
        <div className="flex justify-center gap-1 h-8 items-end">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [10, Math.random() * 30 + 10, 10] }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
              className="w-1 bg-red-600 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { XIcon } from './icons/XIcon';
import { BotIcon } from './icons/BotIcon';
// 确保 utils 路径是对的
import { convertFloat32ToInt16, arrayBufferToBase64, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';
import { AI_SYSTEM_PROMPT } from '../constants';

interface LiveVoiceModalProps {
  onClose: () => void;
}

const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'active' | 'error' | 'closed'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [volumeLevel, setVolumeLevel] = useState<number>(0); 

  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startSession = async () => {
      try {
        // 【大哥修正点】：这里改成 Vite 的读取方式！
        const API_KEY = import.meta.env.VITE_API_KEY;
        if (!API_KEY) throw new Error("未找到 API Key，请检查 .env 文件");
        
        const ai = new GoogleGenAI({ apiKey: API_KEY });

        // 1. Setup Audio Contexts
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        const audioContext = new AudioContextClass({ sampleRate: 24000 }); 
        audioContextRef.current = audioContext;
        
        // 2. Get Microphone Stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true
        }});
        streamRef.current = stream;

        // 3. Connect to Gemini Live
        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    if (!isMounted) return;
                    setStatus('active');
                    console.log("Live session connected");

                    const inputContext = new AudioContextClass({ sampleRate: 16000 });
                    const source = inputContext.createMediaStreamSource(stream);
                    const processor = inputContext.createScriptProcessor(4096, 1, 1);
                    
                    processor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        
                        // 计算音量动画
                        let sum = 0;
                        for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                        const rms = Math.sqrt(sum / inputData.length);
                        setVolumeLevel(Math.min(rms * 5, 1)); 

                        // 音频转换核心逻辑
                        const pcm16 = convertFloat32ToInt16(inputData);
                        const base64Data = arrayBufferToBase64(pcm16.buffer);
                        
                        sessionPromise.then(session => {
                            session.sendRealtimeInput({
                                media: {
                                    mimeType: 'audio/pcm;rate=16000',
                                    data: base64Data
                                }
                            });
                        });
                    };

                    source.connect(processor);
                    processor.connect(inputContext.destination);
                    
                    inputSourceRef.current = source;
                    scriptProcessorRef.current = processor;
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (!isMounted) return;
                    
                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio) {
                        const audioData = base64ToUint8Array(base64Audio);
                        const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
                        
                        const source = audioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(audioContext.destination);
                        
                        const currentTime = audioContext.currentTime;
                        if (nextStartTimeRef.current < currentTime) {
                            nextStartTimeRef.current = currentTime;
                        }
                        
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                    }

                    if (message.serverContent?.interrupted) {
                        nextStartTimeRef.current = 0;
                    }
                },
                onclose: () => {
                    console.log("Session closed");
                    if (isMounted) setStatus('closed');
                },
                onerror: (err) => {
                    console.error("Session error", err);
                    if (isMounted) {
                        setStatus('error');
                        setErrorMessage("连接中断");
                    }
                }
            },
            config: {
                responseModalities: [Modality.AUDIO],
                systemInstruction: AI_SYSTEM_PROMPT + " 请用简短、生动的口语回答，像一个耐心的老师在和孩子聊天。",
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
                }
            }
        });

        sessionRef.current = sessionPromise;

      } catch (e: any) {
        console.error("Failed to start live session", e);
        if (isMounted) {
            setStatus('error');
            setErrorMessage(e.message || "无法连接麦克风或服务器");
        }
      }
    };

    startSession();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current.onaudioprocess = null;
      }
      if (inputSourceRef.current) {
        inputSourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-md p-8 flex flex-col items-center justify-center">
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-white/70 hover:text-white transition-colors"
        >
          <XIcon className="w-8 h-8" />
        </button>

        <div className="mb-8 text-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)] relative">
                <BotIcon className="w-12 h-12 text-white z-10" />
                {status === 'active' && (
                    <>
                        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                        <div 
                            className="absolute inset-0 bg-white rounded-full opacity-10 transition-transform duration-75"
                            style={{ transform: `scale(${1 + volumeLevel})` }}
                        ></div>
                    </>
                )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">小桃语音模式</h2>
            <p className="text-blue-200">
                {status === 'connecting' && "正在连接..."}
                {status === 'active' && "正在聆听..."}
                {status === 'error' && errorMessage}
                {status === 'closed' && "通话结束"}
            </p>
        </div>

        <div className="flex justify-center space-x-8">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-full border border-red-500/50 transition-all"
            >
                结束通话
            </button>
        </div>
      </div>
    </div>
  );
};

export default LiveVoiceModal;

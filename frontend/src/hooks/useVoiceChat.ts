import { useState, useRef, useCallback, useEffect } from 'react';

export type VoiceChatStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface VoiceTranscriptTurn {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface UseVoiceChatOptions {
  onUserSpeech: (text: string) => Promise<string>;
  onTurnComplete?: (question: string, response: string) => void;
}

// Minimal interfaces for Web Speech API (not always in TS lib)
interface ISpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): { transcript: string; confidence: number };
  [index: number]: { transcript: string; confidence: number };
}

interface ISpeechRecognitionResultList {
  readonly length: number;
  item(index: number): ISpeechRecognitionResult;
  [index: number]: ISpeechRecognitionResult;
}

interface ISpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: ISpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: ISpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: ISpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

// Check browser support
export function checkVoiceChatSupport(): { recognition: boolean; synthesis: boolean } {
  const recognition =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const synthesis =
    typeof window !== 'undefined' && 'speechSynthesis' in window;
  return { recognition, synthesis };
}

function getSpeechRecognitionConstructor(): ISpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;
  if (typeof w['SpeechRecognition'] === 'function') {
    return w['SpeechRecognition'] as ISpeechRecognitionConstructor;
  }
  if (typeof w['webkitSpeechRecognition'] === 'function') {
    return w['webkitSpeechRecognition'] as ISpeechRecognitionConstructor;
  }
  return null;
}

export function useVoiceChat({ onUserSpeech, onTurnComplete }: UseVoiceChatOptions) {
  const [status, setStatus] = useState<VoiceChatStatus>('idle');
  const [transcript, setTranscript] = useState<VoiceTranscriptTurn[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState('');

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isProcessingRef = useRef(false);
  const isActiveRef = useRef(false);
  const interimTextRef = useRef('');

  // Keep refs in sync
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    interimTextRef.current = interimText;
  }, [interimText]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    synthRef.current = null;
  }, []);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
  }, []);

  const speakText = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve) => {
        stopSpeaking();

        // Clean text for speech (remove markdown)
        const cleanText = text
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/#{1,6}\s/g, '')
          .replace(/`(.*?)`/g, '$1')
          .replace(/\n+/g, '. ')
          .replace(/\|.*?\|/g, '')
          .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to use a natural voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Google') ||
                v.name.includes('Natural') ||
                v.name.includes('Premium'))
          ) || voices.find((v) => v.lang.startsWith('en'));
        if (preferredVoice) utterance.voice = preferredVoice;

        synthRef.current = utterance;

        utterance.onend = () => {
          synthRef.current = null;
          resolve();
        };

        utterance.onerror = () => {
          synthRef.current = null;
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [stopSpeaking]
  );

  // Forward-declare startRecognition so processUserSpeech can reference it
  const startRecognitionRef = useRef<() => void>(() => {});

  const processUserSpeech = useCallback(
    async (text: string) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      stopSpeaking();

      const userTurn: VoiceTranscriptTurn = {
        id: `user-${Date.now()}`,
        speaker: 'user',
        text,
        timestamp: new Date(),
      };
      setTranscript((prev) => [...prev, userTurn]);
      setStatus('thinking');

      try {
        const aiResponse = await onUserSpeech(text);

        if (!isActiveRef.current) {
          isProcessingRef.current = false;
          return;
        }

        const aiTurn: VoiceTranscriptTurn = {
          id: `ai-${Date.now()}`,
          speaker: 'ai',
          text: aiResponse,
          timestamp: new Date(),
        };
        setTranscript((prev) => [...prev, aiTurn]);

        setStatus('speaking');
        await speakText(aiResponse);

        if (onTurnComplete) {
          onTurnComplete(text, aiResponse);
        }
      } catch {
        setError('Failed to get AI response');
      } finally {
        isProcessingRef.current = false;
        if (isActiveRef.current) {
          setStatus('listening');
          setTimeout(() => {
            if (isActiveRef.current) {
              startRecognitionRef.current();
            }
          }, 400);
        }
      }
    },
    [onUserSpeech, onTurnComplete, stopSpeaking, speakText]
  );

  const startRecognition = useCallback(() => {
    if (!isActiveRef.current) return;

    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      if (isActiveRef.current) {
        setStatus('listening');
        setInterimText('');
      }
    };

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (interim) {
        setInterimText(interim);
        interimTextRef.current = interim;
      }
      if (final) {
        setInterimText('');
        interimTextRef.current = '';
        if (!isProcessingRef.current) {
          processUserSpeech(final.trim());
        }
      }
    };

    recognition.onend = () => {
      if (!isActiveRef.current) return;

      const lastInterim = interimTextRef.current;
      setInterimText('');
      interimTextRef.current = '';

      if (lastInterim.trim() && !isProcessingRef.current) {
        processUserSpeech(lastInterim.trim());
      } else if (!isProcessingRef.current) {
        setTimeout(() => {
          if (isActiveRef.current && !isProcessingRef.current) {
            startRecognitionRef.current();
          }
        }, 300);
      }
    };

    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' || event.error === 'aborted') {
        setTimeout(() => {
          if (isActiveRef.current && !isProcessingRef.current) {
            startRecognitionRef.current();
          }
        }, 300);
        return;
      }
      setError(`Speech recognition error: ${event.error}`);
    };

    recognition.start();
  }, [processUserSpeech]);

  // Keep the ref up to date
  useEffect(() => {
    startRecognitionRef.current = startRecognition;
  }, [startRecognition]);

  const startSession = useCallback(() => {
    const support = checkVoiceChatSupport();
    if (!support.recognition || !support.synthesis) {
      setError('Your browser does not support voice chat. Please use Chrome or Edge.');
      return;
    }

    setError(null);
    setIsActive(true);
    isActiveRef.current = true;
    isProcessingRef.current = false;
    setStatus('listening');

    setTimeout(() => {
      startRecognitionRef.current();
    }, 100);
  }, []);

  const stopSession = useCallback(() => {
    isActiveRef.current = false;
    setIsActive(false);
    isProcessingRef.current = false;
    stopSpeaking();
    stopRecognition();
    setStatus('idle');
    setInterimText('');
    interimTextRef.current = '';
  }, [stopSpeaking, stopRecognition]);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      stopSpeaking();
      stopRecognition();
    };
  }, [stopSpeaking, stopRecognition]);

  return {
    status,
    transcript,
    isActive,
    error,
    interimText,
    startSession,
    stopSession,
    clearTranscript,
  };
}

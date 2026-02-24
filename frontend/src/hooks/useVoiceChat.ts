import { useState, useRef, useCallback, useEffect } from 'react';

export type VoiceChatState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface UseVoiceChatOptions {
  onUserSpeech: (text: string) => Promise<string>;
  onTurnComplete?: (question: string, response: string) => void;
}

export interface TranscriptTurn {
  role: 'user' | 'ai';
  text: string;
  id: string;
}

// Check Web Speech API support
const getSpeechRecognitionClass = (): (new () => ISpeechRecognition) | null => {
  const w = window as unknown as Record<string, unknown>;
  return (w['SpeechRecognition'] as (new () => ISpeechRecognition)) ||
    (w['webkitSpeechRecognition'] as (new () => ISpeechRecognition)) ||
    null;
};

export function useVoiceChat({ onUserSpeech, onTurnComplete }: UseVoiceChatOptions) {
  const [state, setState] = useState<VoiceChatState>('idle');
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);
  const [interimText, setInterimText] = useState('');
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!getSpeechRecognitionClass() && 'speechSynthesis' in window;
  });

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const stateRef = useRef<VoiceChatState>('idle');
  const isSessionActiveRef = useRef(false);
  const onUserSpeechRef = useRef(onUserSpeech);
  const onTurnCompleteRef = useRef(onTurnComplete);
  const shouldRestartRef = useRef(false);

  // Keep refs in sync with latest callbacks
  useEffect(() => {
    onUserSpeechRef.current = onUserSpeech;
  }, [onUserSpeech]);

  useEffect(() => {
    onTurnCompleteRef.current = onTurnComplete;
  }, [onTurnComplete]);

  const updateState = useCallback((newState: VoiceChatState) => {
    stateRef.current = newState;
    setState(newState);
  }, []);

  const speakText = useCallback((text: string, onDone?: () => void) => {
    if (!('speechSynthesis' in window)) {
      onDone?.();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text for TTS - remove markdown, tables, special chars
    const cleaned = text
      .replace(/\|[^\n]*\|/g, '') // remove table rows
      .replace(/[-]{3,}/g, '') // remove horizontal rules
      .replace(/#{1,6}\s/g, '') // remove headings
      .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
      .replace(/\*(.*?)\*/g, '$1') // remove italic
      .replace(/`(.*?)`/g, '$1') // remove code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links
      .replace(/[•→←↑↓]/g, '') // remove special chars
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned) {
      onDone?.();
      return;
    }

    updateState('speaking');

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a natural voice
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferred = voices.find(v =>
          v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (preferred) utterance.voice = preferred;
      }

      utterance.onend = () => {
        if (isSessionActiveRef.current) {
          onDone?.();
        }
      };

      utterance.onerror = () => {
        if (isSessionActiveRef.current) {
          onDone?.();
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      setVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        setVoiceAndSpeak();
      };
      // Fallback if onvoiceschanged never fires
      setTimeout(() => {
        if (stateRef.current === 'speaking') {
          setVoiceAndSpeak();
        }
      }, 500);
    }
  }, [updateState]);

  const startRecognition = useCallback(() => {
    if (!isSessionActiveRef.current) return;

    const SpeechRecognitionClass = getSpeechRecognitionClass();
    if (!SpeechRecognitionClass) return;

    // Clean up previous instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) { /* ignore */ }
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    updateState('listening');
    setInterimText('');

    recognition.onstart = () => {
      updateState('listening');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
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

      setInterimText(interim);

      if (final.trim()) {
        setInterimText('');
        const userText = final.trim();

        // Add user turn to transcript
        setTranscript(prev => [...prev, {
          role: 'user',
          text: userText,
          id: `user-${Date.now()}`
        }]);

        updateState('thinking');

        // Get AI response
        onUserSpeechRef.current(userText).then(response => {
          if (!isSessionActiveRef.current) return;

          // Add AI turn to transcript
          setTranscript(prev => [...prev, {
            role: 'ai',
            text: response,
            id: `ai-${Date.now()}`
          }]);

          // Notify parent
          onTurnCompleteRef.current?.(userText, response);

          // Speak the response, then restart listening
          speakText(response, () => {
            if (isSessionActiveRef.current) {
              updateState('idle');
              // Small delay before restarting recognition
              setTimeout(() => {
                if (isSessionActiveRef.current) {
                  startRecognition();
                }
              }, 300);
            }
          });
        }).catch(() => {
          if (isSessionActiveRef.current) {
            updateState('idle');
          }
        });
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' || event.error === 'aborted') {
        // Restart on no-speech if session is still active
        if (isSessionActiveRef.current && stateRef.current === 'listening') {
          setTimeout(() => {
            if (isSessionActiveRef.current && stateRef.current === 'listening') {
              startRecognition();
            }
          }, 200);
        }
        return;
      }
      // For other errors, just update state
      if (isSessionActiveRef.current) {
        updateState('idle');
      }
    };

    recognition.onend = () => {
      // If we're still in listening state and session is active, restart
      if (isSessionActiveRef.current && stateRef.current === 'listening') {
        setTimeout(() => {
          if (isSessionActiveRef.current && stateRef.current === 'listening') {
            startRecognition();
          }
        }, 200);
      }
    };

    try {
      recognition.start();
    } catch (err) {
      // Recognition might already be started
      console.warn('Recognition start error:', err);
    }
  }, [updateState, speakText]);

  const startSession = useCallback(() => {
    if (!isSupported) return;
    if (isSessionActiveRef.current) return;

    isSessionActiveRef.current = true;
    shouldRestartRef.current = false;
    updateState('listening');

    setTimeout(() => {
      if (isSessionActiveRef.current) {
        startRecognition();
      }
    }, 100);
  }, [isSupported, updateState, startRecognition]);

  const stopSession = useCallback(() => {
    isSessionActiveRef.current = false;
    shouldRestartRef.current = false;

    // Stop recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) { /* ignore */ }
      recognitionRef.current = null;
    }

    // Stop speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    updateState('idle');
    setInterimText('');
  }, [updateState]);

  const interruptAI = useCallback(() => {
    if (stateRef.current !== 'speaking') return;

    // Stop speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Restart listening
    if (isSessionActiveRef.current) {
      setTimeout(() => {
        if (isSessionActiveRef.current) {
          startRecognition();
        }
      }, 100);
    }
  }, [startRecognition]);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isSessionActiveRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) { /* ignore */ }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    state,
    transcript,
    interimText,
    isSupported,
    isActive: isSessionActiveRef.current,
    startSession,
    stopSession,
    interruptAI,
    clearTranscript,
  };
}

import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Volume2, Brain, User, Dna, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { VoiceChatStatus, VoiceTranscriptTurn } from '../hooks/useVoiceChat';
import { checkVoiceChatSupport } from '../hooks/useVoiceChat';

interface VoiceChatInterfaceProps {
  status: VoiceChatStatus;
  transcript: VoiceTranscriptTurn[];
  isActive: boolean;
  error: string | null;
  interimText: string;
  onStart: () => void;
  onStop: () => void;
}

function StatusBadge({ status }: { status: VoiceChatStatus }) {
  const config: Record<VoiceChatStatus, { label: string; className: string }> = {
    idle: { label: 'Ready', className: 'bg-muted text-muted-foreground' },
    listening: {
      label: 'Listening…',
      className: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    },
    thinking: {
      label: 'Thinking…',
      className: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30',
    },
    speaking: { label: 'Speaking…', className: 'bg-primary/20 text-primary border-primary/30' },
  };
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${className}`}
    >
      {status === 'listening' && (
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      )}
      {status === 'thinking' && (
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      )}
      {status === 'speaking' && (
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
      {status === 'idle' && (
        <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
      )}
      {label}
    </span>
  );
}

function WaveformAnimation({ active }: { active: boolean }) {
  const bars = [3, 5, 8, 6, 4, 7, 5, 3, 6, 4, 8, 5, 3];
  return (
    <div className="flex items-center justify-center gap-0.5 h-10">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all ${
            active ? 'bg-primary' : 'bg-muted-foreground/30'
          }`}
          style={
            active
              ? {
                  height: `${height * 3}px`,
                  animation: `voiceBar 0.8s ease-in-out ${i * 60}ms infinite alternate`,
                }
              : { height: '4px' }
          }
        />
      ))}
    </div>
  );
}

function MicButton({
  status,
  isActive,
  onStart,
  onStop,
}: {
  status: VoiceChatStatus;
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
}) {
  const isListening = status === 'listening';
  const isSpeaking = status === 'speaking';
  const isThinking = status === 'thinking';

  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <>
          <span className="absolute w-28 h-28 rounded-full bg-emerald-500/10 animate-ping" />
          <span className="absolute w-24 h-24 rounded-full bg-emerald-500/15 animate-pulse" />
        </>
      )}
      {isSpeaking && (
        <>
          <span className="absolute w-28 h-28 rounded-full bg-primary/10 animate-ping" />
          <span className="absolute w-24 h-24 rounded-full bg-primary/15 animate-pulse" />
        </>
      )}

      <button
        onClick={isActive ? onStop : onStart}
        className={`
          relative z-10 w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-lg active:scale-95
          ${
            isActive
              ? isListening
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                : isSpeaking
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/30'
                : isThinking
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              : 'bg-card border-2 border-border hover:border-primary/50 hover:bg-primary/5 text-foreground'
          }
        `}
        aria-label={isActive ? 'Stop voice chat' : 'Start voice chat'}
      >
        {isActive ? (
          isThinking ? (
            <Brain className="h-8 w-8 animate-pulse" />
          ) : isSpeaking ? (
            <Volume2 className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </button>
    </div>
  );
}

function TranscriptMessage({ turn }: { turn: VoiceTranscriptTurn }) {
  const time = turn.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isUser = turn.speaker === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
          isUser ? 'bg-accent' : 'bg-primary/10'
        }`}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5 text-accent-foreground" />
        ) : (
          <Dna className="h-3.5 w-3.5 text-primary" />
        )}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-accent text-accent-foreground rounded-tr-sm'
              : 'bg-muted text-foreground rounded-tl-sm'
          }`}
        >
          {turn.text}
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">{time}</span>
      </div>
    </div>
  );
}

export default function VoiceChatInterface({
  status,
  transcript,
  isActive,
  error,
  interimText,
  onStart,
  onStop,
}: VoiceChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const support = checkVoiceChatSupport();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript.length, interimText]);

  // Browser not supported
  if (!support.recognition || !support.synthesis) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <MicOff className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold mb-2">Voice Chat Not Supported</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Your browser doesn't support the Web Speech API required for voice chat. Please use{' '}
            <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> for the best
            experience.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <Badge variant="outline">Chrome ✓</Badge>
          <Badge variant="outline">Edge ✓</Badge>
          <Badge variant="secondary">Firefox ✗</Badge>
          <Badge variant="secondary">Safari (limited)</Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Error */}
      {error && (
        <div className="px-4 pt-3">
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Transcript area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef as React.RefObject<HTMLDivElement>}>
          <div className="p-4 space-y-4">
            {transcript.length === 0 && !isActive && (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Mic className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold mb-1">
                  Live Voice Conversation
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Tap the microphone to start a real-time voice conversation with your AI biology
                  tutor.
                </p>
              </div>
            )}

            {transcript.map((turn) => (
              <TranscriptMessage key={turn.id} turn={turn} />
            ))}

            {/* Interim text while listening */}
            {isActive && interimText && (
              <div className="flex gap-3 flex-row-reverse opacity-60">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 mt-1">
                  <User className="h-3.5 w-3.5 text-accent-foreground" />
                </div>
                <div className="max-w-[80%] flex flex-col items-end">
                  <div className="px-3 py-2 rounded-2xl rounded-tr-sm text-sm bg-accent/50 text-accent-foreground italic">
                    {interimText}…
                  </div>
                </div>
              </div>
            )}

            {/* Thinking indicator */}
            {status === 'thinking' && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Dna className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-muted">
                  <div className="flex gap-1 items-center">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Controls */}
      <div className="border-t border-border p-6 flex flex-col items-center gap-4 bg-card/50">
        {/* Waveform */}
        <WaveformAnimation active={status === 'listening' || status === 'speaking'} />

        {/* Status badge */}
        <StatusBadge status={status} />

        {/* Mic button */}
        <MicButton status={status} isActive={isActive} onStart={onStart} onStop={onStop} />

        {/* Hint text */}
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          {!isActive
            ? 'Tap the microphone to begin. Speak naturally — the AI will respond in real time.'
            : status === 'listening'
            ? 'Listening… speak your biology question clearly.'
            : status === 'thinking'
            ? 'Processing your question…'
            : status === 'speaking'
            ? 'AI is responding — you can interrupt by speaking.'
            : ''}
        </p>

        {/* Stop button when active */}
        {isActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onStop}
            className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            End Session
          </Button>
        )}
      </div>
    </div>
  );
}

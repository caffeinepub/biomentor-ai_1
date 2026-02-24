import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Volume2, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVoiceChat, VoiceChatState, TranscriptTurn } from '../hooks/useVoiceChat';

interface VoiceChatInterfaceProps {
  onUserSpeech: (text: string) => Promise<string>;
  onTurnComplete?: (question: string, response: string) => void;
}

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-300 ${
            active ? 'bg-primary animate-voiceBar' : 'bg-muted h-1'
          }`}
          style={active ? {
            animationDelay: `${(i - 1) * 0.1}s`,
            height: `${Math.max(8, Math.min(32, 8 + ((i * 7) % 24)))}px`,
          } : undefined}
        />
      ))}
    </div>
  );
}

function StatusBadge({ state }: { state: VoiceChatState }) {
  const config: Record<VoiceChatState, { label: string; className: string }> = {
    idle: { label: 'Ready', className: 'bg-muted text-muted-foreground' },
    listening: { label: 'Listening…', className: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30' },
    thinking: { label: 'Thinking…', className: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30' },
    speaking: { label: 'Speaking…', className: 'bg-primary/20 text-primary border-primary/30' },
  };
  const { label, className } = config[state];
  return (
    <Badge variant="outline" className={`text-xs font-medium px-3 py-1 ${className}`}>
      {label}
    </Badge>
  );
}

function TranscriptMessage({ turn }: { turn: TranscriptTurn }) {
  const isUser = turn.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
        isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
      }`}>
        {isUser ? 'You' : 'AI'}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isUser
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-muted text-foreground rounded-tl-sm'
      }`}>
        {turn.text}
      </div>
    </div>
  );
}

export default function VoiceChatInterface({ onUserSpeech, onTurnComplete }: VoiceChatInterfaceProps) {
  const { state, transcript, interimText, isSupported, startSession, stopSession, interruptAI, clearTranscript } = useVoiceChat({
    onUserSpeech,
    onTurnComplete,
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const isActive = state !== 'idle' || transcript.length > 0;
  const sessionRunning = state !== 'idle';

  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimText]);

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center p-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">Voice Chat Not Supported</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Your browser doesn't support the Web Speech API. Please try Chrome, Edge, or Safari for voice chat functionality.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Status bar */}
      <div className="flex items-center justify-between px-1">
        <StatusBadge state={state} />
        <div className="flex items-center gap-2">
          {(state === 'listening' || state === 'speaking') && (
            <WaveformBars active={true} />
          )}
          {transcript.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={clearTranscript}
              title="Clear transcript"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Transcript area */}
      <ScrollArea className="flex-1 min-h-0 rounded-xl border border-border bg-background/50">
        <div className="p-4 space-y-4">
          {transcript.length === 0 && state === 'idle' && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Start a voice conversation</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Press the microphone button below to begin talking with your AI biology tutor.
                </p>
              </div>
            </div>
          )}

          {transcript.map((turn) => (
            <TranscriptMessage key={turn.id} turn={turn} />
          ))}

          {/* Interim speech preview */}
          {interimText && (
            <div className="flex gap-3 flex-row-reverse">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary/50 text-primary-foreground">
                You
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-primary/20 text-foreground rounded-tr-sm italic opacity-70">
                {interimText}…
              </div>
            </div>
          )}

          {/* Thinking indicator */}
          {state === 'thinking' && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-secondary text-secondary-foreground">
                AI
              </div>
              <div className="rounded-2xl px-4 py-2.5 bg-muted rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking…</span>
              </div>
            </div>
          )}

          {/* Speaking indicator with waveform */}
          {state === 'speaking' && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-secondary text-secondary-foreground">
                AI
              </div>
              <div className="rounded-2xl px-4 py-2.5 bg-muted rounded-tl-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary" />
                <WaveformBars active={true} />
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-2">
        {/* Interrupt button - only when AI is speaking */}
        {state === 'speaking' && (
          <Button
            variant="outline"
            size="sm"
            onClick={interruptAI}
            className="gap-2 text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950"
          >
            <MicOff className="w-4 h-4" />
            Interrupt
          </Button>
        )}

        {/* Main mic button */}
        <button
          onClick={sessionRunning ? stopSession : startSession}
          disabled={state === 'thinking'}
          className={`
            relative w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sessionRunning
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground scale-110'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }
            ${state === 'listening' ? 'ring-4 ring-primary/30 ring-offset-2 ring-offset-background' : ''}
          `}
          aria-label={sessionRunning ? 'Stop voice session' : 'Start voice session'}
        >
          {state === 'thinking' ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : sessionRunning ? (
            <Square className="w-8 h-8 fill-current" />
          ) : (
            <Mic className="w-8 h-8" />
          )}

          {/* Pulse ring when listening */}
          {state === 'listening' && (
            <>
              <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <span className="absolute inset-[-8px] rounded-full border-2 border-primary/30 animate-pulse" />
            </>
          )}
        </button>

        {/* Stop button when active */}
        {sessionRunning && state !== 'speaking' && (
          <Button
            variant="outline"
            size="sm"
            onClick={stopSession}
            className="gap-2"
          >
            <Square className="w-4 h-4 fill-current" />
            Stop
          </Button>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground pb-1">
        {state === 'idle' && 'Press the microphone to start a voice session'}
        {state === 'listening' && 'Listening — speak your question'}
        {state === 'thinking' && 'Processing your question…'}
        {state === 'speaking' && 'AI is speaking — press Interrupt to take over'}
      </p>
    </div>
  );
}

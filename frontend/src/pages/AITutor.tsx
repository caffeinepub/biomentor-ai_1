import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Send, Trash2, Brain, Loader2, User, Dna, Lightbulb, Mic, MessageSquare
} from 'lucide-react';
import { useGetConversationHistory, useAddConversationTurn, useClearConversationHistory } from '../hooks/useQueries';
import { generateTutorResponse } from '../lib/bioAI';
import { useVoiceChat } from '../hooks/useVoiceChat';
import VoiceChatInterface from '../components/VoiceChatInterface';
import type { ConversationTurn } from '../backend';

const SUGGESTED_QUESTIONS = [
  'Explain DNA replication step by step',
  'How does photosynthesis work?',
  'What is the difference between mitosis and meiosis?',
  'Explain protein synthesis (translation)',
  'How do enzymes work? Explain Michaelis-Menten kinetics',
  'Describe the immune system response to infection',
];

function MessageBubble({ turn }: { turn: ConversationTurn }) {
  const time = new Date(Number(turn.timestamp) / 1_000_000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Student question */}
      <div className="flex justify-end gap-3">
        <div className="max-w-[80%]">
          <div className="chat-bubble-user text-sm leading-relaxed">
            {turn.question}
          </div>
          <div className="text-xs text-muted-foreground mt-1 text-right">{time}</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 mt-1">
          <User className="h-4 w-4 text-accent-foreground" />
        </div>
      </div>

      {/* AI response */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
          <Dna className="h-4 w-4 text-primary" />
        </div>
        <div className="max-w-[85%]">
          <div className="chat-bubble-ai text-sm leading-relaxed prose-bio">
            {turn.aiResponse.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <p key={i} className="font-semibold mt-3 mb-1 first:mt-0">
                    {line.replace(/\*\*/g, '')}
                  </p>
                );
              }
              if (line.startsWith('- ') || line.startsWith('• ')) {
                return (
                  <p key={i} className="pl-3 before:content-['•'] before:mr-2 before:text-primary">
                    {line.replace(/^[-•]\s/, '')}
                  </p>
                );
              }
              if (line.match(/^\d+\./)) {
                return <p key={i} className="pl-3">{line}</p>;
              }
              if (line === '') return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{time} · Prof. BioMentor</div>
        </div>
      </div>
    </div>
  );
}

// ─── Text Chat Panel ──────────────────────────────────────────────────────────

function TextChatPanel() {
  const [input, setInput] = useState('');
  const [localTurns, setLocalTurns] = useState<ConversationTurn[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: history, isLoading } = useGetConversationHistory();
  const addTurn = useAddConversationTurn();
  const clearHistory = useClearConversationHistory();

  const allTurns = [
    ...(history?.turns || []),
    ...localTurns,
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allTurns.length, isGenerating]);

  const handleSend = async (question?: string) => {
    const q = (question || input).trim();
    if (!q || isGenerating) return;

    setInput('');
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const aiResponse = generateTutorResponse(q);
    const timestamp = BigInt(Date.now() * 1_000_000);

    const turn: ConversationTurn = {
      question: q,
      aiResponse,
      timestamp,
    };

    setLocalTurns((prev) => [...prev, turn]);
    setIsGenerating(false);

    try {
      await addTurn.mutateAsync(turn);
      setLocalTurns((prev) => prev.filter((t) => t.timestamp !== timestamp));
    } catch {
      // Keep in local state if backend fails
    }
  };

  const handleClear = async () => {
    setLocalTurns([]);
    await clearHistory.mutateAsync();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Clear button */}
      {allTurns.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={clearHistory.isPending}
            className="text-muted-foreground gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      )}

      {/* Chat area */}
      <Card className="flex-1 shadow-card overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef as React.RefObject<HTMLDivElement>}>
          <CardContent className="p-4 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-3/4 ml-auto" />
                <Skeleton className="h-24 w-4/5" />
              </div>
            ) : allTurns.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Dna className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">
                  Welcome to Your Biology Tutor
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                  I'm your AI biology professor. Ask me anything — from cell biology to genetics,
                  biochemistry to ecology.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-left text-xs p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Lightbulb className="h-3 w-3 inline mr-1.5 text-amber-500" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {allTurns.map((turn, i) => (
                  <MessageBubble key={`${turn.timestamp}-${i}`} turn={turn} />
                ))}
                {isGenerating && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Dna className="h-4 w-4 text-primary" />
                    </div>
                    <div className="chat-bubble-ai">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        Prof. BioMentor is thinking...
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Input area */}
      <Card className="shadow-card">
        <CardContent className="p-3">
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="Ask a biology question... (Press Enter to send, Shift+Enter for new line)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              className="min-h-[60px] max-h-[120px] resize-none border-0 focus-visible:ring-0 p-0 text-sm"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isGenerating}
              size="icon"
              className="shrink-0 h-10 w-10"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">Biology</Badge>
            <Badge variant="outline" className="text-xs">Biotechnology</Badge>
            <Badge variant="outline" className="text-xs">Life Sciences</Badge>
            <span className="text-xs text-muted-foreground ml-auto">AI-powered responses</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Voice Chat Panel ─────────────────────────────────────────────────────────

function VoiceChatPanel() {
  const addTurn = useAddConversationTurn();

  const handleUserSpeech = async (text: string): Promise<string> => {
    // Simulate thinking delay for realism
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    return generateTutorResponse(text);
  };

  const handleTurnComplete = async (question: string, aiResponse: string) => {
    const turn: ConversationTurn = {
      question,
      aiResponse,
      timestamp: BigInt(Date.now() * 1_000_000),
    };
    try {
      await addTurn.mutateAsync(turn);
    } catch {
      // Silently fail — voice transcript is still shown locally
    }
  };

  const {
    status,
    transcript,
    isActive,
    error,
    interimText,
    startSession,
    stopSession,
  } = useVoiceChat({
    onUserSpeech: handleUserSpeech,
    onTurnComplete: handleTurnComplete,
  });

  return (
    <Card className="flex-1 shadow-card overflow-hidden">
      <VoiceChatInterface
        status={status}
        transcript={transcript}
        isActive={isActive}
        error={error}
        interimText={interimText}
        onStart={startSession}
        onStop={stopSession}
      />
    </Card>
  );
}

// ─── Main AITutor Page ────────────────────────────────────────────────────────

export default function AITutor() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col p-4 max-w-4xl mx-auto gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">AI Biology Tutor</h1>
          <p className="text-xs text-muted-foreground">
            Ask anything about biology — text or voice conversation
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="text" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit">
          <TabsTrigger value="text" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Text Chat
          </TabsTrigger>
          <TabsTrigger value="voice" className="gap-2">
            <Mic className="h-4 w-4" />
            Voice Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="flex-1 flex flex-col min-h-0 mt-3">
          <TextChatPanel />
        </TabsContent>

        <TabsContent value="voice" className="flex-1 flex flex-col min-h-0 mt-3">
          <VoiceChatPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

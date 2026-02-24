import React, { useState, useRef, useCallback } from 'react';
import { Send, Bot, User, Trash2, Mic, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAddConversationTurn } from '../hooks/useQueries';
import { getBioAIResponse } from '../lib/bioAI';
import VoiceChatInterface from '../components/VoiceChatInterface';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function TextChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Biology Tutor. I'm here to help you understand biology concepts, prepare for exams, and answer any questions you have. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const addTurnMutation = useAddConversationTurn();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = getBioAIResponse(userMessage.content);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save to backend
      addTurnMutation.mutate({
        question: userMessage.content,
        aiResponse: response,
        timestamp: BigInt(Date.now() * 1_000_000),
      });
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Biology Tutor. I'm here to help you understand biology concepts, prepare for exams, and answer any questions you have. What would you like to learn today?",
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Ask any biology question</p>
        <Button variant="ghost" size="sm" onClick={clearChat} className="gap-1.5 text-muted-foreground">
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0 rounded-xl border border-border bg-background/50">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted text-foreground rounded-tl-sm'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 opacity-60`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-muted rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about cell biology, genetics, evolution…"
          className="resize-none min-h-[52px] max-h-32"
          rows={2}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          size="icon"
          className="shrink-0 h-auto"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function VoiceChatPanel() {
  const addTurnMutation = useAddConversationTurn();

  const handleUserSpeech = useCallback(async (text: string): Promise<string> => {
    return getBioAIResponse(text);
  }, []);

  const handleTurnComplete = useCallback((question: string, response: string) => {
    addTurnMutation.mutate({
      question,
      aiResponse: response,
      timestamp: BigInt(Date.now() * 1_000_000),
    });
  }, [addTurnMutation]);

  return (
    <VoiceChatInterface
      onUserSpeech={handleUserSpeech}
      onTurnComplete={handleTurnComplete}
    />
  );
}

export default function AITutor() {
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">AI Biology Tutor</h1>
          <p className="text-sm text-muted-foreground">Your personal biology learning assistant</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="text" className="flex flex-col flex-1 min-h-0">
        <TabsList className="shrink-0 w-fit mb-3">
          <TabsTrigger value="text" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Text Chat
          </TabsTrigger>
          <TabsTrigger value="voice" className="gap-2">
            <Mic className="w-4 h-4" />
            Voice Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <TextChatPanel />
        </TabsContent>

        <TabsContent value="voice" className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <VoiceChatPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

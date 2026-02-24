import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen, Loader2, Copy, CheckCheck, Sparkles, FileText,
  List, Zap, BookMarked, AlignLeft
} from 'lucide-react';
import { generateNotes, getBiologyTopics, type NoteSet } from '../lib/bioAI';

const QUICK_TOPICS = getBiologyTopics();

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 h-8">
      {copied ? (
        <>
          <CheckCheck className="h-3.5 w-3.5 text-green-600" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </Button>
  );
}

function NoteContent({ content }: { content: string }) {
  return (
    <div className="prose-bio text-sm leading-relaxed whitespace-pre-wrap">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) {
          return (
            <h2 key={i} className="font-heading text-xl font-bold mt-4 mb-2 first:mt-0 text-foreground">
              {line.replace('# ', '')}
            </h2>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3 key={i} className="font-heading text-base font-semibold mt-3 mb-1.5 text-primary">
              {line.replace('## ', '')}
            </h3>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h4 key={i} className="font-semibold mt-2 mb-1 text-foreground">
              {line.replace('### ', '')}
            </h4>
          );
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={i} className="font-semibold mt-2">
              {line.replace(/\*\*/g, '')}
            </p>
          );
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} className="flex gap-2 my-0.5">
              <span className="text-primary mt-1 shrink-0 text-xs">•</span>
              <span>{line.replace(/^[-•]\s/, '')}</span>
            </div>
          );
        }
        if (line.match(/^\d+\.\s/)) {
          return <p key={i} className="my-0.5 pl-2">{line}</p>;
        }
        if (line === '') return <div key={i} className="h-2" />;
        return <p key={i} className="my-0.5">{line}</p>;
      })}
    </div>
  );
}

const tabConfig = [
  { value: 'detailed', label: 'Detailed Notes', icon: AlignLeft, key: 'detailed' as keyof NoteSet },
  { value: 'revision', label: 'Revision', icon: Zap, key: 'revision' as keyof NoteSet },
  { value: 'bullets', label: 'Bullet Summary', icon: List, key: 'bullets' as keyof NoteSet },
  { value: 'mechanisms', label: 'Mechanisms', icon: FileText, key: 'mechanisms' as keyof NoteSet },
  { value: 'definitions', label: 'Definitions', icon: BookMarked, key: 'definitions' as keyof NoteSet },
];

export default function NotesGenerator() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<NoteSet | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    const generated = generateNotes(topic.trim(), content.trim() || undefined);
    setNotes(generated);
    setGenerating(false);
  };

  const handleQuickTopic = (t: string) => {
    setTopic(t);
    setContent('');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">Notes Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate comprehensive study notes for any biology topic
          </p>
        </div>
      </div>

      {/* Input form */}
      <Card className="shadow-card">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Biology Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., DNA Replication, Photosynthesis, Cell Signaling..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={generating}
            />
          </div>

          {/* Quick topic chips */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => handleQuickTopic(t)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors
                    ${topic === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Additional Content (Optional)</Label>
            <Textarea
              id="content"
              placeholder="Paste your lecture notes, textbook excerpts, or any content you want the AI to incorporate..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={generating}
              className="min-h-[80px] resize-none"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!topic.trim() || generating}
            className="w-full gap-2"
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating notes...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Notes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated notes */}
      {notes && (
        <Card className="shadow-card animate-fade-in">
          <CardHeader className="pb-0">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Notes for: {topic}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <Tabs defaultValue="detailed">
              <TabsList className="flex flex-wrap h-auto gap-1 mb-4 bg-muted/50 p-1">
                {tabConfig.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs">
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {tabConfig.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <div className="flex justify-end mb-3">
                    <CopyButton text={notes[tab.key]} />
                  </div>
                  <ScrollArea className="h-[500px] pr-2">
                    <NoteContent content={notes[tab.key]} />
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {!notes && !generating && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Enter a topic above and click Generate Notes to get started.</p>
        </div>
      )}
    </div>
  );
}

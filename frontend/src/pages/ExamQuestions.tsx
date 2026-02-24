import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HelpCircle, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { generateExamQuestions, getBiologyTopics, type ExamQuestion } from '../lib/bioAI';

const TOPICS = getBiologyTopics();

const QUESTION_TYPES = [
  { value: 'twoMark', label: '2-Mark Questions' },
  { value: 'fiveMark', label: '5-Mark Questions' },
  { value: 'eightMark', label: '8-Mark Questions' },
  { value: 'tenMark', label: '10-Mark Questions' },
  { value: 'mcq', label: 'MCQ (Multiple Choice)' },
  { value: 'assertionReason', label: 'Assertion-Reason' },
  { value: 'caseBased', label: 'Case-Based Questions' },
  { value: 'mixed', label: 'Mixed Set' },
];

function QuestionCard({ question, index }: { question: ExamQuestion; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Card className="shadow-card border-l-4 border-l-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>
            <Badge variant="outline" className="text-xs">
              {question.type} · {question.marks} mark{question.marks !== 1 ? 's' : ''}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
            className="gap-1.5 text-xs h-7 shrink-0"
          >
            {showAnswer ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                Hide Answer
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                Show Answer
              </>
            )}
          </Button>
        </div>

        <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium mb-3">
          {question.question}
        </div>

        {showAnswer && (
          <div className="mt-3 pt-3 border-t border-border animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Model Answer
              </span>
            </div>
            <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded-lg p-3">
              {question.answer.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p key={i} className="font-semibold text-foreground mt-2 first:mt-0">
                      {line.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                if (line.startsWith('**')) {
                  const parts = line.split('**');
                  return (
                    <p key={i} className="my-0.5">
                      {parts.map((part, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className="text-foreground">{part}</strong>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  );
                }
                if (line.startsWith('• ') || line.startsWith('- ')) {
                  return (
                    <p key={i} className="pl-3 my-0.5 before:content-['•'] before:mr-2 before:text-primary">
                      {line.replace(/^[•-]\s/, '')}
                    </p>
                  );
                }
                if (line === '') return <div key={i} className="h-1.5" />;
                return <p key={i} className="my-0.5">{line}</p>;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ExamQuestions() {
  const [topic, setTopic] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic || !questionType) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 700));

    let generated: ExamQuestion[] = [];
    if (questionType === 'mixed') {
      const types = ['twoMark', 'mcq', 'fiveMark', 'assertionReason', 'tenMark'];
      for (const t of types) {
        generated = [...generated, ...generateExamQuestions(topic, t, 1)];
      }
    } else {
      generated = generateExamQuestions(topic, questionType, 3);
    }

    setQuestions(generated);
    setGenerating(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">Exam Question Generator</h1>
          <p className="text-sm text-muted-foreground">
            University-format questions with structured model answers
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-card">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Biology Topic</Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic..." />
                </SelectTrigger>
                <SelectContent>
                  {TOPICS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Question Type</Label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select question type..." />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((qt) => (
                    <SelectItem key={qt.value} value={qt.value}>{qt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!topic || !questionType || generating}
            className="w-full mt-4 gap-2"
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating questions...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Questions */}
      {questions.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">
              Generated Questions
              <Badge variant="secondary" className="ml-2 text-xs">{questions.length}</Badge>
            </h2>
          </div>
          <ScrollArea className="h-auto">
            <div className="space-y-3">
              {questions.map((q, i) => (
                <QuestionCard key={i} question={q} index={i} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {!questions.length && !generating && (
        <div className="text-center py-12 text-muted-foreground">
          <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a topic and question type to generate exam questions.</p>
        </div>
      )}
    </div>
  );
}

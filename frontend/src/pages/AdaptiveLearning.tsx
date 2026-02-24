import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart2, AlertTriangle, CheckCircle, XCircle, Loader2,
  TrendingUp, Target, Calendar, ChevronRight, RefreshCw
} from 'lucide-react';
import {
  useGetWeakTopics,
  useGetPracticeRecords,
  useAddPracticeRecord,
} from '../hooks/useQueries';
import { generateAdaptivePracticeQuestion, getBiologyTopics } from '../lib/bioAI';
import type { PracticeRecord } from '../backend';

const ALL_TOPICS = getBiologyTopics();

interface PracticeSession {
  topic: string;
  question: ReturnType<typeof generateAdaptivePracticeQuestion>;
  selectedAnswer: string | null;
  submitted: boolean;
  correct: boolean | null;
}

function WeakTopicBadge({ record }: { record: PracticeRecord }) {
  const score = Number(record.score);
  const attempts = Number(record.attempts);
  const color =
    score < 40
      ? 'text-red-600 border-red-300 bg-red-50'
      : 'text-amber-600 border-amber-300 bg-amber-50';

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${color}`}>
      <div>
        <div className="font-semibold text-sm">{record.topic}</div>
        <div className="text-xs opacity-80">
          {attempts} attempt{attempts !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold">{score}%</div>
        <div className="text-xs opacity-70">avg score</div>
      </div>
    </div>
  );
}

function RevisionPlan({
  weakTopics,
}: {
  weakTopics: PracticeRecord[];
  allRecords: PracticeRecord[];
}) {
  const today = new Date();

  const planItems: { topic: string; date: string; score: number }[] = weakTopics
    .slice(0, 5)
    .map((topic, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 1);
      return {
        topic: topic.topic,
        date: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        score: Number(topic.score),
      };
    });

  if (planItems.length === 0) {
    ALL_TOPICS.slice(0, 3).forEach((t, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 1);
      planItems.push({
        topic: t,
        date: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        score: -1,
      });
    });
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-base flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Revision Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {planItems.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{item.topic}</div>
              <div className="text-xs text-muted-foreground">{item.date}</div>
            </div>
            {item.score >= 0 && (
              <Badge
                variant="outline"
                className={`text-xs shrink-0 ${
                  item.score < 40
                    ? 'border-red-300 text-red-600'
                    : 'border-amber-300 text-amber-600'
                }`}
              >
                {item.score}%
              </Badge>
            )}
          </div>
        ))}
        {planItems.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Complete some practice sessions to generate your revision plan.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdaptiveLearning() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [difficulty, setDifficulty] = useState(1);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  const { data: weakTopics = [], isLoading: weakLoading } = useGetWeakTopics();
  const { data: allRecords = [] } = useGetPracticeRecords();
  const addRecord = useAddPracticeRecord();

  const startPractice = (topic: string) => {
    setSelectedTopic(topic);
    const q = generateAdaptivePracticeQuestion(topic, difficulty);
    setSession({ topic, question: q, selectedAnswer: null, submitted: false, correct: null });
  };

  const handleAnswer = (answer: string) => {
    if (!session || session.submitted) return;
    setSession({ ...session, selectedAnswer: answer });
  };

  const handleSubmit = async () => {
    if (!session || !session.selectedAnswer || session.submitted) return;

    const correct = session.selectedAnswer === session.question.correctAnswer;
    setSession({ ...session, submitted: true, correct });

    const newScore = {
      correct: sessionScore.correct + (correct ? 1 : 0),
      total: sessionScore.total + 1,
    };
    setSessionScore(newScore);

    const scorePercent = Math.round((newScore.correct / newScore.total) * 100);
    const existingRecord = allRecords.find((r) => r.topic === session.topic);
    const record: PracticeRecord = {
      topic: session.topic,
      score: BigInt(scorePercent),
      attempts: BigInt(Number(existingRecord?.attempts || 0) + 1),
      lastAttempt: BigInt(Date.now() * 1_000_000),
    };

    try {
      await addRecord.mutateAsync(record);
    } catch {
      // silently fail
    }
  };

  const handleNext = () => {
    if (!selectedTopic) return;
    if (session?.correct) {
      setDifficulty((d) => Math.min(d + 1, 6));
    }
    const q = generateAdaptivePracticeQuestion(selectedTopic, difficulty);
    setSession({
      topic: selectedTopic,
      question: q,
      selectedAnswer: null,
      submitted: false,
      correct: null,
    });
  };

  const handleChangeTopic = () => {
    setSelectedTopic(null);
    setSession(null);
    setSessionScore({ correct: 0, total: 0 });
    setDifficulty(1);
  };

  const avgScore =
    allRecords.length > 0
      ? Math.round(
          allRecords.reduce((s, r) => s + Number(r.score), 0) / allRecords.length
        )
      : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
          <BarChart2 className="h-5 w-5 text-pink-600" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">Adaptive Learning</h1>
          <p className="text-sm text-muted-foreground">
            Personalized practice that adapts to your performance
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Avg Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-primary' },
          { label: 'Sessions', value: allRecords.length, icon: Target, color: 'text-blue-600' },
          { label: 'Weak Topics', value: weakTopics.length, icon: AlertTriangle, color: 'text-amber-600' },
          {
            label: 'Topics Practiced',
            value: new Set(allRecords.map((r) => r.topic)).size,
            icon: BarChart2,
            color: 'text-green-600',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="p-3 flex items-center gap-2">
                <Icon className={`h-5 w-5 shrink-0 ${stat.color}`} />
                <div>
                  <div className="text-lg font-heading font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Topic selection + weak topics */}
        <div className="space-y-4">
          {/* Weak topics */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Weak Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {weakLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : weakTopics.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No weak topics yet! Keep practicing.
                  </p>
                </div>
              ) : (
                weakTopics.map((t) => (
                  <div
                    key={t.topic}
                    className="cursor-pointer"
                    onClick={() => startPractice(t.topic)}
                  >
                    <WeakTopicBadge record={t} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* All topics */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">Practice Any Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {ALL_TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => startPractice(t)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg flex items-center justify-between transition-colors
                      ${selectedTopic === t
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {t}
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revision plan */}
          <RevisionPlan weakTopics={weakTopics} allRecords={allRecords} />
        </div>

        {/* Right: Practice question */}
        <div className="lg:col-span-2">
          {session ? (
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Practice: {session.topic}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {sessionScore.correct}/{sessionScore.total} correct
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleChangeTopic}
                      className="h-7 text-xs gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Change
                    </Button>
                  </div>
                </div>
                {sessionScore.total > 0 && (
                  <div className="mt-2">
                    <Progress
                      value={(sessionScore.correct / sessionScore.total) * 100}
                      className="h-1.5"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question */}
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {session.question.question}
                  </p>
                </div>

                {/* Options */}
                {session.question.options && (
                  <div className="space-y-2">
                    {session.question.options.map((opt) => {
                      const letter = opt.charAt(0);
                      const isSelected = session.selectedAnswer === letter;
                      const isCorrect =
                        session.submitted && letter === session.question.correctAnswer;
                      const isWrong = session.submitted && isSelected && !isCorrect;

                      return (
                        <button
                          key={opt}
                          onClick={() => handleAnswer(letter)}
                          disabled={session.submitted}
                          className={`w-full text-left text-sm p-3 rounded-lg border transition-all
                            ${isCorrect
                              ? 'border-green-400 bg-green-50 text-green-800'
                              : isWrong
                              ? 'border-red-400 bg-red-50 text-red-800'
                              : isSelected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/40 hover:bg-muted/30'
                            }
                            ${session.submitted ? 'cursor-default' : 'cursor-pointer'}
                          `}
                        >
                          <div className="flex items-center gap-2">
                            {session.submitted && isCorrect && (
                              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                            )}
                            {session.submitted && isWrong && (
                              <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                            )}
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Feedback */}
                {session.submitted && (
                  <div
                    className={`rounded-xl p-4 animate-fade-in ${
                      session.correct
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {session.correct ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          session.correct ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {session.correct ? 'Correct! Well done!' : 'Not quite right.'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {session.question.explanation}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {!session.submitted ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={!session.selectedAnswer || addRecord.isPending}
                      className="flex-1 gap-2"
                    >
                      {addRecord.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      Submit Answer
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="flex-1 gap-2">
                      Next Question
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card h-full">
              <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
                  <BarChart2 className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">Start Practicing</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select a topic from the left panel to begin adaptive practice. Questions will get
                  harder as you improve!
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-sm">
                  {ALL_TOPICS.slice(0, 6).map((t) => (
                    <button
                      key={t}
                      onClick={() => startPractice(t)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

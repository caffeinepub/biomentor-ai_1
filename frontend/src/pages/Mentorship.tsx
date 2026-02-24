import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Compass, BookOpen, Target, GraduationCap, Briefcase, ChevronRight } from 'lucide-react';
import { getMentorshipContent } from '../lib/bioAI';

type Category = 'textbooks' | 'studyStrategy' | 'examPrep' | 'careerGuidance';

const categories: {
  id: Category;
  label: string;
  icon: React.ElementType;
  desc: string;
  color: string;
}[] = [
  {
    id: 'textbooks',
    label: 'Textbook Recommendations',
    icon: BookOpen,
    desc: 'Best books for biology & life sciences',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    id: 'studyStrategy',
    label: 'Study Strategies',
    icon: Target,
    desc: 'Proven techniques for effective learning',
    color: 'bg-green-50 text-green-700',
  },
  {
    id: 'examPrep',
    label: 'Exam Preparation',
    icon: GraduationCap,
    desc: 'Structured plan to ace your exams',
    color: 'bg-purple-50 text-purple-700',
  },
  {
    id: 'careerGuidance',
    label: 'Career Guidance',
    icon: Briefcase,
    desc: 'Pathways in biology & life sciences',
    color: 'bg-amber-50 text-amber-700',
  },
];

function ContentRenderer({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed space-y-0.5">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) {
          return (
            <h2 key={i} className="font-heading text-xl font-bold mt-5 mb-2 first:mt-0 text-foreground">
              {line.replace('# ', '')}
            </h2>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3 key={i} className="font-heading text-base font-semibold mt-4 mb-1.5 text-primary">
              {line.replace('## ', '')}
            </h3>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h4 key={i} className="font-semibold mt-3 mb-1 text-foreground">
              {line.replace('### ', '')}
            </h4>
          );
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={i} className="font-semibold mt-2 text-foreground">
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
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} className="flex gap-2 my-0.5 pl-2">
              <span className="text-primary mt-1 shrink-0 text-xs">•</span>
              <span>{line.replace(/^[-•]\s/, '')}</span>
            </div>
          );
        }
        if (line.match(/^\d+\.\s/)) {
          return <p key={i} className="my-0.5 pl-2">{line}</p>;
        }
        if (line.startsWith('|')) {
          return (
            <div
              key={i}
              className="font-mono text-xs bg-muted/50 px-2 py-0.5 rounded my-0.5 overflow-x-auto"
            >
              {line}
            </div>
          );
        }
        if (line === '') return <div key={i} className="h-2" />;
        return <p key={i} className="my-0.5 text-muted-foreground">{line}</p>;
      })}
    </div>
  );
}

export default function Mentorship() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const content = getMentorshipContent();

  const contentMap: Record<Category, string> = {
    textbooks: content.textbooks,
    studyStrategy: content.studyStrategy,
    examPrep: content.examPrep,
    careerGuidance: content.careerGuidance,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
          <Compass className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">Mentorship Mode</h1>
          <p className="text-sm text-muted-foreground">
            Expert guidance on textbooks, study strategies, exam prep, and career paths
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category selector */}
        <div className="space-y-3">
          <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Choose a Category
          </h2>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150
                  ${isActive
                    ? 'border-primary bg-primary/5 shadow-card'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30 shadow-xs'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}
                    >
                      {cat.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{cat.desc}</div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div className="lg:col-span-2">
          {activeCategory ? (
            <Card className="shadow-card h-full">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  {(() => {
                    const cat = categories.find((c) => c.id === activeCategory);
                    if (!cat) return null;
                    const Icon = cat.icon;
                    return (
                      <>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${cat.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        {cat.label}
                      </>
                    );
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-[600px] pr-3">
                  <ContentRenderer content={contentMap[activeCategory]} />
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card h-full">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
                  <Compass className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">
                  Your Personal Biology Mentor
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select a category from the left to get expert guidance tailored for biology and
                  life science students.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2 w-full max-w-xs">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors text-left"
                      >
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${cat.color}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-medium">{cat.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

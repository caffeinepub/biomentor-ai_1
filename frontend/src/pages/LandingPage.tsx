import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, BookOpen, HelpCircle, BarChart2, Compass, FileText, LogIn, Dna, Loader2 } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Biology Tutor',
    description: 'Conversational AI that teaches like a real professor — step-by-step, with analogies and live doubt solving.',
  },
  {
    icon: FileText,
    title: 'Document Analysis',
    description: 'Upload PPT/PDF files and get AI-powered analysis of mechanisms, pathways, and exam highlights.',
  },
  {
    icon: BookOpen,
    title: 'Notes Generator',
    description: 'Generate detailed notes, revision summaries, bullet points, and mechanism notes for any topic.',
  },
  {
    icon: HelpCircle,
    title: 'Exam Questions',
    description: 'University-format questions from 2-mark to 10-mark, MCQs, assertion-reason, and case-based.',
  },
  {
    icon: BarChart2,
    title: 'Adaptive Learning',
    description: 'Tracks your weak topics, adjusts difficulty, and creates a personalized revision plan.',
  },
  {
    icon: Compass,
    title: 'Mentorship Mode',
    description: 'Get guidance on textbooks, study strategies, exam prep, and career paths in life sciences.',
  },
];

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1200x400.png)' }}
        />
        <div className="relative bg-gradient-to-br from-teal-900/90 via-teal-800/85 to-teal-700/80 text-white">
          <div className="max-w-5xl mx-auto px-6 py-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Dna className="h-8 w-8 text-amber-300" />
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold">BioMentor AI</h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 font-heading mb-4">
              Your Advanced Biology Professor, Available 24/7
            </p>
            <p className="text-white/70 max-w-2xl mx-auto mb-10 text-base leading-relaxed">
              Experience university-level biology tutoring powered by AI. Step-by-step explanations,
              live doubt solving, exam preparation, and personalized learning — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold gap-2 px-8"
                onClick={login}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
                {isLoggingIn ? 'Logging in...' : 'Start Free Trial'}
              </Button>
            </div>
            <p className="text-white/50 text-sm mt-4">1-day free trial • No credit card required</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-heading text-3xl font-bold text-center mb-3">Everything You Need to Excel in Biology</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          From molecular mechanisms to exam strategies — BioMentor AI covers every aspect of your biology education.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-900 text-white py-14 px-6 text-center">
        <h2 className="font-heading text-2xl font-bold mb-3">Ready to Master Biology?</h2>
        <p className="text-white/70 mb-6 max-w-lg mx-auto">
          Join thousands of biology students who are learning smarter with AI-powered tutoring.
        </p>
        <Button
          size="lg"
          className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold gap-2"
          onClick={login}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
          {isLoggingIn ? 'Logging in...' : 'Get Started Free'}
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-4 text-center text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} BioMentor AI. Built with </span>
        <span className="text-red-500">♥</span>
        <span> using </span>
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'biomentor-ai')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

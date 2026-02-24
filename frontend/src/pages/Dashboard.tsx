import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Brain, BookOpen, HelpCircle, BarChart2, Compass, FileText,
  Clock, Crown, TrendingUp, AlertTriangle, ArrowRight, Dna
} from 'lucide-react';
import {
  useGetCallerUserProfile,
  useCheckTrialStatus,
  useGetPracticeRecords,
  useGetWeakTopics,
  useGetStudyMaterials,
} from '../hooks/useQueries';

const featureCards = [
  { path: '/tutor', label: 'AI Tutor', icon: Brain, desc: 'Start a tutoring session', color: 'bg-teal-50 text-teal-700' },
  { path: '/documents', label: 'Documents', icon: FileText, desc: 'Upload & analyze materials', color: 'bg-blue-50 text-blue-700' },
  { path: '/notes', label: 'Notes Generator', icon: BookOpen, desc: 'Generate study notes', color: 'bg-purple-50 text-purple-700' },
  { path: '/exam-questions', label: 'Exam Questions', icon: HelpCircle, desc: 'Practice exam questions', color: 'bg-orange-50 text-orange-700' },
  { path: '/mentorship', label: 'Mentorship', icon: Compass, desc: 'Career & study guidance', color: 'bg-green-50 text-green-700' },
  { path: '/adaptive-learning', label: 'Adaptive Learning', icon: BarChart2, desc: 'Track your progress', color: 'bg-pink-50 text-pink-700' },
];

function TrialCountdown({ trialStarted }: { trialStarted: bigint }) {
  const startMs = Number(trialStarted) / 1_000_000;
  const endMs = startMs + 24 * 60 * 60 * 1000;
  const nowMs = Date.now();
  const remainingMs = Math.max(0, endMs - nowMs);
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const progress = Math.max(0, Math.min(100, (remainingMs / (24 * 60 * 60 * 1000)) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Trial time remaining</span>
        <span className="font-semibold">{hours}h {minutes}m</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

export default function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: trialActive } = useCheckTrialStatus();
  const { data: practiceRecords = [] } = useGetPracticeRecords();
  const { data: weakTopics = [] } = useGetWeakTopics();
  const { data: studyMaterials = [] } = useGetStudyMaterials();

  const avgScore =
    practiceRecords.length > 0
      ? Math.round(
          practiceRecords.reduce((sum, r) => sum + Number(r.score), 0) / practiceRecords.length
        )
      : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Welcome header */}
      <div
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-teal-800 to-teal-600 text-white p-6"
        style={{
          backgroundImage: 'url(/assets/generated/dashboard-bg-pattern.dim_800x600.png)',
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Dna className="h-6 w-6 text-amber-300" />
            <h1 className="font-heading text-2xl font-bold">
              {profileLoading
                ? 'Welcome back!'
                : `Welcome back, ${profile?.name?.split(' ')[0] || 'Student'}!`}
            </h1>
          </div>
          <p className="text-white/80 text-sm">Ready to continue your biology journey today?</p>
        </div>
      </div>

      {/* Status + Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Subscription status */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : profile?.subscriptionActive ? (
              <div>
                <Badge className="bg-primary text-primary-foreground">Premium Active</Badge>
                <p className="text-xs text-muted-foreground mt-2">Full access to all features</p>
              </div>
            ) : trialActive ? (
              <div className="space-y-3">
                <Badge variant="outline" className="border-amber-500 text-amber-700">
                  <Clock className="h-3 w-3 mr-1" />
                  Free Trial
                </Badge>
                {profile && profile.trialStarted > 0n && (
                  <TrialCountdown trialStarted={profile.trialStarted} />
                )}
              </div>
            ) : (
              <div>
                <Badge variant="destructive">Trial Expired</Badge>
                <p className="text-xs text-muted-foreground mt-2">Upgrade to continue learning</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Practice stats */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Practice Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-primary">{avgScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average score across {practiceRecords.length} practice session
              {practiceRecords.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Weak topics */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakTopics.length === 0 ? (
              <div>
                <div className="text-2xl font-heading font-bold text-green-600">All Good!</div>
                <p className="text-xs text-muted-foreground mt-1">No weak topics identified yet</p>
              </div>
            ) : (
              <div>
                <div className="text-3xl font-heading font-bold text-amber-600">
                  {weakTopics.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Topic{weakTopics.length !== 1 ? 's' : ''} to review
                </p>
                <div className="mt-2 space-y-1">
                  {weakTopics.slice(0, 2).map((t) => (
                    <Badge
                      key={t.topic}
                      variant="outline"
                      className="text-xs mr-1 border-amber-300 text-amber-700"
                    >
                      {t.topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Documents Uploaded', value: studyMaterials.length, icon: FileText },
          { label: 'Practice Sessions', value: practiceRecords.length, icon: BarChart2 },
          { label: 'Topics Practiced', value: new Set(practiceRecords.map((r) => r.topic)).size, icon: Brain },
          { label: 'Weak Topics', value: weakTopics.length, icon: AlertTriangle },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-heading font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature navigation */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.path} to={card.path}>
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{card.label}</div>
                      <div className="text-xs text-muted-foreground">{card.desc}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

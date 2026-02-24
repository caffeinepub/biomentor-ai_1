import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  BookOpen, Brain, FileText, HelpCircle, Compass,
  BarChart2, LayoutDashboard, Menu, X, Dna
} from 'lucide-react';
import LoginButton from './LoginButton';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tutor', label: 'AI Tutor', icon: Brain },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/notes', label: 'Notes Generator', icon: BookOpen },
  { path: '/exam-questions', label: 'Exam Questions', icon: HelpCircle },
  { path: '/mentorship', label: 'Mentorship', icon: Compass },
  { path: '/adaptive-learning', label: 'Adaptive Learning', icon: BarChart2 },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          bg-sidebar text-sidebar-foreground shadow-sidebar
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary/20 flex items-center justify-center shrink-0">
            <Dna className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div>
            <div className="font-heading font-bold text-base text-sidebar-foreground leading-tight">BioMentor AI</div>
            <div className="text-xs text-sidebar-foreground/60">Biology Tutor</div>
          </div>
          <button
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {isAuthenticated ? (
            navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })
          ) : (
            <div className="px-3 py-4 text-sm text-sidebar-foreground/60">
              Please log in to access all features.
            </div>
          )}
        </nav>

        {/* User info */}
        {isAuthenticated && profile && (
          <div className="px-4 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary text-xs font-semibold">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">{profile.name}</div>
                <Badge
                  variant="outline"
                  className="text-xs border-sidebar-border text-sidebar-foreground/60 mt-0.5"
                >
                  {profile.subscriptionActive ? 'Premium' : 'Trial'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3 shadow-xs">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 lg:hidden">
            <Dna className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-sm">BioMentor AI</span>
          </div>

          <div className="flex-1" />

          <LoginButton />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

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
    </div>
  );
}

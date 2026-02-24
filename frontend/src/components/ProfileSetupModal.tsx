import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile, useStartFreeTrial } from '../hooks/useQueries';
import { Loader2, GraduationCap } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const saveProfile = useSaveCallerUserProfile();
  const startTrial = useStartFreeTrial();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        trialStarted: BigInt(0),
        trialExpired: false,
        subscriptionActive: false,
      });
      await startTrial.mutateAsync();
    } catch (err) {
      const e = err as Error;
      // If trial already started, that's fine
      if (!e?.message?.includes('already begun')) {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const isLoading = saveProfile.isPending || startTrial.isPending;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="font-heading text-xl">Welcome to BioMentor AI</DialogTitle>
          </div>
          <DialogDescription>
            Set up your student profile to begin your 1-day free trial. No credit card required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g., Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g., priya@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="bg-accent/50 rounded-lg p-3 text-sm text-accent-foreground">
            🎓 You'll get <strong>1 full day</strong> of free access to all AI tutor features.
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Setting up your profile...
              </>
            ) : (
              'Start Free Trial'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

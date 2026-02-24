import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, CheckCircle, Zap } from 'lucide-react';

interface TrialExpiredModalProps {
  open: boolean;
}

const features = [
  'Unlimited AI Tutor conversations',
  'Document upload & analysis',
  'Notes & study material generator',
  'Exam question generator',
  'Adaptive learning system',
  'Mentorship mode',
];

export default function TrialExpiredModal({ open }: TrialExpiredModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Crown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="font-heading text-xl">Your Free Trial Has Ended</DialogTitle>
              <Badge variant="secondary" className="mt-1 text-xs">Trial Expired</Badge>
            </div>
          </div>
          <DialogDescription>
            Your 1-day free trial has expired. Upgrade to continue learning with BioMentor AI.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Premium Plan — Everything Included</span>
            </div>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary mb-1">
              ₹499<span className="text-base font-normal text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground">Cancel anytime • Instant access</p>
          </div>

          <Button className="w-full gap-2" size="lg">
            <Crown className="h-4 w-4" />
            Upgrade to Premium
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment • 30-day money-back guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

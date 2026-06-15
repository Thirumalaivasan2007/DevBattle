import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Shield, Star, Crown, Zap, Flame, Trophy } from 'lucide-react';

export const getTierDetails = (rating: number) => {
  if (rating < 1200) return { name: 'Beginner', color: 'text-zinc-400', bg: 'bg-zinc-400/10', border: 'border-zinc-400/20', icon: Shield };
  if (rating < 1400) return { name: 'Pupil', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: Star };
  if (rating < 1600) return { name: 'Specialist', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', icon: Zap };
  if (rating < 1900) return { name: 'Expert', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Award };
  if (rating < 2200) return { name: 'Candidate Master', color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', icon: Flame };
  if (rating < 2500) return { name: 'Master', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: Crown };
  return { name: 'Grandmaster', color: 'text-red-500 font-bold', bg: 'bg-red-500/10 border-red-500', border: 'border-red-500/50', icon: Trophy };
};

interface TierBadgeProps {
  rating: number;
  showIcon?: boolean;
  className?: string;
}

export default function TierBadge({ rating, showIcon = true, className = '' }: TierBadgeProps) {
  const details = getTierDetails(rating);
  const Icon = details.icon;

  return (
    <Badge variant="outline" className={`${details.bg} ${details.border} ${details.color} ${className} transition-all`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {details.name}
    </Badge>
  );
}

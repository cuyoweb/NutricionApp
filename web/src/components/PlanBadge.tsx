import React from 'react';
import { PlanTier } from '../types';

interface PlanBadgeProps {
  plan: PlanTier;
  showPrice?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ plan, showPrice = true, size = 'md' }) => {
  const planConfigs: Record<PlanTier, { label: string; price: string; bg: string; text: string; border: string; dot: string }> = {
    FREE: {
      label: 'FREE',
      price: '$0',
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-700',
      dot: 'bg-slate-400'
    },
    INICIAL: {
      label: 'INICIAL',
      price: '$6.000',
      bg: 'bg-blue-950/60',
      text: 'text-blue-400',
      border: 'border-blue-800/60',
      dot: 'bg-blue-400'
    },
    PRO: {
      label: 'PRO',
      price: '$10.000',
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-400',
      border: 'border-emerald-800/60',
      dot: 'bg-emerald-400'
    },
    PREMIUM: {
      label: 'PREMIUM',
      price: '$12.000',
      bg: 'bg-purple-950/60',
      text: 'text-purple-400',
      border: 'border-purple-800/60',
      dot: 'bg-purple-400'
    }
  };

  const config = planConfigs[plan] || planConfigs.FREE;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <span>{config.label}</span>
      {showPrice && (
        <span className="opacity-75 font-mono text-[10px]">
          ({config.price})
        </span>
      )}
    </span>
  );
};

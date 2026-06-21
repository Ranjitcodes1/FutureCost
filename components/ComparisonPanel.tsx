'use client';

import React from 'react';
import { ComparisonResult } from '@/lib/carbon/types';
import { Button } from './ui/Button';

interface ComparisonPanelProps {
  comparison: ComparisonResult;
  onChoose: (choice: 'A' | 'B' | 'neither') => void;
}

export function ComparisonPanel({ comparison, onChoose }: ComparisonPanelProps) {
  const diff = Math.abs(comparison.savedTonnesIfChooseB) * 1000; // in kg
  
  // Base factors, we recalculate or use from comparison. 
  // comparison.optionA.equivalents has total. We want difference equivalents.
  const flights = parseFloat((diff / 1842).toFixed(1));
  const trees = Math.ceil(diff / (21.77 * 10)); // 10 years of trees
  const charges = Math.round(diff / 0.0083).toLocaleString();
  const kmDriven = Math.round(diff / 0.192).toLocaleString();

  return (
    <div className="w-full flex flex-col space-y-8 animate-fade-up">
      <h3 className="text-xl font-medium text-carbon-text text-center">What does this difference mean?</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-carbon-surface/30 backdrop-blur-md p-6 rounded-2xl border border-carbon-border shadow-glass hover:border-carbon-accent/40 transition-colors duration-300 text-center flex flex-col items-center justify-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-carbon-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="text-4xl mb-3 block relative z-10 transition-transform group-hover:scale-110 duration-300">✈️</span>
          <p className="text-2xl font-bold text-carbon-text relative z-10">{flights}</p>
          <p className="text-xs text-carbon-muted mt-1 relative z-10">Mumbai → London flights</p>
        </div>
        
        <div className="bg-carbon-surface/30 backdrop-blur-md p-6 rounded-2xl border border-carbon-border shadow-glass hover:border-carbon-cyan/40 transition-colors duration-300 text-center flex flex-col items-center justify-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-carbon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="text-4xl mb-3 block relative z-10 transition-transform group-hover:scale-110 duration-300">🌳</span>
          <p className="text-2xl font-bold text-carbon-text relative z-10">{trees}</p>
          <p className="text-xs text-carbon-muted mt-1 relative z-10">trees needed to absorb this</p>
        </div>

        <div className="bg-carbon-surface/30 backdrop-blur-md p-6 rounded-2xl border border-carbon-border shadow-glass hover:border-amber-500/40 transition-colors duration-300 text-center flex flex-col items-center justify-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="text-4xl mb-3 block relative z-10 transition-transform group-hover:scale-110 duration-300">📱</span>
          <p className="text-2xl font-bold text-carbon-text relative z-10">{charges}</p>
          <p className="text-xs text-carbon-muted mt-1 relative z-10">smartphone charges</p>
        </div>

        <div className="bg-carbon-surface/30 backdrop-blur-md p-6 rounded-2xl border border-carbon-border shadow-glass hover:border-rose-500/40 transition-colors duration-300 text-center flex flex-col items-center justify-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="text-4xl mb-3 block relative z-10 transition-transform group-hover:scale-110 duration-300">🚗</span>
          <p className="text-2xl font-bold text-carbon-text relative z-10">{kmDriven}</p>
          <p className="text-xs text-carbon-muted mt-1 relative z-10">km in a petrol car</p>
        </div>
      </div>

      <div className="flex flex-col items-center pt-8 space-y-4">
        <h4 className="text-lg font-medium text-carbon-text">Which will you choose?</h4>
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => onChoose('A')} variant="outline">
            Choose Option A
          </Button>
          <Button onClick={() => onChoose('B')} variant="outline">
            Choose Option B
          </Button>
          <Button onClick={() => onChoose('neither')} variant="ghost">
            I haven't decided yet
          </Button>
        </div>
      </div>
    </div>
  );
}

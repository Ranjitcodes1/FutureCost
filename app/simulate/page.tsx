'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DecisionForm } from '@/components/DecisionForm';
import { TrajectoryChart } from '@/components/TrajectoryChart';
import { ComparisonPanel } from '@/components/ComparisonPanel';
import { LetterStream } from '@/components/LetterStream';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SimulationOption, ComparisonResult } from '@/lib/carbon/types';

type AppState = 'input' | 'loading' | 'results' | 'profile' | 'letter';

export default function SimulatePage() {
  const [appState, setAppState] = useState<AppState>('input');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [chosenTrajectory, setChosenTrajectory] = useState<'A' | 'B' | null>(null);
  const [userProfile, setUserProfile] = useState({
    name: '',
    city: '',
    age: 30,
    familyStatus: 'single',
    statedValues: ['environment']
  });

  const handleSimulate = async (optionA: SimulationOption, optionB: SimulationOption) => {
    setAppState('loading');
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionA, optionB })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComparison(data);
      setAppState('results');
    } catch (err) {
      console.error(err);
      setAppState('input');
      alert('Simulation failed. Please check inputs and try again.');
    }
  };

  const handleChoose = (choice: 'A' | 'B' | 'neither') => {
    if (choice === 'neither') {
      alert('Take your time. This decision locks in a lot of carbon.');
      return;
    }
    setChosenTrajectory(choice);
    setAppState('profile');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppState('letter');
  };

  return (
    <div className="min-h-screen bg-carbon-bg text-carbon-text py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col space-y-12">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2 md:space-x-4 text-sm md:text-base font-medium">
          <span className={appState === 'input' ? 'text-carbon-accent' : 'text-carbon-muted'}>1. Compare</span>
          <span className="text-carbon-border">→</span>
          <span className={appState === 'results' || appState === 'profile' ? 'text-carbon-accent' : 'text-carbon-muted'}>2. Choose</span>
          <span className="text-carbon-border">→</span>
          <span className={appState === 'letter' ? 'text-carbon-accent' : 'text-carbon-muted'}>3. Hear from 2040</span>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          
          {appState === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Simulate a Decision</h1>
                <p className="text-carbon-muted max-w-xl mx-auto">
                  Compare two options for housing or transport to see how much carbon each locks you into over the next 10 years.
                </p>
              </div>
              <DecisionForm onSubmit={handleSimulate} isLoading={false} />
            </motion.div>
          )}

          {appState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center py-32 space-y-6"
            >
              <div className="w-12 h-12 border-4 border-carbon-border border-t-carbon-accent rounded-full animate-spin"></div>
              <h2 className="text-xl font-medium">Calculating 10-year trajectories...</h2>
            </motion.div>
          )}

          {appState === 'results' && comparison && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col space-y-16"
            >
              <TrajectoryChart comparison={comparison} animate={true} />
              <ComparisonPanel comparison={comparison} onChoose={handleChoose} />
            </motion.div>
          )}

          {appState === 'profile' && comparison && chosenTrajectory && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md mx-auto bg-carbon-surface p-8 rounded-xl border border-carbon-border shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Tell us about yourself</h2>
              <p className="text-carbon-muted text-sm text-center mb-8">
                Your 2040 self needs to know who they are writing to.
              </p>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label className="text-xs text-carbon-muted mb-1 block">First Name (Optional)</label>
                  <Input 
                    value={userProfile.name} 
                    onChange={e => setUserProfile(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Rahul"
                  />
                </div>
                <div>
                  <label className="text-xs text-carbon-muted mb-1 block">City (Optional)</label>
                  <Input 
                    value={userProfile.city} 
                    onChange={e => setUserProfile(p => ({ ...p, city: e.target.value }))}
                    placeholder="e.g. Mumbai"
                  />
                </div>
                <div>
                  <label className="text-xs text-carbon-muted mb-1 block">Age today</label>
                  <Input 
                    type="number"
                    value={userProfile.age} 
                    onChange={e => setUserProfile(p => ({ ...p, age: Number(e.target.value) }))}
                  />
                </div>
                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full">
                    Meet your future self
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {appState === 'letter' && comparison && chosenTrajectory && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <LetterStream 
                simulationResult={comparison} 
                chosenTrajectory={chosenTrajectory} 
                userProfile={userProfile} 
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

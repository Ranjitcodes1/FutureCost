'use client';

import React, { useState } from 'react';
import { ComparisonResult, LetterRequest } from '@/lib/carbon/types';
import { Button } from './ui/Button';

interface LetterStreamProps {
  simulationResult: ComparisonResult;
  userProfile: { name: string; city: string; age: number; familyStatus: string; statedValues: string[] };
  chosenTrajectory: 'A' | 'B';
}

type Tone = 'reflective' | 'direct' | 'scientific' | 'emotional';

export function LetterStream({ simulationResult, userProfile, chosenTrajectory }: LetterStreamProps) {
  const [tone, setTone] = useState<Tone>('reflective');
  const [letterText, setLetterText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [simulationId, setSimulationId] = useState<string | null>(null);

  const generateLetter = async () => {
    setLetterText('');
    setIsStreaming(true);
    setIsComplete(false);

    try {
      const requestBody: LetterRequest = {
        chosenTrajectory,
        tone,
        userProfile,
        comparison: simulationResult
      };

      const response = await fetch('/api/letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.body) throw new Error('No readable stream');
      
      const simId = response.headers.get('X-Simulation-Id');
      if (simId) setSimulationId(simId);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setLetterText((prev) => prev + decoder.decode(value, { stream: true }));
      }
      setIsComplete(true);
    } catch (error) {
      console.error('Error streaming letter:', error);
      setLetterText('Failed to generate letter. Please check API configuration.');
    } finally {
      setIsStreaming(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letterText);
    alert('Letter copied to clipboard');
  };

  const copyShareLink = () => {
    if (!simulationId) return;
    const url = `${window.location.origin}/share/${simulationId}`;
    navigator.clipboard.writeText(url);
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col space-y-8 animate-fade-up">
      {!isStreaming && !isComplete && letterText === '' && (
        <div className="flex flex-col items-center space-y-6">
          <h3 className="text-xl font-medium text-carbon-text">Choose the tone of your future self</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['reflective', 'direct', 'scientific', 'emotional'].map((t) => (
              <button
                key={t}
                onClick={() => setTone(t as Tone)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tone === t 
                    ? 'bg-carbon-accent text-carbon-bg' 
                    : 'bg-carbon-surface text-carbon-text border border-carbon-border hover:bg-carbon-border'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <Button onClick={generateLetter} size="lg" className="mt-4">
            Receive Letter from 2040
          </Button>
        </div>
      )}

      {(isStreaming || letterText !== '') && (
        <div className="bg-[#Fdfbf7] p-8 md:p-12 rounded-sm shadow-xl relative overflow-hidden">
          {/* Subtle noise/texture overlay would go here in CSS */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
          </div>
          
          <div className="font-serif text-[#2D3748] text-lg leading-[1.9] max-w-[65ch] mx-auto whitespace-pre-wrap relative z-10">
            {letterText}
            {isStreaming && <span className="inline-block w-2 h-5 bg-[#2D3748] ml-1 animate-cursor-blink align-middle"></span>}
          </div>
          
          {isComplete && (
            <div className="mt-12 pt-8 border-t border-gray-300 max-w-[65ch] mx-auto relative z-10">
              <p className="font-serif text-[#2D3748] text-lg italic">— You, 2040</p>
              
              <div className="mt-8 flex justify-end gap-3">
                <Button onClick={copyToClipboard} variant="outline" className="text-carbon-bg border-gray-400 hover:bg-gray-100">
                  Copy Text
                </Button>
                {simulationId && (
                  <Button onClick={copyShareLink} className="bg-carbon-accent text-carbon-bg hover:bg-carbon-cyan">
                    Share Link
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-transparent text-carbon-text flex flex-col relative z-10">
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-carbon-cyan/5 via-transparent to-transparent pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8 relative z-10"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-carbon-cyan/30 bg-carbon-cyan/10 backdrop-blur-md text-carbon-cyan text-sm font-semibold tracking-wide uppercase">
            The 10-Year Liability Simulator
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-carbon-text via-carbon-text to-carbon-muted leading-tight pb-2">
            What will your <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-carbon-cyan to-carbon-accent filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">future self</span> say?
          </h1>
          
          <p className="text-lg md:text-xl text-carbon-muted max-w-2xl mx-auto leading-relaxed">
            Every lifestyle decision locks in years of carbon emissions. 
            Simulate your options, visualize the decade-long impact, and receive a letter from your 2040 self.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/simulate">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px] text-lg">
                Simulate a decision
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Abstract Trajectory Visual */}
      <section className="w-full max-w-6xl mx-auto px-4 pb-32">
        <div className="w-full h-64 md:h-96 relative border-y border-carbon-border/50 bg-carbon-surface/20 backdrop-blur-sm overflow-hidden flex items-center justify-center rounded-3xl shadow-glass">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <motion.path 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              d="M 0 350 C 300 350, 600 250, 1000 50" 
              fill="none" 
              stroke="url(#gradientA)" 
              strokeWidth="6"
              style={{ filter: 'drop-shadow(0px 0px 8px rgba(6,182,212,0.5))' }}
            />
            <motion.path 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
              d="M 0 350 C 300 350, 500 150, 1000 300" 
              fill="none" 
              stroke="url(#gradientB)" 
              strokeWidth="6"
              style={{ filter: 'drop-shadow(0px 0px 8px rgba(16,185,129,0.5))' }}
            />
            <defs>
              <linearGradient id="gradientA" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="gradientB" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="relative z-10 bg-carbon-surface/80 backdrop-blur-xl p-8 rounded-2xl border border-carbon-border/50 text-center max-w-sm shadow-glass">
            <h3 className="font-bold text-xl mb-2 text-carbon-text">The Divergence</h3>
            <p className="text-sm text-carbon-muted">A single choice today shapes completely different realities over a decade.</p>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-y border-carbon-border">
        <div className="flex flex-col items-center text-center space-y-2">
          <p className="text-carbon-muted">Average commute decision locks in</p>
          <p className="text-3xl font-bold text-carbon-text">8 years of emissions</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-2">
          <p className="text-carbon-muted">Housing choice determines</p>
          <p className="text-3xl font-bold text-carbon-text">40% of your footprint</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-2">
          <p className="text-carbon-muted">Most people consider</p>
          <p className="text-3xl font-bold text-carbon-text">0% of this before signing</p>
        </div>
      </div>

      {/* How it works */}
      <div className="w-full max-w-4xl py-24 flex flex-col items-center space-y-12">
        <h2 className="text-3xl font-medium text-carbon-text">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-carbon-surface border border-carbon-border flex items-center justify-center text-xl font-bold">1</div>
            <p className="text-carbon-text">Enter two options</p>
            <p className="text-sm text-carbon-muted">Apartment A vs B, car vs metro, etc.</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-carbon-surface border border-carbon-border flex items-center justify-center text-xl font-bold">2</div>
            <p className="text-carbon-text">See 10-year trajectories</p>
            <p className="text-sm text-carbon-muted">Visualize the long-term carbon lock-in</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-carbon-surface border border-carbon-border flex items-center justify-center text-xl font-bold">3</div>
            <p className="text-carbon-text">Hear from 2040</p>
            <p className="text-sm text-carbon-muted">Receive a letter from your future self</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl border-t border-carbon-border py-8 mt-auto flex flex-col md:flex-row justify-between items-center text-sm text-carbon-muted">
        <p>Built with climate data from IPCC, CEA, DEFRA</p>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-carbon-text transition-colors mt-4 md:mt-0">
          GitHub Repository
        </a>
      </footer>
    </main>
  );
}

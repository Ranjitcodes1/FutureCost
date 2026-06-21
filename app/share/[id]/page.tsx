import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TrajectoryChart } from '@/components/TrajectoryChart';
import { ComparisonPanel } from '@/components/ComparisonPanel';
import { Button } from '@/components/ui/Button';

export default async function SharePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Await the params before using them as required by newer Next.js versions
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  if (!id) {
    notFound();
  }

  // Fetch the simulation and the latest letter for it
  const { data: simulation, error: simError } = await supabase
    .from('simulations')
    .select('*')
    .eq('id', id)
    .single();

  if (simError || !simulation) {
    notFound();
  }

  const { data: letters, error: letterError } = await supabase
    .from('letters')
    .select('*')
    .eq('simulation_id', id)
    .order('created_at', { ascending: false })
    .limit(1);

  const letter = letters?.[0];

  if (!letter) {
    notFound();
  }

  // Reconstruct the comparison result
  const comparison = {
    optionA: simulation.option_a,
    optionB: simulation.option_b,
    savedTonnesIfChooseB: simulation.option_a.totalTonnesCO2 - simulation.option_b.totalTonnesCO2,
    savedTonnesIfChooseA: simulation.option_b.totalTonnesCO2 - simulation.option_a.totalTonnesCO2,
    percentDifferenceAvsB: ((simulation.option_a.totalTonnesCO2 - simulation.option_b.totalTonnesCO2) / simulation.option_a.totalTonnesCO2) * 100,
    breakEvenYear: null // Optional
  };

  const chosenLabel = simulation.chosen_option === 'A' ? simulation.option_a.option.label : simulation.option_b.option.label;

  return (
    <main className="min-h-screen bg-carbon-bg text-carbon-text py-12 px-4 md:px-8 relative z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-carbon-cyan/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        <div className="text-center space-y-4">
          <div className="inline-block mb-2 px-4 py-1.5 rounded-full border border-carbon-accent/30 bg-carbon-accent/10 backdrop-blur-md text-carbon-accent text-sm font-semibold tracking-wide uppercase">
            Shared Simulation
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            A Letter from 2040
          </h1>
          <p className="text-lg text-carbon-muted">
            They chose: <strong className="text-carbon-text">{chosenLabel}</strong>
          </p>
        </div>

        {/* The Letter */}
        <div className="bg-[#Fdfbf7] p-8 md:p-12 rounded-sm shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
          </div>
          
          <div className="font-serif text-[#2D3748] text-lg leading-[1.9] max-w-[65ch] mx-auto whitespace-pre-wrap relative z-10">
            {letter.letter_text}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-300 max-w-[65ch] mx-auto relative z-10">
            <p className="font-serif text-[#2D3748] text-lg italic">— The Future Self</p>
          </div>
        </div>

        {/* The Data */}
        <div className="pt-8">
          <h2 className="text-2xl font-bold mb-6 text-center">The Data Behind the Decision</h2>
          <TrajectoryChart comparison={comparison as any} animate={false} />
        </div>

        {/* CTA */}
        <div className="pt-16 pb-8 border-t border-carbon-border text-center space-y-6">
          <h3 className="text-2xl font-bold">What will your future self say?</h3>
          <p className="text-carbon-muted max-w-lg mx-auto">
            Every lifestyle decision locks in years of carbon emissions. Find out what you're locking into.
          </p>
          <Link href="/simulate" className="inline-block mt-4">
            <Button size="lg" className="w-full sm:w-auto min-w-[200px] text-lg">
              Simulate your own decision
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}

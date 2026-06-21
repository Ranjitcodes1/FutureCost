'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ComparisonResult } from '@/lib/carbon/types';

interface TrajectoryChartProps {
  comparison: ComparisonResult;
  animate?: boolean;
}

export function TrajectoryChart({ comparison, animate = true }: TrajectoryChartProps) {
  const data = comparison.optionA.yearlyEmissions.map((ya, index) => {
    const yb = comparison.optionB.yearlyEmissions[index];
    return {
      year: ya.year,
      optionA: parseFloat((ya.cumulative / 1000).toFixed(2)),
      optionB: parseFloat((yb.cumulative / 1000).toFixed(2)),
    };
  });

  const savedIfChooseB = comparison.savedTonnesIfChooseB;

  return (
    <div className="w-full flex flex-col space-y-6 animate-fade-up">
      <div className="bg-carbon-surface/30 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-carbon-border shadow-glass relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-carbon-cyan/5 to-transparent pointer-events-none"></div>
        <h3 className="text-2xl font-semibold text-carbon-text mb-8 relative z-10">Carbon Locked In Over 10 Years</h3>
        <div className="h-[400px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
              <XAxis 
                dataKey="year" 
                stroke="#94A3B8" 
                tick={{ fill: '#94A3B8' }}
                tickFormatter={(val) => `Year ${val}`}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
              />
              <YAxis 
                stroke="#94A3B8" 
                tick={{ fill: '#94A3B8' }}
                tickFormatter={(val) => `${val}t`}
                label={{ value: 'Cumulative CO₂ (tonnes)', angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(11, 18, 33, 0.8)', backdropFilter: 'blur(12px)', borderColor: '#1E293B', color: '#F8FAFC', borderRadius: '12px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)' }}
                formatter={(value: any) => [`${value} tonnes`, '']}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                formatter={(value, entry) => {
                  return <span className="text-carbon-text ml-1 mr-4 font-medium">{value === 'optionA' ? comparison.optionA.option.label : comparison.optionB.option.label}</span>;
                }}
              />
              <ReferenceLine x={1} stroke="#94A3B8" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#94A3B8' }} />
              <Line 
                type="monotone" 
                dataKey="optionA" 
                stroke="#06B6D4" 
                strokeWidth={4}
                dot={{ r: 4, fill: '#06B6D4', strokeWidth: 0 }}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#06B6D4', stroke: 'rgba(6, 182, 212, 0.3)' }}
                isAnimationActive={animate}
                animationDuration={2000}
                animationEasing="ease-in-out"
                style={{ filter: 'drop-shadow(0px 0px 8px rgba(6, 182, 212, 0.5))' }}
              />
              <Line 
                type="monotone" 
                dataKey="optionB" 
                stroke="#10B981" 
                strokeWidth={4}
                dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#10B981', stroke: 'rgba(16, 185, 129, 0.3)' }}
                isAnimationActive={animate}
                animationDuration={2000}
                animationEasing="ease-in-out"
                style={{ filter: 'drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.5))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-carbon-surface/30 backdrop-blur-md p-6 rounded-2xl border border-carbon-border text-center shadow-glass relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-cyan/5 via-transparent to-carbon-accent/5 pointer-events-none"></div>
        <div className="relative z-10">
          <p className="text-sm text-carbon-muted mb-2 uppercase tracking-wider font-semibold">Option A Total</p>
          <p className="text-3xl font-bold text-carbon-cyan">{comparison.optionA.totalTonnesCO2.toFixed(1)}t</p>
        </div>
        <div className="border-y md:border-y-0 md:border-x border-carbon-border/50 py-4 md:py-0 relative z-10">
          <p className="text-sm text-carbon-muted mb-2 uppercase tracking-wider font-semibold">Difference</p>
          <p className={`text-3xl font-bold ${savedIfChooseB > 0 ? 'text-carbon-accent' : 'text-carbon-danger'}`}>
            {savedIfChooseB > 0 ? '-' : '+'}{Math.abs(savedIfChooseB).toFixed(1)}t
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-sm text-carbon-muted mb-2 uppercase tracking-wider font-semibold">Option B Total</p>
          <p className="text-3xl font-bold text-carbon-accent">{comparison.optionB.totalTonnesCO2.toFixed(1)}t</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { SimulationOption, HousingInputs, TransportInputs, DecisionType } from '@/lib/carbon/types';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

interface DecisionFormProps {
  onSubmit: (optionA: SimulationOption, optionB: SimulationOption) => void;
  isLoading: boolean;
}

const defaultOptionA: SimulationOption = {
  label: "Apartment in Thane (30km from office)",
  decisionType: 'housing',
  inputs: {
    type: 'apartment_large',
    distanceFromWorkKm: 30,
    commuteMode: 'car_petrol',
    commuteDaysPerWeek: 5,
    gridRegion: 'india',
    occupants: 2,
    tenancyYears: 3,
  } as HousingInputs,
};

const defaultOptionB: SimulationOption = {
  label: "Apartment in Bandra (4km from office)",
  decisionType: 'housing',
  inputs: {
    type: 'apartment_small',
    distanceFromWorkKm: 4,
    commuteMode: 'metro',
    commuteDaysPerWeek: 5,
    gridRegion: 'india',
    occupants: 2,
    tenancyYears: 3,
  } as HousingInputs,
};

function OptionColumn({
  title,
  option,
  onChange
}: {
  title: string;
  option: SimulationOption;
  onChange: (opt: SimulationOption) => void;
}) {
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...option, label: e.target.value });
  };

  const handleDecisionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as DecisionType;
    let newInputs = {};
    if (newType === 'housing') {
      newInputs = {
        type: 'apartment_small',
        distanceFromWorkKm: 10,
        commuteMode: 'car_petrol',
        commuteDaysPerWeek: 5,
        gridRegion: 'india',
        occupants: 1,
        tenancyYears: 3,
      } as HousingInputs;
    } else if (newType === 'transport') {
      newInputs = {
        mode: 'car_petrol',
        dailyKm: 20,
        daysPerWeek: 5,
        ownershipYears: 8,
      } as TransportInputs;
    }
    onChange({ ...option, decisionType: newType, inputs: newInputs as any });
  };

  const updateInput = (key: string, value: any) => {
    onChange({
      ...option,
      inputs: {
        ...option.inputs,
        [key]: value
      }
    });
  };

  return (
    <div className="flex flex-col space-y-6 bg-carbon-surface/30 backdrop-blur-md p-6 rounded-2xl border border-carbon-border shadow-glass hover:border-carbon-muted/50 transition-colors duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-carbon-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <h3 className="text-xl font-semibold text-carbon-text mb-2 relative z-10">{title}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs text-carbon-muted mb-1 block">Label</label>
          <Input 
            value={option.label} 
            onChange={handleLabelChange} 
            placeholder="e.g. Apartment near office" 
          />
        </div>

        <div>
          <label className="text-xs text-carbon-muted mb-1 block">Decision Type</label>
          <Select 
            value={option.decisionType} 
            onChange={handleDecisionTypeChange}
            options={[
              { value: 'housing', label: 'Housing' },
              { value: 'transport', label: 'Transport' }
            ]}
          />
        </div>

        {option.decisionType === 'housing' && (
          <>
            <div>
              <label className="text-xs text-carbon-muted mb-1 block">Housing Type</label>
              <Select 
                value={(option.inputs as HousingInputs).type} 
                onChange={(e) => updateInput('type', e.target.value)}
                options={[
                  { value: 'apartment_small', label: 'Small Apartment' },
                  { value: 'apartment_large', label: 'Large Apartment' },
                  { value: 'house_small', label: 'Small House' },
                  { value: 'house_large', label: 'Large House' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-carbon-muted mb-1 block">Distance to Work (km)</label>
                <Input 
                  type="number" min="0" max="100"
                  value={(option.inputs as HousingInputs).distanceFromWorkKm} 
                  onChange={(e) => updateInput('distanceFromWorkKm', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs text-carbon-muted mb-1 block">Commute Days/Week</label>
                <Input 
                  type="number" min="0" max="7"
                  value={(option.inputs as HousingInputs).commuteDaysPerWeek} 
                  onChange={(e) => updateInput('commuteDaysPerWeek', Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-carbon-muted mb-1 block">Commute Mode</label>
              <Select 
                value={(option.inputs as HousingInputs).commuteMode} 
                onChange={(e) => updateInput('commuteMode', e.target.value)}
                options={[
                  { value: 'car_petrol', label: 'Petrol Car' },
                  { value: 'car_diesel', label: 'Diesel Car' },
                  { value: 'car_ev', label: 'Electric Vehicle' },
                  { value: 'motorcycle', label: 'Motorcycle' },
                  { value: 'bus', label: 'Bus' },
                  { value: 'metro', label: 'Metro' },
                  { value: 'train', label: 'Train' },
                  { value: 'bicycle', label: 'Bicycle' },
                  { value: 'walk', label: 'Walk' },
                  { value: 'wfh', label: 'Work From Home' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-carbon-muted mb-1 block">Occupants</label>
                <Input 
                  type="number" min="1" max="10"
                  value={(option.inputs as HousingInputs).occupants} 
                  onChange={(e) => updateInput('occupants', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs text-carbon-muted mb-1 block">Expected Tenancy (yrs)</label>
                <Input 
                  type="number" min="1" max="20"
                  value={(option.inputs as HousingInputs).tenancyYears} 
                  onChange={(e) => updateInput('tenancyYears', Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-carbon-muted mb-1 block">Grid Region</label>
              <Select 
                value={(option.inputs as HousingInputs).gridRegion} 
                onChange={(e) => updateInput('gridRegion', e.target.value)}
                options={[
                  { value: 'india', label: 'India' },
                  { value: 'uk', label: 'UK' },
                  { value: 'us', label: 'US' },
                  { value: 'eu', label: 'EU' },
                  { value: 'australia', label: 'Australia' },
                  { value: 'global', label: 'Global Average' },
                ]}
              />
            </div>
          </>
        )}

        {option.decisionType === 'transport' && (
          <>
            <div>
              <label className="text-xs text-carbon-muted mb-1 block">Transport Mode</label>
              <Select 
                value={(option.inputs as TransportInputs).mode} 
                onChange={(e) => updateInput('mode', e.target.value)}
                options={[
                  { value: 'car_petrol', label: 'Petrol Car' },
                  { value: 'car_diesel', label: 'Diesel Car' },
                  { value: 'car_ev', label: 'Electric Vehicle' },
                  { value: 'motorcycle', label: 'Motorcycle' },
                  { value: 'bus', label: 'Bus' },
                  { value: 'metro', label: 'Metro' },
                  { value: 'train', label: 'Train' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-carbon-muted mb-1 block">Daily Distance (km)</label>
                <Input 
                  type="number" min="0" max="500"
                  value={(option.inputs as TransportInputs).dailyKm} 
                  onChange={(e) => updateInput('dailyKm', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs text-carbon-muted mb-1 block">Days/Week</label>
                <Input 
                  type="number" min="0" max="7"
                  value={(option.inputs as TransportInputs).daysPerWeek} 
                  onChange={(e) => updateInput('daysPerWeek', Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-carbon-muted mb-1 block">Expected Ownership (yrs)</label>
              <Input 
                type="number" min="1" max="20"
                value={(option.inputs as TransportInputs).ownershipYears} 
                onChange={(e) => updateInput('ownershipYears', Number(e.target.value))}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function DecisionForm({ onSubmit, isLoading }: DecisionFormProps) {
  const [optionA, setOptionA] = useState<SimulationOption>(defaultOptionA);
  const [optionB, setOptionB] = useState<SimulationOption>(defaultOptionB);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(optionA, optionB);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto flex flex-col space-y-8 animate-fade-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <OptionColumn title="Option A" option={optionA} onChange={setOptionA} />
        <OptionColumn title="Option B" option={optionB} onChange={setOptionB} />
      </div>
      
      <div className="flex justify-center pt-4">
        <Button type="submit" size="lg" disabled={isLoading} className="w-full md:w-auto min-w-[240px]">
          {isLoading ? 'Calculating...' : 'Compare 10-Year Impact →'}
        </Button>
      </div>
    </form>
  );
}

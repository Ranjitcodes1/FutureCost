export type DecisionType = 'housing' | 'transport' | 'job' | 'diet' | 'travel' | 'purchase';

export type TransportMode = 'car_petrol' | 'car_diesel' | 'car_ev' | 'motorcycle' |
  'bus' | 'metro' | 'train' | 'bicycle' | 'walk' | 'wfh';

export type HousingType = 'apartment_small' | 'apartment_large' | 'house_small' | 'house_large';

export type GridRegion = 'india' | 'uk' | 'us' | 'eu' | 'australia' | 'global';

export interface HousingInputs {
  type: HousingType;
  distanceFromWorkKm: number;
  commuteMode: TransportMode;
  commuteDaysPerWeek: number;
  gridRegion: GridRegion;
  occupants: number;
  tenancyYears: number; // lock-in duration user expects
}

export interface TransportInputs {
  mode: TransportMode;
  dailyKm: number;
  daysPerWeek: number;
  ownershipYears: number; // lock-in duration
}

export interface SimulationOption {
  label: string;
  decisionType: DecisionType;
  inputs: HousingInputs | TransportInputs;
}

export interface YearlyEmission {
  year: number;
  kgCO2: number;
  cumulative: number;
}

export interface SimulationResult {
  option: SimulationOption;
  yearlyEmissions: YearlyEmission[]; // 10 years
  totalKgCO2: number;
  totalTonnesCO2: number;
  lockInYears: number;
  equivalents: {
    flightsMumbaiLondon: number;
    treesNeeded: number;
    smartphoneCharges: number;
    kmDrivenPetrolCar: number;
  };
  annualAvgKgCO2: number;
}

export interface ComparisonResult {
  optionA: SimulationResult;
  optionB: SimulationResult;
  savedTonnesIfChooseB: number;
  savedTonnesIfChooseA: number;
  percentDifferenceAvsB: number;
  breakEvenYear: number | null;
}

export interface LetterRequest {
  simulationId?: string;
  chosenTrajectory: 'A' | 'B';
  tone: 'reflective' | 'direct' | 'scientific' | 'emotional';
  userProfile: {
    name: string;
    city: string;
    age: number;
    familyStatus: string;
    statedValues: string[];
  };
  comparison: ComparisonResult;
}

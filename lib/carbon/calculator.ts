import {
  HousingInputs, TransportInputs, SimulationResult, ComparisonResult,
  YearlyEmission, SimulationOption
} from './types';
import {
  TRANSPORT_EMISSION_FACTORS, GRID_EMISSION_FACTORS,
  HOME_ENERGY_KWH_PER_DAY, GRID_DECARBONIZATION_RATE,
  LOCK_IN_YEARS, EQUIVALENT_FACTORS
} from './emissionFactors';

function calculateHousingYearlyEmission(inputs: HousingInputs, year: number): number {
  // Grid decarbonizes over time
  const gridDecayFactor = Math.pow(1 - GRID_DECARBONIZATION_RATE, year);
  const gridFactor = GRID_EMISSION_FACTORS[inputs.gridRegion] * gridDecayFactor;

  // Home energy emissions
  const homeEnergyKwhPerYear = HOME_ENERGY_KWH_PER_DAY[inputs.type] * 365 / inputs.occupants;
  const homeEmissions = homeEnergyKwhPerYear * gridFactor;

  // Commute emissions
  const commuteFactor = TRANSPORT_EMISSION_FACTORS[inputs.commuteMode];
  const commuteDaysPerYear = inputs.commuteDaysPerWeek * 52;
  const commuteKmPerYear = inputs.distanceFromWorkKm * 2 * commuteDaysPerYear;
  const commuteEmissions = commuteKmPerYear * commuteFactor;

  return homeEmissions + commuteEmissions;
}

function calculateTransportYearlyEmission(inputs: TransportInputs, year: number): number {
  const factor = TRANSPORT_EMISSION_FACTORS[inputs.mode];
  const kmPerYear = inputs.dailyKm * inputs.daysPerWeek * 52;
  return kmPerYear * factor;
}

function buildYearlyEmissions(
  option: SimulationOption,
  projectionYears: number = 10
): YearlyEmission[] {
  const results: YearlyEmission[] = [];
  let cumulative = 0;

  for (let year = 1; year <= projectionYears; year++) {
    let kgCO2 = 0;

    if (option.decisionType === 'housing') {
      kgCO2 = calculateHousingYearlyEmission(option.inputs as HousingInputs, year);
    } else if (option.decisionType === 'transport') {
      kgCO2 = calculateTransportYearlyEmission(option.inputs as TransportInputs, year);
    }

    cumulative += kgCO2;
    results.push({ year, kgCO2, cumulative });
  }

  return results;
}

export function simulateOption(option: SimulationOption): SimulationResult {
  const yearlyEmissions = buildYearlyEmissions(option);
  const totalKgCO2 = yearlyEmissions[yearlyEmissions.length - 1].cumulative;
  const totalTonnesCO2 = totalKgCO2 / 1000;
  const annualAvgKgCO2 = totalKgCO2 / 10;

  const lockInYears = option.decisionType === 'housing'
    ? (option.inputs as HousingInputs).tenancyYears
    : option.decisionType === 'transport'
    ? (option.inputs as TransportInputs).ownershipYears
    : LOCK_IN_YEARS[option.decisionType];

  const equivalents = {
    flightsMumbaiLondon: parseFloat((totalKgCO2 / EQUIVALENT_FACTORS.flightMumbaiLondon).toFixed(1)),
    treesNeeded: Math.ceil(totalKgCO2 / (EQUIVALENT_FACTORS.kgCO2perTreePerYear * 10)),
    smartphoneCharges: Math.round(totalKgCO2 / EQUIVALENT_FACTORS.kgCO2perSmartphoneCharge),
    kmDrivenPetrolCar: Math.round(totalKgCO2 / EQUIVALENT_FACTORS.kgCO2perKmPetrolCar),
  };

  return {
    option,
    yearlyEmissions,
    totalKgCO2,
    totalTonnesCO2,
    lockInYears,
    equivalents,
    annualAvgKgCO2,
  };
}

export function compareOptions(
  optionA: SimulationOption,
  optionB: SimulationOption
): ComparisonResult {
  const resultA = simulateOption(optionA);
  const resultB = simulateOption(optionB);

  const savedIfChooseB = resultA.totalKgCO2 - resultB.totalKgCO2;
  const savedIfChooseA = resultB.totalKgCO2 - resultA.totalKgCO2;
  const percentDiff = ((Math.abs(savedIfChooseB) / resultA.totalKgCO2) * 100);

  // Find first year where cumulative B < cumulative A (break-even)
  let breakEvenYear: number | null = null;
  for (let i = 0; i < resultA.yearlyEmissions.length; i++) {
    if (resultB.yearlyEmissions[i].cumulative < resultA.yearlyEmissions[i].cumulative) {
      breakEvenYear = resultA.yearlyEmissions[i].year;
      break;
    }
  }

  return {
    optionA: resultA,
    optionB: resultB,
    savedTonnesIfChooseB: savedIfChooseB / 1000,
    savedTonnesIfChooseA: savedIfChooseA / 1000,
    percentDifferenceAvsB: percentDiff,
    breakEvenYear,
  };
}

import { simulateOption, compareOptions } from '@/lib/carbon/calculator';
import { SimulationOption, HousingInputs, TransportInputs } from '@/lib/carbon/types';

const farApartment: SimulationOption = {
  label: 'Far apartment',
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

const nearApartment: SimulationOption = {
  label: 'Near apartment',
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

describe('Carbon calculator', () => {
  test('Far apartment emits more than near apartment', () => {
    const far = simulateOption(farApartment);
    const near = simulateOption(nearApartment);
    expect(far.totalTonnesCO2).toBeGreaterThan(near.totalTonnesCO2);
  });

  test('10 year projection has 10 data points', () => {
    const result = simulateOption(farApartment);
    expect(result.yearlyEmissions).toHaveLength(10);
  });

  test('Cumulative values are monotonically increasing', () => {
    const result = simulateOption(farApartment);
    for (let i = 1; i < result.yearlyEmissions.length; i++) {
      expect(result.yearlyEmissions[i].cumulative)
        .toBeGreaterThan(result.yearlyEmissions[i - 1].cumulative);
    }
  });

  test('Comparison shows correct difference direction', () => {
    const comparison = compareOptions(farApartment, nearApartment);
    expect(comparison.savedTonnesIfChooseB).toBeGreaterThan(0);
  });

  test('EV produces less emissions than petrol', () => {
    const petrolCar: SimulationOption = {
      label: 'Petrol car', decisionType: 'transport',
      inputs: { mode: 'car_petrol', dailyKm: 40, daysPerWeek: 5, ownershipYears: 8 } as TransportInputs,
    };
    const ev: SimulationOption = {
      label: 'EV', decisionType: 'transport',
      inputs: { mode: 'car_ev', dailyKm: 40, daysPerWeek: 5, ownershipYears: 8 } as TransportInputs,
    };
    const petrolResult = simulateOption(petrolCar);
    const evResult = simulateOption(ev);
    expect(petrolResult.totalTonnesCO2).toBeGreaterThan(evResult.totalTonnesCO2);
  });
});

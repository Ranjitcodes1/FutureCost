// All values in kg CO2e per unit

// Transport: kg CO2e per passenger-km
export const TRANSPORT_EMISSION_FACTORS: Record<string, number> = {
  car_petrol:    0.192,
  car_diesel:    0.168,
  car_ev:        0.053,  // India grid (CEA 2023: 0.716 kg/kWh avg, 7.5kWh/100km)
  motorcycle:    0.114,
  bus:           0.089,
  metro:         0.031,
  train:         0.041,
  bicycle:       0.000,
  walk:          0.000,
  wfh:           0.000,
};

// Grid emission factors: kg CO2e per kWh
export const GRID_EMISSION_FACTORS: Record<string, number> = {
  india:     0.716,
  uk:        0.233,
  us:        0.386,
  eu:        0.275,
  australia: 0.580,
  global:    0.490,
};

// Home energy: base kWh per day by housing type (per occupant, excludes commute)
export const HOME_ENERGY_KWH_PER_DAY: Record<string, number> = {
  apartment_small: 4.2,
  apartment_large: 7.8,
  house_small:     9.1,
  house_large:    14.6,
};

// Grid decarbonization: reduction factor per year (% per year decline in grid intensity)
// India target: net zero 2070, so ~1.8% annual grid improvement
export const GRID_DECARBONIZATION_RATE = 0.018;

// Lock-in durations in years (average expected commitment)
export const LOCK_IN_YEARS: Record<string, number> = {
  housing:   3.5,  // avg Indian urban tenancy
  transport: 8.0,  // avg vehicle ownership
  job:       2.5,
  diet:      1.0,  // diet habits recalculated annually
  travel:    1.0,
  purchase:  5.0,  // major appliance
};

// Flight emissions: kg CO2e per passenger, economy class, with RFI 1.9x multiplier
export const FLIGHT_EMISSION_KG: Record<string, number> = {
  mumbai_london:   1842,
  delhi_london:    1780,
  mumbai_dubai:     412,
  delhi_nyc:       2210,
  domestic_short:   186,  // <500km
  domestic_medium:  289,  // 500-1500km
};

// Equivalents
export const EQUIVALENT_FACTORS = {
  flightMumbaiLondon:      1842,    // kg CO2 per flight
  kgCO2perKmPetrolCar:     0.192,
  kgCO2perSmartphoneCharge: 0.0083,
  kgCO2perTreePerYear:      21.77,
};

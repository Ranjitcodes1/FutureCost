const http = require('http');

const data = JSON.stringify({
  chosenTrajectory: "A",
  tone: "reflective",
  userProfile: {
    name: "Test",
    city: "Test City",
    age: 30,
    familyStatus: "single",
    statedValues: ["environment"]
  },
  comparison: {
    optionA: {
      option: {
        label: "A",
        decisionType: "housing",
        inputs: {
          type: "apartment_small",
          distanceFromWorkKm: 5,
          commuteMode: "metro",
          commuteDaysPerWeek: 5,
          gridRegion: "india",
          occupants: 1,
          tenancyYears: 3
        }
      },
      yearlyEmissions: [],
      totalKgCO2: 1000,
      totalTonnesCO2: 1,
      lockInYears: 3,
      equivalents: { flightsMumbaiLondon: 0.5, treesNeeded: 5, smartphoneCharges: 120000, kmDrivenPetrolCar: 5000 },
      annualAvgKgCO2: 100
    },
    optionB: {
      option: {
        label: "B",
        decisionType: "housing",
        inputs: {
          type: "apartment_large",
          distanceFromWorkKm: 20,
          commuteMode: "car_petrol",
          commuteDaysPerWeek: 5,
          gridRegion: "india",
          occupants: 1,
          tenancyYears: 3
        }
      },
      yearlyEmissions: [],
      totalKgCO2: 5000,
      totalTonnesCO2: 5,
      lockInYears: 3,
      equivalents: { flightsMumbaiLondon: 2.5, treesNeeded: 25, smartphoneCharges: 600000, kmDrivenPetrolCar: 25000 },
      annualAvgKgCO2: 500
    },
    savedTonnesIfChooseB: 4,
    savedTonnesIfChooseA: -4,
    percentDifferenceAvsB: 400,
    breakEvenYear: null
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/letter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    process.stdout.write(chunk);
  });
  res.on('end', () => {
    console.log('\n--- END OF STREAM ---');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();

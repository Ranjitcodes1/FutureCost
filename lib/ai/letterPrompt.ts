import { LetterRequest } from '../carbon/types';

export function buildLetterPrompt(req: LetterRequest): string {
  const { userProfile, comparison, chosenTrajectory, tone } = req;
  const chosen = chosenTrajectory === 'A' ? comparison.optionA : comparison.optionB;
  const alternative = chosenTrajectory === 'A' ? comparison.optionB : comparison.optionA;
  const savedOrExtra = chosenTrajectory === 'A'
    ? comparison.savedTonnesIfChooseA
    : comparison.savedTonnesIfChooseB;

  const toneInstructions: Record<string, string> = {
    reflective: 'Write with quiet wisdom. Contemplative. No drama. Like a journal entry from a thoughtful person looking back.',
    direct: 'Write plainly and honestly. No sentimentality. State the facts of the future directly.',
    scientific: 'Ground every statement in observable, specific consequences. Reference climate outcomes concretely.',
    emotional: 'Write with warmth and personal feeling. Reference relationships, daily life, sensory details.',
  };

  const climateContext2040: Record<string, string> = {
    india: 'In 2040, India has experienced increasingly severe summer heat waves (48°C+ in northern cities), unpredictable monsoon patterns, and rising coastal flood risks in Mumbai. Air quality in major cities has become a daily health issue. Renewable energy now powers 60% of the grid.',
    uk: 'In 2040, the UK has seen wetter winters, drier summers, and multiple 40°C+ heat events. Net zero legislation has changed transport infrastructure substantially.',
    us: 'In 2040, the US has experienced more intense hurricane seasons, widespread drought in the west, and major coastal flooding. EVs now dominate new car sales.',
    global: 'In 2040, global average temperatures are 1.6°C above pre-industrial levels. Extreme weather events are 3x more frequent than in 2020.',
  };

  const userCity = userProfile.city || 'your city';
  const gridRegion = (chosen.option.inputs as any).gridRegion || 'india';
  const climate = climateContext2040[gridRegion] || climateContext2040.global;

  return `You are writing a letter from ${userProfile.name || 'the user'}'s future self in the year 2040.

STRICT RULES:
- Write in first person as the user's future self (age ${(userProfile.age || 30) + 16} in 2040)
- NEVER be preachy, guilt-tripping, or apocalyptic
- Do NOT use words like: "crucial", "vital", "imperative", "must", "should have", "mistake"
- Reference ${userCity} specifically at least once
- If the user has children (family status: ${userProfile.familyStatus}), reference them naturally
- The letter is exactly 280-320 words. No more.
- Write in English. Do not add a subject line or greeting prefix.
- End with a single sentence that is forward-looking, not melancholy.
- Tone: ${toneInstructions[tone]}

CONTEXT FOR THE LETTER:
The user in 2024 made a life decision that will emit ${chosen.totalTonnesCO2.toFixed(1)} tonnes of CO2 over the next 10 years (locked in for ~${chosen.lockInYears} years).
An alternative option would have emitted ${alternative.totalTonnesCO2.toFixed(1)} tonnes — a difference of ${Math.abs(savedOrExtra).toFixed(1)} tonnes.
The annual average of their chosen path: ${(chosen.annualAvgKgCO2 / 1000).toFixed(1)} tonnes/year.

2040 WORLD CONTEXT (use these facts, don't invent others):
${climate}

USER PROFILE:
- Name: ${userProfile.name || 'the user'}
- City: ${userCity}
- Age in 2024: ${userProfile.age || 30}
- Family: ${userProfile.familyStatus || 'not specified'}
- What they value: ${userProfile.statedValues?.join(', ') || 'not specified'}

Start the letter directly. Open with "It's 2040." or another grounding first sentence. Do not write "Dear [name]" — start immediately with the scene.`;
}

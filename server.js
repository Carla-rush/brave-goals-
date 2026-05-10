require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/generate-goal-card', async (req, res) => {
  const { answers } = req.body;
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: `You are a warm but straight-talking big sister helping someone build their BRAVE Goal. Be punchy, real, direct — not fluffy or corporate. Use short sentences. Reference their actual words, values, and reasons. Make them feel seen and capable. No hollow affirmations. Write 3-4 short paragraphs. Start with their goal stated boldly. End with something that fires them up.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: buildPrompt(answers) }],
    });
    res.json({ goalCard: message.content[0].text });
  } catch (error) {
    console.error('Error generating goal card:', error.message);
    res.status(500).json({ error: 'Failed to generate goal card. Please check your API key.' });
  }
});

function buildPrompt(a) {
  const valuesArr = [...(a.values || [])];
  if (a.valuesOwn) valuesArr.unshift(a.valuesOwn);
  const valuesStr = valuesArr.filter(Boolean).join(', ');
  const areasArr = a.areas && a.areas.length ? a.areas : (a.area ? [a.area] : []);
  const areaStr = areasArr.map(ar => ar === 'Other' ? (a.areaOther || 'Other') : ar).join(', ');

  const lines = [
    `Area of focus: ${areaStr}`,
    `Values: ${valuesStr}`,
    `Goal: ${a.goal}`,
    `Boldness score: ${a.boldnessScore}/5`,
    a.boldnessScore <= 2 && a.stretchierVersion ? `Stretchier version they considered: ${a.stretchierVersion}` : null,
    `Why it's rewarding: ${a.rewarding}`,
    `How it aligns with their ideal self: ${a.aligned}`,
    `How it connects to their values: ${a.valuesConnection}`,
    `How they'll measure progress: ${a.evidence}`,
    `What they'll remind themselves when it gets hard: ${a.reminder}`,
  ].filter(Boolean);

  return lines.join('\n') + '\n\nWrite their BRAVE Goal Card now.';
}

app.post('/api/capture-email', (req, res) => {
  const { email } = req.body;
  if (email) {
    console.log(`Email captured: ${email}`);
  }
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BRAVE Goal Tool → http://localhost:${PORT}`);
});

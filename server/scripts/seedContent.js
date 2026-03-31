const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

if (!require.extensions['.jsx']) {
  require.extensions['.jsx'] = require.extensions['.js'];
}

const Case = require('../models/Case.jsx');
const Insight = require('../models/Insight.jsx');

const caseSeed = [
  {
    client: 'PrimeNest Realty',
    category: 'OPERATIONS',
    title: 'Real Estate Lead Automation',
    description: 'Automated lead capture, routing, and follow-up journeys for a high-volume property sales workflow.',
    result1Number: '1.7x',
    result1Label: 'Qualified leads/week',
    result2Number: '28%',
    result2Label: 'Less manual follow-up',
    status: 'live',
    tools: ['Google Opal', 'Make', 'Google Sheets']
  },
  {
    client: 'D2C SkinLab',
    category: 'SUPPORT',
    title: 'D2C Brand Support Bot',
    description: 'Built an AI-first support layer with FAQ retrieval and smart escalation handling.',
    result1Number: '37%',
    result1Label: 'Faster first response',
    result2Number: '22%',
    result2Label: 'Lower support workload',
    status: 'live',
    tools: ['Claude AI', 'Zapier', 'Notion']
  },
  {
    client: 'ScaleGrid B2B',
    category: 'SALES',
    title: 'Lead Qualification Assistant',
    description: 'Deployed a pre-qualification assistant that scores inbound leads and books demo slots automatically.',
    result1Number: '18%',
    result1Label: 'More sales calls booked',
    result2Number: '29%',
    result2Label: 'Lower no-show rate',
    status: 'live',
    tools: ['GPT-4', 'Calendly', 'HubSpot']
  }
];

const insightSeed = [
  {
    title: 'How to Pick the Right AI Workflow',
    excerpt: 'A practical checklist to avoid overbuying tools and deploy faster.',
    readTime: '6 min read',
    category: 'Strategy',
    content: 'Start from one painful workflow, not from a tool. Map handoffs, quantify delays, and automate only stable rules first.'
  },
  {
    title: 'Automation Ideas for Small Teams',
    excerpt: 'Six systems that save hours per week without hiring more staff.',
    readTime: '5 min read',
    category: 'Operations',
    content: 'Prioritize high-frequency, low-exception tasks like lead routing, reminders, support triage, and onboarding checklists.'
  },
  {
    title: 'From Chatbot to Revenue Engine',
    excerpt: 'How support automation can improve response quality and conversion.',
    readTime: '7 min read',
    category: 'Growth',
    content: 'A bot creates revenue when it qualifies intent quickly, recommends relevant next actions, and hands off with full context.'
  },
  {
    title: 'Workflow Rules vs AI Agents: When to Use Each',
    excerpt: 'Why predictable processes need rules, but messy real-world scenarios need AI.',
    readTime: '8 min read',
    category: 'Strategy',
    content: 'Rules excel at linear workflows with clear inputs and outputs. AI agents handle ambiguity, context switching, and exceptions. Use both.'
  },
  {
    title: 'Building Automation Without Code: No-Code Playbook',
    excerpt: 'Tools, templates, and proven workflows you can build in one weekend.',
    readTime: '9 min read',
    category: 'Operations',
    content: 'Zapier, Make, and n8n provide visual builders that rival custom code. Start with pre-built integrations before building custom logic.'
  },
  {
    title: 'Why Most Automation Projects Fail (And How to Avoid It)',
    excerpt: 'Lessons from shipping 50+ real automation systems for bootstrapped startups.',
    readTime: '10 min read',
    category: 'Growth',
    content: 'Automation fails when you automate broken processes. Map your workflow first, then find the bottleneck. Solve that one thing.'
  }
];

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clarix';
  const shouldReset = process.argv.includes('--reset');

  await mongoose.connect(mongoUri);

  if (shouldReset) {
    await Promise.all([Case.deleteMany({}), Insight.deleteMany({})]);
  }

  const existingCases = await Case.countDocuments();
  const existingInsights = await Insight.countDocuments();

  if (existingCases === 0) {
    await Case.insertMany(caseSeed);
    console.log(`Seeded ${caseSeed.length} case studies.`);
  } else {
    console.log(`Skipped cases seed: ${existingCases} records already exist.`);
  }

  if (existingInsights === 0) {
    await Insight.insertMany(insightSeed);
    console.log(`Seeded ${insightSeed.length} insights.`);
  } else {
    console.log(`Skipped insights seed: ${existingInsights} records already exist.`);
  }

  await mongoose.disconnect();
  console.log('Seeding completed successfully.');
};

seed().catch(async (error) => {
  console.error('Seeding failed:', error);
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    // Ignore disconnect errors during failure handling.
  }
  process.exit(1);
});

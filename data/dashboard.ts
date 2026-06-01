import { StartupHealth } from '../types';

export const startupHealth: StartupHealth = {
  name: 'EcoTech',
  stage: 'MVP Development',
  progress: 0.72,
  aiSuggestions: [
    'Your burn rate is projected to exceed runway in 4 months — consider delaying two planned hires until MRR crosses $15K.',
    'Three of your top five competitors recently added B2B enterprise tiers. Evaluate whether a pilot enterprise plan fits your current sales motion.',
    'You haven't posted founder content in 12 days. Consistent LinkedIn activity correlates with 2–3× faster warm inbound for early-stage founders.',
  ],
  dailyTasks: [
    { id: 'task-1', title: 'Follow up with Series A lead from YC intro', completed: true },
    { id: 'task-2', title: 'Review Q2 CAC and LTV metrics with co-founder', completed: false },
    { id: 'task-3', title: 'Draft v2 onboarding email sequence', completed: false },
  ],
  upcomingEvent: {
    id: 'event-1',
    title: 'Austin Founder Meetup — Climate Tech Edition',
    date: '2026-06-05',
    time: '6:30 PM',
    location: 'Capital Factory, Austin TX',
  },
};

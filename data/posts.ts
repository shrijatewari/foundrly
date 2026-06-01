import { Post } from '../types';

export const posts: Post[] = [
  {
    id: '1',
    founderName: 'Sarah Chen',
    startupName: 'NovaMind AI',
    content:
      'Just closed our seed round at $1.2M! Six months ago I was building this solo in my apartment. Persistence is everything — keep shipping, keep talking to users. Happy to answer questions for anyone in early stages.',
    likes: 214,
    comments: 38,
    timeAgo: '2h ago',
  },
  {
    id: '2',
    founderName: 'Marcus Webb',
    startupName: 'Stackflow',
    content:
      'Painful lesson learned: we spent 3 months perfecting a feature nobody asked for. Launched it, crickets. Now we do weekly 20-min user calls before writing a single line of code. Validation > assumption.',
    likes: 187,
    comments: 52,
    timeAgo: '5h ago',
  },
  {
    id: '3',
    founderName: 'Priya Nair',
    startupName: 'GreenLedger',
    content:
      'We hit 1,000 paying customers today. Took us 14 months and two complete pivots to get here. The original idea is barely recognizable, and that\'s okay. Startups are experiments.',
    likes: 341,
    comments: 74,
    timeAgo: '9h ago',
  },
  {
    id: '4',
    founderName: 'Jordan Ellis',
    startupName: 'Launchpad HR',
    content:
      'Honest founder post: churn spiked 18% last quarter. Instead of spinning the narrative, we held a transparency call with our top 50 customers and asked what we broke. Got more actionable feedback in 90 minutes than in our last two quarters of surveys.',
    likes: 129,
    comments: 61,
    timeAgo: '1d ago',
  },
  {
    id: '5',
    founderName: 'Aiden Park',
    startupName: 'Routeify',
    content:
      'Reminder that "doing things that don\'t scale" still works in 2026. Our first 100 customers were onboarded manually by me via video call. It\'s slow, exhausting, and gave us insights no analytics tool ever would.',
    likes: 276,
    comments: 44,
    timeAgo: '2d ago',
  },
];

export default posts;
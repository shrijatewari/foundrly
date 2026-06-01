/**
 * Community feed data contract.
 *
 * NOTE: This is a placeholder so the Community screen compiles and runs.
 * Replace the `posts` array (and extend `Post` if needed) with the real
 * dummy data. The Community screen only relies on the fields below:
 *   - id:          stable unique key for the list
 *   - startupName: shown in accent color; initials are derived from it
 *   - content:     the post body (white text)
 *   - likes:       initial like count
 *   - comments:    comment count
 *   - avatarColor: optional override for the avatar circle color
 */
export interface Post {
  id: string;
  startupName: string;
  content: string;
  likes: number;
  comments: number;
  avatarColor?: string;
}

export const posts: Post[] = [
  {
    id: '1',
    startupName: 'Nimbus Labs',
    content:
      'Just shipped our v0.1 to the first 50 beta users. Onboarding completion jumped from 40% to 78% after we cut the signup form down to a single screen.',
    likes: 24,
    comments: 5,
    avatarColor: '#6E0F1A',
  },
  {
    id: '2',
    startupName: 'Sproutly',
    content:
      'Hot take: your first 10 customers should be people you can call by name. We closed our first 8 over coffee, not cold email.',
    likes: 41,
    comments: 12,
    avatarColor: '#2E7D5B',
  },
  {
    id: '3',
    startupName: 'Cobalt AI',
    content:
      'Spent the weekend rewriting our inference pipeline. p95 latency down from 1.2s to 310ms. Users immediately noticed. Speed is a feature.',
    likes: 67,
    comments: 9,
    avatarColor: '#2A4D8F',
  },
  {
    id: '4',
    startupName: 'Folio',
    content:
      'Pricing experiment update: moving from 3 tiers to 2 increased conversion by 19%. Choice paralysis is real.',
    likes: 18,
    comments: 3,
    avatarColor: '#8A5A2B',
  },
  {
    id: '5',
    startupName: 'Tidepool',
    content:
      'Looking for a technical cofounder in the climate space. We have 3 LOIs and a tiny grant. DM if building here excites you.',
    likes: 53,
    comments: 21,
    avatarColor: '#1F6F78',
  },
];

export default posts;

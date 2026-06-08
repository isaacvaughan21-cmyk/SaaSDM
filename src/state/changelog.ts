// Version history for The Idea Matrix.
// Bump CURRENT_VERSION and add an entry at the TOP of CHANGELOG on each release.
// Keep `version` in sync with the git tag you create (e.g. tag `v1.1.0`).

export type ChangelogEntry = {
  version: string;
  date: string; // YYYY-MM-DD
  title: string;
  changes: string[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.3.0',
    date: '2026-06-08',
    title: 'Archive, niche grouping & synced Matrix',
    changes: [
      'Archive ideas you’re not pursuing without deleting them',
      'Give each idea a niche and group the library by niche',
      'Filter to an Archived view and restore ideas anytime',
      'When signed in, the Matrix mirrors your Library — your ideas sync to your account',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-06-07',
    title: 'Planning workspace & library upgrades',
    changes: [
      'Open any idea into a planning workspace — mind map, feature ideas, schedule, and action items',
      'Set each idea to Open, WIP, or On-Hold and filter the library by status',
      'Edit an idea’s name and notes from the library',
      'Expand long notes inline with Show more',
      'Opt in to founder tips and updates when you sign up',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-06-07',
    title: 'Idea Library & accounts',
    changes: [
      'New Idea Library — save ideas before you score them',
      'Create an account to sync your ideas across devices',
      'Scored ideas show their ranking inside the Library',
      'Score or re-score any library idea in one click',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-06-01',
    title: 'Initial release',
    changes: [
      'Score SaaS ideas across 9 weighted criteria and 3 pillars',
      'Ranked comparison table with fatal-weakness flags',
      'Adjustable pillar weights and PDF export',
    ],
  },
];

export const CURRENT_VERSION = CHANGELOG[0].version;

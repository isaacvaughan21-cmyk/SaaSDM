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

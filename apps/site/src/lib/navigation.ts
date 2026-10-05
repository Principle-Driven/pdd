import type { Principle } from './principles';

export interface DocLink { title: string; href: string; }
export interface NavigationGroup { title: string; links: DocLink[]; }
export interface TocItem { id: string; text: string; depth?: number; }

export function getNavigation(principles: Principle[]): NavigationGroup[] {
  return [
    { title: 'Get started', links: [
      { title: 'Introduction', href: '/' },
      { title: 'A complete example', href: '/example' },
      { title: 'Set up your repository', href: '/blueprint' },
    ] },
    { title: 'The method', links: [
      { title: 'How PDD works', href: '/method' },
      { title: 'Write a principle', href: '/method#write-a-principle' },
      { title: 'Change a principle', href: '/method#change-a-principle' },
    ] },
    { title: 'Reference', links: [
      { title: 'CLI', href: '/cli' },
      { title: 'Configuration', href: '/cli#configuration' },
      { title: 'Starter files', href: '/blueprint#starter-files' },
    ] },
    { title: 'Principles', links: [
      { title: 'Catalog overview', href: '/principles' },
      ...principles.map((principle) => ({ title: principle.data.title, href: `/principles/${principle.id}` })),
    ] },
  ];
}

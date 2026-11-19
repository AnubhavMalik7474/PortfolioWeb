// Central site configuration — edit brand, contact and SEO details here.
export const siteConfig = {
  name: 'SHAPE',
  shortName: 'SHAPE',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  role: 'Front-end & UI/UX Developer',
  // ≤ 60 chars — fits Google's title width without truncation.
  title: 'SHAPE — Front-end & UI/UX Developer Portfolio',
  // ~155 chars — brand, role, core skills and a reason to click.
  description:
    'SHAPE is the portfolio of a front-end & UI/UX developer building fast, accessible websites, web apps and design systems with React, Next.js and Figma.',
  keywords: [
    'SHAPE portfolio',
    'front-end developer',
    'UI/UX developer',
    'UI/UX designer',
    'React developer',
    'Next.js developer',
    'web developer portfolio',
    'responsive web design',
    'design systems',
    'Figma to code',
    'web accessibility',
  ],
  locale: 'en_US',
  themeColor: '#1e2024',
  email: 'hello@example.com',
  phone: '+15550102030',
  phoneLabel: '+1 555 010 2030',
  foundingYear: 2016,
  address: {
    locality: 'New York',
    country: 'US',
  },
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Dribbble', href: 'https://dribbble.com/uxbyanubhav' },
  ],
  nav: [
    { label: 'Home', href: '#top' },
    { label: 'About', href: '#about' },
    { label: 'Showcase', href: '#gallery' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#works' },
    { label: 'Contact', href: '#contact' },
  ],
};

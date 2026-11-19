// Page copy & media for the SHAPE portfolio (front-end & UI/UX developer).
// Copy lengths mirror the original layout, so lines wrap the same way.
// Project images come from Dribbble (dribbble.com/uxbyanubhav) → /public/images/projects.
const DRIBBBLE = 'https://dribbble.com/shots/';

export const hero = {
  kicker: 'Designing Interfaces.',
  title: 'Shaping Tomorrow.',
  lead: 'I design and build fast, accessible web interfaces that people genuinely enjoy using.',
};

export const intro = {
  image: { src: '/images/projects/mobile-app-ui.png', width: 1600, height: 1200, alt: 'Mobile app UI design shown on two floating phones over a purple wave' },
};

export const about = {
  title: 'Design Meets Code.',
  text: 'With 3+ years in UI/UX, I turn rough ideas into clean, user-friendly web and mobile products people love.',
  cta: { label: 'Services', href: '#services' },
};

export const gallery = [
  { src: '/images/projects/booking-app-design.png', width: 1600, height: 1200, w: 405, h: 400, alt: 'Booking and calendar mobile app design with agent details screens' },
  { src: '/images/projects/features-3d.png', width: 1024, height: 768, w: 520, h: 600, alt: 'Modern 3D features section with performance stats cards' },
  { src: '/images/projects/sign-in-page.png', width: 1600, height: 960, w: 415, h: 310, alt: 'Truet sign-in page with a blue gradient brand panel' },
  { src: '/images/projects/interior-project-app.png', width: 1600, height: 1200, w: 520, h: 700, alt: 'Interior design and project management mobile app screens' },
  { src: '/images/projects/ai-receptionist-landing.png', width: 1600, height: 1200, w: 415, h: 360, alt: 'AI receptionist landing page hero: Never miss a call, never miss a client' },
];

export const services = [
  {
    title: 'UX Research',
    text: 'User interviews, journey maps and usability tests that reveal what people really need — so every screen solves a real problem.',
    image: { src: '/images/projects/infographic-dashboard.png', alt: 'Infographic mapping the features of a call-management app' },
  },
  {
    title: 'UI Design',
    text: 'Wireframes to polished, high-fidelity interfaces in Figma — clear hierarchy, accessible colour and motion that guides the eye.',
    image: { src: '/images/projects/features-section.png', alt: 'Colourful features section UI for an AI receptionist product' },
  },
  {
    title: 'Front-end',
    text: 'Fast, SEO-friendly websites and web apps built with React, Next.js and modern CSS — responsive on every screen, from day one.',
    image: { src: '/images/projects/hero-banner-header.png', alt: 'Website hero banner with header for a Mediterranean wellness brand' },
  },
  {
    title: 'Design Systems',
    text: 'Reusable components, tokens and documentation that keep design and code in sync — so your product scales without the mess.',
    image: { src: '/images/projects/mega-menu.jpg', alt: 'Website mega menu design with feature links' },
  },
];

export const works = [
  {
    title: 'AI Automation',
    category: 'SaaS Landing Page',
    href: DRIBBBLE + '27866317-Landing-page-Business-Automation-Modern-SaaS-Platform',
    image: { src: '/images/projects/saas-automation-landing.png', width: 1600, height: 1167, alt: 'Business automation SaaS landing page featuring a friendly AI mascot' },
  },
  {
    title: 'Pizza SaaS',
    category: 'Restaurant Landing Page',
    href: DRIBBBLE + '27497512-Pizza-Restaurant-SaaS-Landing-Page-UI-Design',
    image: { src: '/images/projects/pizza-restaurant-landing.png', width: 1600, height: 866, alt: 'Pizza restaurant SaaS landing page: never lose another order' },
  },
  {
    title: 'Astrology App',
    category: 'Mobile App UI',
    href: DRIBBBLE + '27058799-Astrology-Numerology-Mobile-App-UI-Design',
    image: { src: '/images/projects/astrology-numerology-app.png', width: 1600, height: 1200, alt: 'Astrology and numerology mobile app UI screens' },
  },
];

export const cta = {
  title: "Let's Build Yours",
  text: 'Got a product idea or a site that needs a refresh? I design and build it — fast and accessible.',
  button: { label: 'Start a project' }, // links to siteConfig.email
};

export const footerLinks = [
  { label: 'About me', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

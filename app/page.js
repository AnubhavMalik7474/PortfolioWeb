import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import Intro from '@/components/Intro/Intro';
import About from '@/components/About/About';
import Gallery from '@/components/Gallery/Gallery';
import Services from '@/components/Services/Services';
import WorksPin from '@/components/WorksPin/WorksPin';
import Cta from '@/components/Cta/Cta';
import Footer from '@/components/Footer/Footer';
import JsonLd from '@/components/JsonLd/JsonLd';
import { siteConfig } from '@/lib/site';
import { services, works } from '@/lib/content';

export default function HomePage() {
  const { url, name, description } = siteConfig;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${url}/#organization`,
        name,
        url,
        logo: `${url}/icon.svg`,
        description,
        slogan: siteConfig.role,
        knowsAbout: ['UI design', 'UX research', 'Front-end development', 'React', 'Next.js', 'Design systems', 'Web accessibility', 'Figma'],
        email: siteConfig.email,
        telephone: siteConfig.phone,
        foundingDate: String(siteConfig.foundingYear),
        sameAs: siteConfig.social.map((s) => s.href),
        address: {
          '@type': 'PostalAddress',
          addressLocality: siteConfig.address.locality,
          addressCountry: siteConfig.address.country,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name,
        description,
        inLanguage: 'en',
        publisher: { '@id': `${url}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}/#webpage`,
        url,
        name: siteConfig.title,
        description,
        isPartOf: { '@id': `${url}/#website` },
        about: { '@id': `${url}/#organization` },
        primaryImageOfPage: `${url}/opengraph-image`,
        inLanguage: 'en',
      },
      {
        '@type': 'ItemList',
        '@id': `${url}/#services`,
        name: 'Services',
        itemListElement: services.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'Service', name: s.title, description: s.text, provider: { '@id': `${url}/#organization` } },
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${url}/#works`,
        name: 'Selected projects',
        itemListElement: works.map((w, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'CreativeWork',
            name: w.title,
            genre: w.category,
            image: `${url}${w.image.src}`,
            creator: { '@id': `${url}/#organization` },
          },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <Header />
      <main id="main">
        <Hero />
        <Intro />
        <About />
        <Gallery />
        <Services />
        <WorksPin />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

import BackgroundImage from '../../components/BackgroundImage';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { locales, defaultLocale } from '@/i18n/request';
import { getTranslations } from 'next-intl/server';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params, searchParams }, parent) {
  const { locale } = await params;
  const validLocale = locales.includes(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: validLocale });

  return {
    title: t('meta.title'),
    description: t('meta.description')
  };
}
export default async function HomePage({ params }) {
  const { locale } = await params;
  const validLocale = locales.includes(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: validLocale });

  return (
    <main className="page home">
      <section className="banner">
        <BackgroundImage url="/images/home-banner.jpg" />
        <div className="page-content">
          <h2>{t('meta.title')}</h2>
          <h1>{t('meta.description')}</h1>
          <div className="botoje-white"></div>
        </div>
      </section>

      {/*<section className="secondary">*/}
      {/*  <BackgroundImage url="/images/back2.jpg" className="mission" />*/}
      {/*  <div className="page-content">*/}
      {/*    <header className="missionus">*/}
      {/*      <h2>{formatMessage({ id: 'ourMission', defaultMessage: 'Our Mission' })}</h2>*/}
      {/*      <p>{formatMessage({ id: 'ourMissionText', defaultMessage: '' })}</p>*/}
      {/*    </header>*/}

      {/*    <div className="services">*/}
      {/*      <div>*/}
      {/*        <h3>{formatMessage({ id: 'firstService', defaultMessage: 'Organizing Prayer and Worship Sessions' })}</h3>*/}
      {/*        <p>{formatMessage({ id: 'firstServiceText', defaultMessage: '' })}</p>*/}
      {/*        <div className="image-circle sw">*/}
      {/*          <img src="/images/firstService.jpg" alt="Organizing Prayer and Worship Sessions" />*/}
      {/*        </div>*/}
      {/*      </div>*/}

      {/*      <div>*/}
      {/*        <h3>{formatMessage({ id: 'secondService', defaultMessage: 'Equipping Worshipers' })}</h3>*/}
      {/*        <p>{formatMessage({ id: 'secondServiceText', defaultMessage: '' })}</p>*/}
      {/*        <div className="image-circle">*/}
      {/*          <img src="/images/secondService.jpeg" alt="Equipping Worshipers" />*/}
      {/*        </div>*/}
      {/*      </div>*/}

      {/*      <div>*/}
      {/*        <h3>{formatMessage({ id: 'thirdService', defaultMessage: 'Nurturing Prophets' })}</h3>*/}
      {/*        <p>{formatMessage({ id: 'thirdServiceText', defaultMessage: '' })}</p>*/}
      {/*        <div className="image-circle ne">*/}
      {/*          <img src="/images/thirdService.jpg" alt="Nurturing Prophets" />*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/*<section className="primary about-us">*/}
      {/*  <div className="page-content">*/}
      {/*    <div className="botoje-white"></div>*/}
      {/*    <div className="text-block">*/}
      {/*      <h2>{formatMessage({ id: 'aboutUs', defaultMessage: 'About Us' })}</h2>*/}
      {/*    </div>*/}

      {/*    <div className="text-block">*/}
      {/*      <p>{formatMessage({ id: 'aboutUsSectionText', defaultMessage: '' })}</p>*/}
      {/*      <Link className="button" href="/about-us">*/}
      {/*        {formatMessage({ id: 'more', defaultMessage: 'More' })}*/}
      {/*      </Link>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}
    </main>
  );
}

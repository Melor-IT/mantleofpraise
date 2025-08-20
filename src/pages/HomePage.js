import { useIntl } from 'react-intl';
import BackgroundImage from '../components/BackgroundImage';

export default function HomePage({ locale, setLocale }) {
  const { formatMessage } = useIntl();

  return (
    <main className="page home">
      <section>
        <BackgroundImage url="/images/home-banner.jpg" />

        <div className="page-content">
          <h2>
            {formatMessage({
              id: 'welcomTo',
              defaultMessage: 'Welcome to'
            })}
          </h2>
          <h1>
            {formatMessage({
              id: 'mantleOfPraise',
              defaultMessage: 'Mantle of Praise'
            })}
          </h1>

          <div className='botoje-white'></div>
        </div>
      </section>

      <section className="secondary"></section>

      <section className="primary"></section>
    </main>
  );
}

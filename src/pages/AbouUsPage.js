import { useIntl } from 'react-intl';
import BackgroundImage from '../components/BackgroundImage';

export default function AboutUs() {
  const { formatMessage } = useIntl();

  return (
    <div className="page join-us">
      <section>
        <BackgroundImage url="/images/join-us-banner.png" />

        <div className="page-content">
          <h1>{formatMessage({ id: 'aboutUs', defaultMessage: 'About Us' })}</h1>

          <h3 style={{ marginTop: '2rem' }}>
            The Spirit of the Lord GOD is upon me; because the LORD hath anointed me to preach good
            tidings unto the meek; he hath sent me to bind up the brokenhearted, to proclaim liberty
            to the captives, and the opening of the prison to them that are bound; to proclaim the
            acceptable year of the LORD, and the day of vengeance of our God; to comfort all that
            mourn; to appoint unto them that mourn in Zion, to give unto them beauty for ashes, the
            oil of joy for mourning, the garment of praise for the spirit of heaviness; that they
            might be called trees of righteousness, the planting of the LORD, that he might be
            glorified.
          </h3>
          <h3>- Isaiah 61:1-3</h3>
        </div>
      </section>
    </div>
  );
}

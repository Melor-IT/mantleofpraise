import AboutUsPage from '../../../components/AboutUsPage';
import { pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'about-us');
}

export default function Page() {
  return <AboutUsPage />;
}

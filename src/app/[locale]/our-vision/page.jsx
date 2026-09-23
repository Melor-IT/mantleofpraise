import OurVisionPage from '../../../components/OurVisionPage';
import { pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'our-vision');
}

export default function Page() {
  return <OurVisionPage />;
}

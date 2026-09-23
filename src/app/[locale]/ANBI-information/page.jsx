import ANBIInformationPage from '../../../components/ANBIInformationPage';
import { pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'ANBI-information');
}

export default function Page() {
  return <ANBIInformationPage />;
}

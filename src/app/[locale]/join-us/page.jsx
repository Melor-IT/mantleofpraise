import JoinUsPage from '../../../components/JoinUsPage';
import { pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'join-us');
}

export default function Page() {
  return <JoinUsPage />;
}

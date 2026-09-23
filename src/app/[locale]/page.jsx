import HomePage from '../../components/HomePage';
import { pageMetadata } from '../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale);
}

export default function Page() {
  return <HomePage />;
}

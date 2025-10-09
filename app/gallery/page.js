'use client';

import { useIntl } from 'react-intl';

export default function GalleryPage() {
  const { formatMessage } = useIntl();

  return <div>{formatMessage({ id: 'gallery', defaultMessage: 'Gallery' })}</div>;
}

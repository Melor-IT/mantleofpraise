import { organizationStructuredData, serializeStructuredData } from '../../lib/site';

export default function OrganizationData({ locale }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeStructuredData(organizationStructuredData(locale))
      }}
    />
  );
}

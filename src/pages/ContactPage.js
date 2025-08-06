import { useIntl } from "react-intl";

export default function ContactPage() {
  const { formatMessage } = useIntl();

  return (
    <main class="page">{formatMessage({ id: "aboutUs", defaultMessage: "aboutUs" })}</main>
  );
}

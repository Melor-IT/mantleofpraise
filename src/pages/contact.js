import { useIntl } from "react-intl";

export default function Contact() {
  const { formatMessage } = useIntl();

  return (
    <main class="page">{formatMessage({ id: "aboutUs", defaultMessage: "aboutUs" })}</main>
  );
}

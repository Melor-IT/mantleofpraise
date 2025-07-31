import { useIntl } from "react-intl";

export default function Contact() {
  const { formatMessage } = useIntl();

  return (
    <div>{formatMessage({ id: "aboutUs", defaultMessage: "aboutUs" })}</div>
  );
}

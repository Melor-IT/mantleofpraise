import { useIntl } from "react-intl";

export default function AboutUs() {
  const { formatMessage } = useIntl();

  return (
    <div>{formatMessage({ id: "aboutUs", defaultMessage: "About Us" })}</div>
  );
}

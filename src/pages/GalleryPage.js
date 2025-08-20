import { useIntl } from "react-intl";

export default function Gallery() {
  const { formatMessage } = useIntl();

  return (
    <div>{formatMessage({ id: "gallery", defaultMessage: "Gallery" })}</div>
  );
}

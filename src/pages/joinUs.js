import { useIntl } from "react-intl";

export default function JoinUs() {
  const { formatMessage } = useIntl();

  return (
    <div>{formatMessage({ id: "joinUs", defaultMessage: "Join Us" })}</div>
  );
}

import React from "react";
import { useIntl } from "react-intl";

export default function Home() {
  const { formatMessage } = useIntl();

  return (
    <div>{formatMessage({ id: "home.title", defaultMessage: "home" })}</div>
  );
}

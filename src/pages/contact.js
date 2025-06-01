import React from "react";
import { useIntl } from "react-intl";

export default function Contact() {
  const { formatMessage } = useIntl();

  return (
    <div>{formatMessage({ id: "contact.title", defaultMessage: "Contact" })}</div>
  );
}

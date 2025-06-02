import React from "react";
import { useIntl } from "react-intl";
import  imageheader  from "../images/headrimage.jpg";

export default function Home({ locale, setLocale }) {
  const { formatMessage } = useIntl();

  return (
    <div className="home">
      <div className="imageheadr">
        <img src={imageheader} alt="imageheader" className="imageheader" />
      </div>
    </div>
  );
}

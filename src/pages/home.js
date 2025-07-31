import React from "react";
import { useIntl } from "react-intl";

export default function Home({ locale, setLocale }) {
  useIntl();

  return (
    <div  className="home">
      <div className="imageheadr">
        <img src="../images/headrimage.jpg" alt="imageheader" className="imageheader" />
      </div>
    </div>
  );
}

import React from "react";
import { useIntl } from "react-intl";
// import image from "./images/footerimage.jpg";
import  imageheader  from "../images/headrimage.jpg";

export default function Home({ locale, setLocale }) {
  useIntl();

  return (
    <div  className="home">
      <div className="imageheadr">
        <img src={imageheader} alt="imageheader" className="imageheader" />
      </div>
    </div>
  );
}

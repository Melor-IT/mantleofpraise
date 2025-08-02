import React from "react";

const BackgroundImage = ({ url }) => (
  <div
    className="background"
    style={{
      backgroundImage: `url(${url})`,
    }}
  />
);

export default BackgroundImage;

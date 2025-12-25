import React, { useState } from "react";
import "./Banner.scss";
import { Skeleton } from "antd";

interface BannerProps {
  CalculatorName?: string;
  CalculatorDesc?: string;
  CalculatorImage?: string;
}

const Banner: React.FC<BannerProps> = ({
  CalculatorName,
  CalculatorDesc,
  CalculatorImage,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="Banner">
      <div className="section1">
        <div className="left">
          <h3>{CalculatorName}</h3>
          <p>{CalculatorDesc}</p>
        </div>

        <div className="right">
          {!imageLoaded && (
            <Skeleton.Avatar
              shape="square"
              style={{ width: 280, height: 280 }}
              active
            />
          )}

          <img
            src={CalculatorImage ?? "/assets/apt.png"}
            alt="Banner Image"
            className={`picture ${imageLoaded ? "loaded" : "not-loaded"}`}
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;

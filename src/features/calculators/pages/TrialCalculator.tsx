import React, { useEffect, useState, ReactNode } from "react";
import "./Calculator.scss";

import { Row, Col } from "antd";
import { useLocation } from "react-router-dom";

import Banner from "@/components/layout/Banner";
import { GetCalculatorDescription } from "@/utils/api/Api";
import { Image_URL } from "@/utils/constants/host";
import Signin from "@/features/auth/Signin";

interface TrialCalculatorProps {
  children: ReactNode;
}

const TrialCalculator: React.FC<TrialCalculatorProps> = ({ children }) => {
  const [calculatordetails, setCalculatorDetails] = useState<any>(null);
  const { pathname } = useLocation();

  const category_slug = pathname.split("/")[2];

  useEffect(() => {
    GetCalculatorDescription(category_slug)
      .then((res) => setCalculatorDetails(res?.data?.data))
      .catch((err) => console.error("API Error:", err));
  }, [category_slug]);

  const isToken = localStorage.getItem("UserLoginTokenApt");
  const userStatus = localStorage.getItem("UserStatus");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" }); // FIXED
  }, []);

  if (!isToken || userStatus === "DEACTIVATE") {
    return <Signin />;
  }

  return (
    <div className="calculator_main_container">
      <Banner
        CalculatorDesc={calculatordetails?.description}
        CalculatorName={
          calculatordetails?.calculator_name ?? category_slug.replace(/-/g, " ")
        }
        CalculatorImage={Image_URL + calculatordetails?.file_name}
      />

      <Row justify="center" className="cal_main">
        <Col xs={24} md={20} lg={18}>
          <div className="Calculator_container">
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return child;

              // FIX: TS-safe cloneElement
              return React.cloneElement(
                child as React.ReactElement<any>,
                {
                  calculatordetails,
                } as any
              );
            })}
          </div>

          <p
            className="description"
            dangerouslySetInnerHTML={{
              __html: calculatordetails?.profit_margin_formula,
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TrialCalculator;

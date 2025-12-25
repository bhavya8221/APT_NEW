import React, { useEffect, useState } from "react";
import { Input, message } from "antd";

import { CalculatorViewApi } from "@/utils/api/Api";

type GrossPayProps = {
  calculatordetails?: {
    calculatordetails?: {
      id?: string | number;
    };
  };
};

const GrossPayCalculator: React.FC<GrossPayProps> = ({ calculatordetails }) => {
  const [hourlyCost, setHourlyCost] = useState<number | undefined>();
  const [numberOfDays, setNumberOfDays] = useState<number | undefined>();
  const [hoursPerDay, setHoursPerDay] = useState<number | undefined>();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 }); // TS safe
  }, []);

  const handleView = async () => {
    try {
      await CalculatorViewApi(calculatordetails?.calculatordetails?.id);
    } catch (err) {
      console.log(err);
      message.error("Unable to record calculator view.");
    }
  };

  const total = (hourlyCost || 0) * (numberOfDays || 0) * (hoursPerDay || 0);

  return (
    <div className="GrossPayCalculator">
      <div className="Row_1">
        <div className="Col_1 blank_input">
          Enter your hourly cost
          <div className="Col_12">
            <Input
              placeholder="Enter value"
              type="number"
              value={hourlyCost}
              onChange={(e) => setHourlyCost(Number(e.target.value))}
              onClick={handleView}
            />
          </div>
        </div>
      </div>

      <div className="Row_1">
        <div className="Col_1 blank_input">
          Enter Number of Days
          <div className="Col_12">
            <Input
              placeholder="Enter value"
              type="number"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="Row_1">
        <div className="Col_1 blank_input">
          Enter Working hours per day
          <div className="Col_12">
            <Input
              placeholder="Enter value"
              type="number"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="Row_1">
        <div className="Col_1 blank_input">
          Total Amount :
          <div className="Col_12">
            <div className="blank_input">${total.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrossPayCalculator;

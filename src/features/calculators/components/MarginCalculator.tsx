import React, { useEffect, useState } from "react";
import { Input, Button, Form, message } from "antd";

import { marginCalculator } from "@/features/calculators/functions/marginCalculatorFunction";
import { CalculatorViewApi } from "@/utils/api/Api";

type MarginCalculatorProps = {
  calculatordetails?: {
    calculatordetails?: {
      id?: string | number;
    };
  };
};

const MarginCalculatorComponent: React.FC<MarginCalculatorProps> = ({
  calculatordetails,
}) => {
  const [cost, setCost] = useState<number | undefined>();
  const [revenue, setRevenue] = useState<number | undefined>();
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!cost || cost <= 0 || !revenue || revenue <= 0) {
      setResult("negative");
      return;
    }

    try {
      const data = await marginCalculator(cost, revenue);
      setResult(data);
    } catch (error) {
      console.error("Calculation error:", error);
      message.error("Error calculating margin.");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 }); // clean & TS-safe
  }, []);

  const handleView = async (id?: string | number) => {
    if (!id) return;

    try {
      await CalculatorViewApi(id); // ✔ Only ONE argument (new API)
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <div className="MarginCalculatorComponent">
      <Form layout="vertical">
        <Form.Item label="Cost ($)">
          <Input
            type="number"
            placeholder="Enter Cost"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </Form.Item>

        <Form.Item label="Revenue ($)">
          <Input
            type="number"
            placeholder="Enter Revenue"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
          />
        </Form.Item>
      </Form>

      <div className="Button_style" style={{ display: "flex", gap: "10px" }}>
        <Button
          onClick={() => {
            setCost(undefined);
            setRevenue(undefined);
          }}
        >
          Clear
        </Button>

        <Button
          type="primary"
          onClick={() => {
            handleSubmit();
            handleView(calculatordetails?.calculatordetails?.id);
          }}
        >
          Calculate
        </Button>
      </div>

      {result && (
        <div className="Answer_Container">
          <h5>Answer</h5>

          {result === "negative" ? (
            <p className="red">Enter Cost & Revenue greater than 0</p>
          ) : (
            <>
              <p>Gross Margin: {result.G}%</p>
              <p>Markup: {result.M}%</p>
              <p>Gross Profit: ${result.P}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MarginCalculatorComponent;

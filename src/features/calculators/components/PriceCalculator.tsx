import { useEffect, useState } from "react";
import { Button, Form, Input, Card, message } from "antd";
import { priceCalculator } from "@/features/calculators/functions/priceCalculatorFunction";
import { CalculatorViewApi } from "@/utils/api/Api";

interface PriceCalculatorProps {
  calculatordetails?: {
    calculatordetails?: {
      id?: string | number;
    };
  };
}

export default function PriceCalculatorComponent({
  calculatordetails = {},
}: PriceCalculatorProps) {
  const [cost, setCost] = useState<string>("");
  const [grossMargin, setGrossMargin] = useState<string>("");
  const [result, setResult] = useState<any>(null);

  // const storedToken = localStorage.getItem("UserLoginTokenApt");

  const handleSubmit = async () => {
    if (!cost || !grossMargin) {
      return message.error("Please enter both cost and gross margin.");
    }

    if (Number(cost) <= 0 || Number(grossMargin) <= 0) {
      setResult("negative");
      return;
    }

    try {
      const data = await priceCalculator(Number(cost), Number(grossMargin));
      setResult(data);
    } catch (error) {
      console.error("Price calculation error:", error);
      message.error("Unable to calculate price.");
    }
  };

  // FIX: API accepts only ONE argument (id)
  const handleView = async () => {
    const id = calculatordetails?.calculatordetails?.id;
    if (!id) return;

    try {
      await CalculatorViewApi(id);
    } catch (error) {
      console.error("Error viewing calculator:", error);
    }
  };

  // FIX: "instant" is invalid behavior in TS
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <Card className="calculator-card">
      <Form layout="vertical">
        <Form.Item label="Cost">
          <Input
            size="large"
            placeholder="Enter cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            prefix="$"
          />
        </Form.Item>

        <Form.Item label="Gross Margin (%)">
          <Input
            size="large"
            placeholder="Enter gross margin (0–99)"
            value={grossMargin}
            onChange={(e) => setGrossMargin(e.target.value)}
            prefix="%"
          />
        </Form.Item>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button
            size="large"
            onClick={() => {
              setCost("");
              setGrossMargin("");
              setResult(null);
            }}
          >
            Clear
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={() => {
              handleSubmit();
              handleView();
            }}
          >
            Calculate
          </Button>
        </div>
      </Form>

      {result && (
        <Card className="result-card" style={{ marginTop: "2rem" }}>
          <h3>Answer</h3>

          {result === "negative" ? (
            <p style={{ color: "red" }}>Enter Cost & Margin greater than 0</p>
          ) : (
            <>
              <p>
                <strong>Price (R):</strong> ${result?.R}
              </p>
              <p>
                <strong>Profit (P):</strong> ${result?.P}
              </p>
              <p>
                <strong>Mark Up (M):</strong> {result?.M}%
              </p>
            </>
          )}
        </Card>
      )}
    </Card>
  );
}

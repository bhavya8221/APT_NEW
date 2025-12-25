import { useEffect, useState } from "react";
import { Button, Form, Input, message, Card } from "antd";
import { profitMarginCalculator } from "@/features/calculators/functions/profitMarginCalculatorFunction";
import { CalculatorViewApi } from "@/utils/api/Api";

interface ProfitCalculatorProps {
  calculatordetails?: {
    calculatordetails?: {
      id?: string | number;
    };
  };
}

export default function ProfitCalculator({
  calculatordetails = {},
}: ProfitCalculatorProps) {
  const [cost, setCost] = useState<string>("");
  const [revenue, setRevenue] = useState<string>("");
  const [result, setResult] = useState<any>(null);

  // const storedToken = localStorage.getItem("UserLoginTokenApt");

  const handleSubmit = async () => {
    if (!cost || !revenue) {
      return message.error("Please enter both cost and revenue.");
    }

    try {
      const data = await profitMarginCalculator(Number(revenue), Number(cost));
      setResult(data);
    } catch (error) {
      console.error("Profit margin calculation failed:", error);
      message.error("Unable to calculate profit margin.");
    }
  };

  const handleView = async () => {
    const id = calculatordetails?.calculatordetails?.id;
    if (!id) return;

    try {
      // FIX: API only accepts 1 argument
      await CalculatorViewApi(id);
    } catch (error) {
      console.error("Error viewing calculator:", error);
    }
  };

  // FIX: ScrollBehavior only accepts "auto" or "smooth"
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

        <Form.Item label="Revenue">
          <Input
            size="large"
            placeholder="Enter revenue"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            prefix="$"
          />
        </Form.Item>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button
            type="default"
            size="large"
            onClick={() => {
              setCost("");
              setRevenue("");
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

          <p>
            <strong>Net Profit Margin:</strong> {result.netProfitMargin}%
          </p>
          <p>
            <strong>Net Profit:</strong> ${result.netProfit}
          </p>
          <p>
            <strong>Profit Percentage:</strong> {result.profitPercentage}%
          </p>
        </Card>
      )}
    </Card>
  );
}

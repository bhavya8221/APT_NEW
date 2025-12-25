import { ArrowRight, Sparkles } from "lucide-react";
import "./ClosingCTA.scss";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export const ClosingCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="closing-cta">
      {/* Background gradient */}
      <div className="closing-cta__bg"></div>

      <div className="closing-cta__container">
        <div className="closing-cta__content">
          {/* Badge */}
          <div className="closing-cta__badge">
            <Sparkles className="icon" />
            Ready to Transform Your Pricing Strategy?
          </div>

          {/* Headlines */}
          <div className="closing-cta__headline">
            <h2>
              Unlock the{" "}
              <span className="highlight">Future of Pricing Strategy</span>
            </h2>
            <p>
              From AI-powered insights to financial calculators, everything you
              need to <span className="accent">win clients</span> and{" "}
              <span className="primary">maximize profitability</span> is here.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="closing-cta__buttons">
            <Button
              size="lg"
              className="btn-primary animate-glow"
              onClick={() => navigate("/ai-proposals")}
            >
              Get Started with APT 2.0
              <ArrowRight className="arrow" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

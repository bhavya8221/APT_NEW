import { Sparkles, Zap } from "lucide-react";
import "./Hero.scss";
import BannerVideo from "@/assets/aptvideo.mp4";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      {/* Background gradient */}
      <div className="hero__gradient"></div>

      <div className="hero__container">
        <div className="hero__grid">
          {/* Content */}
          <div className="hero__content">
            {/* Badge */}
            <div className="hero__badge">
              <Sparkles className="icon" />
              ASK Ceddie AI - Now Available
            </div>

            {/* Headline */}
            <div className="hero__headline">
              <h1>
                <span className="primary">Automated Pricing Tool 2.0</span>
                <br />
                <span className="foreground">AI-Driven Pricing for</span>
                <br />
                <span className="gradient">Coaches & Consultants</span>
              </h1>

              <p>
                The ONLY pricing tool built for the leadership development
                industry. Just click <span className="accent">ASK Ceddie</span>{" "}
                and let the pricing begin.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="hero__actions">
              <Button
                size="lg"
                className="btn-primary"
                onClick={() => navigate("/ai-proposals")}
              >
                <Zap className="icon mr-2" />
                Ask Ceddie Now
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="hero__trust">
              <div>
                <span className="dot green"></span> AI-Powered Analytics
              </div>
              <div>
                <span className="dot primary"></span> Industry-Specific
              </div>
              <div>
                <span className="dot accent"></span> Real-Time Insights
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero__imageWrapper">
            <div className="hero__image">
              <video autoPlay loop muted className="videoo">
                <source src={BannerVideo} />
              </video>
              <div className="overlay"></div>
            </div>

            {/* Floating elements */}
            <div className="float-tag accent">ASK Ceddie</div>
            <div className="float-tag primary">AI-Driven</div>
          </div>
        </div>
      </div>
    </section>
  );
};

import {
  Brain,
  TrendingUp,
  Target,
  Sliders,
  BarChart3,
  FileText,
  Zap,
} from "lucide-react";
import "./KeyFeatures.scss";
const features = [
  {
    icon: Brain,
    title: "AI-Driven Analytics",
    description:
      "Market, competitor & customer insights powered by advanced AI",
  },
  {
    icon: TrendingUp,
    title: "Dynamic Pricing Adjustments",
    description: "Real-time automated updates based on market conditions",
  },
  {
    icon: Target,
    title: "Recommended & Local Pricing",
    description: "Dual pricing options with scientific validation",
  },
  {
    icon: Sliders,
    title: "Customizable Models",
    description: "Cost-plus, value-based, or dynamic pricing strategies",
  },
  {
    icon: BarChart3,
    title: "User-Friendly Dashboard",
    description: "Intuitive, fast, and simple to use interface",
  },
  {
    icon: FileText,
    title: "Comprehensive Proposals",
    description: "Full or quick proposal formats for any client",
  },
  {
    icon: Zap,
    title: "Scalability",
    description: "Works for small businesses to enterprise level",
  },
];
export const KeyFeatures = () => {
  return (
    <section className="key-features">
      <div className="container">
        <div className="header">
          <p>Key Features </p>
          <h2>
            You just click <span className="highlight"> ASK Ceddie </span>and
            let the pricing begin.
          </h2>
        </div>
        <div className="grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="icon">
                <feature.icon className="icon-svg" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

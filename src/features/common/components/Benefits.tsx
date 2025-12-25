import { CheckCircle, TrendingUp, Heart, Award } from "lucide-react";
import "./Benefits.scss";

const benefits = [
  {
    icon: CheckCircle,
    title: "Enhanced Decision-Making",
    description:
      "Make confident pricing decisions backed by comprehensive data analysis and AI insights.",
    color: "green",
  },
  {
    icon: TrendingUp,
    title: "Increased Profitability",
    description:
      "Capture maximum value from every project with scientifically optimized pricing strategies.",
    color: "red",
  },
  {
    icon: Heart,
    title: "Improved Customer Satisfaction",
    description:
      "Deliver fair, competitive pricing that builds trust and long-term client relationships.",
    color: "blue",
  },
];

export const Benefits = () => {
  return (
    <section className="benefits">
      <div className="container">
        {/* Section Header */}
        <div className="header">
          <h2>
            Transform Your <span className="highlight">Business Results</span>
          </h2>
          <p>
            Join thousands of coaches and consultants who've revolutionized
            their pricing strategy
          </p>
        </div>

        {/* Benefit Items */}
        <div className="grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className={`icon ${benefit.color}`}>
                <benefit.icon className="icon-svg" />
              </div>

              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Validation Badge */}
        <div className="validation">
          <div className="badge">
            <Award className="badge-icon" />
            <span>
              <span className="highlight">Scientific Validation</span>
              <span style={{ color: "black" }}>
                {" "}
                - Present evidence-backed proposals
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

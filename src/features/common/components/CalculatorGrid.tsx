import {
  Calculator,
  TrendingUp,
  DollarSign,
  BarChart3,
  Tag,
  PieChart,
  Handshake,
  FileText,
  Briefcase,
  FileSignature,
  Target,
} from "lucide-react";

import "./CalculatorGrid.scss";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

const calculators = [
  {
    icon: Calculator,
    title: "Advanced Price Exhibit Calculator",
    description: "Build clear, accurate price exhibits for clients",
    color: "primary",
    link: "calculator/advanced-price-exhibit",
  },
  {
    icon: TrendingUp,
    title: "HOT Deals Calculator",
    description: "Spot and showcase irresistible offers",
    color: "orange",
    link: "calculator/hot-deals-calculator",
  },
  {
    icon: DollarSign,
    title: "Gross Profit Margin Calculator",
    description: "Instantly calculate GP percentage",
    color: "green",
    link: "calculator/margin-calculator",
  },
  {
    icon: BarChart3,
    title: "Net Profit Margin Calculator",
    description: "Reveal true profitability per project",
    color: "blue",
    link: "calculator/profit-margin-calculator",
  },
  {
    icon: Tag,
    title: "Sale Price Calculator",
    description: "Generate sale prices with margins built-in",
    color: "accent",
    link: "calculator/sale-price-calculator",
  },
  {
    icon: PieChart,
    title: "Selling Price Calculator",
    description: "Set competitive selling prices",
    color: "purple",
    link: "calculator/selling-price-calculator",
  },
  {
    icon: Handshake,
    title: "Strategic Partnership Discount Calculator",
    description: "Model collaboration discounts",
    color: "indigo",
    link: "calculator/partnership-pricing-volume-discounts",
  },
  {
    icon: FileText,
    title: "Proposal Template Collection",
    description: "Ready-to-use client proposals",
    color: "primary",
    link: "proposals",
  },
  {
    icon: Briefcase,
    title: "Business Plan Templates",
    description: "Strategy and financial templates",
    color: "gray",
    link: "proposals",
  },
  {
    icon: FileSignature,
    title: "Agreement Template Collection",
    description: "Professional contracts for your industry",
    color: "green-dark",
    link: "proposals",
  },
  {
    icon: Target,
    title: "Profitability Module",
    description: "Deep dive into overall financial health",
    color: "primary",
    link: "calculator/profitability-module",
  },
];

export const CalculatorGrid = () => {
  return (
    <section className="calculator-grid">
      <div className="container">
        <div className="header">
          <h2>
            Complete <span className="highlight">Toolkit</span> Collection
          </h2>
          <p>
            From calculators to templates - everything you need to win clients
            and maximize profitability
          </p>
        </div>

        <div className="grid">
          {calculators.map((calc, index) => (
            <div key={index} className="card">
              <div className="card-top">
                <div className={`icon-box ${calc.color}`}>
                  <calc.icon className="icon" />
                </div>
                <div className="info">
                  <h3>{calc.title}</h3>
                  <p>{calc.description}</p>
                </div>
              </div>

              <Link to={`/${calc.link}`}>
                <Button variant="outline" size="sm" className="try-btn">
                  Try Now
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

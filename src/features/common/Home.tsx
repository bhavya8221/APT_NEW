import "../../index.css";
import { Hero } from "./components/Hero";
import { Overview } from "./components/Overview";
import { KeyFeatures } from "./components/KeyFeatures";
import { Benefits } from "./components/Benefits";
import { CalculatorGrid } from "./components/CalculatorGrid";
import { ClosingCTA } from "./components/ClosingCTA";

const Home = () => {
  return (
    <main className="index-page">
      <Hero />
      <Overview />
      <KeyFeatures />
      <Benefits />
      <CalculatorGrid />
      <ClosingCTA />
    </main>
  );
};

export default Home;

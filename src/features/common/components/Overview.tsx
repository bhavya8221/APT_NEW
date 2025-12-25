import "./Overview.scss";

export const Overview = () => {
  return (
    <section className="overview-section">
      <div className="overview-container">
        <div className="overview-content">
          <p className="overview-text">
            <span className="highlight-primary">APT 2.0</span> is the only{" "}
            <span className="highlight-accent"> AI-powered solution </span> for
            the leadership development, speaking, coaching, and training
            industry, using its ASK Ceddie module to deliver
            <span className="highlight-foreground">
              {" "}
              data-driven insights, real-time adjustments, and strategic pricing
              recommendations.{" "}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

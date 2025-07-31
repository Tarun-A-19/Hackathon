import React from 'react';

const Infographics = () => {
  return (
    <div className="infographics-section">
      <h2>Waste Statistics by Sector</h2>
      <div className="charts">
        <div className="chart">
          <h4>Household Waste</h4>
          <img src="/infographics/household-waste.png" alt="Household waste chart" />
        </div>
        <div className="chart">
          <h4>Industrial Waste</h4>
          <img src="/infographics/industrial-waste.png" alt="Industrial waste chart" />
        </div>
        <div className="chart">
          <h4>Campus Waste</h4>
          <img src="/infographics/campus-waste.png" alt="Campus waste chart" />
        </div>
      </div>
    </div>
  );
};

export default Infographics;
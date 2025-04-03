import { useMemo } from "react";
import type { DogAttributes } from "@shared/types";
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Register the required chart components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface AttributeRadarChartProps {
  attributes: DogAttributes;
}

const AttributeRadarChart = ({ attributes }: AttributeRadarChartProps) => {
  // Prepare chart data using useMemo to prevent unnecessary recalculations
  const data = useMemo(() => ({
    labels: [
      "Size",
      "Weight",
      "Aggression",
      "Trainability",
      "Energy Level",
      "Lifespan"
    ],
    datasets: [{
      label: "Dog Attributes",
      data: [
        attributes.size,
        attributes.weight,
        attributes.aggression,
        attributes.trainability,
        attributes.energy_level,
        attributes.lifespan
      ],
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: "rgba(59, 130, 246, 1)",
      pointBackgroundColor: "rgba(59, 130, 246, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 2
    }]
  }), [attributes]);

  // Chart options
  const options = {
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 10,
        ticks: { stepSize: 2 }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default AttributeRadarChart;

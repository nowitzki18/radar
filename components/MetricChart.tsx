'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricChartProps {
  data: { timestamp: string; value: number }[];
  anomalies?: { timestamp: string; value: number }[];
  label: string;
  color?: string;
}

export default function MetricChart({ data, anomalies, label, color = '#3b82f6' }: MetricChartProps) {
  const chartData = {
    labels: data.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label,
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      ...(anomalies && anomalies.length > 0
        ? [
            {
              label: 'Anomalies',
              data: anomalies.map((a) => a.value),
              borderColor: '#ef4444',
              backgroundColor: '#ef4444',
              pointRadius: 6,
              pointHoverRadius: 8,
              pointStyle: 'circle' as const,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}


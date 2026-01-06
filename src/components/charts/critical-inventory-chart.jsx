import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useState, useMemo } from 'react'
import TimeRangeSelector from './time-range-selector'
import { generateCriticalInventoryData } from '../../data/mock-chart-data'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function CriticalInventoryChart() {
  const [selectedRange, setSelectedRange] = useState(6)

  const chartData = useMemo(() => {
    const data = generateCriticalInventoryData(selectedRange)
    
    return {
      labels: data.map((d) => d.product),
      datasets: [
        {
          label: 'Current Stock',
          data: data.map((d) => d.currentStock),
          backgroundColor: 'rgb(239, 68, 68)', // red-500
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
        },
        {
          label: 'Min Threshold',
          data: data.map((d) => d.minThreshold),
          backgroundColor: 'rgba(239, 68, 68, 0.3)', // red-500 with opacity
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
          borderDash: [5, 5],
        },
      ],
    }
  }, [selectedRange])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Horizontal bars
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgb(220, 220, 220)',
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(50, 50, 50, 0.95)',
        titleColor: 'rgb(245, 245, 245)',
        bodyColor: 'rgb(220, 220, 220)',
        borderColor: 'rgba(100, 100, 100, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.x.toLocaleString()} units`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(100, 100, 100, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(180, 180, 180, 0.8)',
          font: {
            size: 11,
          },
        },
        beginAtZero: true,
      },
      y: {
        grid: {
          color: 'rgba(100, 100, 100, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(180, 180, 180, 0.8)',
          font: {
            size: 11,
          },
        },
      },
    },
  }

  return (
    <div className="card-surface shadow-card p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-[oklch(0.96_0_0)] mb-1">
            Critical Inventory
          </h3>
          <p className="text-xs md:text-sm text-[oklch(0.70_0_0)]">
            Low stock items requiring attention
          </p>
        </div>
        <TimeRangeSelector
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
      </div>
      <div className="h-[300px] md:h-[350px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}


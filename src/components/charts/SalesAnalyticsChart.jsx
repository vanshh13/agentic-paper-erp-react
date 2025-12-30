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
import TimeRangeSelector from './TimeRangeSelector'
import { generateSalesAnalyticsData } from '../../data/mockChartData'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function SalesAnalyticsChart() {
  const [selectedRange, setSelectedRange] = useState(6)

  const chartData = useMemo(() => {
    const data = generateSalesAnalyticsData(selectedRange)
    
    return {
      labels: data.map((d) => d.month),
      datasets: [
        {
          label: 'Number of Orders',
          data: data.map((d) => d.orders),
          backgroundColor: 'rgb(99, 102, 241)', // indigo-500
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: 'Sales Value (₹)',
          data: data.map((d) => d.salesValue / 10000), // Convert to lakhs for better scale
          backgroundColor: 'rgb(168, 85, 247)', // purple-500
          borderColor: 'rgb(168, 85, 247)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
      ],
    }
  }, [selectedRange])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
            if (context.datasetIndex === 1) {
              // Format sales value in lakhs
              return `Sales Value: ₹${context.parsed.y.toFixed(1)}L`
            }
            return `${context.dataset.label}: ${context.parsed.y}`
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
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Number of Orders',
          color: 'rgb(220, 220, 220)',
          font: {
            size: 11,
          },
        },
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
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Sales Value (₹ Lakhs)',
          color: 'rgb(220, 220, 220)',
          font: {
            size: 11,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgba(180, 180, 180, 0.8)',
          font: {
            size: 11,
          },
        },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="card-surface shadow-card p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-[oklch(0.96_0_0)] mb-1">
            Sales Analytics
          </h3>
          <p className="text-xs md:text-sm text-[oklch(0.70_0_0)]">
            Orders count and sales value by month
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


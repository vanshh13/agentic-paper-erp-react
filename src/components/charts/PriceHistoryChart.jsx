import { Line } from 'react-chartjs-2'
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
} from 'chart.js'
import { useState, useMemo } from 'react'
import TimeRangeSelector from './TimeRangeSelector'
import ProductSelector from './ProductSelector'
import { generatePriceHistoryData, mockProducts } from '../../data/mockChartData'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function PriceHistoryChart() {
  const [selectedRange, setSelectedRange] = useState(6)
  const [selectedProduct, setSelectedProduct] = useState('1')

  // Store raw data for tooltip access
  const rawData = useMemo(() => {
    return generatePriceHistoryData(selectedRange, parseInt(selectedProduct))
  }, [selectedRange, selectedProduct])

  const chartData = useMemo(() => {
    // Use date labels for better readability, fallback to week labels if too many points
    const useDateLabels = rawData.length <= 24 // Use dates if 24 weeks or less
    
    return {
      labels: rawData.map((d) => useDateLabels ? d.dateLabel : d.weekLabel),
      datasets: [
        {
          label: 'Price (₹)',
          data: rawData.map((d) => d.price),
          borderColor: 'rgb(251, 191, 36)', // amber-500
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(251, 191, 36)',
          pointBorderColor: 'rgb(250, 250, 250)',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }
  }, [rawData])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
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
          title: function(context) {
            const index = context[0].dataIndex
            if (rawData[index]) {
              return `Week ${rawData[index].week} - ${rawData[index].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            }
            return context[0].label
          },
          label: function(context) {
            return `Price: ₹${context.parsed.y.toLocaleString()}`
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Weeks',
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
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
        },
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
          callback: function(value) {
            return '₹' + value.toLocaleString()
          },
        },
        beginAtZero: false,
      },
    },
  }), [rawData])

  return (
    <div className="card-surface shadow-card p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-[oklch(0.96_0_0)] mb-1">
            Price History
          </h3>
          <p className="text-xs md:text-sm text-[oklch(0.70_0_0)]">
            Product price trend over time
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ProductSelector
            selectedProduct={selectedProduct}
            onProductChange={setSelectedProduct}
            products={mockProducts}
          />
          <TimeRangeSelector
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>
      </div>
      <div className="h-[300px] md:h-[350px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}


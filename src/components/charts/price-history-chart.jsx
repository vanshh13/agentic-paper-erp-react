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
import TimeRangeSelector from './time-range-selector'
import ProductSelector from './product-selector'
import { generatePriceHistoryData, mockProducts } from '../../data/mock-chart-data'

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
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

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

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
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
          font: {
            size: 11,
          },
        },
        grid: {
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
        ticks: {
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
  }

  const options = useMemo(
    () => createChartOptions(isDarkMode, baseOptions),
    [isDarkMode]
  )

  return (
    <div className="card-surface shadow-card p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
            Price History
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
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


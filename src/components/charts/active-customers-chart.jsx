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
import { generateActiveCustomersData } from '../../data/mock-chart-data'

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

export default function ActiveCustomersChart() {
  const [selectedRange, setSelectedRange] = useState(6)
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  const chartData = useMemo(() => {
    const data = generateActiveCustomersData(selectedRange)
    
    return {
      labels: data.map((d) => d.month),
      datasets: [
        {
          label: 'Active Customers',
          data: data.map((d) => d.value),
          borderColor: 'rgb(99, 102, 241)', // indigo-500
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: 'rgb(250, 250, 250)',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }
  }, [selectedRange])

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
      },
    },
    scales: {
      x: {
        grid: {
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
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
            Active Customers
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Customer growth over time
          </p>
        </div>
        <TimeRangeSelector
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
      </div>
      <div className="h-[300px] md:h-[350px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}


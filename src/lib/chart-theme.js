export const getChartThemeColors = (isDarkMode) => {
  if (isDarkMode) {
    // Dark mode colors
    return {
      textColor: 'rgb(220, 220, 220)',      // Light text
      gridColor: 'rgba(100, 100, 100, 0.2)', // Subtle grid
      ticksColor: 'rgba(180, 180, 180, 0.8)', // Medium gray ticks
      tooltipBg: 'rgba(50, 50, 50, 0.95)',   // Dark tooltip bg
      tooltipTitle: 'rgb(245, 245, 245)',    // Light title
      tooltipBody: 'rgb(220, 220, 220)',     // Light body
      tooltipBorder: 'rgba(100, 100, 100, 0.3)', // Subtle border
    }
  } else {
    // Light mode colors
    return {
      textColor: 'rgb(80, 80, 80)',           // Dark text
      gridColor: 'rgba(200, 200, 200, 0.3)',  // More visible grid
      ticksColor: 'rgba(100, 100, 100, 0.7)', // Darker ticks
      tooltipBg: 'rgba(240, 240, 240, 0.95)', // Light tooltip bg
      tooltipTitle: 'rgb(50, 50, 50)',        // Dark title
      tooltipBody: 'rgb(80, 80, 80)',         // Dark body
      tooltipBorder: 'rgba(180, 180, 180, 0.4)', // More visible border
    }
  }
}

export const createChartOptions = (isDarkMode, baseOptions = {}) => {
  const themeColors = getChartThemeColors(isDarkMode)

  return {
    ...baseOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins?.legend,
        display: true,
        position: 'top',
        labels: {
          color: themeColors.textColor,
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: themeColors.tooltipBg,
        titleColor: themeColors.tooltipTitle,
        bodyColor: themeColors.tooltipBody,
        borderColor: themeColors.tooltipBorder,
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        ...baseOptions.plugins?.tooltip,
      },
    },
    scales: {
      ...(baseOptions.scales || {}),
      x: {
        ...(baseOptions.scales?.x || {}),
        grid: {
          color: themeColors.gridColor,
          drawBorder: false,
        },
        ticks: {
          color: themeColors.ticksColor,
          font: {
            size: 11,
          },
        },
        beginAtZero: true,
      },
      y: {
        ...(baseOptions.scales?.y || {}),
        grid: {
          color: themeColors.gridColor,
          drawBorder: false,
        },
        ticks: {
          color: themeColors.ticksColor,
          font: {
            size: 11,
          },
        },
      },
    },
  }
}

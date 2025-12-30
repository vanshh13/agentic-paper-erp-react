// Mock data for Active Customers Chart
export const generateActiveCustomersData = (months) => {
  const data = []
  const today = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setMonth(date.getMonth() - i)
    
    // Generate realistic dummy data with some variation
    const baseValue = 150 + Math.random() * 50
    const trend = (months - i) * 5 // Slight upward trend
    const value = Math.round(baseValue + trend + (Math.random() * 20 - 10))
    
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      value: Math.max(100, value), // Ensure minimum value
    })
  }
  
  return data
}

// Mock data for Sales Analytics Chart
export const generateSalesAnalyticsData = (months) => {
  const data = []
  const today = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setMonth(date.getMonth() - i)
    
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      orders: Math.floor(Math.random() * 50) + 20, // 20-70 orders
      salesValue: Math.floor(Math.random() * 500000) + 200000, // ₹2L - ₹7L
    })
  }
  
  return data
}

// Mock data for Top Inventory Chart
export const generateTopInventoryData = (months) => {
  const productNames = [
    'A4 Paper 80gsm',
    'A4 Paper 70gsm',
    'A3 Paper 80gsm',
    'Legal Size Paper',
    'Photo Paper Glossy',
    'Cardstock White',
    'Envelope A4',
    'Notebook 200pg',
  ]
  
  return productNames.slice(0, 8).map((name, idx) => ({
    product: name,
    quantity: Math.floor(Math.random() * 5000) + 1000 + (idx * 200), // 1000-6000
  })).sort((a, b) => b.quantity - a.quantity)
}

// Mock data for Critical Inventory Chart
export const generateCriticalInventoryData = (months) => {
  const productNames = [
    'A4 Paper 80gsm',
    'A3 Paper 80gsm',
    'Photo Paper Glossy',
    'Cardstock White',
    'Envelope A4',
    'Notebook 200pg',
    'Stapler Pins',
    'File Folders',
  ]
  
  return productNames.map((name) => ({
    product: name,
    currentStock: Math.floor(Math.random() * 200) + 10, // 10-210 (low stock)
    minThreshold: Math.floor(Math.random() * 100) + 50, // 50-150
  })).filter(item => item.currentStock < item.minThreshold)
    .sort((a, b) => a.currentStock - b.currentStock)
    .slice(0, 8)
}

// Mock data for Price History Chart - Weekly scale
export const generatePriceHistoryData = (months, productId) => {
  const data = []
  const today = new Date()
  const basePrice = 500 + (productId * 50) // Different base price per product
  
  // Calculate total weeks (approximately 4 weeks per month)
  const totalWeeks = months * 4
  
  // Start from the beginning of the range
  const startDate = new Date(today)
  startDate.setMonth(startDate.getMonth() - months)
  
  for (let week = 0; week < totalWeeks; week++) {
    const weekDate = new Date(startDate)
    weekDate.setDate(weekDate.getDate() + (week * 7)) // Add 7 days for each week
    
    // Generate price with some variation and trend
    const weekNumber = week + 1
    const variation = (Math.random() * 50) - 25 // ±25
    const trend = (weekNumber / totalWeeks) * (months * 2) // Slight upward trend over time
    const price = Math.round(basePrice + variation + trend)
    
    // Format label as "Week X" or date
    const weekLabel = `W${weekNumber}`
    const dateLabel = weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    data.push({
      week: weekNumber,
      weekLabel: weekLabel,
      dateLabel: dateLabel,
      date: weekDate,
      price: Math.max(400, price), // Ensure minimum price
    })
  }
  
  return data
}

// Mock product list for selector
export const mockProducts = [
  { value: '1', label: 'A4 Paper 80gsm' },
  { value: '2', label: 'A4 Paper 70gsm' },
  { value: '3', label: 'A3 Paper 80gsm' },
  { value: '4', label: 'Legal Size Paper' },
  { value: '5', label: 'Photo Paper Glossy' },
  { value: '6', label: 'Cardstock White' },
  { value: '7', label: 'Envelope A4' },
  { value: '8', label: 'Notebook 200pg' },
]


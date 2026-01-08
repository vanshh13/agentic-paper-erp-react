import { createSlice } from '@reduxjs/toolkit'

const buildBreadcrumbsFromPathname = (pathname) => {
  const paths = String(pathname || '')
    .split('/')
    .filter(Boolean)

  const breadcrumbs = [{ label: 'Home', path: '/dashboard' }]

  if (paths.length === 0) return breadcrumbs

  let currentPath = ''
  paths.forEach((path) => {
    currentPath += `/${path}`
    const label = path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    breadcrumbs.push({ label, path: currentPath })
  })

  return breadcrumbs
}

const breadcrumbsSlice = createSlice({
  name: 'breadcrumbs',
  initialState: {
    items: [{ label: 'Home', path: '/dashboard' }],
  },
  reducers: {
    setPathname(state, action) {
      state.items = buildBreadcrumbsFromPathname(action.payload)
    },
    resetBreadcrumbs(state) {
      state.items = [{ label: 'Home', path: '/dashboard' }]
    },
  },
})

export const { setPathname, resetBreadcrumbs } = breadcrumbsSlice.actions

export const selectBreadcrumbs = (state) => state.breadcrumbs.items

export default breadcrumbsSlice.reducer

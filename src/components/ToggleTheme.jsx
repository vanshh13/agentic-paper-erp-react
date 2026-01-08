import { Moon, Sun } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../store/theme-slice'
// import { Update } from '../../services/api/profile/profile'

const ToggleTheme = () => {
  const dispatch = useDispatch()
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const userId = useSelector((state) => state.auth.user?.id)

  const handleToggle = async () => {
    const newTheme = isDarkMode ? 'light' : 'dark'

    // 1️⃣ Update Redux immediately
    dispatch(toggleTheme())

    // // 2️⃣ Optional: persist to backend
    // try {
    //   if (userId) {
    //     await Update(userId, {
    //       meta_data: {
    //         preferences: { theme: newTheme },
    //       },
    //     })
    //   }
    // } catch (err) {
    //   console.error('Theme update failed, reverting')
    //   dispatch(toggleTheme()) // revert
    // }

  }

  return (
    <button
      onClick={handleToggle}
      className="relative w-20 h-[50px] rounded-full bg-[#28292C]"
    >
      <div className="absolute inset-0 flex justify-between px-2 items-center">
        <Sun className={`w-5 ${isDarkMode ? 'text-gray-500' : 'text-white'}`} />
        <Moon className={`w-5 ${isDarkMode ? 'text-white' : 'text-gray-500'}`} />
      </div>

      <div
        className={`absolute top-2 w-8 h-8 bg-black rounded-full transition-all ${
          isDarkMode ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  )
}

export default ToggleTheme

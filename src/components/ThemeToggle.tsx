import { useEffect } from "react"

export const ThemeToggle = () => {
  useEffect(() => {
    // Force dark mode always
    const root = document.documentElement
    root.classList.remove("light")
    localStorage.setItem("theme", "dark")
  }, [])

  return null
}
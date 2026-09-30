import { ReactNode } from 'react'
import { useData } from '../context/DataContext'
import GridBackground from './GridBackground'
import Navbar from './Navbar'
import Footer from './Footer'

/** Frame shared by every public page: interactive grid, navbar, footer. */
export default function SiteShell({ children }: { children: ReactNode }) {
  const { config } = useData()
  const s = config.site
  return (
    <div className="relative min-h-screen flex flex-col">
      {s.grid_enabled && <GridBackground size={s.grid_size} interactive={s.grid_interactive} />}
      <Navbar />
      <main className="relative z-[1] flex-1">{children}</main>
      <Footer />
    </div>
  )
}
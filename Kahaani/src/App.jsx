import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import AuthPage from './pages/AuthPage'
import ArtistPage from './pages/ArtistPage'
import BuyerPage from './pages/BuyerPage'
import './styles/globals.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth/:role" element={<AuthPage />} />
        <Route path="/artist" element={<ArtistPage />} />
        <Route path="/buyer" element={<BuyerPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Instruments from './pages/Instruments'
import About from './pages/About'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/instruments" element={<Instruments />} />
        <Route path="/about"       element={<About />} />
        <Route path="/sign-in/*"   element={<SignInPage />} />
        <Route path="/sign-up/*"   element={<SignUpPage />} />
      </Routes>
    </Router>
  )
}

// src/router/index.tsx
import { Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Report from "../pages/nav/Report"
import MainZone from "../pages/nav/MainZone"
import ChatBot from "../pages/nav/ChatBot"
import Sensor from "../pages/nav/Sensor"
import Alarm from "../pages/Alarm"

import NotFound from "../pages/NotFound"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/alarm" element={<Alarm />} />

      {/* nav */}
      <Route path="/report" element={<Report />} />
      <Route path="/mainzone" element={<MainZone />} />
      <Route path="/chatbot" element={<ChatBot />} />
      <Route path="/sensor" element={<Sensor />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
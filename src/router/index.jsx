// src/router/index.jsx
import { Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Report from "../pages/nav/Report"
import MainZone from "../pages/nav/MainZone"
import ChatBot from "../pages/nav/ChatBot"
import Sensor from "../pages/nav/Sensor"
import Alarm from "../pages/Alarm"
import Setting from "../setting/Setting"

import NotFound from "../pages/NotFound"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/alarm" element={<Alarm />} />
      <Route path="/setting" element={<Setting />} />

      {/* nav */}
      <Route path="/mainzone" element={<MainZone />} />
      <Route path="/report" element={<Report />} />
      <Route path="/sensor" element={<Sensor />} />
      <Route path="/chatbot" element={<ChatBot />} />

      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
} 
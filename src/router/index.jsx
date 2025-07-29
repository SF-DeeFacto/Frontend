// src/router/index.jsx
import { Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Report from "../pages/Report"
import ChatBot from "../pages/ChatBot"
import Sensor from "../pages/Sensor"
import Alarm from "../pages/Alarm"
import Setting from "../pages/setting/Setting"
import Graph from "../pages/Graph"
import ZoneA from "../pages/zone/ZoneA"
import ZoneB from "../pages/zone/ZoneB"
import ZoneC from "../pages/zone/ZoneC"
import NotFound from "../pages/NotFound"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/alarm" element={<Alarm />} />
      <Route path="/setting" element={<Setting />} />

      {/* nav */}
      <Route path="/mainzone" element={<ZoneA />} />
      <Route path="/report" element={<Report />} />
      <Route path="/sensor" element={<Sensor />} />
      <Route path="/graph" element={<Graph />} />      
      <Route path="/chatbot" element={<ChatBot />} />
      {/*sub */}
      <Route path="/zoneA" element={<ZoneA />} />
      <Route path="/zone/a" element={<ZoneA />} />
      <Route path="/zone/b" element={<ZoneB />} />
      <Route path="/zone/c" element={<ZoneC />} />

      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
} 
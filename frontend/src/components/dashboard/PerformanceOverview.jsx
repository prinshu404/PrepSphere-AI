import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import "../../assets/css/performance-overview.css";

const CustomTooltip = ({ active, payload, label }) => active && payload?.length ? <div className="performance-tooltip"><span>{label}</span><strong>{payload[0].value}/100</strong></div> : null;

export default function PerformanceOverview({ data = [], score = 0, change = 0 }) {
  return (
    <div className="performance-overview">
      <div className="performance-header"><div><h2>Performance Overview</h2><p>Your interview performance over the last 7 days</p></div><div className="performance-period"><span className="performance-period-dot"></span>This Week</div></div>
      <div className="performance-summary"><div className="performance-score"><strong>{score}</strong><span>/100</span></div><div className="performance-growth"><span>{change >= 0 ? "+" : ""}{change}%</span><small>vs previous week</small></div></div>
      <div className="performance-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs><linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7654d7" stopOpacity={0.22}/><stop offset="100%" stopColor="#7654d7" stopOpacity={0.02}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#eeeeF3" vertical={false}/>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#999cac", fontSize: 10 }} dy={8}/>
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#999cac", fontSize: 10 }} ticks={[0,20,40,60,80,100]}/>
            <Tooltip content={<CustomTooltip/>} cursor={{ stroke: "#dcd6ee", strokeDasharray: "4 4" }}/>
            <Area type="monotone" dataKey="score" stroke="#7654d7" strokeWidth={3} fill="url(#performanceGradient)" dot={false} activeDot={{ r: 5, fill: "#7654d7", stroke: "#ffffff", strokeWidth: 3 }}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

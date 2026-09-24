import React from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export default function StatCard({ title, value, suffix = "", change, description, icon: Icon, iconClass }) {
  return (
    <div className="stats-card">
      <div className="stats-card-top">
        <div className={`stats-icon ${iconClass}`}><Icon size={19} strokeWidth={2.2} /></div>
        <span className="stats-card-action"><ArrowUpRight size={15} /></span>
      </div>
      <div className="stats-card-content">
        <p className="stats-card-title">{title}</p>
        <div className="stats-value-row"><span className="stats-card-value">{value}</span>{suffix && <span className="stats-card-suffix">{suffix}</span>}</div>
      </div>
      <div className="stats-card-footer">
        <span className="stats-change stats-change--positive"><TrendingUp size={12} />{change}</span>
        <span className="stats-description">{description}</span>
      </div>
    </div>
  );
}

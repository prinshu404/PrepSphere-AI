import React from "react";
import {
  Users,
  LogIn,
  AlertCircle,
  Mic2,
} from "lucide-react";
import StatCard from "./StatCard";
import "../../assets/css/stats-grid.css";

export default function StatsGrid({ stats }) {
  const items = [
    {
      title: "Registrations",
      value: stats.students ?? 0,
      description: "total students",
      icon: Users,
      iconClass: "stats-icon--purple",
    },
    {
      title: "Successful Logins",
      value: stats.logins ?? 0,
      description: "successful login attempts",
      icon: LogIn,
      iconClass: "stats-icon--blue",
    },
    {
      title: "Failed Logins",
      value: stats.failed_logins ?? 0,
      description: "failed login attempts",
      icon: AlertCircle,
      iconClass: "stats-icon--orange",
    },
    {
      title: "Total Interviews",
      value: stats.interviews ?? 0,
      description: "interviews created",
      icon: Mic2,
      iconClass: "stats-icon--green",
    },
  ];

  return (
    <div className="stats-grid">
      {items.map((item) => (
        <StatCard
          key={item.title}
          {...item}
        />
      ))}
    </div>
  );
}
import React from "react";
import { ArrowRight, CalendarDays, Clock3, ChevronRight, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/recent-interviews.css";

const formatDate = (value) => new Intl.DateTimeFormat("en-US", { month:"short", day:"numeric" }).format(new Date(value));
const formatTime = (value) => new Intl.DateTimeFormat("en-US", { hour:"numeric", minute:"2-digit" }).format(new Date(value));

export default function RecentInterviews({ interviews = [] }) {
  const navigate = useNavigate();
  return <div className="recent-interviews">
    <div className="recent-interviews-header"><div><h2>Recent Interviews</h2><p>Review your latest mock interview sessions.</p></div><button type="button" className="recent-interviews-view-all" onClick={()=>navigate("/interviews")}>View all<ArrowRight size={14}/></button></div>
    {interviews.length ? <div className="recent-interviews-list">{interviews.map(item=><div className="recent-interview-item" key={item.id}><div className="recent-interview-icon"><Video size={17}/></div><div className="recent-interview-info"><div className="recent-interview-title-row"><h3>{item.role}</h3><span className="recent-interview-status">{item.status}</span></div><div className="recent-interview-meta"><span>{item.company}</span><span className="recent-interview-type">{item.type}</span></div></div><div className="recent-interview-date"><span><CalendarDays size={12}/>{formatDate(item.completedAt)}</span><span><Clock3 size={12}/>{formatTime(item.completedAt)}</span></div><div className="recent-interview-score"><strong>{item.score}</strong><span>/100</span></div><button type="button" className="recent-interview-action" onClick={()=>navigate("/reports")}><ChevronRight size={16}/></button></div>)}</div> : <div className="dashboard-empty">No completed interviews yet. Start your first mock interview to see it here.</div>}
    <div className="recent-interviews-footer"><button type="button" className="recent-interviews-primary-button" onClick={()=>navigate("/interviews")}>Start New Interview<ArrowRight size={14}/></button></div>
  </div>;
}

import React from "react";
import { Code2, MessageCircle, Brain, Users, BarChart3, ArrowRight } from "lucide-react";
import "../../assets/css/skill-snapshot.css";

const meta = [
  ["technical","Technical Skills",Code2,"skill-icon--purple","skill-progress--purple"],
  ["communication","Communication",MessageCircle,"skill-icon--blue","skill-progress--blue"],
  ["problemSolving","Problem Solving",Brain,"skill-icon--green","skill-progress--green"],
  ["confidence","Confidence",Users,"skill-icon--orange","skill-progress--orange"],
];

export default function SkillSnapshot({ skills = {} }) {
  const items = meta.map(([key,name,icon,iconClass,progressClass]) => ({ key,name,icon,iconClass,progressClass,score: Number(skills[key] || 0) }));
  const overall = items.length ? Math.round(items.reduce((sum,item)=>sum+item.score,0)/items.length) : 0;
  return <div className="skill-snapshot">
    <div className="skill-snapshot-header"><div><h2>Skill Snapshot</h2><p>Your current strengths and improvement areas</p></div><button type="button" className="skill-view-button" aria-label="View all skills"><BarChart3 size={15}/></button></div>
    <div className="skill-list">{items.map(({key,name,icon:Icon,iconClass,progressClass,score})=><div className="skill-item" key={key}><div className="skill-item-top"><div className="skill-name-wrapper"><div className={`skill-icon ${iconClass}`}><Icon size={16}/></div><span className="skill-name">{name}</span></div><span className="skill-score">{score}%</span></div><div className="skill-progress-track"><div className={`skill-progress-fill ${progressClass}`} style={{width:`${score}%`}}/></div></div>)}</div>
    <div className="skill-snapshot-footer"><div className="skill-overall"><span>Overall skill level</span><strong>{overall}%</strong></div><button type="button" className="skill-improve-button">Improve skills<ArrowRight size={14}/></button></div>
  </div>;
}

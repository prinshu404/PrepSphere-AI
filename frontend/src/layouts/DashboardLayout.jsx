import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
export default function DashboardLayout(){ const [open,setOpen]=useState(false); return <div className="app-shell"><Sidebar open={open} onClose={()=>setOpen(false)}/><div className="app-main"><Navbar onMenu={()=>setOpen(true)}/><main className="content"><Outlet/></main></div>{open && <button className="sidebar-overlay" onClick={()=>setOpen(false)} aria-label="Close menu"/>}</div>; }

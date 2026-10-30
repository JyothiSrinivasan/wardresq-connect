/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  RotateCcw, 
  LayoutDashboard, 
  TableProperties, 
  FileText, 
  MessageSquareCode, 
  Cpu, 
  Radio
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';

interface HeaderProps {
  activeTab: 'dashboard' | 'incidents' | 'report' | 'whatsapp' | 'algorithm';
  setActiveTab: (tab: 'dashboard' | 'incidents' | 'report' | 'whatsapp' | 'algorithm') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { stats, resetDemoData } = useIncidents();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Indian Standard Time format
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B] text-white shadow-xl border-b border-[#1C2541]">
      {/* 8. Mandatory Safety Disclaimer Banner */}
      <div className="bg-red-600 text-white px-4 py-2 text-center text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
        <span>
          DEMONSTRATION PROTOTYPE – Not an operational emergency service. Do not use for real emergency response.
        </span>
        <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
      </div>

      {/* Main Command Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-600/30 ring-2 ring-red-400/40">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-[#0B132B]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                WardResQ <span className="text-red-400">Connect</span>
              </h1>
              <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse text-red-400" /> Live MEOC
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-2 font-medium">
              <span>AI-Powered Flood Emergency Coordination System</span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="hidden sm:inline text-amber-300/90 font-mono text-[11px]">{currentTime}</span>
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
          {/* Critical Open Badge */}
          <div 
            onClick={() => setActiveTab('incidents')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg border transition flex items-center gap-2 ${
              stats.criticalOpen > 0 
                ? 'bg-red-950/70 border-red-500/60 text-red-200 hover:bg-red-900/80 shadow-md shadow-red-950' 
                : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
            }`}
            title="Click to view critical incidents"
          >
            <Activity className={`w-4 h-4 ${stats.criticalOpen > 0 ? 'text-red-400 animate-bounce' : 'text-emerald-400'}`} />
            <div className="text-left text-xs">
              <span className="block font-bold leading-none text-white text-sm">
                {stats.criticalOpen} CRITICAL
              </span>
              <span className="text-[10px] text-red-300/80 font-medium leading-none">
                {stats.totalPeopleTrapped} Persons Trapped
              </span>
            </div>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={() => {
              if (confirm('Reset incident database back to initial 9 Indian city flood incidents?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1C2541] hover:bg-[#283761] border border-slate-700 text-slate-300 hover:text-white transition shadow-sm"
            title="Reset to default synthetic dataset (Hyderabad, Chennai, Mumbai, Kochi, Bengaluru, Patna, Guwahati)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Demo Data</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="bg-[#1C2541]/90 border-t border-[#3A506B]/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#3A506B]/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Emergency Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition whitespace-nowrap relative ${
              activeTab === 'incidents'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#3A506B]/40'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            <span>Incident Command & Table</span>
            <span className="ml-1 px-1.5 py-0.2 bg-black/40 text-amber-300 rounded text-[10px] font-mono font-bold">
              {stats.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#3A506B]/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resident Incident Report</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400'
                : 'text-emerald-300 hover:text-emerald-100 hover:bg-emerald-950/40'
            }`}
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>Citizen WhatsApp Bot</span>
            <span className="px-1.5 py-0.2 bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 rounded text-[10px] font-bold">
              Simulated
            </span>
          </button>

          <button
            onClick={() => setActiveTab('algorithm')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition whitespace-nowrap ${
              activeTab === 'algorithm'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#3A506B]/40'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI Scoring Algorithm</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

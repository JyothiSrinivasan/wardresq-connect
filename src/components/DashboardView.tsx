/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Waves, 
  HeartPulse, 
  ArrowUpRight, 
  ChevronRight, 
  LifeBuoy, 
  Radio, 
  Flame, 
  MessageSquare,
  FilePlus,
  Navigation
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { Incident, PriorityLevel } from '../types';

interface DashboardViewProps {
  onSelectIncident: (incident: Incident) => void;
  onNavigateToTab: (tab: 'incidents' | 'report' | 'whatsapp' | 'algorithm') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectIncident, onNavigateToTab }) => {
  const { incidents, stats } = useIncidents();

  // Top five highest-priority open/active incidents (sorted by score descending)
  const topFiveIncidents = [...incidents]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Recent incident activity (last 7 actions / incidents created or updated)
  const recentActivities: Array<{
    id: string;
    incidentId: string;
    title: string;
    detail: string;
    time: string;
    type: 'critical' | 'dispatch' | 'note' | 'resolve' | 'new';
  }> = [];

  // Gather recent field notes and creation events
  incidents.forEach((inc) => {
    recentActivities.push({
      id: `act-new-${inc.id}`,
      incidentId: inc.id,
      title: `Incident ${inc.id} (${inc.city}) Registered`,
      detail: `${inc.locality} • ${inc.waterLevel} level • Score ${inc.score}/100 (${inc.priority})`,
      time: inc.createdAt,
      type: inc.priority === 'Critical' ? 'critical' : 'new',
    });

    inc.fieldNotes.forEach((fn) => {
      recentActivities.push({
        id: `act-fn-${fn.id}`,
        incidentId: inc.id,
        title: `Dispatch Update on ${inc.id}`,
        detail: `${fn.author}: "${fn.note}"`,
        time: fn.timestamp,
        type: fn.note.includes('Resolved') ? 'resolve' : fn.note.includes('Assigned') ? 'dispatch' : 'note',
      });
    });
  });

  // Sort by time descending and take top 6
  recentActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  const displayActivities = recentActivities.slice(0, 6);

  // Group by city for Indian Municipal Coverage
  const cities: Array<{ name: string; state: string; count: number; critical: number }> = [
    { name: 'Hyderabad', state: 'Telangana', count: 0, critical: 0 },
    { name: 'Chennai', state: 'Tamil Nadu', count: 0, critical: 0 },
    { name: 'Mumbai', state: 'Maharashtra', count: 0, critical: 0 },
    { name: 'Kochi', state: 'Kerala', count: 0, critical: 0 },
    { name: 'Bengaluru', state: 'Karnataka', count: 0, critical: 0 },
    { name: 'Patna', state: 'Bihar', count: 0, critical: 0 },
    { name: 'Guwahati', state: 'Assam', count: 0, critical: 0 },
  ];

  cities.forEach((c) => {
    const cityIncidents = incidents.filter((i) => i.city.toLowerCase() === c.name.toLowerCase());
    c.count = cityIncidents.length;
    c.critical = cityIncidents.filter((i) => i.priority === 'Critical' && i.status !== 'Resolved').length;
  });

  const getPriorityBadgeClass = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500/15 text-red-400 border border-red-500/40 ring-1 ring-red-500/20';
      case 'High':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/40';
      case 'Medium':
        return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30';
      case 'Low':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    }
  };

  const getStatusBadgeClass = (status: Incident['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
      case 'Assigned':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case 'En Route':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse';
      case 'Rescued':
        return 'bg-teal-500/20 text-teal-300 border border-teal-500/40';
      case 'Resolved':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Launch & Situation Bar */}
      <div className="bg-gradient-to-r from-[#1C2541] via-[#16203B] to-[#0B132B] p-4 sm:p-5 rounded-2xl border border-slate-700/60 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
              <Flame className="w-3.5 h-3.5 text-red-400 mr-1 animate-pulse" /> Monsoon Flood Surge Active
            </span>
            <span className="text-xs text-slate-400">Multi-Agency Operations Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Indian Municipal Emergency Operations Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Live incident queue monitoring municipal flood reports across 7 critical zones. All requests prioritised via explainable AI algorithm (0–100 scale).
          </p>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
          <button
            onClick={() => onNavigateToTab('report')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-red-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <FilePlus className="w-4 h-4" />
            <span>Log Resident Report</span>
          </button>

          <button
            onClick={() => onNavigateToTab('whatsapp')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Simulate Citizen WhatsApp</span>
          </button>
        </div>
      </div>

      {/* 1. Emergency Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Incidents */}
        <div className="bg-[#1C2541]/80 backdrop-blur border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reported</p>
            <p className="text-3xl sm:text-4xl font-black text-white mt-1">{stats.total}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span>{incidents.filter(i => i.source === 'WhatsApp Bot').length} from WhatsApp Bot</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        {/* Critical Open Incidents */}
        <div className={`backdrop-blur rounded-2xl p-4 sm:p-5 shadow-lg border transition ${
          stats.criticalOpen > 0
            ? 'bg-red-950/60 border-red-500/60 ring-2 ring-red-500/20'
            : 'bg-[#1C2541]/80 border-slate-700/80'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <p className="text-xs font-bold uppercase tracking-wider text-red-300">Critical Open Incidents</p>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-red-400 mt-1">{stats.criticalOpen}</p>
              <p className="text-xs text-red-300/80 mt-1">
                Score ≥ 70 • Immediate Life Risk
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Total People Trapped */}
        <div className="bg-[#1C2541]/80 backdrop-blur border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Total People Trapped</p>
            <p className="text-3xl sm:text-4xl font-black text-amber-400 mt-1">{stats.totalPeopleTrapped}</p>
            <p className="text-xs text-slate-400 mt-1">
              In active flooded sectors
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Successfully Resolved */}
        <div className="bg-[#1C2541]/80 backdrop-blur border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Rescued & Resolved</p>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">{stats.resolved + stats.rescued}</p>
            <p className="text-xs text-emerald-300/80 mt-1">
              {stats.resolved} Closed • {stats.rescued} Rescued Safe
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Indian Municipal Operational Coverage Across 7 Cities */}
      <div className="bg-[#1C2541]/60 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" /> City Emergency Zones (7 Municipalities)
            </h3>
            <p className="text-xs text-slate-400">Real-time flood reports distribution across designated Indian urban centres</p>
          </div>
          <span className="text-xs font-medium text-slate-400 self-start sm:self-auto bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            Active Monsoonal Monitoring
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {cities.map((city) => (
            <div
              key={city.name}
              onClick={() => onNavigateToTab('incidents')}
              className="bg-[#0B132B]/80 hover:bg-[#16203B] border border-slate-700/70 hover:border-red-500/50 rounded-xl p-3 cursor-pointer transition text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-red-300 transition">
                  {city.name}
                </span>
                {city.critical > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" title={`${city.critical} critical incident(s)`} />
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">{city.state}</p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-black text-slate-200">{city.count}</span>
                <span className="text-[10px] text-slate-400">incidents</span>
              </div>
              {city.critical > 0 ? (
                <span className="mt-1 block text-[9px] font-bold text-red-400 uppercase">
                  {city.critical} Critical Alert
                </span>
              ) : (
                <span className="mt-1 block text-[9px] text-slate-500">Normal Standby</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Split: Top 5 Highest-Priority Incidents & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Highest Priority Incidents (Spans 2 columns on lg) */}
        <div className="lg:col-span-2 bg-[#1C2541]/70 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5 text-red-400" />
                    Top 5 Highest-Priority Incidents
                  </h3>
                  <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                    Immediate Action
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ranked by deterministic AI multi-factor algorithm (0–100 scale)
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab('incidents')}
                className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 hover:underline"
              >
                <span>View All ({incidents.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of Top 5 Incidents */}
            <div className="space-y-3">
              {topFiveIncidents.map((incident, idx) => (
                <div
                  key={incident.id}
                  onClick={() => onSelectIncident(incident)}
                  className="bg-[#0B132B]/90 hover:bg-[#121B36] border border-slate-700/80 hover:border-red-500/60 rounded-xl p-3.5 transition cursor-pointer shadow group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      {/* Priority rank indicator */}
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 shrink-0 group-hover:border-red-400 group-hover:text-red-300">
                        #{idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-white group-hover:text-red-300 transition">
                            {incident.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPriorityBadgeClass(incident.priority)}`}>
                            {incident.priority.toUpperCase()} ({incident.score}/100)
                          </span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusBadgeClass(incident.status)}`}>
                            {incident.status}
                          </span>
                          {incident.medicalEmergency && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-600/50 flex items-center gap-1">
                              <HeartPulse className="w-3 h-3 text-rose-400" /> Medical Emergency
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-slate-100 mt-1">
                          {incident.residentName} • <span className="text-red-300">{incident.city}</span>
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {incident.locality}
                        </p>
                      </div>
                    </div>

                    {/* Stats & Score Gauge */}
                    <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-center shrink-0">
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs text-slate-300">
                          <Waves className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-semibold">{incident.waterLevel} Level</span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400">
                          <Users className="w-3 h-3 text-amber-300" />
                          <span>{incident.peopleTrapped} Trapped ({incident.children + incident.elderly + incident.disabled} Vuln)</span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex flex-col items-center justify-center shadow-inner group-hover:border-red-500/80">
                        <span className="text-[9px] uppercase font-bold text-slate-400">Score</span>
                        <span className={`text-base font-black ${
                          incident.score >= 70 ? 'text-red-400' : incident.score >= 45 ? 'text-amber-400' : 'text-yellow-400'
                        }`}>
                          {incident.score}
                        </span>
                      </div>

                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Recommended responder preview */}
                  {incident.assignedTeam ? (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-purple-300">
                      <span className="flex items-center gap-1.5">
                        <Navigation className="w-3 h-3 text-purple-400" />
                        Assigned Unit: <span className="font-semibold text-white">{incident.assignedTeam}</span>
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        Last note: {incident.fieldNotes[incident.fieldNotes.length - 1]?.note.slice(0, 45) || 'Dispatched'}...
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-amber-300 font-medium flex items-center gap-1">
                        ⚠️ Recommended: {incident.priorityBreakdown.recommendedResource}
                      </span>
                      <span className="text-red-400 font-semibold group-hover:underline">
                        Assign Responder →
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Critical threshold is 70+ points. Automatic priority escalation enabled.</span>
            <button
              onClick={() => onNavigateToTab('algorithm')}
              className="text-red-400 hover:text-red-300 font-semibold underline"
            >
              How is score calculated?
            </button>
          </div>
        </div>

        {/* Recent Incident Activity Log */}
        <div className="bg-[#1C2541]/70 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Live Incident Activity Feed
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live stream feed" />
            </div>

            <div className="space-y-3.5">
              {displayActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => {
                    const match = incidents.find((i) => i.id === act.incidentId);
                    if (match) onSelectIncident(match);
                  }}
                  className="p-3 bg-[#0B132B]/80 hover:bg-[#121B36] border border-slate-800 hover:border-slate-600 rounded-xl cursor-pointer transition text-left"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {act.type === 'critical' ? (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                      ) : act.type === 'dispatch' ? (
                        <Navigation className="w-3 h-3 text-purple-400 shrink-0" />
                      ) : act.type === 'resolve' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <Radio className="w-3 h-3 text-blue-400 shrink-0" />
                      )}
                      <span className="truncate">{act.title}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {new Date(act.time).toLocaleTimeString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {act.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">All updates broadcast to ward VHF radios</span>
            <button
              onClick={() => onNavigateToTab('incidents')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              Open Full Command Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  ChevronRight, 
  ShieldAlert, 
  Waves, 
  Users, 
  HeartPulse, 
  Radio, 
  ArrowUpDown,
  LifeBuoy
} from 'lucide-react';
import { Incident, IncidentStatus, PriorityLevel, WaterLevel, IndianCity } from '../types';
import { useIncidents } from '../context/IncidentContext';

interface IncidentManagementViewProps {
  onSelectIncident: (incident: Incident) => void;
}

export const IncidentManagementView: React.FC<IncidentManagementViewProps> = ({ onSelectIncident }) => {
  const { incidents } = useIncidents();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [waterFilter, setWaterFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'time' | 'trapped'>('score');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Quick Preset Chips
  const [activePreset, setActivePreset] = useState<string>('all');

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    if (preset === 'all') {
      setPriorityFilter('ALL');
      setStatusFilter('ALL');
      setWaterFilter('ALL');
    } else if (preset === 'critical_unassigned') {
      setPriorityFilter('Critical');
      setStatusFilter('New');
      setWaterFilter('ALL');
    } else if (preset === 'medical') {
      setPriorityFilter('ALL');
      setStatusFilter('ALL');
      setWaterFilter('ALL');
    } else if (preset === 'rooftop') {
      setPriorityFilter('ALL');
      setStatusFilter('ALL');
      setWaterFilter('Rooftop');
    } else if (preset === 'active_only') {
      setPriorityFilter('ALL');
      setStatusFilter('ACTIVE');
      setWaterFilter('ALL');
    }
  };

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = inc.id.toLowerCase().includes(q);
        const matchesName = inc.residentName.toLowerCase().includes(q);
        const matchesLocality = inc.locality.toLowerCase().includes(q);
        const matchesCity = inc.city.toLowerCase().includes(q);
        const matchesPhone = inc.contactNumber.toLowerCase().includes(q);
        const matchesTeam = inc.assignedTeam?.toLowerCase().includes(q);
        const matchesNotes = inc.fieldNotes.some((n) => n.note.toLowerCase().includes(q));

        if (!matchesId && !matchesName && !matchesLocality && !matchesCity && !matchesPhone && !matchesTeam && !matchesNotes) {
          return false;
        }
      }

      // Priority Filter
      if (priorityFilter !== 'ALL' && inc.priority !== priorityFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter === 'ACTIVE') {
        if (inc.status === 'Resolved' || inc.status === 'Rescued') return false;
      } else if (statusFilter !== 'ALL' && inc.status !== statusFilter) {
        return false;
      }

      // City Filter
      if (cityFilter !== 'ALL' && inc.city.toLowerCase() !== cityFilter.toLowerCase()) {
        return false;
      }

      // Water Level Filter
      if (waterFilter !== 'ALL' && inc.waterLevel !== waterFilter) {
        return false;
      }

      // Preset: Medical
      if (activePreset === 'medical' && !inc.medicalEmergency) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'score') {
        return sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
      }
      if (sortBy === 'trapped') {
        return sortOrder === 'desc' ? b.peopleTrapped - a.peopleTrapped : a.peopleTrapped - b.peopleTrapped;
      }
      if (sortBy === 'time') {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      }
      return 0;
    });
  }, [incidents, searchQuery, priorityFilter, statusFilter, cityFilter, waterFilter, activePreset, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
    setCityFilter('ALL');
    setWaterFilter('ALL');
    setActivePreset('all');
  };

  const getPriorityBadgeClass = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border border-red-500/50 ring-1 ring-red-500/30';
      case 'High':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/50';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40';
      case 'Low':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
    }
  };

  const getStatusBadgeClass = (status: IncidentStatus) => {
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
    <div className="space-y-5">
      {/* Search & Filter Header Control Card */}
      <div className="bg-[#1C2541]/80 backdrop-blur border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-red-400" />
              Incident Command & Dispatch Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Filter by urgency tier, inspect algorithmic reasoning, allocate NDRF/SDRF boats, and update rescue logs.
            </p>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => applyPreset('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activePreset === 'all'
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All ({incidents.length})
            </button>

            <button
              onClick={() => applyPreset('critical_unassigned')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activePreset === 'critical_unassigned'
                  ? 'bg-red-600 text-white font-bold ring-2 ring-red-400/40'
                  : 'bg-red-950/60 text-red-300 border border-red-500/40 hover:bg-red-900/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Critical Unassigned</span>
            </button>

            <button
              onClick={() => applyPreset('medical')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activePreset === 'medical'
                  ? 'bg-rose-600 text-white font-bold ring-2 ring-rose-400/40'
                  : 'bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:bg-rose-900/60'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Medical Emergencies</span>
            </button>

            <button
              onClick={() => applyPreset('rooftop')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activePreset === 'rooftop'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Rooftop Depth</span>
            </button>

            <button
              onClick={() => applyPreset('active_only')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activePreset === 'active_only'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Active Only
            </button>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-700/60">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, resident, locality, phone, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Priority Select */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">🔴 Critical (70–100)</option>
              <option value="High">🟠 High (45–69)</option>
              <option value="Medium">🟡 Medium (25–44)</option>
              <option value="Low">🟢 Low (0–24)</option>
            </select>
          </div>

          {/* Status Select */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">⚡ All Active (Excl Resolved)</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="En Route">En Route</option>
              <option value="Rescued">Rescued</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* City Select */}
          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="ALL">All Cities</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Kochi">Kochi</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Patna">Patna</option>
              <option value="Guwahati">Guwahati</option>
            </select>
          </div>

          {/* Water Level Select */}
          <div className="flex items-center gap-1.5">
            <select
              value={waterFilter}
              onChange={(e) => setWaterFilter(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="ALL">All Water Levels</option>
              <option value="Rooftop">Rooftop (40 pts)</option>
              <option value="Chest">Chest (35 pts)</option>
              <option value="Waist">Waist (25 pts)</option>
              <option value="Knee">Knee (15 pts)</option>
              <option value="Ankle">Ankle (5 pts)</option>
            </select>

            <button
              onClick={clearFilters}
              title="Reset all filters"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-600 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort & Results Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div>
            Showing <span className="font-bold text-white">{filteredIncidents.length}</span> of{' '}
            <span className="font-bold text-white">{incidents.length}</span> incidents
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0B132B] border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs"
            >
              <option value="score">Priority Score</option>
              <option value="trapped">People Trapped</option>
              <option value="time">Time Reported</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700"
              title={`Toggle sort order (${sortOrder})`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Incident Table */}
      <div className="bg-[#1C2541]/80 backdrop-blur border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B132B] text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4">Incident ID & City</th>
                <th className="py-3.5 px-4">Resident & Locality</th>
                <th className="py-3.5 px-4">Water Level</th>
                <th className="py-3.5 px-4">Trapped & Demographics</th>
                <th className="py-3.5 px-4">AI Score & Priority</th>
                <th className="py-3.5 px-4">Rescue Status</th>
                <th className="py-3.5 px-4">Assigned Team</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">No incidents match the active search or filters.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-2 text-xs text-red-400 hover:underline"
                    >
                      Clear search & filter parameters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => onSelectIncident(incident)}
                    className="hover:bg-[#121B36] cursor-pointer transition group"
                  >
                    {/* ID & City */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white group-hover:text-red-300 transition">
                        {incident.id}
                      </div>
                      <div className="text-[11px] text-red-300 font-semibold flex items-center gap-1 mt-0.5">
                        <span>{incident.city}</span>
                        <span className="text-[9px] text-slate-500">• {incident.source}</span>
                      </div>
                    </td>

                    {/* Resident & Locality */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-100">{incident.residentName}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5" title={incident.locality}>
                        {incident.locality}
                      </div>
                    </td>

                    {/* Water Level */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs ${
                        incident.waterLevel === 'Rooftop'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
                          : incident.waterLevel === 'Chest'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50'
                          : incident.waterLevel === 'Waist'
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        <Waves className="w-3.5 h-3.5" />
                        <span>{incident.waterLevel}</span>
                      </span>
                    </td>

                    {/* Trapped & Demographics */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Users className="w-3.5 h-3.5 text-amber-300" />
                        <span>{incident.peopleTrapped} Trapped</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {incident.children + incident.elderly + incident.disabled > 0 ? (
                          <span className="text-purple-300">
                            {incident.children > 0 && `${incident.children} kids `}
                            {incident.elderly > 0 && `${incident.elderly} elderly `}
                            {incident.disabled > 0 && `${incident.disabled} disabled`}
                          </span>
                        ) : (
                          <span>No flagged vulnerable</span>
                        )}
                      </div>
                      {incident.medicalEmergency && (
                        <div className="text-[10px] text-rose-400 font-bold flex items-center gap-1 mt-0.5">
                          <HeartPulse className="w-3 h-3" /> Medical Alert
                        </div>
                      )}
                    </td>

                    {/* Priority & Score */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getPriorityBadgeClass(incident.priority)}`}>
                          {incident.priority}
                        </span>
                        <div className="text-right">
                          <span className="font-mono font-black text-sm text-white">
                            {incident.score}
                          </span>
                          <span className="text-[10px] text-slate-400">/100</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusBadgeClass(incident.status)}`}>
                        {incident.status}
                      </span>
                    </td>

                    {/* Assigned Team */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {incident.assignedTeam ? (
                        <div className="text-[11px] font-medium text-purple-300 flex items-center gap-1 line-clamp-1">
                          <Radio className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{incident.assignedTeam}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-400/90 italic font-medium">
                          Pending Assignment
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(incident);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-red-600 hover:text-white text-slate-200 rounded-lg text-xs font-semibold transition border border-slate-700 hover:border-red-500 inline-flex items-center gap-1 shadow-sm"
                      >
                        <span>Dispatch Intel</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

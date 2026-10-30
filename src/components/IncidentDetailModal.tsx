/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Waves, 
  Users, 
  HeartPulse, 
  ShieldAlert, 
  Clock, 
  Send, 
  CheckCircle2, 
  UserCheck, 
  Cpu, 
  Radio, 
  Sparkles,
  PhoneCall,
  Check
} from 'lucide-react';
import { Incident, IncidentStatus, PriorityLevel, RESPONDER_TEAMS } from '../types';
import { useIncidents } from '../context/IncidentContext';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({ incident, onClose }) => {
  const { updateStatus, assignTeam, addFieldNote } = useIncidents();
  const [selectedTeam, setSelectedTeam] = useState<string>(incident?.assignedTeam || '');
  const [newNote, setNewNote] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('Duty Ward Officer');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [callSimulated, setCallSimulated] = useState(false);

  if (!incident) return null;

  const handleAssignTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    assignTeam(incident.id, selectedTeam, authorName);
  };

  const handleStatusChange = (status: IncidentStatus) => {
    updateStatus(incident.id, status, authorName);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addFieldNote(incident.id, newNote, authorName);
    setNewNote('');
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(incident.contactNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSimulateCall = () => {
    setCallSimulated(true);
    setTimeout(() => setCallSimulated(false), 3500);
  };

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-400 bg-red-950/60 border-red-500/60 ring-2 ring-red-500/30';
      case 'High':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/60';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-950/60 border-yellow-500/50';
      case 'Low':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50';
    }
  };

  const statuses: IncidentStatus[] = ['New', 'Assigned', 'En Route', 'Rescued', 'Resolved'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative w-full max-w-4xl bg-[#0B132B] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#1C2541] px-5 py-4 border-b border-slate-700/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm sm:text-base font-bold text-white">
                  {incident.id}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityColor(incident.priority)}`}>
                  {incident.priority.toUpperCase()} PRIORITY ({incident.score}/100)
                </span>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  via {incident.source}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Reported {new Date(incident.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Status Progression Workflow Step Tracker */}
          <div className="bg-[#16203B] p-4 rounded-xl border border-slate-700">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Rescue Lifecycle Status Workflow
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {statuses.map((st, idx) => {
                const isCurrent = incident.status === st;
                const isPast = statuses.indexOf(incident.status) > idx;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 border ${
                      isCurrent
                        ? 'bg-red-600 text-white border-red-400 shadow-md ring-2 ring-red-400/30'
                        : isPast
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                        : 'bg-slate-900/80 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isPast ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-current" />
                      )}
                      <span>{st}</span>
                    </div>
                    <span className="text-[9px] font-normal opacity-80">
                      {isCurrent ? 'Current' : isPast ? 'Completed' : 'Click to Set'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Call Simulation Alert Notification */}
          {callSimulated && (
            <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-emerald-200 text-xs flex items-center justify-between animate-pulse">
              <span className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                Simulated satellite bridge connected to {incident.contactNumber} ({incident.residentName}). Audio line open on Channel 4.
              </span>
              <span className="font-mono text-[11px] text-emerald-300">00:03 LIVE</span>
            </div>
          )}

          {/* Two-Column Grid: Incident Data & AI Explainability */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Location & Resident Profile */}
            <div className="space-y-4">
              {/* Resident Contact Card */}
              <div className="bg-[#16203B]/80 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-400" /> Resident & Location Profile
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Contact / Family Lead:</span>
                    <span className="font-bold text-white text-sm">{incident.residentName}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-200">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-mono">{incident.contactNumber}</span>
                    </div>

                    <button
                      onClick={handleCopyPhone}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white transition"
                    >
                      {copiedPhone ? 'Copied!' : 'Copy'}
                    </button>

                    <button
                      onClick={handleSimulateCall}
                      className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white rounded-lg transition flex items-center gap-1 font-semibold"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Simulation
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60">
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400" /> City & Locality:
                    </span>
                    <span className="font-bold text-white">
                      {incident.city} — <span className="text-slate-200 font-normal">{incident.locality}</span>
                    </span>
                  </div>

                  {incident.additionalInfo && (
                    <div className="pt-1">
                      <span className="text-slate-400 block text-[11px]">Field Landmarks / Hazards:</span>
                      <p className="text-slate-300 italic bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                        "{incident.additionalInfo}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Hazard & Vulnerability Metrics */}
              <div className="bg-[#16203B]/80 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-cyan-400" /> Flood Depth & Demographic Breakdown
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0B132B] p-2.5 rounded-lg border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Water Inundation Level:</span>
                    <span className="font-black text-sm text-cyan-300 flex items-center gap-1.5 mt-0.5">
                      <Waves className="w-4 h-4" /> {incident.waterLevel} Level
                    </span>
                    <span className="text-[10px] text-slate-400">
                      +{incident.priorityBreakdown.waterScore} pts in scoring
                    </span>
                  </div>

                  <div className="bg-[#0B132B] p-2.5 rounded-lg border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Total Trapped:</span>
                    <span className="font-black text-sm text-amber-300 flex items-center gap-1.5 mt-0.5">
                      <Users className="w-4 h-4" /> {incident.peopleTrapped} Occupants
                    </span>
                    <span className="text-[10px] text-slate-400">
                      +{incident.priorityBreakdown.trappedScore} pts in scoring
                    </span>
                  </div>
                </div>

                {/* Vulnerable Counts */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#0B132B] p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Children (&lt;12)</span>
                    <span className="font-bold text-white text-sm">{incident.children}</span>
                  </div>
                  <div className="bg-[#0B132B] p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Elderly (&gt;65)</span>
                    <span className="font-bold text-white text-sm">{incident.elderly}</span>
                  </div>
                  <div className="bg-[#0B132B] p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Persons w/ Disability</span>
                    <span className="font-bold text-white text-sm">{incident.disabled}</span>
                  </div>
                </div>

                {/* Medical Emergency Alert Box */}
                {incident.medicalEmergency ? (
                  <div className="p-3 bg-red-950/70 border border-red-500/70 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
                      <HeartPulse className="w-4 h-4 text-red-400 animate-pulse" />
                      <span>CRITICAL MEDICAL CONDITION REPORTED (+20 pts)</span>
                    </div>
                    <p className="text-xs text-red-200">
                      {incident.medicalDetails || 'Acute life-threatening medical distress requiring emergency field paramedics.'}
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>No acute clinical medical emergencies declared at intake.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: AI Scoring Breakdown & Responder Assignment */}
            <div className="space-y-4">
              {/* Explainable AI Scoring Analysis */}
              <div className="bg-[#16203B]/80 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-amber-400" /> AI Priority Audit Breakdown
                  </h4>
                  <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-600">
                    {incident.score} / 100 PTS
                  </span>
                </div>

                {/* Points Progress Bars */}
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Water Depth Severity (5–40)</span>
                      <span className="font-mono font-bold text-cyan-300">{incident.priorityBreakdown.waterScore} / 40</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-400 rounded-full" 
                        style={{ width: `${(incident.priorityBreakdown.waterScore / 40) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Trapped Count (3 pts each, max 20)</span>
                      <span className="font-mono font-bold text-amber-300">{incident.priorityBreakdown.trappedScore} / 20</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full" 
                        style={{ width: `${(incident.priorityBreakdown.trappedScore / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Vulnerable People (4 pts each, max 20)</span>
                      <span className="font-mono font-bold text-purple-300">{incident.priorityBreakdown.vulnerableScore} / 20</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-400 rounded-full" 
                        style={{ width: `${(incident.priorityBreakdown.vulnerableScore / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Medical Emergency Factor</span>
                      <span className="font-mono font-bold text-red-300">{incident.priorityBreakdown.medicalScore} / 20</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-400 rounded-full" 
                        style={{ width: `${(incident.priorityBreakdown.medicalScore / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Explainable Reasoning List */}
                <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 block">Algorithmic Justification:</span>
                  <ul className="text-[11px] text-slate-300 space-y-1">
                    {incident.priorityBreakdown.reasoning.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-400 font-bold shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Resource Badge */}
                <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                    AI-Recommended Emergency Resource
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {incident.priorityBreakdown.recommendedResource}
                  </p>
                </div>
              </div>

              {/* Responder Team Assignment (7 Teams) */}
              <div className="bg-[#16203B]/80 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-purple-400" /> Dispatch Responder Team
                </h4>

                <form onSubmit={handleAssignTeam} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
                      Select Authorized Disaster Response Unit:
                    </label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">-- Choose Responder Unit --</option>
                      {RESPONDER_TEAMS.map((team) => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      {incident.assignedTeam ? (
                        <span className="text-emerald-300 font-medium">Currently: {incident.assignedTeam}</span>
                      ) : (
                        <span className="text-amber-400">No unit assigned yet</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedTeam || selectedTeam === incident.assignedTeam}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow"
                    >
                      {incident.assignedTeam ? 'Reassign Team' : 'Assign & Notify Team'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Field Notes & Audit History */}
          <div className="bg-[#16203B]/80 p-4 rounded-xl border border-slate-700/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Field Notes & Command Log ({incident.fieldNotes.length})
            </h4>

            {/* Notes Timeline */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {incident.fieldNotes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No notes logged yet.</p>
              ) : (
                incident.fieldNotes.map((fn) => (
                  <div key={fn.id} className="p-2.5 bg-[#0B132B] border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-200">{fn.author}</span>
                      <span className="font-mono">
                        {new Date(fn.timestamp).toLocaleTimeString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{fn.note}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Field Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-700/60">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Officer name / designation..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-1/3 bg-[#0B132B] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <input
                  type="text"
                  placeholder="Add field update, boat GPS coordinates, or survivor welfare note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-[#0B132B] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#1C2541] px-5 py-3 border-t border-slate-700/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Emergency Operations Record • Encrypted Municipal Transit
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition"
          >
            Close Incident Panel
          </button>
        </div>
      </div>
    </div>
  );
};

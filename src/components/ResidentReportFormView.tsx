/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { 
  FileText, 
  Waves, 
  Users, 
  HeartPulse, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Info,
  Clock,
  RotateCcw
} from 'lucide-react';
import { IndianCity, WaterLevel, Incident } from '../types';
import { calculatePriorityScore, WATER_SEVERITY_POINTS } from '../utils/priorityScoring';
import { useIncidents } from '../context/IncidentContext';

interface ResidentReportFormViewProps {
  onSuccessViewIncident: (incident: Incident) => void;
  onNavigateToTab: (tab: 'dashboard' | 'incidents' | 'whatsapp') => void;
}

export const ResidentReportFormView: React.FC<ResidentReportFormViewProps> = ({ 
  onSuccessViewIncident, 
  onNavigateToTab 
}) => {
  const { addIncident } = useIncidents();

  // Form states
  const [residentName, setResidentName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [city, setCity] = useState<IndianCity>('Hyderabad');
  const [locality, setLocality] = useState('');
  const [waterLevel, setWaterLevel] = useState<WaterLevel>('Waist');
  const [peopleTrapped, setPeopleTrapped] = useState<number>(3);
  const [children, setChildren] = useState<number>(1);
  const [elderly, setElderly] = useState<number>(1);
  const [disabled, setDisabled] = useState<number>(0);
  const [medicalEmergency, setMedicalEmergency] = useState<boolean>(false);
  const [medicalDetails, setMedicalDetails] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Submission feedback
  const [submittedIncident, setSubmittedIncident] = useState<Incident | null>(null);

  // Live priority score calculation in real-time as user types/adjusts fields
  const liveScoring = useMemo(() => {
    return calculatePriorityScore({
      waterLevel,
      peopleTrapped,
      children,
      elderly,
      disabled,
      medicalEmergency,
      medicalDetails,
    });
  }, [waterLevel, peopleTrapped, children, elderly, disabled, medicalEmergency, medicalDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentName.trim()) {
      alert('Please enter the resident or contact person name.');
      return;
    }
    if (!locality.trim()) {
      alert('Please enter your locality, landmark or address.');
      return;
    }

    const created = addIncident({
      residentName: residentName.trim(),
      contactNumber: contactNumber.trim() || '+91 98000 00000',
      city,
      locality: locality.trim(),
      waterLevel,
      peopleTrapped,
      children,
      elderly,
      disabled,
      medicalEmergency,
      medicalDetails: medicalEmergency ? medicalDetails.trim() : '',
      additionalInfo: additionalInfo.trim(),
      source: 'Ward Portal',
    });

    setSubmittedIncident(created);
  };

  const resetForm = () => {
    setResidentName('');
    setContactNumber('');
    setCity('Hyderabad');
    setLocality('');
    setWaterLevel('Waist');
    setPeopleTrapped(2);
    setChildren(0);
    setElderly(0);
    setDisabled(0);
    setMedicalEmergency(false);
    setMedicalDetails('');
    setAdditionalInfo('');
    setSubmittedIncident(null);
  };

  // Water level options with visual depth indicators and point tags
  const waterLevels: Array<{ level: WaterLevel; pts: number; label: string; desc: string }> = [
    { level: 'Ankle', pts: 5, label: 'Ankle Depth', desc: 'Minor pooling, 3–6 inches, roads wet' },
    { level: 'Knee', pts: 15, label: 'Knee Depth', desc: 'Water enters porch/ground, ~1.5 ft' },
    { level: 'Waist', pts: 25, label: 'Waist Depth', desc: 'Ground floor inundated, ~3 ft, no small cars' },
    { level: 'Chest', pts: 35, label: 'Chest Depth', desc: 'Fast currents, ~4.5 ft, high wading danger' },
    { level: 'Rooftop', pts: 40, label: 'Rooftop Depth', desc: 'Complete building submersion, occupants stranded on roof' },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#1C2541]/80 backdrop-blur border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-600/20 border border-red-500/40 rounded-lg text-red-400">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Resident Flood Emergency Intake Form
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            For citizens, ward volunteers, and helpline operators to log inundated homes. The integrated AI prioritisation engine computes rescue urgency live as you fill the fields.
          </p>
        </div>

        <button
          onClick={resetForm}
          className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Form</span>
        </button>
      </div>

      {/* Submission Success Dialog / Receipt */}
      {submittedIncident && (
        <div className="p-5 bg-gradient-to-br from-emerald-950 via-[#0B132B] to-[#16203B] border-2 border-emerald-500/70 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  Incident Successfully Logged & Prioritised
                </span>
                <h3 className="text-xl font-black text-white font-mono flex items-center gap-2">
                  Ticket #{submittedIncident.id}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                submittedIncident.priority === 'Critical'
                  ? 'bg-red-500/20 text-red-300 border-red-500/50 ring-2 ring-red-500/30'
                  : submittedIncident.priority === 'High'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
              }`}>
                {submittedIncident.priority.toUpperCase()} PRIORITY ({submittedIncident.score}/100 PTS)
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#0B132B]/90 rounded-xl border border-slate-700 text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px]">Resident Name:</span>
                <span className="font-bold text-white">{submittedIncident.residentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Location:</span>
                <span className="font-bold text-white">{submittedIncident.city} — {submittedIncident.locality}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Recommended Rescue Unit:</span>
                <span className="font-bold text-amber-300">{submittedIncident.priorityBreakdown.recommendedResource}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-2">
            <button
              onClick={() => onSuccessViewIncident(submittedIncident)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-600/30"
            >
              <span>Open in Command Dispatcher</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateToTab('incidents')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-600"
            >
              View in Incident Matrix
            </button>

            <button
              onClick={resetForm}
              className="px-4 py-2 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition"
            >
              + Submit Another Report
            </button>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 bg-[#1C2541]/80 backdrop-blur border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Contact & Location Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-700 pb-2">
                <MapPin className="w-4 h-4 text-red-400" /> 1. Resident & Location Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-200 block mb-1">
                    Resident Name / Family Lead *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S. Venkatesh / Laxmi Devi"
                    value={residentName}
                    onChange={(e) => setResidentName(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-200 block mb-1">
                    Contact Phone (dummy data only) *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98450 12345"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-200 block mb-1">
                    City / Municipality *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as IndianCity)}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Hyderabad">Hyderabad (GHMC)</option>
                    <option value="Chennai">Chennai (GCC)</option>
                    <option value="Mumbai">Mumbai (BMC)</option>
                    <option value="Kochi">Kochi (KMC)</option>
                    <option value="Bengaluru">Bengaluru (BBMP)</option>
                    <option value="Patna">Patna (PMC)</option>
                    <option value="Guwahati">Guwahati (GMC)</option>
                    <option value="Other">Other Municipality</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-200 block mb-1">
                    Locality, Ward & Landmark Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plot 42, Lakeview Enclave, Behind Water Tank"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Water Level Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-cyan-400" /> 2. Flood Inundation Depth
                </h3>
                <span className="text-[11px] font-mono font-bold text-cyan-300">
                  +{WATER_SEVERITY_POINTS[waterLevel]} points
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {waterLevels.map((item) => {
                  const isSelected = waterLevel === item.level;
                  return (
                    <div
                      key={item.level}
                      onClick={() => setWaterLevel(item.level)}
                      className={`cursor-pointer rounded-xl p-2.5 border transition text-center flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/90 border-cyan-400 ring-2 ring-cyan-400/40 text-white shadow-md'
                          : 'bg-[#0B132B] border-slate-700 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center text-[10px] text-cyan-400 font-bold mb-1">
                          <span>+{item.pts} pts</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                        </div>
                        <p className="text-xs font-bold text-white">{item.label}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Trapped Occupants & Vulnerabilities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" /> 3. People Trapped & Vulnerable Demographics
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Trapped (3 pts ea, max 20) • Vuln (4 pts ea, max 20)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Total Trapped */}
                <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-700 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Total People Trapped
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setPeopleTrapped((p) => Math.max(1, p - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="text-base font-black text-amber-300 font-mono">
                      {peopleTrapped}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPeopleTrapped((p) => Math.min(30, p + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-700 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Children (&lt; 12 yrs)
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setChildren((c) => Math.max(0, c - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="text-base font-black text-purple-300 font-mono">
                      {children}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChildren((c) => Math.min(peopleTrapped, c + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Elderly */}
                <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-700 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Elderly (&gt; 65 yrs)
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setElderly((e) => Math.max(0, e - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="text-base font-black text-purple-300 font-mono">
                      {elderly}
                    </span>
                    <button
                      type="button"
                      onClick={() => setElderly((e) => Math.min(peopleTrapped, e + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Disabled */}
                <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-700 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Persons w/ Disability
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setDisabled((d) => Math.max(0, d - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="text-base font-black text-purple-300 font-mono">
                      {disabled}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDisabled((d) => Math.min(peopleTrapped, d + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Medical Emergency & Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-red-400" /> 4. Medical Distress Factor
                </h3>
                <span className="text-[11px] font-mono font-bold text-red-300">
                  {medicalEmergency ? '+20 points' : '+0 points'}
                </span>
              </div>

              <div className={`p-4 rounded-xl border transition ${
                medicalEmergency
                  ? 'bg-red-950/70 border-red-500/70'
                  : 'bg-[#0B132B] border-slate-700'
              }`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={medicalEmergency}
                    onChange={(e) => setMedicalEmergency(e.target.checked)}
                    className="w-5 h-5 rounded text-red-600 bg-[#0B132B] border-slate-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Active Medical Emergency / Clinical Hazard in Household
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Oxygen dependency, insulin shortage, pregnancy, dialysis, fracture, or hypothermia
                    </span>
                  </div>
                </label>

                {medicalEmergency && (
                  <div className="mt-3 pt-3 border-t border-red-500/30">
                    <label className="text-xs font-semibold text-red-200 block mb-1">
                      Specify Clinical Details & Urgency:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dialysis patient due for session; severe shivering; heart medications submerged"
                      value={medicalDetails}
                      onChange={(e) => setMedicalDetails(e.target.value)}
                      className="w-full bg-[#0B132B] border border-red-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 5. Additional Information */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Additional Information, Landmarks or Hazards
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Transformer sparked nearby; rooftop reached via ladder; terrace door jammed; strong nala current"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Submit Flood Rescue Incident Ticket</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live AI Prioritisation Radar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 bg-gradient-to-b from-[#1C2541] to-[#121B36] border-2 border-red-500/40 rounded-2xl p-5 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live AI Prioritisation Radar
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30">
                Deterministic
              </span>
            </div>

            {/* Big Live Score Gauge */}
            <div className="bg-[#0B132B] p-4 rounded-xl border border-slate-700/80 text-center relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Live Prioritisation Score
                </span>
                
                <div className="flex items-baseline justify-center gap-1 my-2">
                  <span className={`text-5xl font-black font-mono transition-all duration-300 ${
                    liveScoring.priority === 'Critical'
                      ? 'text-red-400'
                      : liveScoring.priority === 'High'
                      ? 'text-amber-400'
                      : liveScoring.priority === 'Medium'
                      ? 'text-yellow-400'
                      : 'text-emerald-400'
                  }`}>
                    {liveScoring.totalScore}
                  </span>
                  <span className="text-lg font-bold text-slate-500">/ 100</span>
                </div>

                {/* Priority Classification Badge */}
                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border ${
                  liveScoring.priority === 'Critical'
                    ? 'bg-red-500/20 text-red-300 border-red-500/60 ring-2 ring-red-500/30 animate-pulse'
                    : liveScoring.priority === 'High'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                    : liveScoring.priority === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                }`}>
                  {liveScoring.priority} Priority Tier
                </div>

                <p className="text-[11px] text-slate-400 mt-2">
                  {liveScoring.priority === 'Critical'
                    ? 'Immediate life risk • Priority 1 Rapid Inflatable Boat / Air Support'
                    : liveScoring.priority === 'High'
                    ? 'Urgent rescue requirement • High clearance vehicle / raft'
                    : liveScoring.priority === 'Medium'
                    ? 'Monitored evacuation • Civil defence wading crew'
                    : 'Relief distribution & low depth monitoring'}
                </p>
              </div>

              {/* Background Glow */}
              <div 
                className={`absolute inset-0 opacity-10 transition-colors duration-500 ${
                  liveScoring.priority === 'Critical'
                    ? 'bg-red-600'
                    : liveScoring.priority === 'High'
                    ? 'bg-amber-600'
                    : liveScoring.priority === 'Medium'
                    ? 'bg-yellow-600'
                    : 'bg-emerald-600'
                }`}
              />
            </div>

            {/* Score Factors Breakdown Bar */}
            <div className="space-y-2.5 text-xs">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Points Breakdown (Max 100)
              </span>

              {/* Water Depth */}
              <div className="bg-[#0B132B]/80 p-2.5 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-cyan-400" />
                    Water Depth [{waterLevel}]
                  </span>
                  <span className="font-mono font-bold text-cyan-300">
                    +{liveScoring.waterScore} pts (5–40)
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${(liveScoring.waterScore / 40) * 100}%` }}
                  />
                </div>
              </div>

              {/* People Trapped */}
              <div className="bg-[#0B132B]/80 p-2.5 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Trapped [{peopleTrapped} occupants]
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    +{liveScoring.trappedScore} pts (max 20)
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${(liveScoring.trappedScore / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Vulnerable */}
              <div className="bg-[#0B132B]/80 p-2.5 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    Vulnerable Demographics [{children + elderly + disabled}]
                  </span>
                  <span className="font-mono font-bold text-purple-300">
                    +{liveScoring.vulnerableScore} pts (max 20)
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-400 transition-all duration-300"
                    style={{ width: `${(liveScoring.vulnerableScore / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Medical Emergency */}
              <div className="bg-[#0B132B]/80 p-2.5 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                    Medical Emergency Flag
                  </span>
                  <span className="font-mono font-bold text-red-300">
                    +{liveScoring.medicalScore} pts (20 pts)
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-400 transition-all duration-300"
                    style={{ width: `${(liveScoring.medicalScore / 20) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recommended Resource Allocation */}
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Recommended Rescue Resource
              </span>
              <p className="text-xs font-bold text-white leading-snug">
                {liveScoring.recommendedResource}
              </p>
            </div>

            {/* Explainable Reasoning Points */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 block">Algorithm Audit Reasons:</span>
              <ul className="text-[11px] text-slate-300 space-y-1">
                {liveScoring.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 shrink-0">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

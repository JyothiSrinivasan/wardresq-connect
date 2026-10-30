/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldAlert, 
  Waves, 
  Users, 
  HeartPulse, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Scale, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { WaterLevel, PriorityLevel } from '../types';
import { calculatePriorityScore, WATER_SEVERITY_POINTS } from '../utils/priorityScoring';

export const AlgorithmExplainerView: React.FC = () => {
  // Interactive Sandbox state for testing the algorithm live
  const [sandboxWater, setSandboxWater] = useState<WaterLevel>('Chest');
  const [sandboxTrapped, setSandboxTrapped] = useState<number>(4);
  const [sandboxChildren, setSandboxChildren] = useState<number>(1);
  const [sandboxElderly, setSandboxElderly] = useState<number>(1);
  const [sandboxDisabled, setSandboxDisabled] = useState<number>(0);
  const [sandboxMedical, setSandboxMedical] = useState<boolean>(true);

  const sandboxResult = calculatePriorityScore({
    waterLevel: sandboxWater,
    peopleTrapped: sandboxTrapped,
    children: sandboxChildren,
    elderly: sandboxElderly,
    disabled: sandboxDisabled,
    medicalEmergency: sandboxMedical,
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1C2541]/80 backdrop-blur border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Explainable AI Prioritisation Specification (100-Point Formula)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Ward officers need absolute transparency in life-or-death decisions. Unlike opaque black-box deep models, WardResQ implements a deterministic, multi-factor rubric aligned with National Disaster Management Authority (NDMA) triage principles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-mono border border-slate-700">
            Total Score ∈ [0, 100]
          </span>
        </div>
      </div>

      {/* 4 Factor Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Factor 1: Water Severity */}
        <div className="bg-[#1C2541]/80 border border-slate-700 rounded-2xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Waves className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              5 – 40 pts
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">1. Water Inundation Severity</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Depth & velocity of water around the structure.
          </p>
          <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800">
            <div className="flex justify-between"><span>Rooftop Depth:</span> <span className="font-bold text-cyan-300">40 pts</span></div>
            <div className="flex justify-between"><span>Chest Depth:</span> <span className="font-bold text-cyan-300">35 pts</span></div>
            <div className="flex justify-between"><span>Waist Depth:</span> <span className="font-bold text-cyan-300">25 pts</span></div>
            <div className="flex justify-between"><span>Knee Depth:</span> <span className="font-bold text-cyan-300">15 pts</span></div>
            <div className="flex justify-between"><span>Ankle Depth:</span> <span className="font-bold text-cyan-300">5 pts</span></div>
          </div>
        </div>

        {/* Factor 2: People Trapped */}
        <div className="bg-[#1C2541]/80 border border-slate-700 rounded-2xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Max 20 pts
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">2. People Trapped Count</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Number of stranded occupants needing boat evacuation.
          </p>
          <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800">
            <p className="font-mono text-amber-300 font-semibold">Formula: Trapped × 3 pts</p>
            <p className="text-slate-400">Capped at a maximum ceiling of 20 points (e.g. 7+ individuals).</p>
            <p className="text-slate-400">Prevents small shallow apartments from drowning out critical calls.</p>
          </div>
        </div>

        {/* Factor 3: Vulnerable Demographics */}
        <div className="bg-[#1C2541]/80 border border-slate-700 rounded-2xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              Max 20 pts
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">3. Vulnerable Demographics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Individuals unable to wade or evacuate independently.
          </p>
          <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800">
            <p className="font-mono text-purple-300 font-semibold">Formula: (Kids + Seniors + Disabled) × 4 pts</p>
            <p className="text-slate-400">Capped at 20 points max (5+ vulnerable individuals).</p>
            <p className="text-slate-400">Guarantees special priority for infants and mobility-impaired residents.</p>
          </div>
        </div>

        {/* Factor 4: Medical Emergency */}
        <div className="bg-[#1C2541]/80 border border-slate-700 rounded-2xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-500/30">
              20 pts
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">4. Medical Emergency</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Immediate acute clinical condition requiring paramedic care.
          </p>
          <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800">
            <p className="font-mono text-red-300 font-semibold">Fixed Boost: +20 pts</p>
            <p className="text-slate-400">Applies if oxygen, dialysis, pregnancy, insulin, or severe hypothermia is present.</p>
            <p className="text-slate-400">Triggers mobile ICU paramedic ambulance deployment.</p>
          </div>
        </div>
      </div>

      {/* Priority Classification Thresholds */}
      <div className="bg-[#1C2541]/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400" /> Priority Tiers & Thresholds (NDMA Protocol)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-red-950/60 border border-red-500/60 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-red-300 uppercase">Critical Tier</span>
              <span className="font-mono font-bold text-xs text-white bg-red-600 px-2 py-0.5 rounded">
                70 – 100 PTS
              </span>
            </div>
            <p className="text-xs text-red-200">
              Imminent threat to human life. Rooftop isolation or deep chest water with medical distress. Immediate NDRF zodiac motorboats dispatched.
            </p>
          </div>

          <div className="bg-amber-950/60 border border-amber-500/60 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 uppercase">High Tier</span>
              <span className="font-mono font-bold text-xs text-white bg-amber-600 px-2 py-0.5 rounded">
                45 – 69 PTS
              </span>
            </div>
            <p className="text-xs text-amber-200">
              Urgent evacuation required. Fast-rising waist/chest currents, trapped families, or elderly residents needing swift extraction.
            </p>
          </div>

          <div className="bg-yellow-950/60 border border-yellow-500/60 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-yellow-300 uppercase">Medium Tier</span>
              <span className="font-mono font-bold text-xs text-white bg-yellow-600 px-2 py-0.5 rounded">
                25 – 44 PTS
              </span>
            </div>
            <p className="text-xs text-yellow-200">
              Moderate inundation. Knee to waist depth with stable occupants. Wading rescue squads and food/water drops queued.
            </p>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-500/60 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-300 uppercase">Low Tier</span>
              <span className="font-mono font-bold text-xs text-white bg-emerald-600 px-2 py-0.5 rounded">
                0 – 24 PTS
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              Ankle depth pooling, restricted vehicular movement. Monitored by civil defence volunteers; sandbagging and dry ration relief.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Live Sandbox Calculator */}
      <div className="bg-gradient-to-br from-[#1C2541] via-[#121B36] to-[#0B132B] border-2 border-red-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Interactive Algorithm Sandbox (Test Formula in Real-Time)
            </h3>
            <p className="text-xs text-slate-400">
              Adjust the emergency parameters below to inspect how the mathematical formula reacts and allocates responder resources.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 self-start sm:self-auto">
            Zero Hallucination Guaranteed
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-200 block mb-1">
                Select Water Level (5–40 pts):
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['Ankle', 'Knee', 'Waist', 'Chest', 'Rooftop'] as WaterLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSandboxWater(lvl)}
                    className={`py-2 px-1 text-xs font-bold rounded-lg transition border ${
                      sandboxWater === lvl
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-md ring-2 ring-cyan-400/30'
                        : 'bg-[#0B132B] text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div>{lvl}</div>
                    <div className="text-[10px] opacity-80">+{WATER_SEVERITY_POINTS[lvl]}pts</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-700">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Trapped (3 ea)</label>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSandboxTrapped((p) => Math.max(1, p - 1))}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-amber-300">{sandboxTrapped}</span>
                  <button
                    onClick={() => setSandboxTrapped((p) => p + 1)}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-700">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Kids (4 ea)</label>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSandboxChildren((c) => Math.max(0, c - 1))}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-purple-300">{sandboxChildren}</span>
                  <button
                    onClick={() => setSandboxChildren((c) => c + 1)}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-700">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Elderly (4 ea)</label>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSandboxElderly((e) => Math.max(0, e - 1))}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-purple-300">{sandboxElderly}</span>
                  <button
                    onClick={() => setSandboxElderly((e) => e + 1)}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-700">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Disabled (4 ea)</label>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSandboxDisabled((d) => Math.max(0, d - 1))}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-purple-300">{sandboxDisabled}</span>
                  <button
                    onClick={() => setSandboxDisabled((d) => d + 1)}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#0B132B] border border-slate-700 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold text-white">Active Medical Emergency (+20 pts)</span>
              </div>
              <input
                type="checkbox"
                checked={sandboxMedical}
                onChange={(e) => setSandboxMedical(e.target.checked)}
                className="w-5 h-5 rounded text-red-600 bg-[#0B132B] border-slate-600 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Sandbox Live Output Result */}
          <div className="lg:col-span-5 bg-[#0B132B] p-4 rounded-xl border border-slate-700 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>Calculated Urgency:</span>
                <span className="font-mono font-bold text-white text-base">
                  {sandboxResult.totalScore} / 100 PTS
                </span>
              </div>

              <div className="my-3 text-center">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                  sandboxResult.priority === 'Critical'
                    ? 'bg-red-500/20 text-red-300 border-red-500/60 ring-2 ring-red-500/30'
                    : sandboxResult.priority === 'High'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                    : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                }`}>
                  {sandboxResult.priority} Priority Tier
                </span>
              </div>

              <div className="text-[11px] space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Water Score:</span>
                  <span className="font-mono text-cyan-300">+{sandboxResult.waterScore} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Trapped Score (max 20):</span>
                  <span className="font-mono text-amber-300">+{sandboxResult.trappedScore} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Vulnerable Score (max 20):</span>
                  <span className="font-mono text-purple-300">+{sandboxResult.vulnerableScore} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Medical Distress:</span>
                  <span className="font-mono text-red-300">+{sandboxResult.medicalScore} pts</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Auto-Assigned Resource:
              </span>
              <p className="text-xs font-bold text-white mt-0.5">
                {sandboxResult.recommendedResource}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

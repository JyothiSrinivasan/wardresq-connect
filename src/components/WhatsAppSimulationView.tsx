/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  CheckCheck, 
  ShieldCheck, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Sparkles, 
  LifeBuoy, 
  ArrowRight, 
  AlertTriangle, 
  ExternalLink,
  RotateCcw,
  Waves,
  HeartPulse,
  Users,
  Compass
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { Incident, IndianCity, WaterLevel } from '../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  options?: Array<{ label: string; value: string; actionId: string }>;
  incidentTicket?: {
    id: string;
    city: string;
    locality: string;
    score: number;
    priority: string;
    waterLevel: string;
    recommendedResource: string;
  };
}

interface WhatsAppSimulationViewProps {
  onSelectIncident: (incident: Incident) => void;
  onNavigateToTab: (tab: 'dashboard' | 'incidents') => void;
}

export const WhatsAppSimulationView: React.FC<WhatsAppSimulationViewProps> = ({ 
  onSelectIncident, 
  onNavigateToTab 
}) => {
  const { addIncident, incidents } = useIncidents();

  // Active chat step state for wizard
  const [step, setStep] = useState<
    'initial' | 'city' | 'locality' | 'water_level' | 'trapped' | 'medical' | 'done' | 'tracking'
  >('initial');

  // Draft incident state
  const [draft, setDraft] = useState<{
    category: string;
    city: IndianCity;
    locality: string;
    waterLevel: WaterLevel;
    peopleTrapped: number;
    children: number;
    elderly: number;
    disabled: number;
    medicalEmergency: boolean;
    medicalDetails: string;
  }>({
    category: 'Trapped People',
    city: 'Hyderabad',
    locality: '',
    waterLevel: 'Waist',
    peopleTrapped: 3,
    children: 1,
    elderly: 1,
    disabled: 0,
    medicalEmergency: false,
    medicalDetails: '',
  });

  const [inputVal, setInputVal] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const initialBotMessage: Message = {
    id: 'msg-init-1',
    sender: 'bot',
    text: `Namaste! 🙏 Welcome to the WardResQ Citizen Flood Emergency Line.\n\nThis is an automated 24/7 municipal coordination bot for citizens stranded in floodwaters.\n\nPlease select the nature of your emergency to dispatch rescue:`,
    timestamp: 'Just now',
    options: [
      { label: '🚨 Report Trapped People', value: 'trapped', actionId: 'start_trapped' },
      { label: '🌊 Report Rising Water Level', value: 'rising_water', actionId: 'start_water' },
      { label: '🚑 Medical Emergency in Flooded House', value: 'medical', actionId: 'start_medical' },
      { label: '🚧 Blocked Roads & Inundated Culverts', value: 'road', actionId: 'start_road' },
      { label: '🔍 Track Existing Ticket Status', value: 'track', actionId: 'track_ticket' },
    ],
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text: string, options?: Message['options'], incidentTicket?: Message['incidentTicket']) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender: 'bot',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
      }),
      options,
      incidentTicket,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const addUserMessage = (text: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleOptionClick = (option: { label: string; value: string; actionId: string }) => {
    addUserMessage(option.label);

    if (option.actionId.startsWith('start_')) {
      const isMed = option.value === 'medical';
      setDraft((prev) => ({
        ...prev,
        category: option.label,
        medicalEmergency: isMed,
        medicalDetails: isMed ? 'Urgent medical distress reported via Citizen WhatsApp' : '',
      }));
      setStep('city');

      setTimeout(() => {
        addBotMessage('Got it. Which Indian city / municipal corporation are you reporting from?', [
          { label: 'Hyderabad (GHMC)', value: 'Hyderabad', actionId: 'city_hyderabad' },
          { label: 'Chennai (GCC)', value: 'Chennai', actionId: 'city_chennai' },
          { label: 'Mumbai (BMC)', value: 'Mumbai', actionId: 'city_mumbai' },
          { label: 'Bengaluru (BBMP)', value: 'Bengaluru', actionId: 'city_bengaluru' },
          { label: 'Kochi (KMC)', value: 'Kochi', actionId: 'city_kochi' },
          { label: 'Patna (PMC)', value: 'Patna', actionId: 'city_patna' },
          { label: 'Guwahati (GMC)', value: 'Guwahati', actionId: 'city_guwahati' },
        ]);
      }, 500);
      return;
    }

    if (option.actionId.startsWith('city_')) {
      const chosenCity = option.value as IndianCity;
      setDraft((prev) => ({ ...prev, city: chosenCity }));
      setStep('locality');

      setTimeout(() => {
        addBotMessage(
          `Location recorded for ${chosenCity}. 📍\n\nPlease type your specific Locality, Ward number, or nearest Landmark (e.g. "Tolichowki near Pillar 45" or "Velachery Lake link road") in the chat box below:`
        );
      }, 500);
      return;
    }

    if (option.actionId.startsWith('water_')) {
      const level = option.value as WaterLevel;
      setDraft((prev) => ({ ...prev, waterLevel: level }));
      setStep('trapped');

      setTimeout(() => {
        addBotMessage(
          `Water depth recorded as [${level}]. 🌊\n\nHow many people are currently trapped with you in the flooded building?`,
          [
            { label: '1 - 2 Persons', value: '2', actionId: 'trapped_2' },
            { label: '3 - 5 Persons (Family)', value: '4', actionId: 'trapped_4' },
            { label: '6 - 9 Persons (Large Group)', value: '7', actionId: 'trapped_7' },
            { label: '10+ Persons (Community)', value: '12', actionId: 'trapped_12' },
          ]
        );
      }, 500);
      return;
    }

    if (option.actionId.startsWith('trapped_')) {
      const count = parseInt(option.value, 10);
      // Auto estimate children/elderly based on count
      const estKids = count >= 4 ? 1 : 0;
      const estElderly = count >= 4 ? 1 : 0;

      setDraft((prev) => ({
        ...prev,
        peopleTrapped: count,
        children: estKids,
        elderly: estElderly,
      }));
      setStep('medical');

      setTimeout(() => {
        addBotMessage(
          `Recorded ${count} people trapped (${estKids} children, ${estElderly} elderly).\n\nIs there an acute MEDICAL EMERGENCY? (e.g. Oxygen, insulin, pregnancy, dialysis, severe shivering)`,
          [
            { label: '🚨 YES – Medical Emergency Active', value: 'yes', actionId: 'med_yes' },
            { label: '🛡️ NO – Safe from immediate illness', value: 'no', actionId: 'med_no' },
          ]
        );
      }, 500);
      return;
    }

    if (option.actionId.startsWith('med_')) {
      const hasMed = option.value === 'yes';
      finalizeTicket(hasMed);
      return;
    }

    if (option.actionId === 'track_ticket') {
      setStep('tracking');
      setTimeout(() => {
        if (incidents.length === 0) {
          addBotMessage('No active tickets found in the ward system.');
          return;
        }

        const recent = incidents.slice(0, 3);
        const textSummary = recent
          .map(
            (inc) =>
              `• Ticket: ${inc.id}\n  Resident: ${inc.residentName} (${inc.city})\n  Status: [${inc.status}]\n  Priority: ${inc.priority} (${inc.score}/100)\n  Assigned Unit: ${inc.assignedTeam || 'Staging pending'}`
          )
          .join('\n\n');

        addBotMessage(
          `🔎 Here are the latest active tickets registered in your ward:\n\n${textSummary}\n\nYou can click below to inspect in the officer command centre:`,
          recent.map((inc) => ({
            label: `View ${inc.id} (${inc.city})`,
            value: inc.id,
            actionId: `view_ticket_${inc.id}`,
          }))
        );
      }, 500);
      return;
    }

    if (option.actionId.startsWith('view_ticket_')) {
      const targetId = option.value;
      const match = incidents.find((i) => i.id === targetId);
      if (match) {
        onSelectIncident(match);
      }
      return;
    }
  };

  const finalizeTicket = (hasMedicalEmergency: boolean) => {
    setStep('done');

    const created = addIncident({
      residentName: 'WhatsApp Citizen (' + draft.city + ')',
      contactNumber: '+91 99' + Math.floor(10000000 + Math.random() * 90000000),
      city: draft.city,
      locality: draft.locality || `${draft.city} Urban Inundation Sector`,
      waterLevel: draft.waterLevel,
      peopleTrapped: draft.peopleTrapped,
      children: draft.children,
      elderly: draft.elderly,
      disabled: draft.disabled,
      medicalEmergency: hasMedicalEmergency,
      medicalDetails: hasMedicalEmergency ? 'Citizen reported clinical distress via WhatsApp' : '',
      additionalInfo: `Reported via WhatsApp Simulation. Category: ${draft.category}.`,
      source: 'WhatsApp Bot',
    });

    setTimeout(() => {
      addBotMessage(
        `✅ SOS TICKET GENERATED & INJECTED INTO WARD COMMAND CENTRE!\n\nTicket ID: *${created.id}*\nCity: ${created.city}\nLocality: ${created.locality}\nCalculated Priority: *${created.priority.toUpperCase()}* (${created.score}/100 pts)\nWater Depth: ${created.waterLevel}\nPeople Trapped: ${created.peopleTrapped}\nRecommended Unit: *${created.priorityBreakdown.recommendedResource}*\n\nYour alert is now LIVE on the Ward Officer's incident dashboard for immediate team dispatch.`,
        [
          { label: '📊 View in Officer Dashboard', value: created.id, actionId: `view_ticket_${created.id}` },
          { label: '📋 View in Incident Table', value: 'incidents_tab', actionId: 'open_incidents_tab' },
          { label: '🔄 Report Another Incident', value: 'restart', actionId: 'restart_chat' },
        ],
        {
          id: created.id,
          city: created.city,
          locality: created.locality,
          score: created.score,
          priority: created.priority,
          waterLevel: created.waterLevel,
          recommendedResource: created.priorityBreakdown.recommendedResource,
        }
      );
    }, 600);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');
    addUserMessage(userText);

    if (step === 'locality') {
      setDraft((prev) => ({ ...prev, locality: userText }));
      setStep('water_level');

      setTimeout(() => {
        addBotMessage(
          `Locality set to "${userText}". 📌\n\nWhat is the current water level at this location?`,
          [
            { label: '🌊 Rooftop Level (Occupants on roof)', value: 'Rooftop', actionId: 'water_Rooftop' },
            { label: '🌊 Chest Level (Deep wading)', value: 'Chest', actionId: 'water_Chest' },
            { label: '🌊 Waist Level (Flooded floor)', value: 'Waist', actionId: 'water_Waist' },
            { label: '🌊 Knee Level (Porch/Road flood)', value: 'Knee', actionId: 'water_Knee' },
            { label: '🌊 Ankle Level (Early pooling)', value: 'Ankle', actionId: 'water_Ankle' },
          ]
        );
      }, 500);
      return;
    }

    // Default conversational responses
    setTimeout(() => {
      if (userText.toLowerCase().includes('help') || userText.toLowerCase().includes('sos')) {
        addBotMessage('Emergency desk acknowledges your alert! Please choose an option to log your exact sector:', [
          { label: '🚨 Report Trapped People', value: 'trapped', actionId: 'start_trapped' },
          { label: '🌊 Report Rising Water Level', value: 'rising_water', actionId: 'start_water' },
          { label: '🚑 Medical Emergency', value: 'medical', actionId: 'start_medical' },
        ]);
      } else {
        addBotMessage(
          `Message logged: "${userText}". Please tap a button below so our AI prioritisation engine can assign the right boat or NDRF squad:`,
          [
            { label: '🚨 Report Trapped People', value: 'trapped', actionId: 'start_trapped' },
            { label: '🌊 Report Rising Water', value: 'rising_water', actionId: 'start_water' },
            { label: '🔍 Track Existing Ticket', value: 'track', actionId: 'track_ticket' },
          ]
        );
      }
    }, 600);
  };

  const resetChat = () => {
    setStep('initial');
    setMessages([initialBotMessage]);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Info Card */}
      <div className="bg-[#1C2541]/80 backdrop-blur border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-600/20 border border-emerald-500/40 rounded-lg text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Citizen WhatsApp Emergency Bot Simulation
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live State Integration
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Simulates a lightweight WhatsApp chatbot used by stranded residents without installing new apps. Every interactive ticket submitted here is dynamically prioritised and saved directly into the shared municipal command queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Chat</span>
          </button>
        </div>
      </div>

      {/* Main WhatsApp Window Container */}
      <div className="max-w-3xl mx-auto bg-[#0B132B] border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[700px]">
        {/* WhatsApp Green Top Bar */}
        <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between text-white shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-white/40 flex items-center justify-center font-bold text-sm shadow">
                🇮🇳
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight">
                  WardResQ Citizen Flood Help 🇮🇳
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center text-[9px] font-black" title="Verified Municipal Channel">
                  ✓
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span>Official Municipal Disaster Cell</span>
                <span>• Online</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-emerald-100">
            <button className="p-1.5 hover:bg-emerald-700/60 rounded-full transition" title="Simulated audio call">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-emerald-700/60 rounded-full transition" title="Simulated video call">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-emerald-700/60 rounded-full transition">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d1418] bg-opacity-95 relative">
          {/* Encrypted Disclaimer Badge */}
          <div className="text-center my-1">
            <span className="inline-flex items-center gap-1.5 bg-[#182229] text-amber-200/90 text-[10px] font-medium px-3 py-1 rounded-lg border border-amber-500/20 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Messages are routed via Ward Emergency Operations Centre (MEOC). Priority score is calculated deterministically.
            </span>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-md text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#005c4b] text-white rounded-tr-none'
                    : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/50'
                }`}
              >
                {/* Text Content */}
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Ticket Receipt Visual Card inside Chat Bubble */}
                {msg.incidentTicket && (
                  <div className="mt-3 p-3 bg-[#111b21] rounded-xl border border-emerald-500/40 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-400">
                        {msg.incidentTicket.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.incidentTicket.priority === 'Critical'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {msg.incidentTicket.priority} ({msg.incidentTicket.score}/100)
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-0.5">
                      <p>📍 {msg.incidentTicket.city} — {msg.incidentTicket.locality}</p>
                      <p>🌊 Water Depth: {msg.incidentTicket.waterLevel}</p>
                      <p className="text-amber-300 font-semibold">
                        🚒 Unit: {msg.incidentTicket.recommendedResource}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timestamp & Read Receipts */}
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'user' && (
                    <CheckCheck className="w-3.5 h-3.5 text-cyan-400 inline" />
                  )}
                </div>
              </div>

              {/* Interactive Options / Buttons rendered beneath Bot Message */}
              {msg.options && msg.options.length > 0 && (
                <div className="mt-2.5 flex flex-col gap-1.5 w-full max-w-[85%] sm:max-w-[75%] pl-1">
                  {msg.options.map((opt) => (
                    <button
                      key={opt.actionId}
                      onClick={() => {
                        if (opt.actionId === 'open_incidents_tab') {
                          onNavigateToTab('incidents');
                        } else if (opt.actionId === 'restart_chat') {
                          resetChat();
                        } else {
                          handleOptionClick(opt);
                        }
                      }}
                      className="text-left px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#202c33] hover:bg-[#005c4b] text-cyan-300 hover:text-white border border-slate-700 hover:border-cyan-400 transition shadow-sm flex items-center justify-between group"
                    >
                      <span>{opt.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div ref={chatBottomRef} />
        </div>

        {/* WhatsApp Chat Input Bar */}
        <form
          onSubmit={handleSendText}
          className="bg-[#202c33] px-3 py-2.5 flex items-center gap-2 border-t border-slate-700 shrink-0"
        >
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-200 transition"
            title="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-200 transition"
            title="Attach landmark photo or GPS pin"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder={
              step === 'locality'
                ? 'Type your locality or landmark and hit Enter...'
                : 'Type message or choose interactive button above...'
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-[#2a3942] text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-2 border border-transparent focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            className="p-2.5 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white shadow transition shrink-0"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

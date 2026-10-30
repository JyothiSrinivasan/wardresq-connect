/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WaterLevel = 'Ankle' | 'Knee' | 'Waist' | 'Chest' | 'Rooftop';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus = 'New' | 'Assigned' | 'En Route' | 'Rescued' | 'Resolved';

export type IndianCity = 
  | 'Hyderabad' 
  | 'Chennai' 
  | 'Mumbai' 
  | 'Kochi' 
  | 'Bengaluru' 
  | 'Patna' 
  | 'Guwahati'
  | 'Other';

export interface PriorityBreakdown {
  waterScore: number;       // 5 to 40
  trappedScore: number;     // 3 per person, max 20
  vulnerableScore: number;   // 4 per person, max 20
  medicalScore: number;     // 20 points
  totalScore: number;       // 0 to 100
  priority: PriorityLevel;
  reasoning: string[];
  recommendedResource: string;
}

export interface FieldNote {
  id: string;
  timestamp: string;
  author: string;
  note: string;
}

export interface Incident {
  id: string;
  residentName: string;
  contactNumber: string;
  city: IndianCity;
  locality: string;
  waterLevel: WaterLevel;
  peopleTrapped: number;
  children: number;
  elderly: number;
  disabled: number;
  medicalEmergency: boolean;
  medicalDetails: string;
  additionalInfo: string;
  source: 'Ward Portal' | 'WhatsApp Bot' | 'Emergency Helpline 112';
  createdAt: string;
  score: number;
  priority: PriorityLevel;
  priorityBreakdown: PriorityBreakdown;
  status: IncidentStatus;
  assignedTeam: string | null;
  fieldNotes: FieldNote[];
}

export const RESPONDER_TEAMS = [
  'NDRF Team Alpha (Deep Water & Motorboat Unit)',
  'NDRF Team Bravo (Aviation & Helo Winch Support)',
  'SDRF Coastal & Riverine Rescue Battalion',
  'State Fire & Disaster Response Force (SFDRF) Squad 4',
  'Indian Coast Guard / Naval Diving Wading Cell',
  'Municipal Emergency Medical Corps (Mobile ICU Ambulance)',
  'Civil Defence & Ward Volunteer Rapid Raft Unit',
] as const;

export type ResponderTeam = typeof RESPONDER_TEAMS[number];

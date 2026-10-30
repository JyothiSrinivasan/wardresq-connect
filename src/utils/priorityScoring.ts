/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PriorityBreakdown, PriorityLevel, WaterLevel } from '../types';

export const WATER_SEVERITY_POINTS: Record<WaterLevel, number> = {
  Ankle: 5,
  Knee: 15,
  Waist: 25,
  Chest: 35,
  Rooftop: 40,
};

export interface ScoringInputs {
  waterLevel: WaterLevel;
  peopleTrapped: number;
  children: number;
  elderly: number;
  disabled: number;
  medicalEmergency: boolean;
  medicalDetails?: string;
}

export function calculatePriorityScore(inputs: ScoringInputs): PriorityBreakdown {
  const {
    waterLevel,
    peopleTrapped,
    children,
    elderly,
    disabled,
    medicalEmergency,
  } = inputs;

  // 1. Water Severity (5 - 40 points)
  const waterScore = WATER_SEVERITY_POINTS[waterLevel] || 5;

  // 2. People Trapped: 3 points each, maximum 20 points
  const rawTrappedScore = Math.max(0, peopleTrapped) * 3;
  const trappedScore = Math.min(20, rawTrappedScore);

  // 3. Vulnerable People: 4 points each (children + elderly + disabled), maximum 20 points
  const totalVulnerable = Math.max(0, children) + Math.max(0, elderly) + Math.max(0, disabled);
  const rawVulnerableScore = totalVulnerable * 4;
  const vulnerableScore = Math.min(20, rawVulnerableScore);

  // 4. Medical Emergency: 20 points
  const medicalScore = medicalEmergency ? 20 : 0;

  // Total Score out of 100
  const totalScore = Math.min(100, waterScore + trappedScore + vulnerableScore + medicalScore);

  // Priority classification
  // 70–100: Critical
  // 45–69: High
  // 25–44: Medium
  // 0–24: Low
  let priority: PriorityLevel = 'Low';
  if (totalScore >= 70) {
    priority = 'Critical';
  } else if (totalScore >= 45) {
    priority = 'High';
  } else if (totalScore >= 25) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  // Explainable Reasoning Generation
  const reasoning: string[] = [];

  reasoning.push(
    `Water Level [${waterLevel}]: +${waterScore} pts (${waterLevel === 'Rooftop' ? 'Extreme submersion, imminent structural / drowning risk' : waterLevel === 'Chest' ? 'Severe depth, currents immobilise adults' : waterLevel === 'Waist' ? 'Dangerous wading, vehicles submerged' : waterLevel === 'Knee' ? 'Restricted mobility' : 'Minor pooling'})`
  );

  if (peopleTrapped > 0) {
    reasoning.push(
      `People Trapped [${peopleTrapped}]: +${trappedScore} pts (${peopleTrapped} × 3 pts, capped at 20 pts max)`
    );
  } else {
    reasoning.push(`People Trapped [0]: +0 pts (No isolated occupants reported)`);
  }

  if (totalVulnerable > 0) {
    const breakdownDetails = [];
    if (children > 0) breakdownDetails.push(`${children} children`);
    if (elderly > 0) breakdownDetails.push(`${elderly} elderly`);
    if (disabled > 0) breakdownDetails.push(`${disabled} persons with disabilities`);

    reasoning.push(
      `Vulnerable Demographics [${totalVulnerable} total]: +${vulnerableScore} pts (${breakdownDetails.join(', ')} @ 4 pts each, capped at 20 pts max)`
    );
  } else {
    reasoning.push(`Vulnerable Demographics: +0 pts (No special vulnerability registered)`);
  }

  if (medicalEmergency) {
    reasoning.push(`Medical Emergency: +20 pts (Critical life-safety factor requires immediate paramedic dispatch)`);
  } else {
    reasoning.push(`Medical Emergency: +0 pts (No acute clinical distress declared)`);
  }

  // Recommended Resource Allocation
  let recommendedResource = 'Civil Defence & Ward Volunteer Rapid Raft Unit';

  if (waterLevel === 'Rooftop' || (totalScore >= 75 && waterLevel === 'Chest')) {
    recommendedResource = 'NDRF Team Alpha (Deep Water & Motorboat Unit) + Drone Aerial Recon';
  } else if (medicalEmergency && (waterLevel === 'Chest' || waterLevel === 'Waist')) {
    recommendedResource = 'Municipal Emergency Medical Corps (Mobile ICU Ambulance) + Inflatable Raft';
  } else if (waterLevel === 'Chest') {
    recommendedResource = 'SDRF Coastal & Riverine Rescue Battalion';
  } else if (waterLevel === 'Waist' || totalScore >= 50) {
    recommendedResource = 'State Fire & Disaster Response Force (SFDRF) Squad 4';
  } else if (waterLevel === 'Knee') {
    recommendedResource = 'Civil Defence & Ward Volunteer Rapid Raft Unit';
  } else {
    recommendedResource = 'Ward Relief Patrol & Sandbagging Support Unit';
  }

  return {
    waterScore,
    trappedScore,
    vulnerableScore,
    medicalScore,
    totalScore,
    priority,
    reasoning,
    recommendedResource,
  };
}

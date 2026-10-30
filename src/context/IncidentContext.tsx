/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Incident, IncidentStatus, PriorityBreakdown } from '../types';
import { INITIAL_INCIDENTS } from '../data/initialIncidents';
import { calculatePriorityScore, ScoringInputs } from '../utils/priorityScoring';

const STORAGE_KEY = 'wardresq_incidents_data_v1';

interface IncidentContextType {
  incidents: Incident[];
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  addIncident: (data: Omit<Incident, 'id' | 'createdAt' | 'score' | 'priority' | 'priorityBreakdown' | 'status' | 'assignedTeam' | 'fieldNotes'> & {
    source?: Incident['source'];
  }) => Incident;
  updateStatus: (incidentId: string, newStatus: IncidentStatus, officerName?: string) => void;
  assignTeam: (incidentId: string, teamName: string, officerName?: string) => void;
  addFieldNote: (incidentId: string, noteText: string, author?: string) => void;
  resetDemoData: () => void;
  stats: {
    total: number;
    criticalOpen: number;
    highOpen: number;
    totalPeopleTrapped: number;
    resolved: number;
    rescued: number;
    inProgress: number;
  };
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback if parsing fails
    }
    return INITIAL_INCIDENTS;
  });

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    } catch (err) {
      console.warn('Failed to save incidents to localStorage:', err);
    }
  }, [incidents]);

  // Keep selectedIncident updated if an incident in the list updates
  useEffect(() => {
    if (selectedIncident) {
      const updated = incidents.find((i) => i.id === selectedIncident.id);
      if (updated) {
        setSelectedIncident(updated);
      }
    }
  }, [incidents]);

  const addIncident = (
    data: Omit<Incident, 'id' | 'createdAt' | 'score' | 'priority' | 'priorityBreakdown' | 'status' | 'assignedTeam' | 'fieldNotes'> & {
      source?: Incident['source'];
    }
  ): Incident => {
    const scoringInputs: ScoringInputs = {
      waterLevel: data.waterLevel,
      peopleTrapped: data.peopleTrapped,
      children: data.children,
      elderly: data.elderly,
      disabled: data.disabled,
      medicalEmergency: data.medicalEmergency,
      medicalDetails: data.medicalDetails,
    };

    const breakdown: PriorityBreakdown = calculatePriorityScore(scoringInputs);
    
    // Generate clean ticket ID
    const cityCode = data.city ? data.city.substring(0, 3).toUpperCase() : 'WRD';
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const incidentId = `WRQ-2026-${cityCode}-${randomSeq}`;

    const newIncident: Incident = {
      ...data,
      id: incidentId,
      source: data.source || 'Ward Portal',
      createdAt: new Date().toISOString(),
      score: breakdown.totalScore,
      priority: breakdown.priority,
      priorityBreakdown: breakdown,
      status: 'New',
      assignedTeam: null,
      fieldNotes: [
        {
          id: `fn-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'System Intake AI',
          note: `Incident registered with Priority ${breakdown.priority.toUpperCase()} (${breakdown.totalScore}/100 pts). Auto-recommended resource: ${breakdown.recommendedResource}.`,
        },
      ],
    };

    setIncidents((prev) => [newIncident, ...prev]);
    return newIncident;
  };

  const updateStatus = (incidentId: string, newStatus: IncidentStatus, officerName = 'Duty Ward Officer') => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const newNote = {
            id: `fn-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            author: officerName,
            note: `Status updated from [${inc.status}] to [${newStatus}].`,
          };
          return {
            ...inc,
            status: newStatus,
            fieldNotes: [...inc.fieldNotes, newNote],
          };
        }
        return inc;
      })
    );
  };

  const assignTeam = (incidentId: string, teamName: string, officerName = 'Operations Commander') => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const newStatus: IncidentStatus = inc.status === 'New' ? 'Assigned' : inc.status;
          const newNote = {
            id: `fn-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            author: officerName,
            note: `Assigned responder unit: ${teamName}. Dispatch dispatched on radio channel 3.`,
          };
          return {
            ...inc,
            assignedTeam: teamName,
            status: newStatus,
            fieldNotes: [...inc.fieldNotes, newNote],
          };
        }
        return inc;
      })
    );
  };

  const addFieldNote = (incidentId: string, noteText: string, author = 'Ward Incident Desk') => {
    if (!noteText.trim()) return;
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const newNote = {
            id: `fn-${Date.now()}`,
            timestamp: new Date().toISOString(),
            author,
            note: noteText.trim(),
          };
          return {
            ...inc,
            fieldNotes: [...inc.fieldNotes, newNote],
          };
        }
        return inc;
      })
    );
  };

  const resetDemoData = () => {
    setIncidents(INITIAL_INCIDENTS);
    localStorage.removeItem(STORAGE_KEY);
    setSelectedIncident(null);
  };

  // Precalculated statistics
  const total = incidents.length;
  const criticalOpen = incidents.filter(
    (i) => i.priority === 'Critical' && i.status !== 'Resolved' && i.status !== 'Rescued'
  ).length;
  const highOpen = incidents.filter(
    (i) => i.priority === 'High' && i.status !== 'Resolved' && i.status !== 'Rescued'
  ).length;
  const totalPeopleTrapped = incidents
    .filter((i) => i.status !== 'Resolved' && i.status !== 'Rescued')
    .reduce((acc, curr) => acc + (curr.peopleTrapped || 0), 0);
  const resolved = incidents.filter((i) => i.status === 'Resolved').length;
  const rescued = incidents.filter((i) => i.status === 'Rescued').length;
  const inProgress = incidents.filter((i) => i.status === 'Assigned' || i.status === 'En Route').length;

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        selectedIncident,
        setSelectedIncident,
        addIncident,
        updateStatus,
        assignTeam,
        addFieldNote,
        resetDemoData,
        stats: {
          total,
          criticalOpen,
          highOpen,
          totalPeopleTrapped,
          resolved,
          rescued,
          inProgress,
        },
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};

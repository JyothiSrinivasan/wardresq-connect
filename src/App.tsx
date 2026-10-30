/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { IncidentProvider, useIncidents } from './context/IncidentContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { IncidentManagementView } from './components/IncidentManagementView';
import { ResidentReportFormView } from './components/ResidentReportFormView';
import { WhatsAppSimulationView } from './components/WhatsAppSimulationView';
import { AlgorithmExplainerView } from './components/AlgorithmExplainerView';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { Incident } from './types';

type ActiveTab = 'dashboard' | 'incidents' | 'report' | 'whatsapp' | 'algorithm';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const { selectedIncident, setSelectedIncident } = useIncidents();

  const handleOpenIncident = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleCloseModal = () => {
    setSelectedIncident(null);
  };

  return (
    <div className="min-h-screen bg-[#070c1b] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header with mandatory disclaimer & navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onSelectIncident={handleOpenIncident}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentManagementView onSelectIncident={handleOpenIncident} />
        )}

        {activeTab === 'report' && (
          <ResidentReportFormView
            onSuccessViewIncident={(incident) => {
              setSelectedIncident(incident);
              setActiveTab('incidents');
            }}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppSimulationView
            onSelectIncident={(incident) => {
              setSelectedIncident(incident);
              setActiveTab('incidents');
            }}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'algorithm' && <AlgorithmExplainerView />}
      </main>

      {/* Footer */}
      <footer className="bg-[#0B132B] border-t border-[#1C2541] py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">WardResQ Connect</span>
            <span>• Indian Municipal Flood Emergency Coordination System</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Rapid Prototype for Monsoon Disaster Preparedness • Multi-Agency VHF Relay Channel 4
          </div>
        </div>
      </footer>

      {/* Incident Detail / Dispatch Modal */}
      {selectedIncident && (
        <IncidentDetailModal incident={selectedIncident} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <IncidentProvider>
      <MainAppContent />
    </IncidentProvider>
  );
}

import React, { useState } from 'react';
import {
  Compass,
  ShieldAlert,
  Radio,
  Flame,
  Globe2,
  TrendingUp,
  Layers,
  Sparkles,
  ExternalLink,
  Filter,
  Search,
  ArrowRight,
  FileDown,
  Users,
  Target,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Calendar,
  X,
  Server,
  Lock,
  RefreshCw,
  Cpu,
  Activity,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  ThreatCampaign,
  ThreatActor,
  TelemetryMetrics,
  IOC,
  VulnerabilityCVE,
  ExecutiveBriefing
} from '../types';

interface CTIDashboardViewProps {
  campaigns: ThreatCampaign[];
  actors: ThreatActor[];
  telemetry: TelemetryMetrics;
  iocs: IOC[];
  cves: VulnerabilityCVE[];
  onSelectActor: (actor: ThreatActor) => void;
  onSelectIOC: (ioc: IOC) => void;
  onNavigateTab: (tab: any) => void;
  onExportSTIX: () => void;
}

export const CTIDashboardView: React.FC<CTIDashboardViewProps> = ({
  campaigns = [],
  actors = [],
  telemetry,
  iocs = [],
  cves = [],
  onSelectActor,
  onSelectIOC,
  onNavigateTab,
  onExportSTIX
}) => {
  // Filters
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedMotivation, setSelectedMotivation] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Campaign Modal
  const [selectedCampaign, setSelectedCampaign] = useState<ThreatCampaign | null>(null);

  // Executive AI Briefing State
  const [briefingModalOpen, setBriefingModalOpen] = useState(false);
  const [briefing, setBriefing] = useState<ExecutiveBriefing | null>(null);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [briefingRegion, setBriefingRegion] = useState('Global');
  const [briefingSector, setBriefingSector] = useState('Critical Infrastructure & Telecom');

  // Filtered Campaigns
  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesSearch =
      searchQuery === '' ||
      camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.attackVector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.targetedSectors.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSeverity =
      selectedSeverity === 'all' || camp.severity === selectedSeverity;

    const matchesRegion =
      selectedRegion === 'all' ||
      (selectedRegion === 'americas' && camp.targetedCountries.some((c) => ['United States', 'Canada', 'Guam'].includes(c))) ||
      (selectedRegion === 'emea' && camp.targetedCountries.some((c) => ['United Kingdom', 'Germany', 'France', 'Ukraine', 'Poland', 'Estonia', 'Switzerland'].includes(c))) ||
      (selectedRegion === 'apac' && camp.targetedCountries.some((c) => ['Japan', 'Singapore', 'South Korea', 'Australia', 'Guam'].includes(c)));

    const matchesMotivation =
      selectedMotivation === 'all' ||
      (selectedMotivation === 'espionage' && (camp.actorName.includes('APT29') || camp.actorName.includes('Volt') || camp.actorName.includes('UNC3886') || camp.actorName.includes('Salt'))) ||
      (selectedMotivation === 'financial' && (camp.actorName.includes('BlackCat') || camp.actorName.includes('Lazarus') || camp.actorName.includes('LockBit') || camp.actorName.includes('Scattered Spider') || camp.actorName.includes('FIN11'))) ||
      (selectedMotivation === 'sabotage' && (camp.actorName.includes('Sandworm') || camp.actorName.includes('Volt')));

    return matchesSearch && matchesSeverity && matchesRegion && matchesMotivation;
  });

  // Trigger Gemini AI Executive Briefing
  const handleGenerateBriefing = async () => {
    try {
      setIsGeneratingBriefing(true);
      setBriefingModalOpen(true);
      const res = await fetch('/api/threat-intel/executive-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: briefingRegion,
          sector: briefingSector,
          timeRange: 'Current Active Landscape'
        })
      });

      if (!res.ok) throw new Error('Failed to generate executive briefing');
      const data = await res.json();
      setBriefing(data);
    } catch (err) {
      console.error('Error generating executive briefing:', err);
    } finally {
      setIsGeneratingBriefing(false);
    }
  };

  return (
    <div className="space-y-3 text-slate-900 font-sans">
      {/* Aegis CTI Command Header & KPIs */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-xs space-y-3">
        {/* Top: Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 via-rose-700 to-red-800 text-white flex items-center justify-center shadow-md shadow-red-500/20 border border-red-500/40 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">
                Unified Offensive Intelligence
              </h2>
              <div className="flex items-center gap-2">
                <h1 className="text-[11px] sm:text-xs font-bold text-slate-900 font-mono tracking-tight">
                  Strategic Threat Landscape & Campaign Intelligence
                </h1>
                <p className="text-[9px] text-slate-500 font-mono leading-relaxed mt-0.5">
                  Continuous threat exposure management (CTEM), EPSS exploit likelihood rating,<br />
                  CISA KEV correlation, and AI-directed patch verification.
                </p>
                <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[9px] font-mono font-bold border border-red-200 tracking-wider">
                  TACTICAL CTI
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
            <button
              onClick={() => onNavigateTab('next-gen')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-200 transition-all cursor-pointer shadow-2xs"
              title="Inspect Senior Threat Researcher Next-Gen Architecture & Sandbox"
            >
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Next-Gen Blueprint</span>
            </button>

            <button
              onClick={handleGenerateBriefing}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-[10px] font-bold shadow-md shadow-red-500/20 border border-red-500/40 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-pink-200" />
              <span>Briefing</span>
            </button>

            <button
              onClick={onExportSTIX}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
              title="Export full campaign and adversary bundle to STIX 2.1"
            >
              <FileDown className="w-3 h-3 text-indigo-600" />
              <span className="font-mono font-bold uppercase">STIX</span>
            </button>
          </div>
        </div>

        {/* Bottom: Strategic Threat Posture KPI Grid (Compact inline) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 hover:border-red-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase">
              <span>DEFCON Level</span>
              <Radio className="w-2.5 h-2.5 text-red-600 animate-pulse" />
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-sm font-black text-red-600 font-mono">2</span>
              <span className="text-[9px] px-1 py-0.2 rounded font-bold border border-red-200 bg-red-50 text-red-700">ELEVATED</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 hover:border-sky-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase">
              <span>Active Ops</span>
              <Layers className="w-2.5 h-2.5 text-sky-600" />
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-sm font-black text-sky-700 font-mono">{campaigns.length}</span>
              <span className="text-[9px] font-mono text-slate-400">INGESTED</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase">
              <span>APT & UNCs</span>
              <Users className="w-2.5 h-2.5 text-purple-600" />
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-sm font-black text-purple-700 font-mono">{actors.length}</span>
              <span className="text-[9px] font-mono text-slate-400">TRACKED</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase">
              <span>High-Risk</span>
              <Target className="w-2.5 h-2.5 text-amber-600" />
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-sm font-black text-amber-700 font-mono">5</span>
              <span className="text-[9px] font-mono text-slate-400">SECTORS</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 hover:border-rose-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase">
              <span>Weaponized</span>
              <Zap className="w-2.5 h-2.5 text-rose-600" />
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-sm font-black text-rose-700 font-mono">{cves.length}</span>
              <span className="text-[9px] font-mono text-slate-400">CVEs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main CTI Layout: Left Half (Frontline Campaign Ops Central) & Right Half (Attribution, TTPs, Targeted Industry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left Half (5 cols): Frontline Campaign Operations Central (4-column card grid) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
          {/* Filter Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                <span>Frontline Campaign Operations Central</span>
                <span className="text-[10px] font-mono font-normal text-slate-500">
                  ({filteredCampaigns.length})
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
              {/* Search */}
              <div className="relative">
                <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-6 pr-2 py-0.5 text-[10px] text-slate-900 focus:outline-none focus:border-red-500 font-mono w-28"
                />
              </div>

              {/* Region Filter */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className={`border rounded-lg px-1.5 py-0.5 text-[10px] focus:outline-none cursor-pointer transition-all font-semibold ${
                  selectedRegion !== 'all' 
                    ? 'bg-sky-100 text-sky-800 border-sky-300 shadow-3xs font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <option value="all">Geos</option>
                <option value="americas">AMER</option>
                <option value="emea">EMEA</option>
                <option value="apac">APAC</option>
              </select>
            </div>
          </div>

          {/* Campaign Cards Grid (2-column layout inside left half) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 max-h-[720px] overflow-y-auto pr-0.5">
            {filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-red-500/60 rounded-xl p-2.5 transition-all shadow-2xs flex flex-col justify-between group cursor-pointer whitespace-normal break-words"
                onClick={() => setSelectedCampaign(camp)}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`px-1 py-0.2 rounded text-[8px] font-mono font-bold uppercase ${
                        camp.severity === 'critical'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {camp.severity}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">#{camp.id.split('-')[1]}</span>
                  </div>

                  <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-tight mb-1">
                    {camp.title}
                  </h3>

                  <div className="flex items-center gap-1 mb-1 pb-1 border-b border-slate-200">
                    <span className="text-[10px] font-bold text-indigo-600 font-mono">
                      {camp.actorName}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-1">
                    {camp.mitreTactics.slice(0, 2).map((tactic, idx) => (
                      <span key={idx} className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 text-[8px] font-bold uppercase">
                        {tactic}
                      </span>
                    ))}
                  </div>

                  <div className="mb-1.5 bg-red-50/50 p-1 rounded-lg border border-red-100/50">
                    <span className="text-slate-800 font-mono font-bold text-[9px] leading-tight block truncate">
                      {camp.attackVector}
                    </span>
                  </div>
                </div>

                <div className="mt-1.5 pt-1 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-mono text-[8px] font-bold text-red-600">{camp.iocCount} IOCs</span>
                  <span className="flex items-center gap-0.5 text-indigo-600 text-[9px] font-bold font-mono">
                    Dive <ChevronRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Half: Geopolitical Attribution, Stacked boxes (2. TTP Dominance, 3. Targeted Industry Exposure) */}
        <div className="lg:col-span-7 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* 1. Geopolitical Threat Attribution Matrix */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Geopolitical Threat Attribution Matrix</span>
                </h3>
                <p className="text-[9px] text-slate-500 font-mono">
                  State intelligence organs and cybercrime safe-harbors
                </p>
              </div>
              <span className="text-[8px] font-mono bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold border border-red-100">
                VOLATILE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {telemetry.topSourceCountries.map((c, i) => (
                <div key={i} className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-red-300 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm flex items-center gap-1 font-bold text-slate-900">
                      <span>{c.flag}</span>
                      <span className="text-[10px] font-mono uppercase">{c.country}</span>
                    </span>
                    <span className="text-[8px] font-mono text-red-600 font-bold bg-red-50 px-1 rounded">LIVE</span>
                  </div>
                  
                  <div className="flex items-baseline justify-between text-[9px] mb-0.5 font-mono">
                    <span className="text-slate-400">Volume:</span>
                    <span className="text-slate-900 font-bold">{(c.count / 1000).toFixed(1)}K</span>
                  </div>

                  <div className="w-full bg-slate-100 h-1 rounded-full mb-1.5 overflow-hidden">
                    <div 
                      className="bg-red-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (c.count / 50000) * 100)}%` }} 
                    />
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-50">
                    {(c.country === 'Russia'
                      ? ['APT29', 'APT28']
                      : c.country === 'China'
                      ? ['UNC3886', 'Volt Typhoon']
                      : c.country === 'North Korea'
                      ? ['Lazarus']
                      : ['MuddyWater']
                    ).map(actor => (
                      <span key={actor} className="text-[8px] font-bold text-indigo-700 bg-indigo-50 px-1 py-0 rounded">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {/* 2. Adversary Attack Vector & TTP Dominance */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                    <span>Adversary Attack Vector & TTP Dominance</span>
                  </h3>
                  <p className="text-[9px] text-slate-500 font-mono">
                    Living-off-the-Land (LotL), edge hypervisors, token replay
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('mitre')}
                  className="text-[9px] text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 font-mono font-bold cursor-pointer bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100"
                >
                  MATRIX <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {telemetry.attackVectorBreakdown.slice(0, 6).map((vec, i) => (
                  <div key={i} className="bg-white p-2 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-slate-900 truncate">{vec.vector}</span>
                      <span className="font-black text-red-600">{vec.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full"
                        style={{ width: `${vec.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Targeted Industry Threat Exposure */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Targeted Industry Threat Exposure</span>
                  </h3>
                  <p className="text-[9px] text-slate-500 font-mono">
                    Adversary targeting across critical sectors
                  </p>
                </div>
                <span className="text-[8px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold border border-indigo-200">
                  CROSS-SECTOR
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {telemetry.topTargetedSectors.map((sec, i) => (
                  <div key={i} className="bg-white p-2 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-800 font-bold truncate">{sec.sector}</span>
                      <span className="text-indigo-700 font-bold">{sec.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 h-full rounded-full"
                        style={{ width: `${sec.percentage * 2.6}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CAMPAIGN DRILL-DOWN DRAWER */}
      <div 
        className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${
          selectedCampaign ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setSelectedCampaign(null)}
        />

        {/* Drawer Content */}
        <div 
          className={`relative w-full max-w-3xl h-full bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900 transition-transform duration-500 ease-out ${
            selectedCampaign ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold border border-red-200">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold uppercase">
                    {selectedCampaign?.severity}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    {selectedCampaign?.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedCampaign?.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setSelectedCampaign(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono flex-1">
            {selectedCampaign && (
              <>
                {/* Core Attribution Banner */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-bold block">Attributed Actor</span>
                    <span className="text-sm font-bold text-indigo-600">{selectedCampaign.actorName}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-bold block">First Identified</span>
                    <span className="text-xs font-bold text-slate-800">{selectedCampaign.startDate}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-bold block">Latest Telemetry</span>
                    <span className="text-xs font-bold text-emerald-700">{selectedCampaign.lastActivity}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-bold block">Tracked IOCs</span>
                    <span className="text-sm font-bold text-red-600">{selectedCampaign.iocCount} indicators</span>
                  </div>
                </div>

                {/* Threat Summary */}
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1.5">
                    Strategic Threat Assessment
                  </h4>
                  <p className="text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-sans text-xs">
                    {selectedCampaign.summary}
                  </p>
                </div>

                {/* Primary Attack Vector & Tradecraft */}
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1.5">
                    Primary Delivery & Exploitation Mechanics
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-indigo-700 font-semibold text-[11px]">
                    {selectedCampaign.attackVector}
                  </div>
                </div>

                {/* MITRE ATT&CK Tactics */}
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1.5">
                    Observed MITRE ATT&CK Tactics
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCampaign.mitreTactics.map((tactic, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-bold shadow-2xs"
                      >
                        {tactic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Targeted Sectors & Geographies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-xs uppercase text-slate-500 font-bold block mb-1">
                      Targeted Industry Sectors
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCampaign.targetedSectors.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-700 text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-xs uppercase text-slate-500 font-bold block mb-1">
                      Targeted Countries & Territories
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCampaign.targetedCountries.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-700 text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                setSelectedCampaign(null);
                onNavigateTab('actors');
              }}
              className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Pivot to Threat Actor Dossier</span>
            </button>

            <button
              onClick={() => setSelectedCampaign(null)}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors cursor-pointer text-xs font-mono"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXECUTIVE CTI BRIEFING DRAWER */}
      <div 
        className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${
          briefingModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setBriefingModalOpen(false)}
        />

        {/* Drawer Content */}
        <div 
          className={`relative w-full max-w-4xl h-full bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900 transition-transform duration-500 ease-out ${
            briefingModalOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center shadow-md shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Aegis Executive Intelligence Briefing
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  AI-Synthesized Strategic Intelligence for CISOs & SOC Leadership
                </p>
              </div>
            </div>

            <button
              onClick={() => setBriefingModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono flex-1">
            {isGeneratingBriefing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
                <Sparkles className="w-8 h-8 text-red-600 animate-spin" />
                <p className="font-bold text-slate-900 text-sm">
                  Synthesizing Strategic CTI Telemetry & Adversary Dossiers...
                </p>
                <p className="text-xs text-slate-500 max-w-md font-mono">
                  Correlating nation-state campaign logs, zero-day weaponization trends, and cross-sector impact forecasts via Gemini.
                </p>
              </div>
            ) : briefing ? (
              <div className="space-y-5">
                {/* Title & Posture Banner */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase text-slate-500 font-bold block">
                      Briefing Subject
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{briefing.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-red-50 text-red-700 font-mono font-bold text-xs border border-red-200">
                      {briefing.defconLevel}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 font-mono font-bold text-xs border border-purple-200">
                      {briefing.threatPosture}
                    </span>
                  </div>
                </div>

                {/* Executive Summary */}
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1.5">
                    Executive Summary
                  </h4>
                  <p className="text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-sans text-xs">
                    {briefing.executiveSummary}
                  </p>
                </div>

                {/* Strategic Threat Trends */}
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-2 font-mono">
                    Strategic Threat Landscape Trends
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {briefing.strategicThreatTrends.map((trend, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 hover:border-red-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-[11px] leading-tight">{trend.title}</h5>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            trend.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {trend.severity}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[10px] leading-relaxed font-sans">{trend.description}</p>
                        <div className="text-[9px] text-indigo-600 font-bold pt-1 border-t border-slate-50">Impact: {trend.impact}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Targeted Sector Impacts */}
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-2 font-mono">
                    Targeted Sector Exposure Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {briefing.targetedSectorImpacts.map((sec, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-[11px] uppercase tracking-tight">{sec.sector}</span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                              sec.riskLevel === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {sec.riskLevel}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-mono font-bold uppercase tracking-tighter">Dominant Adversary:</span>
                            <span className="font-bold text-slate-900">{sec.dominantActor}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-mono font-bold uppercase tracking-tighter">Primary Vector:</span>
                            <span className="font-mono text-indigo-600 font-bold">{sec.primaryVector}</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 font-sans italic leading-snug">
                          <span className="font-bold text-indigo-600 font-mono not-italic uppercase tracking-tighter mr-1">Directive:</span> {sec.defensiveAdvice}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Campaign Spotlight */}
                {briefing.activeCampaignSpotlight && (
                  <div>
                    <h4 className="font-bold text-red-700 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-red-600" />
                      <span>Campaign Spotlight: {briefing.activeCampaignSpotlight.campaignName}</span>
                    </h4>
                    <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-slate-800 space-y-1.5">
                      <p className="text-xs">
                        <span className="font-bold text-slate-900">Actor:</span> {briefing.activeCampaignSpotlight.adversary} | <span className="font-bold text-slate-900">Vector:</span> {briefing.activeCampaignSpotlight.vector}
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        <span className="font-bold text-slate-900">Adversary Objective:</span> {briefing.activeCampaignSpotlight.objective}
                      </p>
                      <p className="text-xs text-red-700 font-medium font-sans">
                        <span className="font-bold font-mono">Containment Guidance:</span> {briefing.activeCampaignSpotlight.containmentGuidance}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tactical Priorities */}
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1.5">
                    Prioritized SOC & CTI Defensive Directives
                  </h4>
                  <div className="space-y-1.5">
                    {briefing.tacticalPriorities.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-800 font-medium font-sans">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Drawer Footer */}
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <button
              onClick={handleGenerateBriefing}
              disabled={isGeneratingBriefing}
              className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors font-mono shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingBriefing ? 'animate-spin' : ''}`} />
              <span>Regenerate Briefing</span>
            </button>

            <button
              onClick={() => setBriefingModalOpen(false)}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer font-mono"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

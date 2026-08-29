import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  Zap,
  Globe2,
  TrendingUp,
  AlertTriangle,
  Flame,
  Bug,
  Server,
  ArrowRight,
  ExternalLink,
  Lock,
  Rss,
  Table,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Target,
  Users,
  Compass,
  FileText,
  LayoutGrid,
  Columns3,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  TelemetryMetrics,
  IOC,
  ThreatActor,
  ThreatCampaign,
  VulnerabilityCVE,
  ThreatFeedItem,
  BehavioralAnomaly
} from '../types';
import { MiddleThreatIntelligenceBar } from './MiddleThreatIntelligenceBar';
import {
  ColumnConfig,
  ColumnRearranger,
  SectionTableConfig,
  TableSectionsRearranger
} from './TableRearranger';

interface OverviewDashboardProps {
  telemetry: TelemetryMetrics;
  recentIOCs: IOC[];
  actors: ThreatActor[];
  campaigns: ThreatCampaign[];
  cves: VulnerabilityCVE[];
  feeds: ThreatFeedItem[];
  anomalies: BehavioralAnomaly[];
  isPlainView: boolean;
  onSelectIOC: (ioc: IOC) => void;
  onSelectActor: (actor: ThreatActor) => void;
  onSelectCVE: (cve: VulnerabilityCVE) => void;
  onNavigateTab: (tab: any) => void;
}

const DEFAULT_DASHBOARD_SECTIONS: SectionTableConfig[] = [
  {
    id: 'velocity_chart',
    label: 'Global Telemetry: Incursion Velocity & Attack Trajectory',
    visible: true,
    description: 'Real-time telemetry chart of attack volumes and credential replays',
    badge: 'Chart & Metrics'
  },
  {
    id: 'campaigns_table',
    label: 'Frontline Active Campaigns & Attribution Table',
    visible: true,
    description: 'Active adversary campaigns, target sectors, and IOC counts',
    badge: 'Campaigns'
  },
  {
    id: 'cve_table',
    label: 'Weaponized 0-Day & CISA KEV Radar Table',
    visible: true,
    description: 'Active CVEs exploited in the wild with EPSS scores',
    badge: 'CVE Radar'
  },
  {
    id: 'ioc_table',
    label: 'High-Fidelity IOC Telemetry Table',
    visible: true,
    description: 'Real-time C2 IPs, domains, hashes, and threat scores',
    badge: 'IOCs'
  },
  {
    id: 'actors_table',
    label: 'Tracked Threat Actors & UNC Clusters Table',
    visible: true,
    description: 'Sovereign intelligence organs and ransomware cartels',
    badge: 'Adversaries'
  },
  {
    id: 'feeds_table',
    label: 'National Feeds & MISP Intel Portal',
    visible: true,
    description: 'Real-time intelligence from CISA, MISP, and National Advisory organs',
    badge: 'Intelligence'
  },
  {
    id: 'middle_intelligence_bar',
    label: 'Intelligence Matrix',
    visible: true,
    description: 'MITRE and SPIFFE/SPIRE Intel',
    badge: 'Matrix'
  }
];

const DEFAULT_TRIAGE_COLUMNS: ColumnConfig[] = [
  { id: 'type', label: 'Type', visible: true },
  { id: 'title', label: 'Identifier / Title', visible: true, fixed: true },
  { id: 'severity', label: 'Severity / Risk', visible: true },
  { id: 'context', label: 'Context / Attribution', visible: true },
  { id: 'timestamp', label: 'Timestamp / Score', visible: true },
  { id: 'action', label: 'Action', visible: true }
];

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  telemetry,
  recentIOCs = [],
  actors = [],
  campaigns = [],
  cves = [],
  feeds = [],
  anomalies = [],
  isPlainView = false,
  onSelectIOC,
  onSelectActor,
  onSelectCVE,
  onNavigateTab
}) => {
  const [plainFilter, setPlainFilter] = useState<'all' | 'iocs' | 'feeds' | 'anomalies' | 'cves'>('all');

  // Table Rearranging State
  const [sections, setSections] = useState<SectionTableConfig[]>(() => {
    const saved = localStorage.getItem('aegis_overview_sections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_DASHBOARD_SECTIONS;
  });
  const [isSectionsModalOpen, setIsSectionsModalOpen] = useState(false);

  // Triage Table Columns Rearranging State (Default Compact for tightly packed display)
  const [triageColumns, setTriageColumns] = useState<ColumnConfig[]>(DEFAULT_TRIAGE_COLUMNS);
  const [isTriageColumnModalOpen, setIsTriageColumnModalOpen] = useState(false);
  const [triageDensity, setTriageDensity] = useState<'compact' | 'standard' | 'spacious'>('compact');

  // SOC Telemetry Time Range
  const [telemetryTimeRange, setTelemetryTimeRange] = useState<'1h' | '6h' | '12h' | '24h' | '1mo'>('24h');

  // Sorting for Triage Table
  const [triageSortCol, setTriageSortCol] = useState<string>('timestamp');
  const [triageSortDir, setTriageSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSectionsChange = (newSections: SectionTableConfig[]) => {
    setSections(newSections);
    localStorage.setItem('aegis_overview_sections', JSON.stringify(newSections));
  };

  const handleResetSections = () => {
    setSections(DEFAULT_DASHBOARD_SECTIONS);
    localStorage.removeItem('aegis_overview_sections');
  };

  const handleTriageSort = (colId: string) => {
    if (triageSortCol === colId) {
      setTriageSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setTriageSortCol(colId);
      setTriageSortDir('desc');
    }
  };

  // Simulated Telemetry Data based on Time Range
  const getTelemetryData = () => {
    let basePoints = 6;
    let multiplier = 1;
    let label = 'hour';

    switch (telemetryTimeRange) {
      case '1h': basePoints = 12; multiplier = 0.4; label = 'min'; break;
      case '6h': basePoints = 6; multiplier = 0.8; label = 'hour'; break;
      case '12h': basePoints = 12; multiplier = 0.9; label = 'hour'; break;
      case '24h': basePoints = 6; multiplier = 1; label = 'hour'; break;
      case '1mo': basePoints = 30; multiplier = 25; label = 'day'; break;
    }

    return Array.from({ length: basePoints }).map((_, idx) => {
      const step = telemetryTimeRange === '1h' ? 5 : telemetryTimeRange === '1mo' ? 1 : 4;
      const timeLabel = telemetryTimeRange === '1mo' ? `Day ${idx + 1}` : `${idx * step}:00`;
      
      // Use index to create a pseudo-random but somewhat consistent pattern
      const vectorIndex = idx % telemetry.attackVectorBreakdown.length;
      const percentage = telemetry.attackVectorBreakdown[vectorIndex].percentage;

      return {
        time: timeLabel,
        volume: Math.round(percentage * 142 * multiplier * (0.8 + Math.random() * 0.4)),
        malware: Math.round(percentage * 86 * multiplier * (0.7 + Math.random() * 0.6))
      };
    });
  };

  // Compile combined triage items with robust fallbacks
  const combinedTriageItems = [
    ...(anomalies || []).map((a) => {
      const timeStr = a.detectedAt
        ? new Date(a.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : (a as any).timestamp || 'Just now';
      return {
        id: a.id,
        category: 'anomalies',
        typeLabel: 'Anomaly',
        title: a.title || 'Behavioral Anomaly',
        severity: a.severity || 'medium',
        context: `${a.affectedEntity || (a as any).affectedAsset || 'Asset'} (${a.category || (a as any).sourceType || 'Deviation'})`,
        timestamp: timeStr,
        raw: a,
        onAction: () => onNavigateTab('anomaly')
      };
    }),
    ...(feeds || []).map((f) => {
      let timeStr = 'Recent';
      try {
        if (f.timestamp) {
          timeStr = new Date(f.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      } catch {
        timeStr = f.timestamp || 'Recent';
      }
      return {
        id: f.id,
        category: 'feeds',
        typeLabel: 'Feed Intel',
        title: f.title || f.indicator || 'Threat Intel Feed',
        severity: f.severity || 'medium',
        context: `${f.provider || 'Feed'} | ${f.indicator || 'N/A'}`,
        timestamp: timeStr,
        raw: f,
        onAction: () => onNavigateTab('feeds')
      };
    }),
    ...(recentIOCs || []).map((ioc) => ({
      id: ioc.id,
      category: 'iocs',
      typeLabel: `IOC (${ioc.type || 'Indicator'})`,
      title: ioc.value || 'Unknown IOC',
      severity: ioc.severity || 'medium',
      context: ioc.threatActor || ioc.malwareFamily || 'Under Investigation',
      timestamp: `Risk: ${ioc.riskScore ?? 0}/100`,
      raw: ioc,
      onAction: () => onSelectIOC(ioc)
    })),
    ...(cves || []).map((c) => ({
      id: c.cveId,
      category: 'cves',
      typeLabel: 'CVE',
      title: `${c.cveId || 'CVE'}: ${c.title || 'Vulnerability'}`,
      severity: (c.cvssScore ?? 0) >= 9.0 ? 'critical' : (c.cvssScore ?? 0) >= 7.0 ? 'high' : 'medium',
      context: c.affectedProducts?.join(', ') || 'Enterprise Infrastructure',
      timestamp: `CVSS ${c.cvssScore ?? 0} / EPSS ${((c.epssScore ?? 0) * 100).toFixed(0)}%`,
      raw: c,
      onAction: () => onSelectCVE(c)
    }))
  ];

  const filteredTriageItems = combinedTriageItems
    .filter((item) => plainFilter === 'all' || item.category === plainFilter)
    .sort((a, b) => {
      let cmp = 0;
      if (triageSortCol === 'title') {
        cmp = (a.title || '').localeCompare(b.title || '');
      } else if (triageSortCol === 'type') {
        cmp = (a.typeLabel || '').localeCompare(b.typeLabel || '');
      } else if (triageSortCol === 'severity') {
        const sevRank: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
        cmp = (sevRank[a.severity] || 0) - (sevRank[b.severity] || 0);
      } else {
        cmp = (a.timestamp || '').localeCompare(b.timestamp || '');
      }
      return triageSortDir === 'asc' ? cmp : -cmp;
    });

  const getSeverityBadge = (sev: string) => {
    switch (sev?.toLowerCase()) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const triagePadding =
    triageDensity === 'compact' ? 'py-1 px-2 text-xs' : triageDensity === 'spacious' ? 'py-3 px-4' : 'py-2 px-3 text-xs';

  return (
    <div className="space-y-3 text-slate-900 font-sans">
      {/* Unified Offensive Intelligence Title Bar with Controls & KPI Partitions */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
        {/* Title & Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">
                Unified Offensive Intelligence
              </h2>
              <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 font-mono">
                Aegis Global Command & SOC Telemetry Overview
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono max-w-xl leading-relaxed">
                Continuous threat exposure management (CTEM), EPSS exploit likelihood rating,<br />
                CISA KEV correlation, and AI-directed patch verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSectionsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-[10px] font-bold border border-slate-200 shadow-2xs transition-colors cursor-pointer font-mono"
              title="Configure visible modules and dashboard section ordering"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
              <span>Dashboard Layout</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[9px] border border-indigo-200 font-mono leading-none">
                {sections.filter((s) => s.visible).length}/{sections.length}
              </span>
            </button>

            <button
              onClick={() => onNavigateTab('next-gen')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer border border-blue-500"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Blueprint</span>
            </button>
          </div>
        </div>

        {/* Aegis Threat Posture KPI Cards - 3 Partitions Integrated in Title Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 pt-2 border-t border-slate-200">
          {/* Partition 1: Threat Posture (3/12) */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Card 1: Global Threat Level */}
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 relative overflow-hidden shadow-xs group hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase tracking-widest pb-1 mb-1 border-b border-slate-200">
                <span>Threat Posture</span>
                <Radio className="w-2.5 h-2.5 text-red-600 animate-pulse" />
              </div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-base font-black text-red-600 font-mono tracking-tight">
                  {telemetry.globalThreatLevel}
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-red-950 text-red-100 border border-red-800 font-bold font-mono shadow-2xs">
                  DEFCON 2
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-[9px] text-slate-500 flex items-center gap-1 font-mono">
                  <span className="text-red-600 font-bold">+18% Velocity</span>
                </p>
                <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-100 px-1 rounded border border-slate-200">94.2% CONFIDENCE</span>
              </div>
            </div>

            {/* Card 2: Active Alerts */}
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 relative overflow-hidden shadow-xs group hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase tracking-widest pb-1 mb-1 border-b border-slate-200">
                <span>Tactical Queue</span>
                <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
              </div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-base font-black text-amber-700 font-mono">
                  {telemetry.activeAlertsCount}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">ACTIVE TRIAGE</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-[9px] text-slate-500 flex items-center gap-1 font-mono">
                  <span className="text-amber-700 font-semibold">{anomalies.length}</span> Behavioral
                </p>
                <span className="text-[8px] font-mono font-bold text-amber-600/80">HIGH FIDELITY</span>
              </div>
            </div>
          </div>

          {/* Partition 2: System Sync & Health (3/12) - THE MIDDLE PARTITION */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase tracking-widest pb-1 mb-1 border-b border-slate-200">
              <span>Intel Sync & Control Plane</span>
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            </div>
            
            <div className="grid grid-cols-3 gap-1.5 flex-1">
              <div className="flex flex-col items-center justify-center bg-slate-50/70 border border-slate-200 rounded-lg p-1.5 group hover:bg-slate-100 transition-colors">
                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase mb-0.5">Operational</span>
                <span className="text-sm font-black text-slate-900 font-mono leading-none">142<span className="text-[9px] text-slate-400 font-normal">D</span></span>
                <div className="w-full bg-slate-200 h-1 mt-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]" />
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-slate-50/70 border border-slate-200 rounded-lg p-1.5 group hover:bg-slate-100 transition-colors">
                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase mb-0.5">STIX/TAXII</span>
                <div className="flex items-center gap-1">
                  <Layers className="w-2.5 h-2.5 text-blue-600" />
                  <span className="text-[10px] font-black text-slate-900 font-mono">LIVE</span>
                </div>
                <span className="text-[8px] font-mono text-emerald-600 font-bold mt-0.5">12ms</span>
              </div>

              <div className="flex flex-col items-center justify-center bg-slate-50/70 border border-slate-200 rounded-lg p-1.5 group hover:bg-slate-100 transition-colors">
                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase mb-0.5">AI Triage</span>
                <div className="flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-600" />
                  <span className="text-[10px] font-black text-slate-900 font-mono">SYNC</span>
                </div>
                <span className="text-[8px] font-mono text-slate-500 font-bold mt-0.5">v3.6</span>
              </div>
            </div>
            
            <div className="mt-1 pt-1 border-t border-slate-200 flex items-center justify-between text-[8px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" />
                </div>
                <span>99.998% Resilience</span>
              </div>
              <span>PULSE: 0.2s</span>
            </div>
          </div>

          {/* Partition 3: Asset & Vulnerability (6/12) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* Card 3: Tracked IOCs */}
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 relative overflow-hidden shadow-xs group hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase tracking-widest pb-1 mb-1 border-b border-slate-200">
                <span>High Conf IOCs</span>
                <Server className="w-2.5 h-2.5 text-blue-600" />
              </div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-sm font-black text-slate-900 font-mono">
                  {telemetry.trackedIocsCount.toLocaleString()}
                </span>
                <span className="text-[8px] text-slate-400 font-mono uppercase">Atomic</span>
              </div>
              <div className="mt-1.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4" />
              </div>
            </div>

            {/* Card 4: Monitored Threat Actors */}
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 relative overflow-hidden shadow-xs group hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase tracking-widest pb-1 mb-1 border-b border-slate-200">
                <span>APT Dossiers</span>
                <Users className="w-2.5 h-2.5 text-purple-600" />
              </div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-sm font-black text-slate-900 font-mono">
                  {telemetry.monitoredActorsCount}
                </span>
                <span className="text-[8px] text-slate-400 font-mono uppercase">UNCs</span>
              </div>
              <div className="mt-1.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-1/2" />
              </div>
            </div>

            {/* Card 5: Weaponized CVEs */}
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 relative overflow-hidden shadow-xs group hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono font-bold uppercase tracking-widest pb-1 mb-1 border-b border-slate-200">
                <span>KEV Radar</span>
                <Bug className="w-2.5 h-2.5 text-rose-600" />
              </div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-sm font-black text-slate-900 font-mono">
                  {telemetry.weaponizedCvesCount}
                </span>
                <span className="text-[8px] text-slate-400 font-mono uppercase">Active</span>
              </div>
              <div className="mt-1.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SIMPLE PLAIN VIEW (TABULAR SPREADSHEET / DENSE LIST) */}
      {/* ========================================================================= */}
      {isPlainView ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-xs p-2.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-3.5 h-3.5 text-indigo-600" />
                <span>Aegis High-Density Plain Telemetry Triage Grid</span>
              </h2>
            </div>

            {/* Filter Tabs & Column Rearrange */}
            <div className="flex flex-wrap items-center gap-1 text-xs font-mono">
              <button
                onClick={() => setPlainFilter('all')}
                className={`px-3 py-1.5 border-b-2 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  plainFilter === 'all'
                    ? 'border-red-600 text-red-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span>All Records</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    plainFilter === 'all'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {combinedTriageItems.length}
                </span>
              </button>
              <button
                onClick={() => setPlainFilter('anomalies')}
                className={`px-3 py-1.5 border-b-2 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  plainFilter === 'anomalies'
                    ? 'border-red-600 text-red-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span>Anomalies</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    plainFilter === 'anomalies'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {anomalies.length}
                </span>
              </button>
              <button
                onClick={() => setPlainFilter('iocs')}
                className={`px-3 py-1.5 border-b-2 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  plainFilter === 'iocs'
                    ? 'border-red-600 text-red-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span>IOCs</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    plainFilter === 'iocs'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {recentIOCs.length}
                </span>
              </button>
              <button
                onClick={() => setPlainFilter('cves')}
                className={`px-3 py-1.5 border-b-2 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  plainFilter === 'cves'
                    ? 'border-red-600 text-red-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span>CVEs</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    plainFilter === 'cves'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {cves.length}
                </span>
              </button>

              <button
                onClick={() => setIsTriageColumnModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer ml-auto"
                title="Rearrange columns in triage grid"
              >
                <Columns3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Columns</span>
              </button>
            </div>
          </div>

          {/* Unified Plain Table with Dynamic Columns & Sorting */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] uppercase select-none">
                  {triageColumns
                    .filter((c) => c.visible)
                    .map((col) => {
                      const isSorted = triageSortCol === col.id;
                      return (
                        <th
                          key={col.id}
                          onClick={() => handleTriageSort(col.id)}
                          className={`${triagePadding} font-bold hover:text-slate-900 cursor-pointer transition-colors ${
                            col.id === 'action' ? 'text-right' : ''
                          }`}
                        >
                          <div className={`flex items-center gap-1 ${col.id === 'action' ? 'justify-end' : ''}`}>
                            <span>{col.label}</span>
                            {isSorted ? (
                              triageSortDir === 'asc' ? (
                                <ChevronUp className="w-3.5 h-3.5 text-indigo-600" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-40" />
                            )}
                          </div>
                        </th>
                      );
                    })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTriageItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    {triageColumns
                      .filter((c) => c.visible)
                      .map((col) => {
                        if (col.id === 'type') {
                          return (
                            <td key={col.id} className={triagePadding}>
                              <span
                                className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase ${
                                  item.category === 'anomalies'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : item.category === 'feeds'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : item.category === 'iocs'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {item.typeLabel}
                              </span>
                            </td>
                          );
                        }
                        if (col.id === 'title') {
                          return (
                            <td key={col.id} className={`${triagePadding} font-semibold text-slate-900 truncate max-w-sm`}>
                              {item.title}
                            </td>
                          );
                        }
                        if (col.id === 'severity') {
                          return (
                            <td key={col.id} className={triagePadding}>
                              <span
                                className={`px-1.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${getSeverityBadge(
                                  item.severity
                                )}`}
                              >
                                {item.severity}
                              </span>
                            </td>
                          );
                        }
                        if (col.id === 'context') {
                          return (
                            <td key={col.id} className={`${triagePadding} text-slate-600 truncate max-w-xs`}>
                              {item.context}
                            </td>
                          );
                        }
                        if (col.id === 'timestamp') {
                          return (
                            <td key={col.id} className={`${triagePadding} text-slate-500 font-mono`}>
                              {item.timestamp}
                            </td>
                          );
                        }
                        if (col.id === 'action') {
                          return (
                            <td key={col.id} className={`${triagePadding} text-right`}>
                              <button
                                onClick={item.onAction}
                                className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                              >
                                Investigate
                              </button>
                            </td>
                          );
                        }
                        return null;
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: AEGIS ADVANTAGE DYNAMIC REARRANGEABLE MODULAR DASHBOARD */
        /* ========================================================================= */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 items-start">
          {/* Left Column: Graph (3 cols), Active Frontline Campaigns & CVE Radar */}
          <div className="xl:col-span-6 space-y-2">
            {sections
              .filter((s) => s.visible && (s.id === 'velocity_chart' || s.id === 'campaigns_table' || s.id === 'cve_table'))
              .map((section) => {
                // Section 1: Incursion Velocity Area Chart
                if (section.id === 'velocity_chart') {
                  return (
                    <div
                      key={section.id}
                      className="bg-white border border-slate-200 rounded-lg p-2 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                        <div>
                          <h3 className="text-[10px] font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-widest">
                            <TrendingUp className="w-3 h-3 text-blue-600" />
                            <span>Telemetry: Global Incursion Velocity Matrix</span>
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 border-b border-slate-200">
                            {(['1h', '6h', '12h', '24h', '1mo'] as const).map((range) => (
                              <button
                                key={range}
                                onClick={() => setTelemetryTimeRange(range)}
                                className={`px-2 py-1 border-b-2 text-[9px] font-bold font-mono transition-all cursor-pointer ${
                                  telemetryTimeRange === range
                                    ? 'border-red-600 text-red-600 font-bold'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                                }`}
                              >
                                {range.toUpperCase()}
                              </button>
                            ))}
                          </div>
                          <span className="text-[8px] font-mono bg-red-50 text-red-700 px-1 py-0.5 rounded font-bold border border-red-200">
                            LIVE
                          </span>
                        </div>
                      </div>

                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={getTelemetryData()}
                            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorVolLight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                              </linearGradient>
                              <linearGradient id="colorMalLight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                            <XAxis dataKey="time" stroke="#64748B" fontSize={9} fontFamily="monospace" />
                            <YAxis stroke="#64748B" fontSize={9} fontFamily="monospace" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#FFFFFF',
                                borderColor: '#E2E8F0',
                                borderRadius: '0.5rem',
                                fontSize: '10px',
                                color: '#0F172A',
                                fontFamily: 'monospace',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="volume"
                              stroke="#EF4444"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorVolLight)"
                              name="Perimeter Incursions"
                            />
                            <Area
                              type="monotone"
                              dataKey="malware"
                              stroke="#2563EB"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorMalLight)"
                              name="Credential / Token Replays"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                }

                // Section 2: Active Frontline Campaigns (Rendered on Left Side)
                if (section.id === 'campaigns_table') {
                  return (
                    <div
                      key={section.id}
                      className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-3 animate-in fade-in duration-300"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-rose-600" />
                            <span>Active Frontline Campaigns Operations Table</span>
                          </h3>
                        </div>
                        <button
                          onClick={() => onNavigateTab('cti')}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                          CTI Matrix ({campaigns.length}) <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {(campaigns || []).slice(0, 3).map((camp) => (
                          <div
                            key={camp.id}
                            onClick={() => onNavigateTab('cti')}
                            className="bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 p-2.5 rounded-lg transition-all duration-200 cursor-pointer group shadow-2xs flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-bold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                                  {camp.title}
                                </span>
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 border ${getSeverityBadge(
                                    camp.severity
                                  )}`}
                                >
                                  {camp.severity}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1 pt-1 border-t border-slate-200">
                              <span className="text-blue-600 font-bold truncate max-w-[90px]">{camp.actorName}</span>
                              <span className="font-bold shrink-0">{camp.iocCount} IOCs</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Section 3: Weaponized CVEs / CISA KEV Radar on Left Side (Reduced size, 3 in a row)
                if (section.id === 'cve_table') {
                  return (
                    <div
                      key={section.id}
                      className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5 animate-in fade-in duration-300"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Bug className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                            <span>Weaponized 0-Day & CISA KEV Exploitation Radar</span>
                          </h3>
                        </div>
                        <button
                          onClick={() => onNavigateTab('cve')}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                          Radar ({cves.length}) <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(cves || []).slice(0, 3).map((cve) => (
                          <div
                            key={cve.cveId}
                            onClick={() => onSelectCVE(cve)}
                            className="bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 p-4 rounded-xl transition-all duration-200 cursor-pointer font-mono shadow-2xs flex flex-col justify-between group"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-[10px] font-bold text-blue-700 truncate">{cve.cveId}</span>
                                <span className="text-[8px] px-1 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded shrink-0">
                                  {cve.cvssScore.toFixed(1)}
                                </span>
                              </div>
                              <p className="text-[9px] text-slate-600 line-clamp-1 font-sans leading-tight">
                                {cve.title}
                              </p>
                            </div>
                            <div className="mt-1 pt-1 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-500">
                              <span className="text-amber-700 font-bold">EPSS: {(cve.epssScore * 100).toFixed(0)}%</span>
                              {cve.cisaKev && (
                                <span className="text-rose-700 font-bold bg-rose-50 border border-rose-200 px-1 rounded text-[7px] leading-none py-0.5">
                                  KEV
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (section.id === 'middle_intelligence_bar') {
                  return (
                    <div key={section.id} className="col-span-12">
                      <MiddleThreatIntelligenceBar />
                    </div>
                  );
                }

                return null;
              })}
          </div>

          {/* Right Column: Stacked Boxes (IOCs, Actors, Feeds) - 6 cols */}
          <div className="xl:col-span-6 space-y-2">
            {sections
              .filter((s) => s.visible && s.id !== 'velocity_chart' && s.id !== 'campaigns_table' && s.id !== 'cve_table')
              .map((section) => {
                // Section 3: High Fidelity IOC Table
                if (section.id === 'ioc_table') {
                  return (
                    <div
                      key={section.id}
                      className="bg-white border border-slate-200 rounded-lg p-2 shadow-xs space-y-2 animate-in fade-in duration-300"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5 text-blue-600" />
                            <span>High-Fidelity IOC Telemetry Table</span>
                          </h3>
                        </div>
                        <button
                          onClick={() => onNavigateTab('ioc')}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                          IOC Engine ({recentIOCs.length}) <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                        {(recentIOCs || []).slice(0, 5).map((ioc) => (
                          <div
                            key={ioc.id}
                            onClick={() => onSelectIOC(ioc)}
                            className="bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 p-2.5 rounded-lg transition-all duration-200 cursor-pointer font-mono shadow-2xs flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                  {ioc.type}
                                </span>
                                <span className="text-[9px] font-bold text-red-600">
                                  S: {ioc.riskScore}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-900 truncate block">
                                {ioc.value}
                              </span>
                            </div>
                            <div className="mt-1 pt-1 border-t border-slate-200 flex justify-between text-[9px] text-slate-400">
                              <span>{ioc.category}</span>
                              <span className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-all">Dive &rarr;</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Section 4: Threat Actors & UNCs Table
                if (section.id === 'actors_table') {
                  return (
                    <div
                      key={section.id}
                      className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-3 animate-in fade-in duration-300"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-amber-600" />
                            <span>Tracked Threat Actors & UNC Clusters Table</span>
                          </h3>
                        </div>
                        <button
                          onClick={() => onNavigateTab('actors')}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                          Dossiers ({actors.length}) <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                        {(actors || []).slice(0, 5).map((act) => (
                          <div
                            key={act.id}
                            onClick={() => onSelectActor(act)}
                            className="bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 p-2.5 rounded-lg transition-all duration-200 cursor-pointer font-mono shadow-2xs flex flex-col justify-between whitespace-normal break-words"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-bold text-slate-900">{act.name}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                  {act.originCountry}
                                </span>
                              </div>
                            </div>
                            <div className="mt-1 pt-1 border-t border-slate-200 flex justify-between text-[9px] text-slate-600 font-bold">
                              <span className="text-purple-700">{act.sophistication.charAt(0)}</span>
                              <span className="text-emerald-700">{act.activeCampaigns?.length || 2} Ops</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Section 6: National Feeds & MISP
                if (section.id === 'feeds_table') {
                return (
                  <div
                    key={section.id}
                    className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs space-y-2 animate-in fade-in duration-300"
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Rss className="w-3.5 h-3.5 text-blue-600" />
                          <span>National Feeds & MISP Intel Portal</span>
                        </h3>
                      </div>
                      <button
                        onClick={() => onNavigateTab('feeds')}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-mono font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Intel Hub ({feeds.length}) <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                      {(feeds || []).slice(0, 5).map((feed) => (
                        <div
                          key={feed.id}
                          onClick={() => onNavigateTab('feeds')}
                          className="bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 p-2 rounded-lg transition-all duration-200 cursor-pointer font-mono shadow-2xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[9px] uppercase font-bold px-1 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                {feed.provider}
                              </span>
                              <span className="text-[8px] font-bold text-slate-400">
                                {new Date(feed.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-900 line-clamp-2 leading-tight">
                              {feed.title}
                            </span>
                          </div>
                          <div className="mt-1.5 pt-1 border-t border-slate-200 flex justify-between items-center text-[9px]">
                            <span className={`font-bold px-1 rounded text-[8px] ${
                              feed.severity === 'critical' ? 'bg-red-50 text-red-700' :
                              feed.severity === 'high' ? 'bg-orange-50 text-orange-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              {feed.severity.toUpperCase()}
                            </span>
                            <span className="text-[8px] text-slate-400">Ref: {feed.id.split('-')[1]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      )}

      {/* Sections / Tables Rearranger Modal */}
      <TableSectionsRearranger
        isOpen={isSectionsModalOpen}
        onClose={() => setIsSectionsModalOpen(false)}
        sections={sections}
        onChange={handleSectionsChange}
        onReset={handleResetSections}
        viewTitle="Aegis Overview Dashboard Modules"
      />

      {/* Triage Grid Column Rearranger Modal */}
      <ColumnRearranger
        isOpen={isTriageColumnModalOpen}
        onClose={() => setIsTriageColumnModalOpen(false)}
        columns={triageColumns}
        onChange={setTriageColumns}
        onReset={() => setTriageColumns(DEFAULT_TRIAGE_COLUMNS)}
        density={triageDensity}
        onChangeDensity={setTriageDensity}
        tableName="Plain Telemetry Triage Grid"
      />
    </div>
  );
};

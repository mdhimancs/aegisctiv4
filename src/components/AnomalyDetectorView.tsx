import React, { useState } from 'react';
import {
  AlertTriangle,
  Activity,
  Zap,
  ShieldAlert,
  Search,
  Filter,
  Brain,
  Sliders,
  CheckCircle2,
  XCircle,
  Copy,
  ChevronRight,
  TrendingUp,
  Cpu,
  Globe,
  Radio,
  FileCode,
  Sparkles,
  RefreshCw,
  EyeOff
} from 'lucide-react';
import {
  BehavioralAnomaly,
  AnomalyCategory,
  AnomalyAnalysisResult,
  SeverityLevel
} from '../types';

interface AnomalyDetectorViewProps {
  anomalies: BehavioralAnomaly[];
  onUpdateAnomalyStatus: (id: string, status: BehavioralAnomaly['status']) => void;
  onRunAiEvaluation: (anomaly: BehavioralAnomaly) => Promise<AnomalyAnalysisResult | null>;
}

export const AnomalyDetectorView: React.FC<AnomalyDetectorViewProps> = ({
  anomalies,
  onUpdateAnomalyStatus,
  onRunAiEvaluation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnomaly, setSelectedAnomaly] = useState<BehavioralAnomaly | null>(anomalies[0] || null);

  // AI Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiResult, setAiResult] = useState<AnomalyAnalysisResult | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  // Threshold controls
  const [zScoreThreshold, setZScoreThreshold] = useState<number>(0.0);
  const [jitterThreshold, setJitterThreshold] = useState<number>(5.0);

  const categories: { id: AnomalyCategory; label: string; icon: any }[] = [
    { id: 'beaconing', label: 'C2 Beaconing Jitter', icon: Radio },
    { id: 'exfiltration_spike', label: 'Exfiltration Data Spike', icon: TrendingUp },
    { id: 'process_lineage', label: 'Process Lineage Rare', icon: Cpu },
    { id: 'geo_impossible_travel', label: 'Impossible Travel Jump', icon: Globe },
    { id: 'privilege_escalation', label: 'Kerberos / Priv Escalation', icon: ShieldAlert },
    { id: 'living_off_the_land', label: 'LOLBin Execution', icon: FileCode }
  ];

  const filteredAnomalies = anomalies.filter((a) => {
    const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchSev = selectedSeverity === 'all' || a.severity === selectedSeverity;
    const matchSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.affectedEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.observedDeviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.mitreTechnique.toLowerCase().includes(searchQuery.toLowerCase());
    const matchZScore = a.zScore >= zScoreThreshold;
    return matchCat && matchSev && matchSearch && matchZScore;
  });

  const handleSelectAnomaly = (anomaly: BehavioralAnomaly) => {
    setSelectedAnomaly(anomaly);
    setAiResult(null);
  };

  const handleTriggerAiAnalysis = async (anomaly: BehavioralAnomaly) => {
    setIsEvaluating(true);
    try {
      const result = await onRunAiEvaluation(anomaly);
      if (result) {
        setAiResult(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(id);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  const getStatusBadge = (status: BehavioralAnomaly['status']) => {
    switch (status) {
      case 'confirmed_threat':
        return 'bg-red-50 text-red-700 border-red-200 font-bold';
      case 'investigating':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
      case 'benign_baseline':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
      case 'suppressed':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col text-slate-900 font-sans">
      {/* Top Banner (Title Bar Only) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 font-mono mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1 font-sans">
              Unified Offensive Intelligence
            </h2>
            <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 flex items-center gap-2 font-mono">
              Aegis Behavioral Telemetry & Outlier Detection Engine
              <span className="px-1.5 py-0.2 rounded bg-red-50 border border-red-200 text-[10px] text-red-700 font-mono font-medium">
                {anomalies.filter((a) => a.status === 'investigating' || a.status === 'confirmed_threat').length} Outliers
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-center shadow-2xs">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Max Z-Score</span>
            <span className="font-bold text-indigo-700 text-xs">4.33 σ</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-center shadow-2xs">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Active Probes</span>
            <span className="font-bold text-amber-700 text-xs">6 Sensors</span>
          </div>
        </div>
      </div>

      {/* Merged Section: Filter Controls + Main Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs space-y-4">
        
        {/* Filter Controls Bar (Full Width) */}
        <div className="flex items-center justify-between w-full overflow-x-auto font-mono gap-4 border-b border-slate-200 pb-3">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 border-b-2 text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>All Categories</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] ${
                selectedCategory === 'all'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {anomalies.length}
            </span>
          </button>

          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = anomalies.filter((a) => a.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-red-600' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] ${
                    isSelected
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Severity Filter Dropdown */}
        <div className="flex items-center gap-2 pr-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 outline-none cursor-pointer focus:border-indigo-400 transition-colors"
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Anomalies List + Right Dossier & AI Evaluator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Anomaly List */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
            <span>SHOWING {filteredAnomalies.length} DETECTED OUTLIERS</span>
            <span>SORTED BY ANOMALY SCORE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1 font-mono">
            {filteredAnomalies.map((anom) => {
              const isSelected = selectedAnomaly?.id === anom.id;
              return (
                <div
                  key={anom.id}
                  onClick={() => handleSelectAnomaly(anom)}
                  className={`bg-white border rounded-lg p-1.5 transition-all cursor-pointer shadow-2xs flex flex-col justify-between h-full ${
                    isSelected
                      ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/10'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    {/* Top Row: Info & Time */}
                    <div className="flex items-start justify-between gap-0.5 overflow-hidden">
                      <div className="flex items-center gap-0.5 flex-nowrap flex-1 truncate">
                        <div className="px-1 py-0.5 rounded bg-red-50 border border-red-200 text-center flex items-center gap-0.5 shrink-0">
                          <span className="text-[8.5px] text-red-700 uppercase font-bold">Score</span>
                          <span className="text-[11px] font-black text-red-900 leading-none">{anom.anomalyScore}</span>
                        </div>
                        <span className={`px-1 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase border leading-none shrink-0 ${getSeverityBadge(anom.severity)}`}>
                          {anom.severity}
                        </span>
                        <span className={`px-1 py-0.5 rounded text-[8.5px] font-mono uppercase border leading-none shrink-0 ${getStatusBadge(anom.status)}`}>
                          {anom.status.replace('_', ' ')}
                        </span>
                        <span className="px-1 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[8.5px] font-mono font-semibold border border-indigo-200 leading-none shrink-0">
                          Z={anom.zScore.toFixed(1)}σ
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap mt-0.5 pl-1 shrink-0">
                        {new Date(anom.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3
                      className="text-[12px] font-bold text-slate-900 font-sans leading-snug truncate"
                      title={anom.title}
                    >
                      {anom.title}
                    </h3>
                  </div>

                  <div className="mt-2 flex-grow space-y-1.5 flex flex-col justify-end">
                    {/* Entity Box */}
                    <div className="bg-slate-50 border border-slate-100 rounded p-1.5 space-y-1">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-500 uppercase text-[9px]">Target:</span>
                        <span
                          className="text-[11px] font-bold text-slate-800 truncate leading-tight"
                          title={anom.affectedEntity}
                        >
                          {anom.affectedEntity}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-600 font-sans leading-relaxed break-words border-t border-slate-200 pt-1">
                        {anom.observedDeviation}
                      </div>
                    </div>

                    {/* Footer & Actions */}
                    <div className="flex flex-col gap-1.5 pt-0.5">
                      <span className="font-mono text-indigo-700 font-semibold text-[10px] break-words">
                        {anom.mitreTechnique}
                      </span>
                      <div className="flex items-center gap-1 w-full mt-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateAnomalyStatus(anom.id, 'confirmed_threat');
                          }}
                          className="flex-1 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 transition-colors text-[10.5px]"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateAnomalyStatus(anom.id, 'benign_baseline');
                          }}
                          className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 transition-colors text-[10.5px]"
                        >
                          Baseline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Anomaly Dossier & AI Evaluator */}
        <div className="lg:col-span-5 space-y-3 font-mono">
          {selectedAnomaly ? (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-3 sticky top-20 min-h-[630px]">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-red-50 border border-red-200 text-red-700 text-[10px] font-mono font-bold">
                      Score: {selectedAnomaly.anomalyScore}/100
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(selectedAnomaly.detectedAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-1 font-sans">
                    {selectedAnomaly.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleTriggerAiAnalysis(selectedAnomaly)}
                  disabled={isEvaluating}
                  className="px-2.5 py-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs border border-red-500/40 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                  <span>{isEvaluating ? 'Evaluating...' : 'Aegis AI Triage'}</span>
                </button>
              </div>

              {/* Baseline vs Observed Deviation */}
              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block mb-1">
                    Historical Baseline Normal
                  </span>
                  <p className="text-slate-700 leading-relaxed font-sans">{selectedAnomaly.baselineNorm}</p>
                </div>

                <div className="bg-red-50/50 border border-red-200 rounded-xl p-3">
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wider font-mono block mb-1">
                    Observed Anomaly Outlier
                  </span>
                  <p className="text-red-900 font-medium leading-relaxed font-sans">
                    {selectedAnomaly.observedDeviation}
                  </p>
                </div>
              </div>

              {/* Raw Telemetry Snippet */}
              {selectedAnomaly.rawTelemetrySnippet && (
                <div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono block mb-1">
                    Raw Telemetry & NetFlow Stream
                  </span>
                  <pre className="bg-slate-100 text-slate-800 p-3 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed max-h-36 border border-slate-200">
                    {selectedAnomaly.rawTelemetrySnippet}
                  </pre>
                </div>
              )}

              {/* Recommended Response */}
              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono block mb-1">
                  Aegis Threat Containment Directive
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-sans">
                  {selectedAnomaly.recommendedResponse}
                </p>
              </div>

              {/* AI Evaluation Output Pane */}
              {aiResult && (
                <div className="bg-indigo-50/40 border border-indigo-200 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-indigo-600" />
                      <span>Gemini AI Threat Triage Assessment</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        aiResult.threatStatus === 'MALICIOUS_OUTLIER'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {aiResult.threatStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {aiResult.aiExplanation}
                  </p>

                  {/* Remediation Playbook */}
                  <div className="space-y-1 font-sans">
                    <span className="text-xs font-bold text-indigo-900 uppercase font-mono">
                      Immediate Containment Steps:
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      {aiResult.remediationPlaybook.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Splunk / KQL Hunt Queries */}
                  {aiResult.investigationQueries && (
                    <div className="space-y-2 pt-2 border-t border-indigo-100">
                      <span className="text-xs font-bold text-indigo-900 uppercase font-mono block">
                        Hunting Queries (SIEM / EDR)
                      </span>

                      {aiResult.investigationQueries.kql && (
                        <div className="bg-slate-100 text-indigo-950 p-2.5 rounded-lg text-xs font-mono relative border border-slate-200">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span>KQL (Sentinel / M365 Defender)</span>
                            <button
                              onClick={() => handleCopy(aiResult.investigationQueries.kql!, 'kql')}
                              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedQuery === 'kql' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <code className="text-indigo-800">{aiResult.investigationQueries.kql}</code>
                        </div>
                      )}

                      {aiResult.investigationQueries.splunk && (
                        <div className="bg-slate-100 text-emerald-950 p-2.5 rounded-lg text-xs font-mono relative border border-slate-200">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span>SPL (Splunk Enterprise Security)</span>
                            <button
                              onClick={() => handleCopy(aiResult.investigationQueries.splunk!, 'splunk')}
                              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedQuery === 'splunk' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <code className="text-emerald-800">{aiResult.investigationQueries.splunk}</code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-mono shadow-xs">
              Select any behavioral anomaly to inspect the full baseline analysis and run AI triage.
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

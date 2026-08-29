import React, { useState } from 'react';
import {
  Bug,
  AlertOctagon,
  ShieldCheck,
  ShieldAlert,
  Search,
  ExternalLink,
  Sparkles,
  Zap,
  Activity,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { VulnerabilityCVE } from '../types';

interface CVERadarViewProps {
  cves: VulnerabilityCVE[];
  selectedCVE: VulnerabilityCVE | null;
  onSelectCVE: (cve: VulnerabilityCVE) => void;
  onAddEvaluatedCVE: (cve: VulnerabilityCVE) => void;
}

export const CVERadarView: React.FC<CVERadarViewProps> = ({
  cves,
  selectedCVE,
  onSelectCVE,
  onAddEvaluatedCVE
}) => {
  const [searchCveInput, setSearchCveInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [filterText, setFilterText] = useState('');

  const currentCVE = selectedCVE || cves[0];

  const handleEvaluateNewCVE = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCveInput.trim()) return;

    try {
      setIsEvaluating(true);
      const res = await fetch('/api/threat-intel/cve-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cveId: searchCveInput.trim() })
      });

      if (!res.ok) throw new Error('CVE evaluation failed');
      const data = await res.json();

      const newCve: VulnerabilityCVE = {
        cveId: data.cveId || searchCveInput.trim(),
        title: data.title || 'Security Vulnerability Assessment',
        cvssScore: data.cvssScore || 9.0,
        cvssVector: data.cvssVector || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        epssScore: data.epssScore || 0.85,
        epssPercentile: data.epssPercentile || 95,
        cisaKev: Boolean(data.cisaKev),
        weaponized: Boolean(data.weaponized),
        exploitedInTheWild: Boolean(data.exploitedInTheWild),
        affectedProducts: data.affectedProducts || ['Unspecified Enterprise Software'],
        threatActorsUsing: data.threatActorsUsing || ['State-Sponsored & Ransomware Affiliates'],
        patchAvailable: Boolean(data.patchAvailable ?? true),
        publishedDate: data.publishedDate || new Date().toISOString().split('T')[0],
        advisoryUrl: data.advisoryUrl || `https://nvd.nist.gov/vuln/detail/${searchCveInput.trim()}`,
        summary: data.summary || 'Detailed vulnerability summary analyzed by Gemini AI.',
        mitigationPlaybook: data.mitigationPlaybook || 'Apply latest vendor security advisory patches immediately.'
      };

      onAddEvaluatedCVE(newCve);
      onSelectCVE(newCve);
      setSearchCveInput('');
    } catch (error) {
      console.error('Failed to evaluate CVE:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const filteredCVEs = cves.filter(
    (c) =>
      !filterText ||
      c.cveId.toLowerCase().includes(filterText.toLowerCase()) ||
      c.title.toLowerCase().includes(filterText.toLowerCase()) ||
      c.threatActorsUsing.some((a) => a.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="space-y-4 text-slate-900 font-sans">
      {/* Top Search & AI CVE Evaluation Input */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Bug className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">
              Unified Offensive Intelligence
            </h2>
            <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 font-mono">
              Aegis 0-Day & CVE Weaponization Radar
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
              Tracking in-the-wild zero-day weaponization, CISA KEV catalog inclusions, and EPSS exploit probability scores
            </p>
          </div>
        </div>

        {/* Form to query any CVE via Gemini */}
        <form onSubmit={handleEvaluateNewCVE} className="flex items-center gap-1.5 w-full sm:w-auto">
          <input
            type="text"
            value={searchCveInput}
            onChange={(e) => setSearchCveInput(e.target.value)}
            placeholder="Evaluate any CVE (e.g. CVE-2024-4577)..."
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-900 placeholder-slate-400 focus:bg-slate-50 focus:outline-none focus:border-red-500 min-w-[220px]"
          />
          <button
            type="submit"
            disabled={isEvaluating || !searchCveInput.trim()}
            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs border border-red-500/40 transition-all cursor-pointer shrink-0 font-mono"
          >
            <Sparkles className={`w-3 h-3 ${isEvaluating ? 'animate-spin' : ''}`} />
            <span>{isEvaluating ? 'Evaluating...' : 'AI CVE Eval'}</span>
          </button>
        </form>
      </div>

      {/* Main Grid: Directory + Deep CVE Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: CVE List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                <span>Weaponized CVEs</span>
              </h3>
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter CVEs..."
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] text-slate-800 placeholder-slate-400 focus:bg-slate-50 focus:outline-none focus:border-red-500 w-24 font-mono"
              />
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredCVEs.map((cve) => {
                const isSelected = currentCVE?.cveId === cve.cveId;
                return (
                  <div
                    key={cve.cveId}
                    onClick={() => onSelectCVE(cve)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-50/20 border-red-500 ring-2 ring-red-500/20 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-indigo-700">
                        {cve.cveId}
                      </span>
                      <span className="px-1 py-0.2 bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] font-bold rounded">
                        CVSS {cve.cvssScore.toFixed(1)}
                      </span>
                    </div>

                    <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1 mt-0.5 font-sans">
                      {cve.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200">
                      <span className="text-amber-700 font-bold">
                        EPSS: {(cve.epssScore * 100).toFixed(1)}%
                      </span>
                      {cve.cisaKev && (
                        <span className="text-red-700 font-bold bg-red-50 border border-red-200 px-1 rounded text-[9px]">KEV</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep CVE Breakdown (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {currentCVE ? (
            <div className="space-y-3">
              {/* Header Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs sm:text-sm font-black text-indigo-700">
                        {currentCVE.cveId}
                      </span>
                      {currentCVE.cisaKev && (
                        <span className="px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200 text-[9px] font-mono font-bold uppercase">
                          CISA KEV
                        </span>
                      )}
                      {currentCVE.weaponized && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-mono font-bold uppercase">
                          Weaponized
                        </span>
                      )}
                    </div>
                    <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 mt-0.5 font-sans">
                      {currentCVE.title}
                    </h3>
                    {currentCVE.cvssVector && (
                      <div className="text-[9px] font-mono text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="font-black uppercase tracking-[0.2em] text-[8px] text-slate-400">Vector String</span>
                        <span className="font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">{currentCVE.cvssVector}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={currentCVE.advisoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[10px] text-indigo-700 hover:text-indigo-900 font-mono font-bold"
                  >
                    <span>Vendor Advisory</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Score Gauges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-slate-200 font-mono">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] uppercase text-slate-500 font-bold block leading-tight">
                      CVSS v3.1 Base
                    </span>
                    <span className="text-sm font-black text-red-700">
                      {currentCVE.cvssScore.toFixed(1)} / 10.0
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] uppercase text-slate-500 font-bold block leading-tight">
                      EPSS Exploit Prob.
                    </span>
                    <span className="text-sm font-black text-amber-700">
                      {(currentCVE.epssScore * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] uppercase text-slate-500 font-bold block leading-tight">
                      EPSS Percentile
                    </span>
                    <span className="text-sm font-black text-purple-700">
                      {currentCVE.epssPercentile}th
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] uppercase text-slate-500 font-bold block leading-tight">
                      Patch Status
                    </span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Available
                    </span>
                  </div>
                </div>

              </div>

              {/* Summary & Affected Products & SOC Playbook Grid */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs font-mono">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Left Column: Technical Assessment & Inventory (7 cols) */}
                  <div className="xl:col-span-7 space-y-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Vulnerability Technical Assessment
                      </h4>
                      <div className="text-[11px] text-indigo-950 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono whitespace-pre-wrap">
                        {currentCVE.summary}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                      {/* Affected Products */}
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Affected Software & Versions
                        </h4>
                        <div className="space-y-1">
                          {currentCVE.affectedProducts.map((prod, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[10px] text-indigo-950"
                            >
                              {prod}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Threat Actors */}
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Known Active Adversaries
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {currentCVE.threatActorsUsing.map((act, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-red-50 border border-red-100 text-[10px] font-bold text-red-700"
                            >
                              {act}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: SOC Playbook & Mitigation (5 cols) */}
                  <div className="xl:col-span-5 xl:border-l xl:border-slate-100 xl:pl-6">
                    <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Emergency Mitigation & SOC Playbook</span>
                    </h4>
                    <div className="bg-emerald-50/20 border border-emerald-100 p-3.5 rounded-lg text-[11px] text-emerald-950 whitespace-pre-wrap leading-relaxed font-sans italic">
                      {currentCVE.mitigationPlaybook}
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aegis SOC Priority</h5>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-700 uppercase">Immediate Patching Mandatory</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans leading-tight">
                        This vulnerability is weaponized and requires out-of-band remediation within 24 hours to meet compliance SLAs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-mono shadow-xs">
              Select a vulnerability to view full CVE weaponization metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

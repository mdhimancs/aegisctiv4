import { NextGenRecommendation } from '../types';

export const NEXT_GEN_RECOMMENDATIONS: NextGenRecommendation[] = [
  {
    id: 'rec-01-attack-graph',
    pillar: 'Graph & Correlation Engine',
    title: 'STIX 2.1 Entity Relationship & Attack Graph Engine',
    shortDesc: 'Multi-dimensional graph correlating Threat Actors → Campaigns → Malware → MITRE TTPs → C2 Infrastructure → Targeted Assets.',
    fullRationale: 'Traditional relational/tabular threat lists isolate indicators and obscure adversary infrastructure reuse. A full STIX 2.1 Graph engine automatically correlates newly discovered IP/domain artifacts with historic campaigns (e.g. pivoting from UNC3886 hypervisor backdoors to related fast-flux DNS nodes and infected VM hosts).',
    strategicImpact: 'Strategic Game-Changer',
    timelineQuarter: 'Q3 2026',
    status: 'Prototype Ready',
    roiMetric: 'Reduces analyst investigation & pivoting time by 74%',
    technicalComponents: [
      'STIX 2.1 JSON-LD Semantic Engine',
      'WebGL / D3 3D Force-Directed Graph Canvas',
      'Diamond Model 4-Axis Analytic Pivot',
      'Adversary Infrastructure Clustering Algorithm'
    ],
    standardsCompliance: ['OASIS STIX 2.1', 'TAXII 2.1', 'MITRE ATT&CK v15'],
    keyBenefits: [
      'Visual attack path reconstruction from initial access to data exfiltration',
      'Instant blast-radius & infrastructure overlap discovery across adversary groups',
      'One-click graph export to MISP, OpenCTI, and Maltego formats'
    ],
    interactiveFeatureKey: 'graph'
  },
  {
    id: 'rec-02-predictive-epss',
    pillar: 'Predictive RBVM & Weaponization',
    title: 'Weaponization Velocity Score & Real-Time EPSS Matrix',
    shortDesc: 'Automated exploit forecast fusing EPSS, CISA KEV, GitHub exploit PoC chatter, and Dark Web weaponization monitoring.',
    fullRationale: 'Standard CVSS severity scores fail to predict real-world exploitation in the wild (over 60% of CVSS 9.8s are never exploited, while CVSS 7.2s with active PoCs cause catastrophic ransomware outbreaks). Fusing EPSS with CISA KEV and underground chatter enables predictive vulnerability prioritization before exploits hit the enterprise perimeter.',
    strategicImpact: 'Critical',
    timelineQuarter: 'Q3 2026',
    status: 'Prototype Ready',
    roiMetric: 'Prevents 88% of zero-day exploitation exposure before patch availability',
    technicalComponents: [
      'FIRST EPSS v3 API Ingestion Client',
      'CISA Known Exploited Vulnerabilities (KEV) Webhook Sync',
      'Underground Exploit Market Crawler & Telegram Scraper',
      'Compensating Virtual Patch Generation Engine'
    ],
    standardsCompliance: ['FIRST EPSS v3', 'CISA BOD 22-01', 'NIST NVD'],
    keyBenefits: [
      'Real-time "Time-to-Weaponization" countdown for emerging zero-days',
      'Asset-correlated exploit probability matching active enterprise inventory',
      'Automated mitigation playbook dispatch to edge firewalls (WAF, IPS)'
    ],
    interactiveFeatureKey: 'epss'
  },
  {
    id: 'rec-03-darkweb-ransomware',
    pillar: 'Dark Web & Extortion Telemetry',
    title: 'Live Ransomware Extortion Blog & Stealer Log Ingestion',
    shortDesc: 'Real-time monitoring of 35+ active ransomware extortion portals, proof-of-claim auctions, and RedLine/Lumma stealer log exposure.',
    fullRationale: 'Threat intelligence must provide early warning before ransomware victims appear in the public news. Automated Tor-scraped extortion portals (LockBit, BlackCat, Akira, RansomHub, Play) provide exact victim names, negotiation deadlines, exfiltrated file samples, and ransom demands.',
    strategicImpact: 'Critical',
    timelineQuarter: 'Q4 2026',
    status: 'Prototype Ready',
    roiMetric: 'Gives 48-72 hour advance notice on supply chain & partner compromises',
    technicalComponents: [
      'Headless Tor Onion Crawler Cluster',
      'Infostealer Botnet Telemetry Ingestion (Lumma, Vidar, Redline)',
      'Victim Revenue & Sector Categorization Pipeline',
      'Data Breach & Exfiltration Proof Verifier'
    ],
    standardsCompliance: ['ISAC Threat Sharing Protocols', 'FBI Flash Alerts', 'TLP:AMBER/RED'],
    keyBenefits: [
      'Instant alert if vendor, supplier, or enterprise domain appears on ransomware leak sites',
      'Compromised credential telemetry tracking session token hijacking in real-time',
      'Historical extortion analytics tracking median ransom demands by threat group'
    ],
    interactiveFeatureKey: 'darkweb'
  },
  {
    id: 'rec-04-siem-transpiler',
    pillar: 'Detection Engineering',
    title: 'Multi-SIEM Detection Transpiler & Live Sandbox',
    shortDesc: 'Universal Sigma & YARA-L transpilation engine converting rules into Splunk SPL, Microsoft Sentinel KQL, Elastic EQL, and LogScale LQL.',
    fullRationale: 'Enterprise SOCs operate hybrid telemetry environments (e.g. Sentinel for cloud, Splunk for on-prem, Elastic for microservices). Detection engineers spend hours translating threat intelligence into heterogeneous SIEM syntax. Universal transpilation allows 1-click conversion and syntax testing.',
    strategicImpact: 'Strategic Game-Changer',
    timelineQuarter: 'Q3 2026',
    status: 'Prototype Ready',
    roiMetric: 'Accelerates threat rule deployment from days to 15 seconds',
    technicalComponents: [
      'Sigma AST (Abstract Syntax Tree) Parser',
      'Multi-Vendor Target Query Generators (SPL, KQL, EQL, LQL, AQL)',
      'Synthetic Log Replay Sandbox (Sysmon, Windows Event 4688, Linux auditd)',
      'False Positive Prediction AI Model'
    ],
    standardsCompliance: ['Sigma Standard Specification', 'YARA-L 2.0', 'OASIS OpenC2'],
    keyBenefits: [
      'Zero vendor lock-in for enterprise threat detection logic',
      'Automated testing against synthetic evasive telemetry logs',
      'Instant copy-paste syntax highlighted query blocks for SOC Tier 2/3'
    ],
    interactiveFeatureKey: 'transpiler'
  },
  {
    id: 'rec-05-geopolitical-matrix',
    pillar: 'Strategic Geopolitics & Attribution',
    title: 'State-Sponsored Nexus Matrix & Cyber-Kinetic Correlation',
    shortDesc: 'Geopolitical tension barometer mapping real-world geopolitical conflicts to surges in nation-state APT campaigns, wipers, and DDoS.',
    fullRationale: 'Modern state-sponsored cyber offensives precede and accompany geopolitical tensions (e.g. Taiwan Strait, Middle East, Baltic Sea undersea cable sabotage). Correlating diplomatic and military flashpoints with APT activation provides strategic executive foresight.',
    strategicImpact: 'High',
    timelineQuarter: 'Q4 2026',
    status: 'Prototype Ready',
    roiMetric: 'Provides proactive C-Suite and Board risk posture adjustment ahead of state attacks',
    technicalComponents: [
      'Geopolitical Conflict Event Ingestion API',
      'State-Sponsored Actor Nexus Taxonomy (PRC, RF, DPRK, IRN, etc.)',
      'Offensive Capability Index (Wiper, C2, Supply Chain, ICS/SCADA)',
      'Cross-Border Critical Infrastructure Impact Analyzer'
    ],
    standardsCompliance: ['Diamond Model of Intrusion Analysis', 'ISO/IEC 27005', 'NIS2 Directive'],
    keyBenefits: [
      'Real-time threat level mapping for regional multinational assets',
      'Predictive targeting alerts for Critical National Infrastructure (Energy, Telecom, Finance)',
      'Strategic executive threat briefings auto-generated for Board of Directors'
    ],
    interactiveFeatureKey: 'geopolitics'
  },
  {
    id: 'rec-06-warroom-3d',
    pillar: 'SOC Experience & War Room',
    title: 'SOC War Room Multi-Monitor Mode & 3D Geospatial Globe',
    shortDesc: 'Full-screen NOC/SOC video wall command preset with 3D WebGL tactical globe, trajectory arcs, and automated situational rotation.',
    fullRationale: 'Enterprise SOC command centers require persistent, hands-free situational awareness on large multi-monitor video walls. An intelligent auto-cycling mode rotates through Active Incursions, Ransomware Extortion Timers, Zero-Day Alerts, and High-Risk Anomalies.',
    strategicImpact: 'High',
    timelineQuarter: 'Q4 2026',
    status: 'Architected',
    roiMetric: 'Improves frontline situational awareness across 24/7 global follow-the-sun shifts',
    technicalComponents: [
      'Three.js / WebGL 3D Globe with Orthographic Threat Arcs',
      'Multi-Monitor Screen Splitting Protocol',
      'Automated SOC Video Wall Carousels (10s, 30s, 60s rotation)',
      'Undersea Fiber & Satellite Telemetry Overlay'
    ],
    standardsCompliance: ['WCAG 2.1 High Contrast', 'SOC 2 Type II Command Center Standards'],
    keyBenefits: [
      'Dedicated command screen designed for executive visits and real-time incident war rooms',
      'Hardware-accelerated rendering capable of displaying 100k+ concurrent global telemetry streams',
      'One-touch incident escalation broadcast across Slack, Teams, and PagerDuty'
    ],
    interactiveFeatureKey: 'warroom'
  },
  {
    id: 'rec-07-interoperability',
    pillar: 'Enterprise Interoperability & SOAR',
    title: 'Bi-Directional TAXII 2.1 & Automated SOAR Webhook Mesh',
    shortDesc: 'Turnkey integration with Palo Alto PAN-OS, Fortinet, CrowdStrike RTR, MISP, and ISAC communities with sub-second IOC dissemination.',
    fullRationale: 'Intelligence without automated enforcement leaves organizations vulnerable during the "golden hour" of adversary dwell time. Automated SOAR push triggers block malicious IPs, domains, and certificate hashes directly into perimeter firewalls and EDR agents within 500 milliseconds.',
    strategicImpact: 'Critical',
    timelineQuarter: 'Q1 2027',
    status: 'Architected',
    roiMetric: 'Reduces dwell time and containment SLA from 4.2 hours to under 30 seconds',
    technicalComponents: [
      'OASIS TAXII 2.1 High-Throughput Server / Client',
      'REST Webhook Dispatcher for Palo Alto Cortex XSOAR, Splunk SOAR, Torq',
      'EDR Quarantine API Integration (CrowdStrike, SentinelOne, Defender ATP)',
      'Automated TLP Guardrails & Sanitization Middleware'
    ],
    standardsCompliance: ['TAXII 2.1', 'OpenC2', 'STIX 2.1', 'NIST SP 800-150'],
    keyBenefits: [
      'Zero-touch active blocking across hybrid firewalls and cloud proxies',
      'Automated threat intelligence sharing with industry ISAC peers (FS-ISAC, Health-ISAC)',
      'Cryptographic provenance and digital signing of all shared threat telemetry'
    ],
    interactiveFeatureKey: 'soar'
  },
  {
    id: 'rec-08-github-repo',
    pillar: 'Repository & DevOps Governance',
    title: 'GitHub Repository Naming & Version Control Strategy',
    shortDesc: 'Optimized repository naming conventions (`aegis-threat-intel`, `aegis-threat-map`) and deployment release workflows.',
    fullRationale: 'Establishing clean repository naming and structured version control ensures seamless team collaboration, clear project scoping, and efficient GitHub Pages CI/CD automation.',
    strategicImpact: 'Strategic Game-Changer',
    timelineQuarter: 'Q3 2026',
    status: 'Prototype Ready',
    roiMetric: 'Streamlines repository discovery and CI/CD maintenance across engineering squads',
    technicalComponents: [
      'Repository Name: aegis-threat-intel or aegis-threat-map',
      'GitHub Actions Automated Pages Deployment Pipeline',
      'Branch Protection Rules & PR Review Workflows',
      'Semantic Versioning & Release Tagging Policy'
    ],
    standardsCompliance: ['GitHub Flow', 'Conventional Commits', 'Semantic Versioning 2.0.0'],
    keyBenefits: [
      'Clear, professional repository identification across GitHub ecosystem',
      'Standardized CI/CD workflow automation for static and full-stack builds',
      'Structured backup, unpublish, and update recovery procedures'
    ],
    interactiveFeatureKey: 'github'
  }
];

// Interactive Prototype Mock Data for the sandbox tabs

export interface GraphNode {
  id: string;
  label: string;
  type: 'actor' | 'campaign' | 'malware' | 'ttp' | 'infrastructure' | 'victim' | 'cve';
  severity?: 'critical' | 'high' | 'medium';
  details: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

export const SAMPLE_ATTACK_GRAPH = {
  nodes: [
    { id: 'actor-unc3886', label: 'UNC3886 (China Nexus)', type: 'actor', severity: 'critical', details: 'Elite espionage group specializing in hypervisor zero-days', x: 200, y: 150 },
    { id: 'camp-hypervisor', label: 'Op HyperVisor Steal', type: 'campaign', severity: 'critical', details: 'Targeting VMware ESXi & FortiOS appliances across EMEA & APAC', x: 400, y: 120 },
    { id: 'mal-virtualpwn', label: 'VIRTUALPWN Backdoor', type: 'malware', severity: 'critical', details: 'Kernel-level persistence tool for vSphere VM communication', x: 420, y: 260 },
    { id: 'ttp-t1059', label: 'T1059.004 Unix Shell', type: 'ttp', details: 'Executing arbitrary payloads inside guest VM memory', x: 620, y: 220 },
    { id: 'cve-2024-37085', label: 'CVE-2024-37085', type: 'cve', severity: 'critical', details: 'ESXi Active Directory Authentication Bypass zero-day', x: 230, y: 280 },
    { id: 'infra-c2', label: '185.220.101.45 (C2 Fast-Flux)', type: 'infrastructure', severity: 'high', details: 'Hosted on bulletproof AS209854, active TLS beaconing', x: 620, y: 120 },
    { id: 'vic-defense', label: 'Aerospace & Defense Corp', type: 'victim', severity: 'critical', details: 'Defense industrial base contractor in Washington DC', x: 800, y: 170 }
  ] as GraphNode[],
  edges: [
    { source: 'actor-unc3886', target: 'camp-hypervisor', relationship: 'orchestrates' },
    { source: 'actor-unc3886', target: 'cve-2024-37085', relationship: 'weaponizes' },
    { source: 'camp-hypervisor', target: 'mal-virtualpwn', relationship: 'deploys' },
    { source: 'camp-hypervisor', target: 'infra-c2', relationship: 'communicates_with' },
    { source: 'mal-virtualpwn', target: 'ttp-t1059', relationship: 'executes' },
    { source: 'infra-c2', target: 'vic-defense', relationship: 'infiltrates' },
    { source: 'cve-2024-37085', target: 'vic-defense', relationship: 'exploits' }
  ] as GraphEdge[]
};

export const SAMPLE_DARKWEB_LEAKS = [
  {
    id: 'leak-01',
    ransomwareGroup: 'LockBit 3.0',
    victimName: 'Apex Defense Technologies GmbH',
    victimCountry: 'Germany',
    victimSector: 'Defense / Aerospace',
    estimatedRevenue: '$420M',
    dataVolume: '1.4 TB Exfiltrated',
    leakCountdownHours: 18,
    status: 'Timer Active - Negotiations Stall',
    proofFiles: ['defense_cad_blueprints.7z', 'employee_clearance_list.xlsx', 'cve_exploit_db_dump.sql'],
    ransomDemand: '$3,500,000 in XMR',
    iocs: ['185.193.65.12', 'lockbit3-defense-portal.onion']
  },
  {
    id: 'leak-02',
    ransomwareGroup: 'RansomHub',
    victimName: 'Trans-Pacific Logistics Corp',
    victimCountry: 'Singapore',
    victimSector: 'Maritime & Supply Chain',
    estimatedRevenue: '$1.2B',
    dataVolume: '850 GB Exfiltrated',
    leakCountdownHours: 6,
    status: 'Imminent Dump (6h remaining)',
    proofFiles: ['port_customs_manifests_2026.pdf', 'sap_financial_ledger.db'],
    ransomDemand: '$2,000,000 in BTC',
    iocs: ['91.240.118.89', 'transpac-customs-auth.com']
  },
  {
    id: 'leak-03',
    ransomwareGroup: 'Akira',
    victimName: 'Nordic Health Systems',
    victimCountry: 'Sweden',
    victimSector: 'Healthcare & Biotech',
    estimatedRevenue: '$650M',
    dataVolume: '320 GB Exfiltrated',
    leakCountdownHours: 42,
    status: 'Initial Extortion Post',
    proofFiles: ['clinical_patient_records.tar', 'internal_audit_2025.pdf'],
    ransomDemand: '$1,800,000 in BTC',
    iocs: ['45.142.214.10', 'akira-health-leak.onion']
  },
  {
    id: 'leak-04',
    ransomwareGroup: 'Play Ransomware',
    victimName: 'Metropolitan Energy & Grid Authority',
    victimCountry: 'United States',
    victimSector: 'Energy & Utilities',
    estimatedRevenue: '$890M',
    dataVolume: '2.1 TB Exfiltrated',
    leakCountdownHours: 0,
    status: 'LEAKED - Archive Downloadable',
    proofFiles: ['scada_network_topologies.dwg', 'vpn_credentials_dump.csv'],
    ransomDemand: '$5,000,000 (Expired)',
    iocs: ['194.26.29.114', 'energy-grid-play.onion']
  }
];

export const SAMPLE_TRANSPILATION_RULES = [
  {
    id: 'rule-sig-01',
    name: 'Suspicious ESXi Hypervisor Guest Command Execution (UNC3886)',
    sigmaYaml: `title: Suspicious ESXi Guest Exec via Hypervisor Backdoor
id: b492e817-48f1-4b13-9f88-d58869a1ec09
status: production
description: Detects unauthorized vSphere API / Guest RPC calls executing commands inside guest VMs
author: Aegis CTI Research
date: 2026-08-28
references:
  - https://aegis-intel.internal/reports/UNC3886-ESXi
logsource:
  category: process_creation
  product: linux
detection:
  selection_proc:
    Image|endswith:
      - '/bin/sh'
      - '/bin/bash'
      - '/usr/libexec/openssh/sftp-server'
  selection_parent:
    ParentImage|endswith:
      - '/bin/vmx'
      - '/sbin/vpxa'
  condition: selection_proc and selection_parent
falsepositives:
  - Legitimate VMware Tools automated guest customization scripts
level: critical
tags:
  - attack.t1059.004
  - attack.t1547.010
  - adversary.unc3886`,
    transpiledQueries: {
      splunk: `index=linux_os (Image="*/bin/sh" OR Image="*/bin/bash" OR Image="*/usr/libexec/openssh/sftp-server") (ParentImage="*/bin/vmx" OR ParentImage="*/sbin/vpxa")
| stats count min(_time) as firstTime max(_time) as lastTime by host, user, Image, ParentImage, CommandLine
| eval severity="CRITICAL", actor="UNC3886"`,
      sentinelKql: `Syslog
| where ProcessName endswith "/bin/sh" or ProcessName endswith "/bin/bash" or ProcessName endswith "/usr/libexec/openssh/sftp-server"
| where ParentProcessName endswith "/bin/vmx" or ParentProcessName endswith "/sbin/vpxa"
| project TimeGenerated, Computer, ProcessName, ParentProcessName, ProcessCommandLine, Account
| extend ThreatVerdict = "UNC3886 Hypervisor Guest Execution", Severity = "High"`,
      elasticEql: `process where event.type == "start" and
  process.executable in ("*/bin/sh", "*/bin/bash", "*/usr/libexec/openssh/sftp-server") and
  process.parent.executable in ("*/bin/vmx", "*/sbin/vpxa")`,
      crowdstrikeLql: `#event_simpleName=ProcessRollup2
| ImageFileName=/\\/(bin\\/(sh|bash)|usr\\/libexec\\/openssh\\/sftp-server)$/i
| ParentImageFileName=/\\/(bin\\/vmx|sbin\\/vpxa)$/i
| table([@timestamp, aid, ComputerName, UserName, ImageFileName, ParentImageFileName, CommandLine])`,
      qradarAql: `SELECT QIDNAME(qid) as "Event Name", sourceip, destinationip, username, "Process", "Parent Process"
FROM events
WHERE ("Process" ILIKE '%/bin/sh' OR "Process" ILIKE '%/bin/bash')
  AND ("Parent Process" ILIKE '%/bin/vmx' OR "Parent Process" ILIKE '%/sbin/vpxa')
LAST 24 HOURS`
    }
  }
];

export const SAMPLE_GEOPOLITICAL_EVENTS = [
  {
    id: 'geo-01',
    region: 'Eastern Europe / Baltic Sea Corridor',
    conflictStatus: 'Heightened Cyber-Kinetic Operations',
    stateActors: ['APT28 (Fancy Bear)', 'Sandworm (GRU Unit 74455)', 'Turla (FSB)'],
    targetingSectors: ['Critical Energy Grid', 'Government Ministries', 'Railway & Port Logistics'],
    primaryOffensiveVectors: ['Industroyer2 SCADA Wiper', 'Satellite Modems (AcidRain variants)', 'BGP Route Hijacking'],
    threatLevel: 'DEFCON 1 - Active Disruption',
    riskScore: 98
  },
  {
    id: 'geo-02',
    region: 'Taiwan Strait & East Asia',
    conflictStatus: 'Persistent Strategic Espionage & Pre-Positioning',
    stateActors: ['Volt Typhoon', 'APT41 (Brass Typhoon)', 'Flax Typhoon'],
    targetingSectors: ['Semiconductor Fabrication', 'Subsea Cable Landing Stations', 'Telecommunications Backbones'],
    primaryOffensiveVectors: ['Living-off-the-Land (LotL) Binaries', 'SOHO Router Firmware Mesh C2', 'Active Directory DCSync'],
    threatLevel: 'DEFCON 2 - Strategic Pre-Positioning',
    riskScore: 94
  },
  {
    id: 'geo-03',
    region: 'Middle East & Red Sea Maritime Corridor',
    conflictStatus: 'Surge in Hacktivist DDoS & OT Wiper Campaigns',
    stateActors: ['MuddyWater (MOIS)', 'Charming Kitten (APT35)', 'CyberAv3ngers (IRGC)'],
    targetingSectors: ['Maritime Port Authorities', 'Water Treatment & PLC Utilities', 'Commercial Banking'],
    primaryOffensiveVectors: ['Unitronics PLC Default Credentials', 'Bi-Directional DNS Tunneling', 'Wiper Payloads'],
    threatLevel: 'DEFCON 2 - Rapid Probing',
    riskScore: 89
  }
];

# AEGIS Cyber Threat Intelligence (CTI) Enterprise Suite & Interactive Sandbox

AEGIS is an enterprise-grade Cyber Threat Intelligence (CTI) aggregation, STIX 2.1 graph correlation, threat hunting, and automated detection engineering platform. Designed for Security Operations Centers (SOCs), Threat Intelligence (CTI) Squads, and Incident Responders, AEGIS unifies real-time threat telemetry from global commercial and national feeds, multi-SIEM detection rule transpilation, and predictive exploit vulnerability forecasting into a responsive, high-density threat management center.

The suite elevates modern security workflows by turning passive, unstructured indicators of compromise (IOCs) into dynamic, actionable defense controls with sub-second response metrics.

---

## 💎 Value Proposition & Business Impact

The AEGIS Next-Gen Threat Intelligence Platform addresses critical gaps in legacy CTI systems by turning passive, unstructured indicators of compromise (IOCs) into dynamic, actionable defense controls. 

### 1. High-Fidelity Attack Path Contextualization (STIX 2.1)
* **The Problem:** Traditional threat feeds deliver flat, isolated indicators (IPs, hashes) without context, leading to alert fatigue and high mean-time-to-remedy (MTTR).
* **AEGIS Value:** By leveraging a native STIX 2.1 relationship graph, AEGIS maps multi-hop pathways linking **Threat Actors $\rightarrow$ Campaigns $\rightarrow$ Malware $\rightarrow$ TTPs $\rightarrow$ Infrastructure $\rightarrow$ Target Assets**. 
* **Business Outcome:** Security operations centers (SOC) can instantly pivot from a single compromised asset to trace the exact adversary infrastructure, significantly accelerating root-cause analysis and threat containment.

### 2. Standardized, Vendor-Agnostic Detection Engineering (Multi-SIEM Transpiler)
* **The Problem:** Enterprises are locked into proprietary SIEM/XDR query syntaxes (Splunk SPL, Sentinel KQL, etc.). Rewriting rules across a multi-cloud or hybrid infrastructure requires specialized, costly engineering resources and introduces syntax errors.
* **AEGIS Value:** The transpiler compiles a single vendor-neutral Sigma YAML rule into production-ready queries for **Splunk SPL, Sentinel KQL, Elastic EQL, CrowdStrike Falcon LQL, and QRadar AQL** in 1-click.
* **Business Outcome:** Slashes custom detection engineering cycles from days to seconds, prevents vendor lock-in, and ensures a unified threat-detection posture across complex, multi-vendor environments.

### 3. High-Velocity Vulnerability Prioritization (EPSS Predictor)
* **The Problem:** Patch management teams struggle to address thousands of CVEs based solely on static CVSS scores (which evaluate theoretical severity, not active exploitation).
* **AEGIS Value:** Aegis correlates CVSS 3.1, FIRST EPSS v3 probability metrics, CISA KEV (Known Exploited Vulnerability) listings, and GitHub PoC exploit velocity to forecast real-world exploitation windows.
* **Business Outcome:** Enables risk-based patching that focuses resources strictly on vulnerabilities with active exploitation in the wild. This lowers emergency patching overhead while maintaining strict SLA compliance.

### 4. Proactive Vendor & Supply-Chain Risk Monitoring (Dark Web Feed)
* **The Problem:** Organizations are blindsided when third-party software vendors or key suppliers fall victim to ransomware double-extortion campaigns.
* **AEGIS Value:** Continuous Tor onion crawling monitors over 35 active ransomware leak sites, extracting victim lists, countdown timers, exfiltration volumes, and demand levels.
* **Business Outcome:** Alerts procurement and risk management of supply-chain exposures weeks before standard news cycles or public disclosure, enabling immediate defensive segregation.

### 5. Boardroom-Ready Strategic Alignment (C-Suite Report Automation)
* **The Problem:** CISOs struggle to translate technical security telemetry into a risk-oriented business narrative for non-technical executives and board members.
* **AEGIS Value:** Automatically generates a board-ready strategic intelligence summary in clean, non-technical markdown, directly highlighting macro threat postures, business risks, material impacts, and prioritized directives.
* **Business Outcome:** Bridges the gap between technical threat-intel teams and executive stakeholders, securing fast-track budget approvals for strategic defensive remediation.

---

## 🎨 Enterprise Design Language
AEGIS features a dual-architectural visual posture:
* **Core Command Center & Live Feeds**: A high-density, dark-mode threat command layout optimized for continuous monitoring, high-contrast dashboard metrics, and rapid incident triage.
* **Next-Gen Strategy & C-Suite Suite**: A clean, high-contrast, professional light-grey workspace (`bg-slate-100`) tailored for executive briefings, tactical roadmap review, and boardroom-ready reporting.

---

## 🚀 Key Modules & Capabilities

### 1. Strategic Threat Landscape & Campaign Intelligence (CTI Dashboard)
* **Continuous Threat Exposure Management (CTEM)**: Integrated framework validating threat exposure surfaces, active organizational vulnerabilities, and risk posture trends.
* **EPSS Exploit Likelihood Rating**: Forecasting probability models that prioritize active threats based on the likelihood of real-world exploitation in the wild.
* **CISA KEV Correlation**: Intelligent lookup mechanism correlating active CVE findings against CISA’s official list of Known Exploited Vulnerabilities.
* **AI-Directed Patch Verification**: Automated agentic validation of mitigation strategies, virtual patches, and defensive controls.
* **Executive Campaign Analytics**: Comprehensive campaign tracking of ongoing advanced persistent threat (APT) operations and critical infrastructure attacks.

### 2. Unified Threat Command Center (Overview Dashboard)
* **Real-Time Threat Level Barometer**: Dynamic threat status indicators (Elevated, Critical) syncing live incident telemetry.
* **Executive Scorecards**: High-priority alert channels tracking global incident distributions, active ransomware demands, and threat actor attribution.
* **Geographical Distribution Metrics**: Live visualizers reflecting attack origins, targeted organizations, and regional risk densities.

### 3. Multi-Source National Threat Feeds Portal
* **Automated Threat Feed Ingestion**: Continuous ingestion of public, community, and national intelligence including CISA AIS, AlienVault OTX, ThreatFox, Shadowserver, URLhaus, and SANS Internet Storm Center (ISC).
* **TAXII 2.1 & STIX 2.1 Processing**: Real-time parsing and formatting of structured STIX 2.1 JSON intelligence bundles.
* **National Alert & Bulletins Bulletin**: Access to raw threat advisory bulletins with built-in playbooks, remediation playbooks, and TAXII ingestion indicators.
* **Critical Sector Exposure Mapping**: Interactive matrix tracking active threat exposure and vector densities across critical national infrastructure sectors (Energy, Financial Services, Healthcare, and Telecommunications).

### 4. MITRE ATT&CK Matrix Coverage Navigator
* **Interactive Coverage Visualizer**: Full Enterprise ATT&CK matrix mapping of advanced persistent threat (APT) techniques, sub-techniques, and active exploitation counts.
* **Contextual Mitigations**: One-click deep-dive into standard adversary procedures (e.g., T1505 Web Shells, T1190 Exploit Public-Facing Applications) linked directly to enterprise detections, detection methods, and mitigation actions.

### 5. Live Bulk IOC Enrichment Engine
* **Multipurpose Scanning Canvas**: Bulk scan and extract IPv4 addresses, domains, and cryptographic hashes (MD5, SHA-1, SHA-256) from raw security logs or emails.
* **Aggregated Threat Verification**: Cross-references parsed indicators across OTX and ThreatFox threat intelligence repositories in real-time.
* **Actionable Countermeasures**: Automatically generate network firewall blocks, host file blacklists, or domain blocks based on verified threat severity.

### 6. 0-Day & CVE Vulnerability Radar
* **Active Threat Monitoring**: Continuous monitoring of newly identified zero-day vulnerabilities and CVE records.
* **Exploitation Readiness Matrix**: Track available exploit proofs-of-concept (PoC), public exploit releases, vendor security advisory notifications, and immediate workarounds.
* **Virtual Patching Workflows**: Quickly pivot from CVE records to recommend immediate detection signatures or edge mitigation parameters.

### 7. Universal Detection Engineering Console
* **Multi-Dialect Translation Engine**: Compose and compile modular threat detection rules in universal Sigma YAML and YARA-L formats.
* **Instant Multi-SIEM Transpilation**: One-click transpiler converting abstract detection logic into production-ready syntax for Splunk SPL, Microsoft Sentinel KQL, Elastic EQL, CrowdStrike Falcon LQL, and IBM QRadar AQL.
* **AI Rule Assistant**: Built-in logic generator to auto-synthesize custom YARA files, Snort rules, or Sigma signatures from raw technical indicators.

### 8. Interactive Next-Gen Architecture & Senior Research Sandbox
An advanced sandbox engineered to validate high-impact threat research capabilities under the CTI 2.0 blueprint:
* **STIX 2.1 Attack Path Graph**: Visual, interactive force-directed relationship graph mapping multi-hop adversary pathways (**Threat Actor $\rightarrow$ Campaign $\rightarrow$ Malware $\rightarrow$ TTP $\rightarrow$ Infrastructure $\rightarrow$ Target Asset**).
* **Diamond Model Pivot Analysis**: Interactive 4-axis framework pinning Adversary, Capability, Infrastructure, and Victim details for any selected graph node.
* **Live Ransomware Extortion blog Tracker**: Real-time crawler monitoring over 35 ransomware onion sites, complete with victim names, sector exposures, exfiltrated dataset volumes, ransom demands, and live countdown timers.
* **Weaponization Velocity & EPSS Calculator**: Correlate CVSS 3.1 base scores with FIRST EPSS v3 probability models, CISA KEV status, and GitHub PoC exploit velocity to forecast real-world exploitation likelihood and emergency SLAs.
* **State-Sponsored Geopolitical Barometer**: Map global physical kinetic events to corresponding cyber-kinetic trends, including wiper deployments and critical infrastructure probing.
* **Board-Ready C-Suite Report Generator**: Seamlessly compile and download professional weekly board briefings (Markdown format, TLP:AMBER classification) translating technical telemetry into material business risks and directives.

### 9. Global Cyber Threat Map Visualizer
* **SVG Mapping Engine**: Fully interactive regional map pinpointing threat actor operations, malware clusters, and critical threat hotspots.
* **Live Attribution Cards**: On-map interactive popovers displaying active adversary campaign origins, targeted targets, and active containment alerts.

### 10. AI Incident Response Copilot Drawer
* **Built-in Security Advisor**: Chat assistant pre-loaded with threat analysis, custom signature translation, containment playbook builders, and strategic intelligence guidelines.

---

## 🛠️ Technical Stack
* **Frontend UI**: React 18+, TypeScript, Tailwind CSS, Lucide Icons, D3.js, Recharts.
* **Backend Core**: Express, Node.js, Google GenAI SDK (`@google/genai`) for secure server-side AI execution.
* **Protocols & Specifications**: STIX 2.1 / TAXII 2.1, Sigma Standard, YARA-L 2.0, MITRE ATT&CK v15, FIRST EPSS v3.

---

## 💻 Getting Started

### Prerequisites
* **Node.js** (v18+ recommended)
* **npm** or similar package manager

### Installation
1. Clone or extract the repository.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the development server (runs on port 3000):
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

### Production Build
1. Compile the static application and build the bundled Node server:
   ```bash
   npm run build
   ```
2. Launch the production application:
   ```bash
   npm run start
   ```

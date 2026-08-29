# CHANGELOG

All notable functional changes and capability updates introduced in the current publication of the **AEGIS Cyber Threat Intelligence (CTI) Enterprise Suite** are documented below.

---

## [Current Publication] - Strategic Threat Engineering & Senior Research Update

### 🚀 New Modules & Functional Capabilities

#### 1. Interactive STIX 2.1 Attack Path Graph & Graph Engine
* **Adversary Attack Chain Mapping**: Added an interactive, force-directed SVG relationship graph correlating structured intelligence entities. Threat analysts can now trace multi-hop pathways linking **Threat Actor $\rightarrow$ Campaign $\rightarrow$ Malware $\rightarrow$ TTP $\rightarrow$ C2 Infrastructure $\rightarrow$ Targeted Asset**.
* **Direct Highlighting & Inspection**: Implemented dynamic node-selection and hover highlights. Selecting a node instantly pulls up its complete intelligence profile, including origin, target sector details, active campaigns, and associated IOCs.
* **OASIS STIX 2.1 Compliance**: Fully structures all relations as native relationship schemas (e.g., *indicates*, *uses*, *targets*, *attributed-to*), mirroring production-grade graph databases.

#### 2. Diamond Model 4-Axis analytic Pivot
* **Multi-Axis Analysis Matrix**: Integrated a dynamic Diamond Model card pivot overlay. Selecting any node on the Attack Path Graph automatically constructs a 4-point structural view (1. Adversary, 2. Capability, 3. Infrastructure, 4. Victim).
* **Cross-Tab Pivot Controls**: Added immediate action hooks allowing responders to instantly pivot from a highlighted graph element to the corresponding **Threat Actor Dossier** or **IOC Enrichment Engine** in one click.

#### 3. Real-Time Dark Web & Ransomware Extortion Feed Crawler
* **Extortion blog Monitoring Simulator**: Added a live-updating ransomware blog crawler tracking active cyber extortion auctions (monitoring Akira, LockBit, RansomHub, BlackCat, and others).
* **Exfiltration Telemetry**: Displays target name, sector, country, and estimated revenue, alongside exfiltrated data volume, proof exfiltration samples, and ransom demands.
* **Active Countdown Timers**: Added countdown timers indicating exact remaining hours before confidential dataset dumps occur. Includes a fast-ingestion hook to send associated indicator IOCs straight to the **Bulk IOC Scanning Engine**.

#### 4. Universal Multi-SIEM Transpiler Integration
* **One-Click Target Compiling**: Expanded standard YARA/Sigma editing by adding a universal 1-click transpiler. Analysts can author or load detection logic and instantly compile it into production-ready queries for **Splunk SPL**, **Microsoft Sentinel KQL**, **Elastic EQL**, **CrowdStrike Falcon LQL**, and **IBM QRadar AQL**.
* **Interactive Clipboard & Copy Management**: Integrated clean copy controls for target dialects to expedite production firewall and SIEM deployment.

#### 5. Predictive Weaponization Velocity & EPSS Calculator
* **Multi-Variable Prioritization Simulator**: Designed an interactive calculation matrix that replaces static CVSS scoring with active risk modeling. Combines CVSS 3.1 base score, FIRST EPSS v3 probability, CISA KEV (Known Exploited Vulnerability) database status, and public GitHub PoC exploit velocity.
* **Time-to-Exploitation Forecasts**: Instantly predicts estimated days to in-the-wild exploitation. Automatically generates corresponding emergency SLA warnings and recommends edge mitigations (e.g., immediate WAF/IPS signature dispatch).

#### 6. Geopolitical Cyber-Kinetic Threat Barometer
* **Physical-to-Cyber Event Correlation**: Added an analytical matrix charting global physical conflict flashpoints and correlating them with corresponding cyber threat surges (such as wiper deployments, supply-chain positioning, and DDoS operations).
* **Associated APT/Vector Profiling**: Details active state-sponsored actors, targeted critical sectors, and primary offensive vectors for each conflict region.

#### 7. C-Suite Board-Ready Executive Briefing Generator
* **Automatic Summary Composition**: Added a markdown report composer that translates deep technical telemetry and threat data into concise, board-ready weekly updates (pre-classified as TLP:AMBER).
* **Markdown (.MD) File Downloader**: Fully integrated a native file-export system allowing CISOs and threat leads to export and download reports directly to local storage in one click.

---

### 🎨 Visual & Usability Enhancements

#### 1. Boardroom-Ready Light Presentation Theme
* **Theme Modernization**: Redesigned all Next-Gen Recommendations and Senior Research tabs to use a high-contrast, polished light grey scheme (`bg-slate-100` / high-contrast slate borders).
* **Optimized Auditing Legibility**: Enhances ease-of-reading for long threat briefings, graphs, and sliders in bright boardroom or administrative environments.
* **Unified Visual Language**: Combines clean slate borders, professional white container backdrops, and high-contrast charcoal typography for a polished appearance.

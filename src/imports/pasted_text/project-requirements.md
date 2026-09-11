Example assets:

Payment Server

Customer Database

Production API

Employee Identity System

Cloud Storage

Allow sorting/filtering.

7. AI RECOMMENDATIONS

Create a large section:

AI Security Recommendations

The AI should recommend practical actions.

Examples:

Enable MFA for privileged accounts

Estimated Cost: ₹4.5 L

Risk Reduction: 28%

Financial Risk Reduced: ₹31 L

Button:

View Recommendation

Patch critical vulnerabilities

Estimated Cost: ₹8 L

Risk Reduction: 21%

Financial Risk Reduced: ₹24 L

Button:

View Recommendation

Improve network segmentation

Estimated Cost: ₹15 L

Risk Reduction: 18%

Financial Risk Reduced: ₹19 L

Button:

View Recommendation

Use a small AI indicator and make this section visually important.

8. WHAT-IF SCENARIO SIMULATOR

Create a dedicated page called:

What-if Scenario Simulator

Allow the user to select:

Enable MFA
Patch critical vulnerabilities
Implement network segmentation
Increase security monitoring
Improve endpoint protection

Show two columns:

Current State

Risk Score: 72

Expected Annual Loss: ₹2.45 Cr

Financial Exposure: ₹8.7 Cr

After Investment

Risk Score: 49

Expected Annual Loss: ₹1.61 Cr

Financial Exposure: ₹5.2 Cr

Then display:

Estimated Risk Reduction: 35%

Estimated Financial Risk Reduction: ₹3.5 Cr

Investment Required: ₹25 L

Estimated ROSI: 4.2x

Add a prominent:

Run Scenario

button.

9. INVESTMENT OPTIMIZATION

Create a page called:

Security Investment Optimization

Allow the user to enter a security budget.

Example:

Available Budget: ₹1 Crore

Display recommended investments:

Security Initiative	Cost	Risk Reduction
MFA	₹15 L	18%
Vulnerability Remediation	₹25 L	24%
Network Segmentation	₹30 L	20%
EDR Improvement	₹20 L	14%
Monitoring	₹10 L	8%

Create an:

Investment vs Risk Reduction

chart.

Highlight the recommended investment combination.

10. RISK ANALYSIS PAGE

Create:

Enterprise Risk Analysis

Include:

Overall Risk Score
Likelihood of Incident
Financial Impact
Expected Annual Loss
Value at Risk
Risk Trend
Business Unit Risk
Asset Risk

Create interactive-looking charts and cards.

11. VULNERABILITY PAGE

Create:

Vulnerability Management

Show:

Total Vulnerabilities
Critical
High
Medium
Low

Create a vulnerability table with:

CVE
Asset
Severity
Exploitability
Business Criticality
Estimated Financial Impact
Recommended Action
Status

Add filters for severity and status.

12. ASSET MANAGEMENT PAGE

Create:

Asset Inventory

Show:

Total Assets
Critical Assets
Internet-facing Assets
Unprotected Assets

Table:

Asset Name
Owner
Business Unit
Type
Criticality
Risk Score
Protection Status
13. THREAT INTELLIGENCE PAGE

Create:

Threat Intelligence

Display:

Active Threats
Emerging Threats
Threat Actors
Exploited Vulnerabilities

Create a threat timeline and threat severity cards.

Do not use red/orange/green colors. Use only the provided palette with different shades and labels.

14. SECURITY CONTROLS PAGE

Create:

Security Control Effectiveness

Show controls such as:

MFA
EDR
Firewall
Network Segmentation
Backup
Encryption
Security Monitoring

For each control show:

Effectiveness: 86%

Coverage: 91%

Risk Reduction: 22%

Use progress bars based on the palette.

15. COMPLIANCE PAGE

Create:

Compliance & Framework Mapping

Include:

ISO/IEC 27001
NIST Cybersecurity Framework
CIS Controls
RBI Cyber Security Framework
SEBI Cybersecurity and Cyber Resilience Framework

Show:

Compliance percentage
Controls mapped
Missing controls
Evidence status
Last assessment
16. REPORTS PAGE

Create:

Cyber Risk Reports

Include cards:

Executive Risk Report
Vulnerability Report
Compliance Report
Investment Report
Risk Assessment Report

Add buttons:

View Report

Export PDF

17. SETTINGS PAGE

Create a professional settings interface containing:

Organization
Users
Security integrations
Notification preferences
Risk calculation settings
AI settings
Framework settings
18. AI CHAT ASSISTANT

Add a floating CyberGuard AI Assistant button.

When clicked, open a chat panel.

Example questions:

What is our highest financial cyber risk today?

Which vulnerabilities contribute most to our expected losses?

What happens if we enable MFA?

Where should we spend our next ₹50 lakh?

Show realistic AI responses based on the demo data.

19. DESIGN STYLE

Make the UI:

Professional
Modern
Minimal
Enterprise-grade
Cybersecurity focused
Data-driven
Easy to understand
Suitable for CISO and executive users

Use:

Rounded cards
Subtle borders
Clean typography
Consistent spacing
Professional icons
Clear charts
Smooth hover states
Small animations only where useful

Avoid:

Excessive gradients
Neon effects
Hacker-style graphics
Matrix backgrounds
Excessive glow
Cartoon illustrations
Fake 3D objects
Overly futuristic designs

The interface should look like a real cybersecurity SaaS product, not a gaming website.

20. IMPORTANT FUNCTIONAL REQUIREMENT

This must be a working React + TypeScript + Vite project, not just a visual mockup.

Create all required files and folders.

Use a clean structure such as:

src/
├── App.tsx
├── main.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── KPICard.tsx
│   ├── RiskChart.tsx
│   ├── RiskTable.tsx
│   └── AIAssistant.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Assets.tsx
│   ├── Vulnerabilities.tsx
│   ├── RiskAnalysis.tsx
│   ├── ThreatIntelligence.tsx
│   ├── SecurityControls.tsx
│   ├── Recommendations.tsx
│   ├── Scenarios.tsx
│   ├── Investment.tsx
│   ├── Compliance.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
└── data/
    └── mockData.ts

IMPORTANT: Every imported file must actually exist.

Do not create imports to missing files such as:

./cg/pages/CgDashboard

unless that exact file exists.

Make sure every component has the correct export default or named export matching its import.

Before finishing, check the entire project for:

Missing imports
Incorrect file paths
Incorrect capitalization
Missing components
TypeScript errors
Vite build errors

The application must run successfully with:
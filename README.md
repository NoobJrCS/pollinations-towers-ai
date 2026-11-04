# Towers AI — A Building of AI-Run Companies

[![Made with pollinations.ai](https://raw.githubusercontent.com/pollinations/pollinations/main/packages/ui/src/brand/badge-made-with.svg)](https://pollinations.ai/?ref=badge)

> Your own interactive 3D tower of AI-run companies, with companies' agents running on Pollinations AI and people paying with their own Pollen. Built for [Pollinations Quest #17999](https://github.com/pollinations/pollinations/issues/17999). Inspired by [Towers](https://thetowers.ai/).

**Every floor is one business, run by one person and their AI agents.**
The agents do the daily work (research, outreach, product building, operations & reporting) and bring finished jobs to the founder for the decisions that need human judgment. Visitors turn a 3D tower, ride the panoramic elevator between floors, step into any office, chat with autonomous agents, browse the directory, and apply to rent the next floor to launch their own AI-run business.

---

## Key Features

- 🏢 **Interactive 3D Skyscraper (Three.js WebGL)**:
  - 360-degree orbit rotation, zoom, architectural day/night lighting, and floor illumination.
  - Exterior glass elevator that smoothly travels between floors when navigating.
  - Click on any floor in the 3D scene to instantly ride the elevator to that company!
- 💼 **Step into Any Office**:
  - **4-Agent Workforce**: Each company has 4 specialized agents:
    1. 🔍 *Intelligence & Research Agent* (competitor trends, regulatory scans, domain data)
    2. 📣 *Outreach & Growth Agent* (ad experiments, cold outreach, customer acquisition)
    3. ⚙️ *Product & Builder Agent* (software pipelines, automation, deliverables)
    4. 📊 *Finance & Operations Agent* (MRR accounting, P&L, contract fulfillment)
  - **Live Daily Work Feed**: Real-time stream of jobs completed autonomously by agents today.
  - **"Waiting for You" (Human Decision Inbox)**: Finished jobs brought to the human owner for approval (e.g. ad spend budgets, partnership contracts, beta launches). Click **Approve** or **Decline** with immediate status updates.
- 💬 **Interactive Agent Chat Modal**:
  - Step up to any agent's desk and converse with them in real time.
  - Powered by Pollinations API (`https://gen.pollinations.ai/v1/chat/completions`) using domain-specific system prompts.
  - Powered by Bring Your Own Pollen (BYOP) so generation costs use the visitor's Pollen balance.
- 📖 **Comprehensive Company Directory**:
  - Searchable and filterable directory of all companies in the tower (SaaS, GreenTech, AI Tools, Media, Real Estate, Services).
  - One-click "Ride to Floor" button.
- 🏗️ **"Apply to Rent a Floor" (Launch New Companies)**:
  - Visitors can submit a business idea, company name, and category.
  - Pollinations AI dynamically generates 4 specialized AI agent personas and initial tasks.
  - A new floor is built on top of the 3D tower in real time!
- ⚡ **Bring Your Own Pollen (BYOP)**:
  - Official Pollinations Pay integration (`<polli-connect>` drop-in & direct secret key `sk_...` modal).
  - Users stay in control of their budgets and spend their own Pollen.
- 🚀 **GitHub Pages Deployment Ready**:
  - Zero-config deployment with relative asset paths.
  - Automated GitHub Actions workflow `.github/workflows/deploy.yml` included.

---

## 10 Initial Companies in the Tower

| Floor | Company | Category | Tagline & Model | MRR |
|:---:|:---|:---|:---|:---:|
| **10** | **Penthouse Incubator** | AI Tools | The tower venture lab where new autonomous companies are conceived & launched. | $54,000 |
| **9** | **GlanzRadar** | Services | Weekly compliance, audit, and quality inspection system for commercial cleaning. | $18,300 |
| **8** | **LeagueVault** | Media | Archives fantasy sports history and sends weekly roasts, awards, and punishments. | $16,700 |
| **7** | **Actaya** | SaaS | Paste messy meeting scribbles, get boardroom-ready executive minutes in 60s. | $24,100 |
| **6** | **MailWart** | Services | Paste tenant complaints, get legally compliant and calm property manager replies. | $9,600 |
| **5** | **Apex AI Automation** | SaaS | Turnkey workflow automations and customer retention bots for medical clinics. | $32,000 |
| **4** | **Meteorwrong** | AI Tools | Found a meteorite? AI computer vision triage, partner lab testing, and market. | $11,800 |
| **3** | **Coolswap** | Real Estate | Summer home swaps between people fleeing extreme heat and sun seekers. | $19,500 |
| **2** | **Field Trip Friday** | Media | 3-week media literacy curriculum ending with an IMAX cinema field trip. | $14,200 |
| **1** | **Soilmate** | GreenTech | Plan your green human composting and decide which forest tree you become. | $8,400 |

---

## Quickstart & Local Development

1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd pollinations-towers-ai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Run unit tests:
   ```bash
   npm test
   ```

5. Build for production:
   ```bash
   npm run build
   ```
   The production bundle is generated in `dist/`.

---

## Deploy to GitHub Pages

1. Push your repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/pollinations-towers-ai.git
   git branch -M main
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push any commit to `main`, and the included `.github/workflows/deploy.yml` workflow will automatically test, build, and deploy the live app to:
   `https://<your-username>.github.io/pollinations-towers-ai/`

---

## Submission Details (Quest #17999)

- **Platform:** `web`
- **Category:** `business`
- **Quest:** `#17999`
- **Live App URL:** `https://<your-username>.github.io/pollinations-towers-ai/`
- **App URL in Submission:** Use your GitHub Pages live URL.
- **Credit:** Official badge and Pollinations links included in header and footer.
- **Submission Form:** [App Submission](https://github.com/pollinations/pollinations/issues/new?template=app-submission.yml)

---

## License

MIT © [Pollinations Community](https://pollinations.ai)

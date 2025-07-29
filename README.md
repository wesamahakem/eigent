<div align="center"><a name="readme-top"></a>

[![][image-head]][eigent-site]

[![][image-seperator]][eigent-site]

### Eigent: The World's First Multi-agent Workforce to Unlock Your Exceptional Productivity

**English** · [简体中文](./README_CN.md) · [Official Site][eigent-site] · [Documents][docs-site] · [Feedback][github-issue-link]

<!-- SHIELD GROUP -->

[![][discord-shield]][discord-link]
[![][github-star]][eigent-github]
[![][social-x-shield]][social-x-link]
[![][share-linkedin-shield]][share-linkedin-link]
[![][share-reddit-shield]][share-reddit-link]
[![][sponsor-shield]][sponsor-link]

</div>

<hr/>
<br/>

**Eigent** is the world’s first **Multi-agent Workforce** desktop application, empowering you to build, manage, and deploy a custom AI workforce that can turn your most complex workflows into automated tasks. 

Built on [CAMEL-AI][camel-site]'s acclaimed open-source project, our system introduces a **Multi-Agent Workforce** that **boosts productivity** through parallel execution, customization, and privacy protection.

### ⭐ 13k GitHub Stars - 🥇 #1 GitHub Daily Trending - 🏆 #1 on GAIA

- ✅ **Zero Setup** - No technical configuration required
- ✅ **Multi-Agent Coordination** - Handle complex multi-agent workflows
- ✅ **Enterprise Feature** - SSO/Access control
- ✅ **Local Deploymen**t
- ✅ **Open Source**
- ✅ **Custom Model Support**
- ✅ **MCP Integration**

<br/>

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [🚀 Getting Started](#-getting-started)
  - [☁️ Cloud Version](#️-cloud-version)
  - [🏠 Self-Hosting (Community Edition)](#-self-hosting-community-edition)
  - [🏢 Enterprise](#-enterprise)
- [✨ Key features](#-key-features)
  - [🏭 Workforce](#-workforce)
  - [🧠 Comprehensive Model Support](#-comprehensive-model-support)
  - [🔌 MCP Tools Integration (MCP)](#-mcp-tools-integration-mcp)
  - [✋ Human-in-the-Loop](#-human-in-the-loop)
  - [👐 100% Open Source](#-100-open-source)
- [🧩 Use Cases](#-use-cases)
- [🛠️ Tech Stack](#-tech-stack)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [🌟 Staying ahead](#staying-ahead)
- [🗺️ Roadmap](#-roadmap)
- [📖 Contributing](#-contributing)
  - [Main Contributors](#main-contributors)
  - [Distinguished amabssador](#distinguished-amabssador)
- [Ecosystem](#ecosystem)
- [📄 Open Source License](#-open-source-license)
- [🌐 Community & contact](#-community--contact)

####

<br/>

</details>

## **🚀 Getting Started**

There are three ways to get started with Eigent:

### ☁️ Cloud Version

The fastest way to experience Eigent's multi-agent AI capabilities is through our cloud platform, perfect for teams and individuals who want immediate access without setup complexity. We'll host the models, APIs, and cloud storage, ensuring Eigent runs flawlessly.

- **Instant Access** - Start building multi-agent workflows in minutes.
- **Managed Infrastructure** - We handle scaling, updates, and maintenance.
- **Premium Support** - Subscribe and get priority assistance from our engineering team.

<br/>

![public-beta][image-public-beta]

[**Get started at Eigent.ai →**][eigent-site]

### 🏠 Self-Hosting (Community Edition)

For users who prefer local control, data privacy, or customization, this option is ideal for organizations requiring:

- **Data Privacy** - Keep sensitive data within your infrastructure.
- **Customization** - Modify and extend the platform to fit your needs.
- **Cost Control** - Avoid recurring cloud fees for large-scale deployments.

#### 1. Prerequisites

- Node.js and npm
- Python 3.10+ and uv

#### 2. Quick Start

```bash
git clone https://github.com/eigent-ai/Eigent-desktop.git
cd Eigent-desktop
npm install
npm run dev
```

### 🏢 Enterprise

For organizations requiring maximum security, customization, and control:

- **Commercial License** - [Check our license →](LICENSE)
- **Exclusive Features** (like SSO & custom development)
- **Scalable Enterprise Deployment**
- **Negotiated SLAs** & implementation services

📧 For further details, please contact us at [info@eigent.ai](mailto:info@eigent.ai).

## **✨ Key features**
Unlock the full potential of exceptional productivity with Eigent’s powerful features—built for seamless integration, smarter task execution, and boundless automation.

### 🏭 Workforce 
Employs a team of specialized AI agents that collaborate to solve complex tasks. Eigent dynamically breaks down tasks and activates multiple agents to work **in parallel.**

Eigent pre-defined the following agent workers:

- **Developer Agent:** Writes and executes code, runs terminal commands.
- **Search Agent:** Searches the web and extracts content.
- **Document Agent:** Creates and manages documents.
- **Multi-Modal Agent:** Processes images and audio.

<br/>

![Workforce][image-workforce]

[![Try it Now]](https://www.eigent.ai/download)

<br/>

### 🧠 Comprehensive Model Support
Deploy Eigent locally with your preferred models. 

<br/>

![Model][image-local-model]

[![Try it Now]](https://www.eigent.ai/download)

<br/>

### 🔌 MCP Tools Integration (MCP)
Eigent comes with massive built-in **Model Context Protocol (MCP)** tools (for web browsing, code execution, Notion, Google suite, Slack etc.), and also lets you **install your own tools**. Equip agents with exactly the right tools for your scenarios – even integrate internal APIs or custom functions – to enhance their capabilities.

<br/>

![MCP][image-mcp]

[![Try it Now]](https://www.eigent.ai/download)

<br/>

### ✋ Human-in-the-Loop
If a task gets stuck or encounters uncertainty, Eigent will automatically request human input. 

<br/>

![Human-in-the-loop][image-human-in-the-loop]

[![Try it Now]](https://www.eigent.ai/download)

<br/>

### 👐 100% Open Source
Eigent is completely open-sourced. You can download, inspect, and modify the code, ensuring transparency and fostering a community-driven ecosystem for multi-agent innovation.

<br/>

![Opensource][image-opensource]

[![Try it Now]](https://www.eigent.ai/download)

<br/>

## 🧩 Use Cases

### 1. CAMEL GitHub Newsletter [Replay ▶️]()
Please review the latest updates from the CAMEL GitHub repository over the past month, craft a polished newsletter summarising the key changes, and email it to my client list.

Video

### 2. Palm Springs Tennis Trip [Replay ▶️]()
I am a tennis fan and want to go see the tennis tournament in palm springs. I live in SF - please prepare a detailed itinerary with flights, hotels, things to do for 3 days - around the time semifinal/finals are happening. I like hiking, vegan food and spas. My budget is $3K. The itinerary should be a detailed timeline of time, activity, cost, other details and if applicable a link to buy tickets/make reservations etc. for the item.

### 3. AI Customer Form & Dashboard [Replay ▶️]()
We are a tech consulting firm with in-depth research on technologies in the multi-agent general intelligence field. Please create a potential customer form for us. The target companies are: – B2B American companies – In the development stage before Series B – Require AI technology empowerment – And demonstrate a progressive attitude toward adopting modern productivity software (e.g., Slack, Google Workspace, Notion, etc.) Please list at least 15 companies, clearly stating their contact information, company business introductions, addresses and other specific details. Also, create a dashboard.

### 4. Website SEO Audit Report [Replay ▶️]()
To support the launch of our new Workforce Multiagent product, please run a thorough SEO audit on our official website (https://www.camel-ai.org/) and deliver a detailed optimization report with actionable recommendations.

### 5. Q2 Financial Statement Prep [Replay ▶️]()
Please help me prepare a Q2 financial statement based on this bank transfer record, to report to investors how much we have spent.

### 6. RL Engineer Candidate Summary with Notion MCP [Replay ▶️]()
I am an HR professional looking to hire a Reinforcement Learning Algorithm Engineer. I prefer someone with relevant RL experience. Please help me organize candidate information from this notion page Applicant Tracker into a complete Excel summary table including basic information and concise summary of project experiences (focusing on key highlights and achievements). Please rank candidates based on their RL expertise and provide me with an Excel file that includes all this information in an organized format. I hope you can carefully read through each candidate's resume pdf attachments in the table in notion page Applicant Tracker one by one.

### 7. PDF to Conference Slides [Replay ▶️]()
Convert this PDF into presentation slides suitable for an academic conference. The presentation should be approximately 15 minutes long and must include all key points.

### 8. OWL Webpage Creation with Figma MCP [Replay ▶️]()
Please create a new webpage styled after (https://www.camel-ai.org/) to introduce OWL (https://github.com/camel-ai/owl). Start by generating a Figma-editable file and replace its content to showcase our product. Then, develop and deploy the webpage based on this design.

### 9. Blender 3D Modeling with Blender MCP [Replay ▶️]()
Based on this image, help me model in Blender.

### 10. H1B1 Visa Application with local files [Replay ▶️]()
I'm currently applying for a U.S. H1B1 visa. Please help me locate the necessary application documents on my computer, organize them into a single folder, and finally assist me in filling out the H1B1 visa application form.

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI
- **Package Manager:** uv
- **Async Server:** Uvicorn
- **Authentication:** OAuth 2.0,  Passlib.
- **Multi-agent framework:** CAMEL
    
### Frontend

- **Framework:** React
- **Desktop App Framework:** Electron
- **Language:** TypeScript
- **UI:** Tailwind CSS, Radix UI, Lucide React, Framer Motion
- **State Management:** Zustand
- **Flow Editor:** React Flow

## 🌟 Staying ahead

> \[!IMPORTANT]
>
> **Star Eigent**, You will receive all release notifications from GitHub without any delay \~ ⭐️

![][image-star-us]

### 🗺️ Roadmap

<table>
<tr>
<td width="50%" valign="top">

**Context Engineering** [**Join our slack channel →**: https://camel-ai.slack.com/archives/C097Q1QL98C]

- prompt caching
- system prompt optimize
- toolkit docstring optimize
- context compression

**Multi-modal Enhancement** [**Join our slack channel →**: https://camel-ai.slack.com/archives/C097Q7RT0EQ]

- more accurate image understanding when using browser
- advanced video generation

**Multi-agent system** [**Join our slack channel →**: https://camel-ai.slack.com/archives/C098BJV0KR6]

- workforce support fixed workflow
- workforce support multi-round conversion

</td>
<td width="50%" valign="top">

**Browser Toolkit** [**Join our slack channel →**: https://camel-ai.slack.com/archives/C0977N3C87R]

- forbid repeated page visiting
- automatic cache button clicking

**Document Toolkit** [**Join our slack channel →**: https://camel-ai.slack.com/archives/C0983CP7AHX]

- support dynamic file editing

**Terminal Toolkit** [**Join our slack channel →**: https://camel-ai.slack.com/archives/C097L9D7LDU]

- Terminal Bench integration

**Environment & RL** [**Join our slack channel →**: https://camel-ai.slack.com/archives/C097Q91K1EG]

- Verl integration

</td>
</tr>
</table>

## 📖 Contributing

We welcome contributions! For those who’d like to contribute code, Please see our Contributing Guide for details.

### Main Contributors
| Name             | GitHub Profile                                   |
| ---------------- | ------------------------------------------------ |
| Wendong Fan      | [Wendong-Fan](https://github.com/Wendong-Fan)     |
| Puzhen Zhang     | [nitpicker55555](https://github.com/nitpicker55555) |
| Wei Li           | [luoyou](https://github.com/luoyou)       |
| Wei Sun          | [FooFindBar](https://github.com/FooFindBar)               |
| Tao Sun          | [fengju0213](https://github.com/fengju0213)       |
| Chuan He         | [weer0026](https://github.com/weer0026)           |
| Xiaotian Jin     | [MuggleJinx](https://github.com/MuggleJinx)       |
| Yifeng Wang      | [zjrwtx](https://github.com/zjrwtx)               |
| Weijie Bai <span style="color:#888888">(product manager)</span>       | [Pakchoioioi](https://github.com/Pakchoioioi)     |
| Douglas Lai <span style="color:#888888">(product designer)</span>      | [Douglasymlai](https://github.com/Douglasymlai)   |



At the same time, please consider supporting Eigent by sharing it on social media and at events and conferences. See our ambassador program. [Join our Ambassador Program: Finding the Scaling Laws of Agents][ambassador-link]

[![][image-ambassador]][ambassador-link]

### Distinguished amabssador

| Name             | GitHub Profile                                   |
| ---------------- | ------------------------------------------------ |
| Parth Sharma     | [parthshr370](https://github.com/parthshr370)     |
| Jino Rohit       | [jino-rohit](https://github.com/jino-rohit)       |
| Bipul Sharma     | [Bipul70701](https://github.com/Bipul70701)       |
| Tushar Singh     | [tushar80rt](https://github.com/tushar80rt)       |
| Harshit Sharma   | [Harsh1tSh](https://github.com/Harsh1tSh)         |
| Divyansh Goyal   | [divital-coder](https://github.com/divital-coder) |

## Ecosystem


[![Sglang](https://img.shields.io/badge/SGLang-FF6B6B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMjIgMjJIMkwxMiAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+)](https://github.com/sgl-project/sglang)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Qwen](https://img.shields.io/badge/Qwen-FF6B35?style=for-the-badge&logo=alibaba-cloud&logoColor=white)](https://qwenlm.github.io/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gemini.google.com/)
[![Azure](https://img.shields.io/badge/Microsoft_Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)


## **📄 Open Source License**

This repository is licensed under the [**Eigent Open Source License**](LICENSE), based on Apache 2.0 with additional conditions.

## 🌐 Community & contact

- GitHub Discussion | [Explreo More →](https://github.com/eigent-ai/Eigent-desktop/discussions)
- GitHub Issues | [Contribute →][github-issue-link]
- X (Twitter) | [Follow Us →][social-x-link]
- Discord | [Seek Support →][discord-link]
- Wechat <br/>
![Wechat][image-wechat]


<!-- LINK GROUP -->

[discord-link]: https://discord.camel-ai.org
[discord-shield]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=gray&logo=discord&logoColor=white&style=plastic


[eigent-github]: https://github.com/eigent-ai/Eigent-desktop
[github-star]: https://img.shields.io/github/stars/eigent-ai?color=F5F4F0&labelColor=gray&style=plastic&logo=github

[social-x-link]: https://x.com/Eigent-AI
[social-x-shield]: https://img.shields.io/badge/-%40Eigent_AI-white?labelColor=gray&logo=x&logoColor=white&style=plastic

[sponsor-link]: https://github.com/sponsors/eigent-ai
[sponsor-shield]: https://img.shields.io/badge/-Sponsor%20Eigent-1d1d1d?logo=github&logoColor=white&style=plastic

[share-linkedin-link]: https://www.linkedin.com/company/eigent-ai/
[share-linkedin-shield]: https://img.shields.io/badge/-Share%20on%20linkedin-blue?labelColor=gray&logo=linkedin&logoColor=white&style=plastic

[share-reddit-link]: https://www.reddit.com/r/CamelAI/comments/1m7oa2n/launch_countdown_of_our_first_ever_agent_product/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
[share-reddit-shield]: https://img.shields.io/badge/-Share%20on%20reddit-red?labelColor=gray&logo=reddit&logoColor=white&style=flat-plastic


[camel-site]: https://www.camel-ai.org
[eigent-site]: https://www.eigent.ai
[docs-site]: https://docs.eigent.ai
[github-issue-link]: https://github.com/eigent-ai/Eigent-desktop/issues
[ambassador-link]:https://www.camel-ai.org/ambassador 


[Try it Now]: https://img.shields.io/badge/-TRY_IT_NOW-363AF5?style=plastic

[image-seperator]: https://eigent-ai.github.io/.github/assets/seperator.png 
[image-head]: https://eigent-ai.github.io/.github/assets/head.png 
[image-overview]: https://eigent-ai.github.io/.github/assets/overview.png
[image-public-beta]: https://eigent-ai.github.io/.github/assets/banner.png
[image-ecosystem]: https://eigent-ai.github.io/.github/assets/ecosystem.png
[image-star-us]: https://eigent-ai.github.io/.github/assets/star-us.gif

[image-workforce]: https://eigent-ai.github.io/.github/assets/feature_dynamic_workforce.gif
[image-human-in-the-loop]: https://eigent-ai.github.io/.github/assets/feature_human_in_the_loop.gif
[image-add-worker]: https://eigent-ai.github.io/.github/assets/feature_add_worker.gif
[image-mcp]: https://eigent-ai.github.io/.github/assets/feature_add_mcp.gif
[image-local-model]: https://eigent-ai.github.io/.github/assets/feature_local_model.gif
[image-opensource]: https://eigent-ai.github.io/.github/assets/opensource.png
[image-wechat]: https://eigent-ai.github.io/.github/assets/wechat.png
[image-ambassador]: https://eigent-ai.github.io/.github/assets/ambassador-program.png
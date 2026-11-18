import type { CapabilityCopy } from "./types";

export const capabilityCopyB: CapabilityCopy[] = [
  // ---------------------------------------------------------------------
  // AI and Data
  // ---------------------------------------------------------------------
  {
    pillar: "ai-data",
    slug: "generative-ai-and-agents",
    lead: "Your team answers the same questions all day, and the AI pilots you have tried so far give answers you cannot put in front of customers.",
    why: "Language models are now good at reading a question, finding the relevant passage in your own material and writing a clear reply. They are less dependable when asked to recall facts unaided, to do arithmetic, or to take actions without checks. The value comes from building around those limits: grounding answers in your approved content, restricting what the system is allowed to do, testing it against real conversations, and passing the conversation to a person when it is unsure. Done this way, routine enquiries are handled quickly at any hour and your staff spend their time on the cases that need judgement.",
    services: {
      "AI chatbots for websites and messaging": {
        text: "A chat assistant for your website or messaging channels that answers from your own content, such as product pages, policies and help articles. It suits organisations with a steady flow of repeat questions and a support or sales team that is stretched. The assistant says when it does not know and hands over to a person with the conversation attached.",
        deliverables: [
          "Chat assistant deployed on your site and chosen messaging channels",
          "Knowledge base connected to your approved content",
          "Handover flow to your team, with conversation history",
          "Test set of real questions with recorded results",
        ],
      },
      "Voice agents": {
        text: "A voice agent that answers or places calls for defined tasks such as booking, order status, reminders and first-line qualification. Voice is harder than text: accents, noise and interruptions all affect accuracy. We keep the scope narrow, disclose to callers that they are speaking with an automated agent, and transfer to a person whenever the caller asks or the agent is unsure.",
        deliverables: [
          "Voice agent connected to your telephony number",
          "Call scripts and escalation rules agreed with your team",
          "Call transcripts and outcome log",
          "Integration with your booking or CRM system",
        ],
      },
      "AI agents for enquiries and support": {
        text: "An agent that does more than answer. It looks up an order, raises a ticket, updates a record or drafts a reply for a member of staff to approve. It suits support and operations teams with clear procedures and systems that expose an API. Each action the agent can take is defined in advance, logged, and limited by the permissions you set.",
        deliverables: [
          "Agent with a defined set of permitted actions",
          "Integrations with your helpdesk, CRM or order system",
          "Approval steps for actions that carry risk",
          "Audit log and review dashboard",
        ],
      },
      "AI features in existing software": {
        text: "AI functions added to a product you already run, such as summarising records, drafting text, natural language search or classifying incoming items. It suits product teams that want a useful feature without rebuilding the application. We work in your codebase, follow your release process, and build an evaluation set so quality can be checked before each release.",
        deliverables: [
          "Feature built and merged into your codebase",
          "Evaluation set and quality report",
          "Usage and cost monitoring",
          "Technical documentation for your engineers",
        ],
      },
    },
    technologies: [
      "Python",
      "TypeScript",
      "LangChain",
      "LlamaIndex",
      "OpenAI API",
      "Anthropic API",
      "Amazon Bedrock",
      "Azure OpenAI",
      "PostgreSQL with pgvector",
      "Twilio",
    ],
    faqs: [
      {
        q: "How do you stop the assistant from giving wrong answers?",
        a: "We cannot remove errors entirely, and no one can. We reduce them by restricting answers to your approved content, instructing the system to decline when the content does not cover a question, and testing against a set of real questions before launch. Anything involving money, health, legal matters or account changes is routed to a person or requires approval.",
      },
      {
        q: "Is our data used to train the AI model?",
        a: "We use the business and API offerings of model providers, whose published terms state that customer data is not used for training by default. We confirm the current terms with you before we start and can deploy within your own cloud account if you need tighter control. We also agree which data may be sent to a model and which must be masked or kept out.",
      },
      {
        q: "Which model will you use, and are we locked in to it?",
        a: "We choose after testing candidate models on your own questions, weighing accuracy, speed, cost and where data is processed. The application is built so the model can be changed without rewriting the rest. The prompts, test sets and code belong to you.",
      },
      {
        q: "What does it cost to run after launch?",
        a: "Running cost depends mainly on conversation volume, the length of each exchange and the model chosen. Voice adds telephony and speech charges. We estimate this during scoping using your expected volumes and set up monitoring so you see actual usage and spend.",
      },
      {
        q: "How do we know it is working?",
        a: "We agree measures before the build, such as the share of enquiries resolved without a person, the accuracy of answers on a reviewed sample, and the rate of handover. After launch we review transcripts with your team at regular intervals and correct the content or instructions where answers fall short.",
      },
    ],
  },
  {
    pillar: "ai-data",
    slug: "automation",
    lead: "Skilled people in your organisation spend hours copying data between systems, chasing approvals and typing up documents.",
    why: "Manual hand-offs are slow, and they are where errors and delays enter a process. Most of them follow rules that can be written down, which means software can do them. Automation pays back where the volume is steady and the steps are stable: the work is completed sooner, each step is recorded, and staff are freed for tasks that need judgement. It does not suit every process. A process that is poorly defined should be simplified first, and exceptions still need a person, so we design a review queue into every automation we build.",
    services: {
      "Workflow and office automation": {
        text: "We connect the systems your teams already use so that routine steps happen without someone doing them by hand. Typical examples are approvals, onboarding, invoice routing, report preparation and notifications. It suits operations, finance and HR teams whose work crosses several tools.",
        deliverables: [
          "Process map with the steps chosen for automation",
          "Working automations connected to your systems",
          "Error alerts and an exception queue for staff",
          "Runbook and training for the process owners",
        ],
      },
      "Document reading and data entry automation": {
        text: "Software that reads invoices, forms, contracts, identity documents and similar files, extracts the fields you need and enters them into your systems. Extraction on clean, typed documents is reliable; handwriting, poor scans and unusual layouts are less so. Each field is given a confidence score, and anything below the threshold you set goes to a person to check.",
        deliverables: [
          "Extraction pipeline for your document types",
          "Review screen for low-confidence fields",
          "Integration with your ERP, CRM or accounting system",
          "Accuracy report on a sample of your documents",
        ],
      },
    },
    technologies: [
      "Python",
      "n8n",
      "Zapier",
      "Make",
      "Microsoft Power Automate",
      "UiPath",
      "Azure AI Document Intelligence",
      "Amazon Textract",
      "Google Document AI",
    ],
    faqs: [
      {
        q: "Which of our processes should we automate first?",
        a: "Start with a process that is frequent, follows clear rules and has an owner who wants it fixed. We review candidate processes with your team and rank them by effort and benefit. We will say so if a process needs to be simplified before it is worth automating.",
      },
      {
        q: "Do we need to replace our current software?",
        a: "Usually not. We connect to existing systems through their APIs where these exist, and use interface automation only where there is no other route. If a system cannot be integrated safely, we tell you during scoping.",
      },
      {
        q: "How accurate is document extraction?",
        a: "It depends on the quality and variety of your documents, so we measure it on a sample of your own files before committing to a design. We report accuracy field by field and set thresholds with you. Documents that fall below the threshold are checked by a person, not passed through.",
      },
      {
        q: "What happens when an automation fails or a system changes?",
        a: "Every automation has logging, alerts and a defined fallback so that work is held in a queue and not lost. Changes to connected systems are the most common cause of failure, so we recommend a maintenance arrangement. The runbook explains how your team can pause, rerun or bypass a workflow.",
      },
      {
        q: "Who owns the automations, and can our team change them?",
        a: "You own them, along with the accounts they run in. Where it suits your team we build on low-code platforms that your own staff can edit, and we document each workflow. We train the people who will look after them.",
      },
    ],
  },
  {
    pillar: "ai-data",
    slug: "machine-learning",
    lead: "You hold years of data and suspect it could predict demand, flag risk or personalise what customers see, but nothing has reached production.",
    why: "A model earns its place when it improves a decision that is made often: what to stock, which case to review, which item to show. Most of the effort is not in the algorithm. It is in framing the question, checking that the data can answer it, and running the model reliably inside the systems where the decision is made. We begin with a feasibility check against a simple baseline. If a rule or an off-the-shelf service does the job, we say so, because a custom model brings a continuing cost in monitoring and retraining.",
    services: {
      "Custom machine learning models": {
        text: "Models trained on your data for tasks such as forecasting, scoring, classification and anomaly detection. It suits organisations with enough history on the outcome they want to predict and a clear decision the prediction will inform. We report performance on data the model has not seen, including where it performs poorly.",
        deliverables: [
          "Feasibility report with baseline comparison",
          "Trained model with evaluation results",
          "Deployed prediction service or batch job",
          "Monitoring and retraining procedure",
        ],
      },
      "Computer vision": {
        text: "Systems that read images or video to inspect products, count items, read text and labels, or detect events. Accuracy depends heavily on lighting, camera position and how varied the scenes are, so we test with footage from the real setting. Where a wrong result is costly, the system flags uncertain cases for a person to check.",
        deliverables: [
          "Labelled dataset and labelling guidelines",
          "Trained vision model with accuracy report",
          "Application or API running on cloud or edge hardware",
          "Review workflow for uncertain cases",
        ],
      },
      "Recommendation and search": {
        text: "Search that understands what users mean and recommendations based on behaviour and content. It suits online stores, marketplaces, media platforms and any product with a large catalogue. We measure changes with controlled tests against your current system, not offline scores alone.",
        deliverables: [
          "Search or recommendation service integrated with your product",
          "Relevance evaluation set",
          "A/B test plan and results report",
          "Controls for merchandising and business rules",
        ],
      },
    },
    technologies: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "XGBoost",
      "OpenCV",
      "MLflow",
      "Amazon SageMaker",
      "Google Vertex AI",
      "Elasticsearch",
    ],
    faqs: [
      {
        q: "How much data do we need?",
        a: "It depends on the problem, the number of examples of the outcome you want to predict, and how clean the records are. We answer this with a short feasibility study on your data before any larger commitment. If the data is not sufficient, we explain what would need to be collected.",
      },
      {
        q: "Who owns the trained model?",
        a: "You do. The model, the training code, the processed datasets and the documentation are handed over to you. Open-source libraries used in the work remain under their own licences, which we list.",
      },
      {
        q: "How is our data handled during the project?",
        a: "We prefer to work inside your cloud environment so the data does not leave it. Access is limited to the people on the project, and personal data is removed or masked where the task allows. We agree the handling rules in writing before any data is shared.",
      },
      {
        q: "What happens to accuracy after launch?",
        a: "Models degrade as customer behaviour, products and conditions change. We set up monitoring that compares predictions with actual outcomes and alerts when performance drops. Retraining can be scheduled, and your team or ours can run it using the documented procedure.",
      },
      {
        q: "Can you explain why the model made a particular decision?",
        a: "For most tabular models we can show which inputs influenced a prediction, and we can favour simpler, more interpretable models where regulation or trust requires it. For deep learning models the explanations are more limited. We discuss this trade-off with you when choosing the approach.",
      },
    ],
  },
  {
    pillar: "ai-data",
    slug: "data-and-analytics",
    lead: "Every department reports a different number for the same thing, and getting an answer means waiting for someone to build a spreadsheet.",
    why: "Decisions are slower and weaker when people do not trust the figures in front of them. The cause is rarely the dashboard tool. It is data scattered across systems, definitions that differ between teams, and tracking that was never set up properly. Fixing the foundations gives you one agreed set of numbers, refreshed automatically, that people can explore themselves. It is also the groundwork for any later machine learning or AI project, which depends on the same clean, well-described data.",
    services: {
      "Business dashboards and reports": {
        text: "Dashboards for sales, finance, operations and management that draw from your live systems. We start by agreeing the decisions each report must support and the exact definition of every metric. It suits teams that currently assemble reports by hand.",
        deliverables: [
          "Metric definitions agreed with stakeholders",
          "Dashboards in your chosen BI tool",
          "Scheduled reports and alerts",
          "Training session and user guide",
        ],
      },
      "Data warehouse and pipelines": {
        text: "A central store for your data, with pipelines that bring in records from your applications, clean them and model them for analysis. It suits organisations that have outgrown reporting straight from operational databases or spreadsheets. Pipelines are tested and monitored so failures are noticed before a report goes out wrong.",
        deliverables: [
          "Data warehouse in your cloud account",
          "Automated, tested pipelines from your source systems",
          "Documented data model",
          "Data quality checks and failure alerts",
        ],
      },
      "Website and marketing analytics setup": {
        text: "Correct tracking of what visitors do on your website and app, and which channels bring them. We define the events that matter, implement them through a tag manager, handle consent, and verify that the numbers match your back-end records. It suits marketing teams who doubt their current reports.",
        deliverables: [
          "Measurement plan listing events and conversions",
          "Configured analytics and tag manager accounts",
          "Consent mode and privacy settings",
          "Validation report comparing analytics with source data",
        ],
      },
      "Data migration and clean-up": {
        text: "Moving data from an old system to a new one, or repairing data that has become unreliable through duplicates, missing fields and inconsistent formats. We map every field, run trial migrations, and reconcile the results against the source before cutover. It suits organisations replacing an ERP, CRM or legacy database.",
        deliverables: [
          "Field mapping and transformation rules",
          "Cleaned and deduplicated dataset",
          "Trial migration and reconciliation report",
          "Cutover plan with rollback steps",
        ],
      },
    },
    technologies: [
      "SQL",
      "Python",
      "dbt",
      "Apache Airflow",
      "Snowflake",
      "Google BigQuery",
      "Amazon Redshift",
      "Power BI",
      "Looker Studio",
      "Google Analytics",
    ],
    faqs: [
      {
        q: "We already have a BI tool. Do we need to change it?",
        a: "No. We work with the tool your team already knows unless there is a clear reason to move. In most cases the problem lies in the data feeding the tool, and that is where we concentrate.",
      },
      {
        q: "Where will our data be stored, and who can see it?",
        a: "In a warehouse within your own cloud account, in the region you choose. We set up role-based access so that people see only what their job requires, and sensitive fields can be masked. Our access is granted by you and can be removed at any time.",
      },
      {
        q: "How do you deal with teams that define a metric differently?",
        a: "We document each competing definition, show the difference in the numbers, and run a session with the owners to agree one. The agreed definition is written into the data model so that every report uses it. Where two definitions are both needed, they are given distinct names.",
      },
      {
        q: "Can our analysts maintain this after you finish?",
        a: "Yes, and we build with that aim. The pipelines and models are kept in version control with documentation, and we use widely adopted tools so skills are easy to find. We run a handover with your team and can stay on for support if you want it.",
      },
      {
        q: "What drives the cost of a data project?",
        a: "The number of source systems, the condition of the data, the volume, and how many reports are needed. We scope after a short review of your sources so the estimate reflects what is there. Cloud running costs are separate and are paid by you directly to the provider.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Cloud and Security
  // ---------------------------------------------------------------------
  {
    pillar: "cloud-security",
    slug: "cloud",
    lead: "Your infrastructure has grown piece by piece, the bill keeps rising, and nobody is sure what would happen if a server failed tonight.",
    why: "Infrastructure that was assembled under deadline pressure tends to be costly, slow to change and dependent on one or two people who remember how it works. Putting it in order gives you an environment that is described in code, sized to actual demand, monitored, and recoverable from backup. The practical effect is fewer outages, quicker recovery when one happens, and a bill you can explain line by line. It also makes every later change, from a new feature to a security review, cheaper to carry out.",
    services: {
      "Cloud setup and migration": {
        text: "We design a cloud environment and move your applications and data into it from on-premises servers, shared hosting or another provider. It suits organisations that are outgrowing their hosting or want to leave ageing hardware. The migration is rehearsed first, and cutover is planned around your quiet periods with a tested way back.",
        deliverables: [
          "Target architecture and migration plan",
          "Cloud environment defined as code",
          "Migrated applications and data, verified",
          "Cost estimate and architecture documentation",
        ],
      },
      "Server management and monitoring": {
        text: "Ongoing care of your servers and cloud services: patching, configuration, capacity, access and cost. Monitoring covers availability, performance and errors, with alerts routed to the people who can act. It suits teams without dedicated operations staff.",
        deliverables: [
          "Monitoring dashboards and alert rules",
          "Scheduled patching and maintenance",
          "Monthly report on uptime, incidents and cost",
          "Access register and change log",
        ],
      },
      "Backup and disaster recovery": {
        text: "Backups that are automatic, stored separately from the systems they protect, and tested by restoring them. We agree with you how much data you can afford to lose and how long you can be offline, then design to those targets. It suits any organisation that has never performed a full restore.",
        deliverables: [
          "Backup policy with agreed recovery targets",
          "Automated backups stored in a separate location",
          "Recovery runbook",
          "Report from a restore test",
        ],
      },
      "Speed optimisation": {
        text: "We find why a website or application is slow and fix the causes, whether in the front end, the code, the database or the infrastructure. Measurements are taken before and after under the same conditions. It suits businesses where slow pages are costing sales, search visibility or staff time.",
        deliverables: [
          "Performance audit with ranked findings",
          "Implemented fixes across code and infrastructure",
          "Caching and CDN configuration",
          "Before and after measurement report",
        ],
      },
    },
    technologies: [
      "AWS",
      "Microsoft Azure",
      "Google Cloud",
      "Terraform",
      "Docker",
      "Kubernetes",
      "Linux",
      "Nginx",
      "Cloudflare",
      "Grafana",
    ],
    faqs: [
      {
        q: "Which cloud provider should we use?",
        a: "The choice depends on the software you run, the skills of your team, where your users are and any rules on where data must reside. We compare the options against those factors and explain the recommendation. If you already have a provider, we work with it.",
      },
      {
        q: "Will there be downtime during the migration?",
        a: "We plan to keep it as short as the application allows, and for many systems the switch can be made with little or no interruption. Some databases need a brief maintenance window, which we schedule with you. Every cutover has a rollback plan that has been tested.",
      },
      {
        q: "Who owns the cloud accounts?",
        a: "You do. Accounts are registered and billed in your organisation's name, and we work through access that you grant and can revoke. We do not resell hosting or hold your infrastructure in accounts of our own.",
      },
      {
        q: "Can you reduce our cloud bill?",
        a: "We review what you are running against what you use and report where there is waste, such as oversized or idle resources and unsuitable pricing plans. We do not promise a figure in advance because the saving depends on what we find. Some changes involve a trade-off with resilience, and we set that out for you to decide.",
      },
      {
        q: "How do you access our systems, and how is that controlled?",
        a: "Through named individual accounts with multi-factor authentication and the minimum permissions the work needs. Access is logged, and we do not share credentials. When the engagement ends, access is removed and we confirm this in writing.",
      },
    ],
  },
  {
    pillar: "cloud-security",
    slug: "devops",
    lead: "Releases are infrequent, stressful and done by hand, and each one carries the risk of breaking something that worked yesterday.",
    why: "When releasing is risky, teams release less often, changes pile up, and each release becomes riskier still. Automating the path from a code change to production reverses this. Small changes go out frequently, each one built and tested the same way, and a faulty release can be withdrawn quickly. Your developers spend less time on deployment chores and more on the product, and the business gets fixes and features sooner.",
    services: {
      "CI/CD pipelines": {
        text: "Automated pipelines that build, test and deploy your software every time code changes. It suits teams that still deploy by hand or whose existing pipeline is slow and unreliable. We include security and quality checks in the pipeline so problems are caught before they reach users.",
        deliverables: [
          "Build, test and deploy pipelines for each application",
          "Separate staging and production environments",
          "Automated quality and security checks",
          "Pipeline documentation for your developers",
        ],
      },
      "Release automation and reliability": {
        text: "Practices and tooling that make releases safe and keep services available: gradual rollouts, feature flags, automatic rollback, service level targets and incident procedures. It suits products where downtime has a direct commercial cost. We work with your engineers so the practices remain in use after we leave.",
        deliverables: [
          "Rollout and rollback procedures, automated",
          "Service level objectives with dashboards",
          "On-call alerting and incident runbooks",
          "Post-incident review template and process",
        ],
      },
    },
    technologies: [
      "GitHub Actions",
      "GitLab CI",
      "Jenkins",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Argo CD",
      "Prometheus",
      "Grafana",
      "Sentry",
    ],
    faqs: [
      {
        q: "We have very few automated tests. Can we still set up a pipeline?",
        a: "Yes. A pipeline that builds and deploys consistently is useful on its own, and it gives tests a place to run as they are added. We usually start with a small number of checks on the most important user journeys and extend from there.",
      },
      {
        q: "Will this disrupt our developers' current work?",
        a: "We introduce changes alongside the existing process and switch over one application at a time. Developers are involved in the design so the pipeline fits how they work. There is a short adjustment period, and we support the team through it.",
      },
      {
        q: "Do we need Kubernetes?",
        a: "Often not. Kubernetes is worthwhile for larger systems with many services, and it adds operational effort that smaller teams may not want. We recommend the simplest platform that meets your needs and explain the reasoning.",
      },
      {
        q: "How do you measure whether this has worked?",
        a: "We record a baseline for how often you deploy, how long a change takes to reach production, how often a release causes a fault, and how long recovery takes. The same measures are tracked after the work so the difference is visible. We do not commit to target numbers before seeing your starting point.",
      },
      {
        q: "Who maintains the pipelines afterwards?",
        a: "Your team can, and we hand over with documentation and a walkthrough. All configuration is stored as code in your repositories. If you prefer, we can maintain it under a support arrangement.",
      },
    ],
  },
  {
    pillar: "cloud-security",
    slug: "cybersecurity",
    lead: "You do not know where your systems are exposed, and a customer, auditor or insurer has started asking for evidence.",
    why: "Most breaches exploit ordinary weaknesses: unpatched software, weak access controls, coding mistakes, and people who are tricked into giving access. Finding and fixing these before an attacker does is far less costly than responding afterwards. No assessment can guarantee that a system will never be breached, and we do not claim that. What structured security work gives you is a clear picture of your weaknesses ranked by risk, practical fixes, and documented evidence that you can show to customers, auditors and regulators.",
    services: {
      "Security audit and penetration testing": {
        text: "An authorised test of your applications, APIs, networks or cloud configuration, in which our testers look for weaknesses the way an attacker would. Scope and rules are agreed in writing beforehand. You receive each finding with its severity, the evidence, and the steps to fix it, followed by a retest once fixes are in place.",
        deliverables: [
          "Signed scope and rules of engagement",
          "Technical report with findings ranked by severity",
          "Summary for management",
          "Retest report after remediation",
        ],
      },
      "Hacked website clean-up": {
        text: "Urgent help when a website has been compromised, defaced, infected with malware or blocklisted by search engines and browsers. We contain the incident, remove malicious code, work out how the attacker got in and close that route. We then help you request removal of browser and search warnings.",
        deliverables: [
          "Cleaned and restored website",
          "Incident report with the likely point of entry",
          "Hardening changes and credential resets",
          "Blocklist removal requests submitted",
        ],
      },
      "Data protection compliance": {
        text: "Practical help in meeting the data protection laws and security standards that apply to you, such as GDPR, or preparing for ISO 27001 or SOC 2. We map the personal data you hold, identify gaps and help put the technical and organisational measures in place. We are engineers and not a law firm, so legal interpretation should be confirmed by your counsel.",
        deliverables: [
          "Data inventory and data flow map",
          "Gap assessment against the chosen law or standard",
          "Policies and procedures, drafted for your review",
          "Remediation plan with owners",
        ],
      },
      "Secure code review": {
        text: "A review of your source code for security flaws, combining automated scanning with manual reading by an engineer. Manual review finds logic and authorisation errors that scanners miss. It suits teams preparing for a launch, an audit, or a customer's security questionnaire.",
        deliverables: [
          "Findings report with code locations",
          "Recommended fix for each finding",
          "Dependency and secrets scan results",
          "Walkthrough session with your developers",
        ],
      },
      "Staff security awareness": {
        text: "Training that helps your people recognise phishing, handle data properly and report anything suspicious. Sessions are tailored to the roles and tools in your organisation. Simulated phishing exercises, run with management's approval, show where further training is needed without singling out individuals.",
        deliverables: [
          "Training sessions tailored by role",
          "Simulated phishing exercise",
          "Results report with recommendations",
          "Short reference guide for staff",
        ],
      },
    },
    technologies: [
      "Burp Suite",
      "OWASP ZAP",
      "Nmap",
      "Metasploit",
      "Nessus",
      "Semgrep",
      "SonarQube",
      "Snyk",
      "Wazuh",
      "Cloudflare",
    ],
    faqs: [
      {
        q: "Will a penetration test disrupt our live systems?",
        a: "Testing is planned to avoid disruption. We agree the scope, timing and any actions that are off limits before starting, and we can test a staging copy where the risk to production is a concern. You have a named contact throughout and can pause the test at any time.",
      },
      {
        q: "Does a clean report mean we are secure?",
        a: "No. A test reflects what was found within the agreed scope and time, on the version of the system that was tested. It lowers risk and provides evidence, but new weaknesses appear as software changes, which is why testing should be repeated periodically and after major releases.",
      },
      {
        q: "How do you handle the sensitive information you find?",
        a: "We work under a confidentiality agreement and access only what the test requires. Findings and any data encountered are stored encrypted, shared only with the contacts you name, and deleted after an agreed period. We do not copy customer data out of your systems.",
      },
      {
        q: "Will you fix the problems or only report them?",
        a: "Either. The report is written so your developers can act on it, and we walk them through it. If you want us to carry out the fixes, we scope that as separate work and then retest.",
      },
      {
        q: "Can you make us compliant with a specific regulation?",
        a: "We can assess where you stand, close technical and procedural gaps, and prepare the evidence an auditor will ask for. Formal certification is granted by an independent auditor, not by us. On questions of legal interpretation you should take advice from qualified counsel.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Growth and Marketing
  // ---------------------------------------------------------------------
  {
    pillar: "growth-marketing",
    slug: "seo",
    lead: "People are searching for what you sell and finding your competitors, and the visitors you do get are not turning into enquiries or sales.",
    why: "Search is where buyers go when they already have a need, which makes it one of the more efficient sources of demand over time. Unlike advertising, the traffic does not stop when the budget does, but it takes sustained work and no one controls how search engines rank pages. Visibility is only half of the task. A site that ranks well and converts poorly wastes the effort, so we treat search and conversion as one piece of work: bring in the right visitors, then remove what stops them from acting.",
    services: {
      SEO: {
        text: "Work on your site's technical health, content and authority so that it can be found for the searches your customers make. We begin with an audit and keyword research, then deliver a prioritised programme of fixes and content. It suits businesses that depend on being found online and are willing to invest steadily.",
        deliverables: [
          "Technical and content audit",
          "Keyword research mapped to pages",
          "Implemented on-page and technical fixes",
          "Monthly report on rankings, traffic and conversions",
        ],
      },
      "Local SEO": {
        text: "Visibility in map results and local searches for businesses that serve particular places, whether one location or many. We manage your business profiles, keep listings consistent across directories, build location pages and set up a process for gathering genuine customer reviews. It suits shops, clinics, restaurants, service firms and multi-branch organisations.",
        deliverables: [
          "Optimised Google Business Profile for each location",
          "Consistent listings across key directories",
          "Location pages on your website",
          "Review request process and response guidelines",
        ],
      },
      "Conversion rate improvement": {
        text: "A structured way to get more enquiries or sales from the visitors you already have. We study analytics, recordings and user feedback to find where people give up, form hypotheses, and test changes against the current version. It suits sites with enough traffic for tests to reach a conclusion; on smaller sites we apply established usability fixes and measure before and after.",
        deliverables: [
          "Funnel analysis with identified drop-off points",
          "Prioritised list of test hypotheses",
          "Designed and built test variants",
          "Test results with a recommendation for each",
        ],
      },
    },
    technologies: [
      "Google Search Console",
      "Google Analytics",
      "Google Tag Manager",
      "Google Business Profile",
      "Ahrefs",
      "Semrush",
      "Screaming Frog",
      "Hotjar",
      "Microsoft Clarity",
      "VWO",
    ],
    faqs: [
      {
        q: "How long before we see results from SEO?",
        a: "It depends on the state of your site, the competition for your terms and how quickly changes are implemented. Technical fixes can show an effect relatively soon, while content and authority build gradually. We set expectations after the audit, when we can see your starting point.",
      },
      {
        q: "Can you guarantee a first-page ranking?",
        a: "No, and you should be cautious of anyone who does. Search engines decide rankings and change their systems often. We commit to the work, to methods that follow search engine guidelines, and to transparent reporting on what is and is not improving.",
      },
      {
        q: "How is AI-generated search changing this?",
        a: "Search engines and assistants increasingly answer questions directly, which can reduce clicks for simple informational queries. The foundations still apply: clear, accurate, well-structured content from a credible source. We track how your brand appears in these answers where tools allow and adjust the content plan accordingly.",
      },
      {
        q: "Do you make the website changes, or does our team?",
        a: "Either. We can implement changes directly in your CMS or codebase, or hand your developers clear specifications and check the result. We agree this at the start so recommendations do not sit unimplemented.",
      },
      {
        q: "What will you report, and how do we judge success?",
        a: "We report on the measures tied to your business, such as enquiries, sales and qualified traffic from search, alongside rankings and technical health. You get access to the underlying analytics accounts, which remain yours. Each report states what was done, what changed and what comes next.",
      },
    ],
  },
  {
    pillar: "growth-marketing",
    slug: "performance-marketing",
    lead: "You are spending on advertising and cannot say with confidence which part of it produces customers.",
    why: "Paid media can bring demand quickly and can be scaled up or down, which makes it useful for launches, new markets and predictable lead flow. It is also easy to waste money on it. The difference lies in accurate tracking, disciplined testing of audiences and creative, and judging campaigns by revenue or qualified leads instead of clicks. Platform reports tend to over-credit themselves, so we compare them with your own sales records to reach a truer picture of what the spend returns.",
    services: {
      "Search and social advertising": {
        text: "Planning, building and managing campaigns on search engines and social platforms. We set up conversion tracking first, then test audiences, messages and landing pages and move budget toward what performs. It suits businesses that need measurable demand and can track a lead through to a sale.",
        deliverables: [
          "Account structure and campaign plan",
          "Conversion tracking verified against your sales data",
          "Ad copy and creative variants",
          "Regular performance report with spend, results and next actions",
        ],
      },
      "Influencer marketing": {
        text: "Campaigns with creators whose audience matches your customers. We shortlist creators on audience fit and authenticity checks, agree briefs and contracts, and make sure paid partnerships are disclosed as advertising rules require. Results are tracked with unique links or codes where possible; brand effects are harder to measure and we say so.",
        deliverables: [
          "Vetted creator shortlist with audience data",
          "Campaign brief and content guidelines",
          "Contracts covering usage rights and disclosure",
          "Campaign report on reach, engagement and tracked sales",
        ],
      },
    },
    technologies: [
      "Google Ads",
      "Meta Ads Manager",
      "LinkedIn Campaign Manager",
      "Microsoft Advertising",
      "TikTok Ads Manager",
      "Google Analytics",
      "Google Tag Manager",
      "Looker Studio",
      "HubSpot",
    ],
    faqs: [
      {
        q: "Who owns the ad accounts and the data?",
        a: "You do. Campaigns run in accounts registered to your organisation, with our access granted as a partner or user. If we stop working together, the accounts, history, audiences and creative stay with you.",
      },
      {
        q: "How much should we spend on ads?",
        a: "It depends on your market, the cost of reaching your audience and what a customer is worth to you. We usually suggest starting with a test budget large enough to produce reliable data, then scaling what works. Media spend is paid by you directly to the platforms and is separate from our fee.",
      },
      {
        q: "Which platforms should we advertise on?",
        a: "The ones your customers use when they are open to your offer. Search suits existing demand, social suits creating it, and professional networks suit some business-to-business offers. We recommend a starting mix after reviewing your audience and past data, and adjust it based on results.",
      },
      {
        q: "How do you measure results when tracking is limited by privacy rules?",
        a: "We combine platform data, server-side conversion tracking where appropriate, and your own CRM or sales records, all with user consent respected. No single source is complete, so we compare them. Where attribution is uncertain we state the range instead of presenting one confident number.",
      },
      {
        q: "Who creates the ads and landing pages?",
        a: "We can write copy, design creative and build landing pages, or work with assets from your own team. Fresh creative is needed regularly because performance fades as audiences see the same ad. All creative is approved by you before it goes live.",
      },
    ],
  },
  {
    pillar: "growth-marketing",
    slug: "social-and-content",
    lead: "Your channels go quiet for long stretches, the content that does go out sounds like everyone else's, and you cannot tell whether it helps the business.",
    why: "Buyers check a company's content and reputation before they make contact. Consistent, useful material builds familiarity and trust, supports search visibility, and gives your sales team something to send. Inconsistent or generic content does the opposite. The work needs a plan tied to business goals, people who understand your subject, and a steady production routine. AI tools speed up research and drafting, but accuracy, tone and judgement still depend on a human editor, and every piece we publish is reviewed by one.",
    services: {
      "Social media marketing": {
        text: "Planning, producing and publishing content on the social platforms that matter to your audience, and responding to the people who engage. We work from a monthly calendar that you approve. It suits organisations that want an active, consistent presence without building a full in-house team.",
        deliverables: [
          "Channel strategy and content pillars",
          "Monthly content calendar for approval",
          "Designed posts and short videos, published",
          "Monthly report on reach, engagement and enquiries",
        ],
      },
      "Content writing": {
        text: "Website copy, articles, case studies, guides, product descriptions and email content, written for your readers and edited to a standard. Writers interview your subject experts where the topic requires it. AI tools may assist with research and first drafts; a human editor checks facts, originality and voice before anything reaches you.",
        deliverables: [
          "Tone of voice guide",
          "Editorial plan aligned with search and sales needs",
          "Edited, publication-ready copy",
          "Metadata and internal links for web content",
        ],
      },
      "Photo and video production": {
        text: "Photography and video of your products, people, premises and customers, for use on your website, social channels and advertising. We handle the brief, shoot and edit, and deliver files cut to the formats each platform needs. It suits businesses whose imagery is dated or relies on stock.",
        deliverables: [
          "Creative brief and shot list",
          "Edited photographs in web and print resolutions",
          "Edited videos in platform-specific formats",
          "Usage rights and release forms",
        ],
      },
      "Online reputation management": {
        text: "Monitoring what is said about your organisation in reviews, search results and social media, and responding in an appropriate way. We help you gather genuine reviews from real customers and reply to criticism constructively. We do not write fake reviews or try to have legitimate criticism removed.",
        deliverables: [
          "Reputation audit across review sites and search results",
          "Monitoring and alert setup",
          "Response guidelines and reply templates",
          "Review request process for customers",
        ],
      },
    },
    technologies: [
      "Meta Business Suite",
      "LinkedIn",
      "YouTube",
      "TikTok",
      "Canva",
      "Adobe Creative Cloud",
      "Figma",
      "Hootsuite",
      "Buffer",
      "Google Analytics",
    ],
    faqs: [
      {
        q: "Do you use AI to write our content?",
        a: "We use AI tools for research, outlines and first drafts where they save time. Every piece is then written up, fact-checked and edited by a person, because AI text can contain errors and tends towards generic phrasing. If you prefer content written without AI assistance, we can work that way.",
      },
      {
        q: "How will you learn our business well enough to write about it?",
        a: "We start with a briefing, read your existing material and interview the people who know the subject. For technical topics we ask for a subject expert to review drafts. The tone of voice guide and early pieces are refined with you until they sound right.",
      },
      {
        q: "Who approves content before it is published?",
        a: "You do. Nothing is published without approval from the person you nominate, and the calendar gives you time to review. For fast responses to comments and messages we agree guidelines in advance and escalate anything sensitive.",
      },
      {
        q: "Who owns the content, photographs and social accounts?",
        a: "You own the accounts and the finished content once it is paid for. For photography and video we set out usage rights in writing, including those for any models, music or third-party material. We can supply source files on request.",
      },
      {
        q: "How do we know whether social and content work is paying off?",
        a: "We agree goals at the start, such as enquiries, site visits from social, search visibility or audience growth among a defined group. Reports show those measures and not only likes and impressions. Some benefits, such as trust, are hard to attribute directly, and we are open about that.",
      },
    ],
  },
  {
    pillar: "growth-marketing",
    slug: "marketing-automation",
    lead: "Leads arrive and wait days for a reply, follow-up depends on who remembers, and existing customers hear from you only when there is an invoice.",
    why: "Most revenue lost in marketing is lost after the lead arrives: slow responses, no follow-up, no reason to come back. Automation makes the right message go out at the right moment without relying on someone's memory, and it records what happened so sales and marketing work from the same picture. Its value depends on clean data and a sensible plan. Automating messages that are poorly targeted only sends more unwanted email, so we start with the customer journey and consent before we build anything.",
    services: {
      "Marketing automation": {
        text: "Setting up or repairing a marketing automation platform and CRM so that leads are captured, scored, routed and followed up automatically. We map the journey from first contact to repeat purchase and build the workflows that support it. It suits organisations with a growing lead volume and a sales team that cannot keep up by hand.",
        deliverables: [
          "Customer journey map and automation plan",
          "Configured platform integrated with your CRM and website",
          "Lead capture, scoring and routing workflows",
          "Reporting dashboard and team training",
        ],
      },
      "Email and messaging campaigns": {
        text: "Planning, writing, designing and sending campaigns by email, SMS and messaging apps such as WhatsApp. This covers newsletters, promotions and triggered messages such as welcome series and abandoned basket reminders. We send only to people who have agreed to receive messages, and we manage sender reputation so your messages reach the inbox.",
        deliverables: [
          "Campaign calendar and segmentation plan",
          "Designed, responsive message templates",
          "Triggered message sequences",
          "Campaign reports on delivery, engagement and revenue",
        ],
      },
    },
    technologies: [
      "HubSpot",
      "Salesforce",
      "Mailchimp",
      "Klaviyo",
      "ActiveCampaign",
      "Brevo",
      "Zoho CRM",
      "Twilio",
      "WhatsApp Business Platform",
      "Zapier",
    ],
    faqs: [
      {
        q: "Which platform should we use?",
        a: "It depends on your sales model, the size of your contact list, the systems it must connect to and your budget for licences. We compare a short list against those needs and explain the trade-offs. If you already have a platform that is fit for purpose, we work with it.",
      },
      {
        q: "How do you keep our messaging within privacy and anti-spam law?",
        a: "We build consent capture, preference management and unsubscribe handling into every flow, and we do not use purchased lists. Rules differ by country and channel, so we configure for the markets you send to. For legal interpretation in a particular jurisdiction you should confirm with your counsel.",
      },
      {
        q: "Who owns the platform account and the contact data?",
        a: "You do. The licence is in your organisation's name and the contact data is yours. We work through user access that you control and can withdraw.",
      },
      {
        q: "Our contact data is a mess. Can you still help?",
        a: "Yes, and cleaning it is usually the first step. We remove duplicates, standardise fields, suppress invalid addresses and separate contacts with valid consent from those without. Sending to a poor list harms deliverability, so this work is done before campaigns start.",
      },
      {
        q: "Will our team be able to run it after setup?",
        a: "That is the intention. We document each workflow, train your marketers on the platform and keep the structure simple enough to maintain. Ongoing campaign management is available if you would like us to run it.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Managed Services and Teams
  // ---------------------------------------------------------------------
  {
    pillar: "managed-services",
    slug: "maintenance-and-support",
    lead: "Your website or application is live, the people who built it have moved on, and updates, bugs and security patches are piling up.",
    why: "Software is not finished at launch. Frameworks and plugins need updating, security flaws are disclosed, browsers and devices change, and users find faults. Left alone, a working product slowly becomes slow, insecure and expensive to change. A maintenance arrangement keeps it current through regular, planned work and gives you a named team to call when something breaks, with response times agreed in advance. It costs less than emergency repairs and protects the investment you made in building the product.",
    services: {
      "Website and app maintenance plans": {
        text: "A recurring plan covering updates, security patches, backups, monitoring, bug fixes and small improvements. The plan is sized to your product and can be adjusted as needs change. It suits any organisation that runs a website or application without a dedicated in-house team to look after it.",
        deliverables: [
          "Scheduled updates and security patches",
          "Backups and uptime monitoring",
          "Bug fixes and small changes within an agreed allowance",
          "Monthly maintenance report",
        ],
      },
      "Round-the-clock support": {
        text: "Monitoring and incident response outside office hours for systems that must stay available at all times. Alerts are triaged against a severity scale agreed with you, with defined response targets and an escalation path. It suits online stores, booking systems, payment platforms and services with users in several time zones.",
        deliverables: [
          "Service level agreement with response targets",
          "Continuous monitoring and alerting",
          "Ticketing access and escalation contacts",
          "Incident reports with cause and corrective action",
        ],
      },
      "Speed, security and SEO audits": {
        text: "An independent check of how your website or application performs in three areas: load speed, security exposure and search visibility. You receive findings ranked by impact and effort, written so that either your team or ours can act on them. It suits organisations planning a redesign, changing supplier, or simply unsure of the state of what they have.",
        deliverables: [
          "Performance audit with measurements",
          "Security scan and configuration review",
          "Technical SEO audit",
          "Prioritised action plan",
        ],
      },
      "Rescue and takeover of unfinished projects": {
        text: "We take over projects that have stalled, been abandoned by a previous supplier or been delivered in a state that cannot be released. We begin with an assessment of the code, infrastructure and documentation, and tell you plainly what can be kept and what must be redone. It suits organisations that have paid for software they cannot yet use.",
        deliverables: [
          "Code and infrastructure assessment report",
          "Recovered access to repositories, hosting and accounts",
          "Stabilisation plan with a recommendation to repair or rebuild",
          "Documentation of the system as found",
        ],
      },
    },
    technologies: [
      "WordPress",
      "Laravel",
      "React",
      "Node.js",
      "AWS",
      "Cloudflare",
      "Sentry",
      "UptimeRobot",
      "Jira",
      "GitHub",
    ],
    faqs: [
      {
        q: "Can you maintain software that another company built?",
        a: "Yes, in most cases. We start with a paid assessment of the code and hosting so we know what we are taking on and can tell you about any risks. If the technology is outside our skills or the code is in very poor condition, we say so before you commit.",
      },
      {
        q: "What is included in a plan, and what counts as extra?",
        a: "A plan covers the routine work listed in it plus an agreed allowance of time for fixes and small changes. New features and larger changes are estimated separately and done only with your approval. The monthly report shows how the time was used.",
      },
      {
        q: "How quickly will you respond when something breaks?",
        a: "Response targets are set by severity in the service level agreement, with the shortest targets for outages that stop your business trading. The targets you need affect the cost, so we agree them during scoping. We report on whether they were met.",
      },
      {
        q: "What access do you need, and how do you protect it?",
        a: "We need access to the code repository, hosting and relevant admin accounts, granted to named individuals with the minimum permissions required. Credentials are held in a password manager and multi-factor authentication is used where the system supports it. All accounts stay in your ownership.",
      },
      {
        q: "Are we tied in, and what happens if we want to leave?",
        a: "Terms and notice periods are set out in the agreement, and we keep them reasonable. If you leave, we hand over the code, documentation, credentials and any open work to you or your new supplier. We do not hold code or access back.",
      },
    ],
  },
  {
    pillar: "managed-services",
    slug: "dedicated-teams",
    lead: "Your roadmap is longer than your team can deliver, and hiring the engineers you need is slow, costly and uncertain.",
    why: "Recruiting skilled engineers takes time, and a roadmap does not wait. A dedicated team gives you extra capacity that works to your priorities and processes, without the overhead of recruitment, payroll and equipment, and with the flexibility to scale as needs change. The model works when it is run properly: people who stay on your work, clear communication, overlapping working hours and code that meets your standards. It is not right for everything. Work that needs constant in-person collaboration, or that has no one on your side to set direction, is a poor fit, and we will tell you so.",
    services: {
      "Dedicated developers": {
        text: "One or more developers, designers or testers who work only on your product, under your direction, for an agreed period. You meet and approve the people before they start. It suits companies with a clear backlog and someone in-house who can set priorities.",
        deliverables: [
          "Candidate profiles and interviews for your approval",
          "Assigned team members working in your tools",
          "Regular timesheets and progress reports",
          "Replacement and handover process if a person changes",
        ],
      },
      "Team extension": {
        text: "Our people join your existing team to add capacity or a skill you lack, such as mobile, data, DevOps or quality engineering. They attend your stand-ups, follow your coding standards and work in your repositories. It suits engineering leaders who want to move faster without changing how their team works.",
        deliverables: [
          "Engineers matched to the skills you need",
          "Onboarding plan into your process and codebase",
          "Work delivered through your pull request and review flow",
          "Knowledge transfer documentation at the end of the engagement",
        ],
      },
      "White-label development for agencies": {
        text: "Design, development and maintenance carried out for agencies and consultancies under their own name. We work under a non-disclosure agreement, stay behind the scenes or join client calls as part of your team, as you prefer. It suits agencies that sell more than they can build in-house.",
        deliverables: [
          "Non-disclosure and non-solicitation agreement",
          "Estimates and proposals you can present as your own",
          "Finished work delivered under your brand",
          "Source files and documentation",
        ],
      },
      "Offshore development": {
        text: "A complete project team, including project management, design, engineering and testing, that takes responsibility for delivering a product or a stream of work from our location. It suits companies that want an outcome delivered and not only extra hands. We agree working hours that overlap with yours and a fixed rhythm of demonstrations and reports.",
        deliverables: [
          "Project team with a named delivery manager",
          "Sprint plans, demonstrations and status reports",
          "Tested, working software in your repositories",
          "Technical documentation and handover",
        ],
      },
    },
    technologies: [
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "Laravel",
      "Flutter",
      "React Native",
      "Jira",
      "GitHub",
      "Slack",
    ],
    faqs: [
      {
        q: "Who owns the code and intellectual property?",
        a: "You do. The contract assigns the intellectual property in the work to you, and code is committed to repositories that you own. Everyone on your team works under confidentiality obligations.",
      },
      {
        q: "Do we get to choose the people on our team?",
        a: "Yes. We propose people based on the skills you need, and you can interview them before they start. If someone proves not to be the right fit, we arrange a replacement and manage the handover.",
      },
      {
        q: "How do you handle time zone differences?",
        a: "We agree a daily window of overlapping hours for meetings and quick questions, and the team works to your communication tools and rituals. Outside that window, written updates keep work moving. The overlap is settled before the engagement starts so there are no surprises.",
      },
      {
        q: "How do we scale the team up or down?",
        a: "With notice, as set out in the agreement. Adding people depends on the skills required and their availability, and we tell you what is realistic when you ask. Reducing the team includes a handover period so knowledge is not lost.",
      },
      {
        q: "How do you protect our code and data when working remotely?",
        a: "Team members use individual accounts in your systems with the permissions you set, and multi-factor authentication where available. We follow your security policies, and can work within your VPN or virtual desktops if required. Access is removed as soon as a person leaves your project.",
      },
    ],
  },
];

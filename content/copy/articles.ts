import type { Article } from "./types";

export const articleCopy: Article[] = [
  {
    slug: "how-to-scope-a-first-ai-agent-project-so-it-reaches-production",
    title: "How to scope a first AI agent project so it reaches production",
    summary:
      "Most first agent projects stall between a convincing demo and a system people rely on. The cause is usually scope, and scope can be fixed before any code is written.",
    kind: "Guide",
    topic: "AI and Data",
    date: "2026-11-18",
    readingMinutes: 5,
    author: "technicus-editorial",
    related: ["ai-data", "strategy-consulting"],
    body: [
      {
        type: "p",
        text: "Many first AI agent projects stall between a convincing demo and a system people rely on. The cause is rarely the model. It is usually scope: the task was too broad, nobody defined what a correct answer looks like, or the agent was never connected to the systems where the work happens. This guide sets out how to scope a first project so that it has a realistic path to production.",
      },
      { type: "h2", text: "Pick a task, not a department" },
      {
        type: "p",
        text: "\"An agent for customer support\" is not a scope. \"Answer order status enquiries from web chat using the order system, and hand over to a person for anything else\" is. A good first task has four properties.",
      },
      {
        type: "ul",
        items: [
          "It happens often, so the saving is visible and you have plenty of real examples to test against.",
          "The information needed to do it already exists in a system or document the agent can be given access to.",
          "A competent person can say whether a given answer is right or wrong without a long debate.",
          "A wrong answer is recoverable. Someone can correct it before money moves, a record changes for good or a customer is harmed.",
        ],
      },
      {
        type: "p",
        text: "A task that fails the last test can still be a candidate, but only with a person approving each action. Plan for that from the start instead of adding it after an incident.",
      },
      { type: "h2", text: "Define done before you build" },
      {
        type: "p",
        text: "Language models produce plausible output for almost any input, which makes a demo easy to mistake for a finished product. The protection is an evaluation set: a collection of real past cases, each with the outcome you would accept. Gather it before development starts. A few dozen cases are enough to begin, and the set should grow as you find failures. Include the awkward ones: incomplete requests, questions outside the scope, and attempts to make the agent do something it should refuse.",
      },
      {
        type: "p",
        text: "Then agree what a pass means. For some tasks it is the share of cases handled correctly. For others, one category of mistake is unacceptable at any rate, such as quoting a policy that does not exist. Write both down. Without this, every review meeting becomes an argument about anecdotes.",
      },
      { type: "h2", text: "Decide what the agent is allowed to do" },
      {
        type: "p",
        text: "An agent that only reads and drafts carries far less risk than one that writes to your systems. List each action and place it in one of three groups.",
      },
      {
        type: "ul",
        items: [
          "Read only: looking up records, searching documents, summarising.",
          "Act with approval: the agent prepares the refund, the email or the record change, and a person confirms it.",
          "Act alone: reserved for actions that are low in value, easy to reverse and logged.",
        ],
      },
      {
        type: "p",
        text: "Give the agent its own credentials with the narrowest permissions that allow the task. Treat any text it reads from outside, such as emails, web pages and uploaded files, as untrusted input. Instructions hidden in that content can steer a model. The limit on what the agent can do therefore has to be enforced by the systems around it, not by its prompt.",
      },
      { type: "h2", text: "Budget for the integration work" },
      {
        type: "p",
        text: "In most agent projects the model call is the small part. The effort goes into connecting to the order system or the CRM, cleaning the documents the agent will search, building the handover to a person, and logging what happened. If the knowledge the agent needs is spread across out-of-date files and people's heads, fix that first. An agent grounded in poor source material gives poor answers with confidence.",
      },
      {
        type: "p",
        text: "Settle the data questions early as well. Establish what personal or confidential data will be sent to the model provider, under what terms, where it is processed, and whether your contracts with your own customers permit it. The answers can change the choice of model or hosting, so they belong in scoping, not in the final week.",
      },
      { type: "h2", text: "Plan the handover and the first month" },
      {
        type: "p",
        text: "Every agent needs a defined exit: the conditions under which it stops and passes the case to a person, with the conversation so far attached. The usual triggers are low confidence, a request outside scope, an upset customer and repeated failure to resolve the issue.",
      },
      {
        type: "p",
        text: "Release in stages. Start in shadow mode, where the agent drafts and staff send. Move to a small share of real traffic once drafts are being accepted with few edits. Review a sample of conversations every week and add each failure to the evaluation set. Rerun the set before any change to the prompt, the model or the tools. Behaviour can shift when any of these change, and the evaluation set is how you notice.",
      },
      { type: "h2", text: "A scoping checklist" },
      {
        type: "ul",
        items: [
          "One task, described in a sentence, with a named owner in the business.",
          "An evaluation set of real cases and a written pass mark.",
          "A list of permitted actions, each marked read only, act with approval or act alone.",
          "Confirmed access to the systems and documents the agent needs.",
          "Data handling agreed with whoever is responsible for privacy and security.",
          "A handover route to a person and a staged release plan.",
          "A way to compare the running cost per handled case with the cost of doing the work by hand.",
        ],
      },
      {
        type: "p",
        text: "If you can fill in every line, the project is small enough to finish and clear enough to judge. Once it is running, a second agent is much easier, because the evaluation habit, the integrations and the approval rules already exist.",
      },
    ],
  },
  {
    slug: "build-or-buy-how-to-decide-for-business-software",
    title: "Build or buy: how to decide for business software",
    summary:
      "Buying a product and commissioning your own software can both be right, and both can fail expensively. A practical way to compare them, step by step.",
    kind: "Article",
    topic: "Strategy and Consulting",
    date: "2026-11-18",
    readingMinutes: 4,
    author: "technicus-editorial",
    related: ["strategy-consulting", "product-engineering"],
    body: [
      {
        type: "p",
        text: "Every organisation eventually faces the choice between buying a product off the shelf and commissioning its own software. Both routes can be right, and both can fail expensively. The decision gets easier when you stop treating it as one question about a whole system and look at what you are choosing between, part by part.",
      },
      { type: "h2", text: "Start with the process, not the software" },
      {
        type: "p",
        text: "Write down the process the software must support, step by step, including the exceptions. Then mark each step as standard or distinctive. Standard steps are done in much the same way by every organisation of your kind: payroll, bookkeeping, email, basic customer records. Distinctive steps are where your way of working is part of why customers choose you, or where regulation or your operating model forces something unusual.",
      },
      {
        type: "p",
        text: "Standard work favours buying. A vendor serving many customers has already met the edge cases and spreads the cost of maintenance across all of them. Distinctive work favours building, because a product designed for the average customer will push you towards the average process.",
      },
      { type: "h2", text: "What buying really costs" },
      {
        type: "p",
        text: "The licence fee is the visible part. The rest tends to appear after the contract is signed.",
      },
      {
        type: "ul",
        items: [
          "Configuration and integration with the systems you already run. This is often a project in its own right.",
          "Data migration from the old system, including clean-up.",
          "Customisation. Heavy customisation of a bought product gives you the costs of both routes: you pay for the licence and you also own code that can break at each vendor upgrade.",
          "Pricing per user or per transaction, which grows as you do.",
          "Dependence on the vendor's roadmap, pricing decisions and continued existence.",
        ],
      },
      {
        type: "p",
        text: "Ask to see how you would get your data out, in what format and with what help. The cost of leaving is part of the price.",
      },
      { type: "h2", text: "What building really costs" },
      {
        type: "p",
        text: "Building gives you fit and control. It also gives you all of the responsibility.",
      },
      {
        type: "ul",
        items: [
          "Ownership. Someone in your organisation must set priorities, answer questions and accept the work. If nobody has time for that, the project will drift.",
          "Upkeep. Software is never finished. Budget for maintenance, security updates, hosting and changes in every year after launch, not only for the first release.",
          "Time. A bought product can be in use while a custom one is still being specified.",
          "Knowledge. If the people who built it leave and the code is undocumented, you have a different kind of lock-in. Insist on owning the source code, the documentation and the deployment accounts.",
        ],
      },
      { type: "h2", text: "The middle options" },
      {
        type: "p",
        text: "The choice is rarely all or nothing. Three patterns are common.",
      },
      {
        type: "ul",
        items: [
          "Buy the core, build the edge. Use a standard product for record-keeping and build the distinctive part on top through its API: a customer portal, a pricing engine, a scheduling tool.",
          "Build on a platform. Open-source frameworks and low-code platforms supply the common parts, so custom effort goes only into what is specific to you. Check the limits of the platform before you commit, because they tend to appear late.",
          "Buy now, build later. Start on a product to learn what you need, with a clear view of what would trigger a move. This works if you keep your data clean and portable.",
        ],
      },
      { type: "h2", text: "Points that settle most cases" },
      {
        type: "ul",
        items: [
          "Whether a product covers the bulk of the process without customisation. Test this with your own scenarios in a trial, not in a sales demonstration.",
          "Whether the part that does not fit is central to how you compete, or a habit you could change.",
          "How many other systems it must exchange data with, and whether the product has a documented API for that.",
          "Who will own the system internally over the next several years.",
          "What happens to the cost of each route if your volume doubles.",
          "Whether rules on where data is stored or how it is audited rule out any of the products.",
        ],
      },
      { type: "h2", text: "How to run the decision" },
      {
        type: "p",
        text: "Give the decision a fixed, short period. Shortlist two or three products and run your real scenarios through each. In parallel, get an outline estimate for building the same scope, including the first three years of running it. Compare the options on total cost over that period, time to first use, fit to the distinctive steps and the cost of leaving. Write down the assumptions. The decision will be questioned later, and the reasoning should outlast the people who made it.",
      },
      {
        type: "p",
        text: "A caution applies to each side. Organisations that build tend to underestimate maintenance. Organisations that buy tend to underestimate integration and the changes they must make to their own process. Whichever route you take, name that risk and put a budget line against it.",
      },
    ],
  },
  {
    slug: "what-to-check-before-you-migrate-to-the-cloud",
    title: "What to check before you migrate to the cloud",
    summary:
      "A cloud migration changes how you run systems, not only where they sit. These are the checks worth finishing before any workload moves.",
    kind: "Guide",
    topic: "Cloud and Security",
    date: "2026-11-18",
    readingMinutes: 4,
    author: "technicus-editorial",
    related: ["cloud-security"],
    body: [
      {
        type: "p",
        text: "A cloud migration is a change to how you run systems, not only to where they sit. Moves that go badly have usually skipped the preparation. Nobody had a full list of what was running, the costs were guessed, or the cut-over had no way back. The checks below are the ones worth finishing before any workload moves.",
      },
      { type: "h2", text: "Be clear about the reason" },
      {
        type: "p",
        text: "Write down what you expect from the move: retiring ageing hardware, handling variable demand, releasing faster, recovering better from failure, or closing a data centre. The reason decides the approach. If the aim is to leave a building by a fixed date, moving servers largely as they are is sensible. If the aim is to release faster or scale on demand, moving unchanged servers will not deliver it, because the application needs work too. Cost reduction on its own is a weak reason. Steady, predictable workloads can cost more in the cloud than on hardware you already own.",
      },
      { type: "h2", text: "Build an inventory" },
      {
        type: "ul",
        items: [
          "Every application, the servers it runs on and who owns it in the business.",
          "Dependencies between them: databases, file shares, scheduled jobs, internal APIs and hard-coded addresses.",
          "External connections: payment providers, partner links, email delivery and anything that trusts a fixed IP address.",
          "Data: size, growth, sensitivity and how long it must be kept.",
          "Licences. Some software licences restrict or reprice use on shared cloud hardware.",
        ],
      },
      {
        type: "p",
        text: "The dependencies are where the surprises are. Monitoring real network traffic for a few weeks finds connections that no document mentions.",
      },
      { type: "h2", text: "Choose a treatment for each application" },
      {
        type: "p",
        text: "Not everything should move in the same way. For each application, choose one of the following.",
      },
      {
        type: "ul",
        items: [
          "Retire it, if it is no longer used.",
          "Replace it with a hosted product that does the same job.",
          "Move it as it is, on virtual servers.",
          "Adjust it to use managed services, such as a managed database, without rewriting it.",
          "Rebuild it for the cloud, where the benefit justifies the cost.",
          "Leave it where it is. Systems tied to on-site equipment or with strict latency needs can be better off staying.",
        ],
      },
      {
        type: "p",
        text: "The more you change an application, the more benefit you can get and the more risk you take. Start with one that is low in risk but typical of the rest, so the lessons carry over.",
      },
      { type: "h2", text: "Check data and compliance" },
      {
        type: "p",
        text: "Establish which laws, contracts and industry rules govern your data, and whether they limit the country or region where it may be stored. Choose regions to match. Understand the division of responsibility. The provider secures the facilities and the underlying platform. You remain responsible for how you configure it, who has access and what happens to your data. Many cloud security incidents come from configuration mistakes, such as storage left open to the public or access keys with too much reach, and not from a failure of the provider.",
      },
      { type: "h2", text: "Estimate the running cost properly" },
      {
        type: "ul",
        items: [
          "Size from measured usage, not from the specifications of current servers, which are often larger than needed.",
          "Include outbound data transfer, storage growth, backups, logging and the provider's support plan.",
          "Include people: the skills to run the new environment, in house or through a partner.",
          "Tag every resource by application and owner, and set budgets and alerts from the first day.",
          "Allow for a period of paying for both environments at once.",
        ],
      },
      { type: "h2", text: "Set up the foundation first" },
      {
        type: "p",
        text: "Before the first workload arrives, put the basics in place: account structure, network layout, identity and access management with multi-factor authentication, central logging, encryption defaults and a backup policy. Define the infrastructure as code so that environments can be recreated and reviewed. Adding these after applications have moved is harder and tends to be put off.",
      },
      { type: "h2", text: "Plan the cut-over and the way back" },
      {
        type: "ul",
        items: [
          "Rehearse the migration with a copy of production data, and time it.",
          "Decide how data stays in sync during the move and how long a freeze on changes is acceptable.",
          "Reduce DNS time-to-live values well ahead of the switch, so the change takes effect quickly.",
          "Define the tests that confirm success: functions, integrations and performance against a baseline measured before the move.",
          "Define rollback: the conditions that trigger it, who decides and how long the old environment is kept ready.",
          "Restore from a backup in the new environment before you depend on it.",
        ],
      },
      { type: "h2", text: "After the move" },
      {
        type: "p",
        text: "Keep the old environment for the agreed period, then shut it down, or you will pay twice. Review the bill after the first full month and compare it with the estimate. Update the runbooks, monitoring and on-call arrangements, because the failure modes are different now. A migration is complete when the team can operate the new environment with confidence, not when the last server is switched off.",
      },
    ],
  },
  {
    slug: "how-to-brief-a-design-team-so-the-first-version-is-usable",
    title: "How to brief a design team so the first version is usable",
    summary:
      "When a first design misses, the brief is usually the cause. What to put in it so the first version can be tested with real users instead of debated in a meeting room.",
    kind: "Guide",
    topic: "Experience Design",
    date: "2026-11-18",
    readingMinutes: 4,
    author: "technicus-editorial",
    related: ["experience-design"],
    body: [
      {
        type: "p",
        text: "When a first design misses, the brief is usually the cause. It described how the product should look and feel, and left out who would use it and what they need to get done. A design team can only solve the problem it is given. This guide covers what to put in the brief so that the first version can be tested with real users instead of debated in a meeting room.",
      },
      { type: "h2", text: "Describe the people and their situation" },
      {
        type: "p",
        text: "Name the main user groups. For each, say what you know and not what you assume: their role, how often they will use the product, on what device, and where. A desk, a shop floor, a vehicle and a weak mobile connection all call for different decisions. A screen for someone who uses it all day should be dense and fast. A screen for someone who visits twice a year must explain itself. The feature is the same and the design is not.",
      },
      {
        type: "p",
        text: "If you have evidence, attach it: support tickets, site search terms, sales call notes, analytics. If you have none, say so. The team can then plan some research instead of designing on guesses.",
      },
      { type: "h2", text: "State the tasks in order of importance" },
      {
        type: "p",
        text: "List what users must be able to do, as tasks with a start and an end: book a repeat appointment, approve an invoice, find out where an order is. Then rank them and mark the three or four that matter most. Design is largely a matter of deciding what gets attention. Without a ranking, everything gets equal weight and nothing is easy to find.",
      },
      { type: "h2", text: "Say what success looks like" },
      {
        type: "p",
        text: "Give outcomes that can be observed. For example:",
      },
      {
        type: "ul",
        items: [
          "A new user completes sign-up without asking for help.",
          "Staff process an order in fewer steps than they do now.",
          "Support requests about a named problem go down.",
          "More visitors reach the enquiry form.",
        ],
      },
      {
        type: "p",
        text: "Outcomes give designers something to test against. They also give you grounds for accepting or rejecting the work other than taste.",
      },
      { type: "h2", text: "Give the constraints early" },
      {
        type: "ul",
        items: [
          "Technical: the platform, the systems it must connect to, what data is and is not available, and any component library already in use.",
          "Brand: the guidelines, and which parts are fixed and which are open.",
          "Content: who writes it and when it will be ready. Designing with real content exposes problems that placeholder text hides.",
          "Languages: text length varies between languages, and right-to-left scripts change the layout.",
          "Accessibility: the standard you need to meet. It costs far less to design for it from the start than to add it later.",
          "Legal: consent, disclosures and anything a regulator requires on screen.",
          "Time and budget: these let the team propose the right depth of work.",
        ],
      },
      { type: "h2", text: "Leave the solution open" },
      {
        type: "p",
        text: "Describe problems, not screens. \"Users cannot tell which plan suits them\" is a brief. \"Add a comparison table with a toggle\" is a solution, and it may not be the right one. Reference sites are useful if you say what you like about each one. Without that, the team can only copy the surface.",
      },
      { type: "h2", text: "Agree how feedback will work" },
      {
        type: "p",
        text: "Name one person with the authority to decide. That person collects comments from everyone else and resolves the contradictions before passing them on. Conflicting feedback from several stakeholders is a common cause of delay and of designs that please nobody.",
      },
      {
        type: "p",
        text: "Agree the stages too: flows and wireframes first, then visual design, then a prototype. Raise structural concerns at the structural stage, when they are cheap to act on. Phrase feedback as a problem. \"I did not notice the price\" is more useful than \"make the price bigger\", because it leaves the designer free to find the right fix.",
      },
      { type: "h2", text: "Plan a test before the build" },
      {
        type: "p",
        text: "Ask for a clickable prototype of the top tasks and put it in front of a handful of people from the real user group. Watch them attempt each task without help. This takes days, costs little next to development, and settles disagreements that opinion cannot. Allow time for one round of changes afterwards.",
      },
      { type: "h2", text: "A one-page brief" },
      {
        type: "ul",
        items: [
          "The problem, in two or three sentences, and why it matters now.",
          "The user groups and what you know about each.",
          "The ranked tasks.",
          "The outcomes that define success.",
          "The constraints: technical, brand, content, languages, accessibility, legal, time and budget.",
          "The decision-maker and the review stages.",
          "What is out of scope.",
        ],
      },
      {
        type: "p",
        text: "A brief like this takes a few hours to write. It saves rounds of revision, and it means the first version you see is an answer to the right problem.",
      },
    ],
  },
  {
    slug: "a-security-review-checklist-before-you-launch-a-web-application",
    title: "A security review checklist before you launch a web application",
    summary:
      "A baseline review that removes the common weaknesses automated attacks look for as soon as a site is public, and a clear view of what a checklist cannot catch.",
    kind: "Guide",
    topic: "Product Engineering",
    date: "2026-11-18",
    readingMinutes: 4,
    author: "technicus-editorial",
    related: ["product-engineering", "cloud-security"],
    body: [
      {
        type: "p",
        text: "A security review before launch will not make an application invulnerable. It does remove the common weaknesses that automated attacks probe for soon after a site becomes public. This checklist is a baseline. Applications that handle payments, health records or other regulated data need more, including independent testing.",
      },
      { type: "h2", text: "Authentication and sessions" },
      {
        type: "ul",
        items: [
          "Passwords are hashed with a slow, salted algorithm designed for the purpose, such as Argon2 or bcrypt. They are never stored in plain text or with a fast general-purpose hash.",
          "Login, password reset and one-time code endpoints are rate limited.",
          "Multi-factor authentication is available to users and required for administrators.",
          "Session cookies are set Secure and HttpOnly with a suitable SameSite value. Sessions expire, and are invalidated on logout and password change.",
          "Password reset tokens are single use and short lived, and the reset form does not reveal whether an account exists.",
        ],
      },
      { type: "h2", text: "Authorisation" },
      {
        type: "p",
        text: "Broken access control is one of the most common serious flaws. Scanners find it poorly, because the rules are specific to your business. Check it by hand with two test accounts.",
      },
      {
        type: "ul",
        items: [
          "A user cannot read or change another user's records by altering an identifier in the URL or the request body.",
          "An ordinary user cannot call administrator endpoints, even though the interface hides them.",
          "In a multi-tenant application, every query is scoped to the tenant on the server.",
          "Access is denied by default, and each permission is granted explicitly.",
        ],
      },
      { type: "h2", text: "Input and output" },
      {
        type: "ul",
        items: [
          "Database access uses parameterised queries or an ORM. No SQL is built by joining strings with user input.",
          "Output is encoded by the templating framework, and every place that bypasses it has been reviewed. A content security policy adds a second layer.",
          "State-changing requests are protected against cross-site request forgery where authentication relies on cookies.",
          "All input is validated on the server. Checks in the browser are a convenience for users, not a control.",
          "File uploads are limited by type and size, renamed, stored outside the web root or in object storage, and never executed.",
          "Where the server fetches a URL supplied by a user, the destinations are restricted so that internal services cannot be reached.",
        ],
      },
      { type: "h2", text: "Secrets and configuration" },
      {
        type: "ul",
        items: [
          "No keys or passwords are in the code repository, including its history. Any that were have been rotated.",
          "Secrets are held in a secrets manager or environment configuration, and differ between environments.",
          "Debug mode is off, default accounts are removed, and error pages do not show stack traces.",
          "Admin panels, databases and internal dashboards are not reachable from the public internet.",
          "The application's database account has only the permissions it needs.",
        ],
      },
      { type: "h2", text: "Transport and browser controls" },
      {
        type: "ul",
        items: [
          "HTTPS is enforced on every page, with HTTP redirected. Strict transport security is enabled once you are confident every subdomain supports it.",
          "Security headers are set: a content security policy, protection against framing by other sites, and no content type sniffing.",
          "Cross-origin access is limited to the origins that need it. A wildcard is never combined with credentials.",
        ],
      },
      { type: "h2", text: "Dependencies and infrastructure" },
      {
        type: "ul",
        items: [
          "Third-party packages have been scanned for known vulnerabilities, versions are locked, and someone is responsible for updates after launch.",
          "The operating system and runtime are patched, with a routine for keeping them so.",
          "Storage buckets are private by default.",
          "Only the ports the application needs are open.",
        ],
      },
      { type: "h2", text: "Logging, backup and response" },
      {
        type: "ul",
        items: [
          "Sign-ins, failed sign-ins, permission changes and administrator actions are logged. Passwords, tokens and full card numbers are not.",
          "Alerts exist for unusual patterns, such as a burst of failed logins.",
          "Backups run automatically and are stored separately from the application. A restore has been tested.",
          "There is a written plan for an incident: who decides, who is told, and what your legal duties are to notify regulators or users. Those duties vary by jurisdiction.",
        ],
      },
      { type: "h2", text: "Privacy" },
      {
        type: "p",
        text: "Collect only the personal data you need. Know where it is stored, how long you keep it and how you would delete it on request. Make sure the privacy notice matches what the application does, including the third-party scripts on each page. Analytics and advertising tags can pass on more than you intend.",
      },
      { type: "h2", text: "What a checklist cannot do" },
      {
        type: "p",
        text: "A checklist catches known classes of weakness. It does not find flaws in the logic of your own application, such as a discount that can be applied twice or an approval step that can be skipped. For applications that handle money or sensitive data, commission a penetration test from people who did not build the system, and leave time before launch to fix what they find. Repeat the review after major changes. Security is a condition you maintain, not a gate you pass once.",
      },
    ],
  },
  {
    slug: "dedicated-team-or-fixed-scope-project-how-to-choose",
    title: "Dedicated team or fixed-scope project: how to choose",
    summary:
      "The two common ways to engage a software partner place risk in different places. How each works, where each goes wrong and how to tell which one fits your situation.",
    kind: "Article",
    topic: "Managed Services and Teams",
    date: "2026-11-18",
    readingMinutes: 4,
    author: "technicus-editorial",
    related: ["managed-services", "product-engineering"],
    body: [
      {
        type: "p",
        text: "When you bring in an outside partner to build software, you choose a commercial model as well as a supplier. The two common models are the fixed-scope project, where an agreed deliverable is produced for an agreed fee by an agreed date, and the dedicated team, where named people work on your priorities for a period and you pay for their time. Neither is right in general. Each puts risk in a different place, and the choice depends on how well you know what you want.",
      },
      { type: "h2", text: "How a fixed-scope project works" },
      {
        type: "p",
        text: "You and the supplier agree a specification, a price and a timetable. The supplier carries the risk of underestimating the work. In return, the supplier needs the scope to stay still, so changes go through a change request process, each with a cost and a delay. The model suits these conditions.",
      },
      {
        type: "ul",
        items: [
          "The requirements are known and can be written down in detail before work starts.",
          "The work has a clear end: a website, an integration, a migration, a defined first version.",
          "The budget has to be approved in advance and cannot move.",
          "You have little time to be involved from week to week.",
        ],
      },
      {
        type: "p",
        text: "The weak points follow from the same structure. A detailed specification takes time to write, and it is written when you know least about the product. The supplier prices in a margin for uncertainty. When you learn something halfway through, the contract resists the change. And since the supplier's margin depends on finishing within the estimate, qualities that are not specified can be squeezed. If you want tests, documentation and performance targets, write them into the scope.",
      },
      { type: "h2", text: "How a dedicated team works" },
      {
        type: "p",
        text: "You engage a set of people for a period: developers, a designer, a tester, often a part-time project manager. They work from your list of priorities. You pay for capacity and decide what it is spent on, and you can change direction in any week. You carry the risk of how much gets done. The model suits these conditions.",
      },
      {
        type: "ul",
        items: [
          "The product will change as you learn from users.",
          "The work continues: a product with a roadmap, not a single delivery.",
          "You have someone who can set priorities and answer questions quickly.",
          "You need skills to add to a team you already have.",
        ],
      },
      {
        type: "p",
        text: "The weak points are different. Without a decision-maker on your side, the team drifts, or builds the wrong thing efficiently. Cost is open-ended unless you set a budget and review it regularly. There is a ramp-up period while the team learns your business. The model also asks for more of your time than a fixed project does.",
      },
      { type: "h2", text: "The two tests that decide it" },
      {
        type: "p",
        text: "The first test is how much you expect the requirements to change. If you could hand over a specification today, look away for three months and be satisfied with exactly what it describes, a fixed scope fits. If you expect to learn along the way, a team fits. The second test is who is available on your side. A team needs a product owner with time and authority. If you cannot provide one, a fixed scope is safer, or the partner must supply that role and you must trust their judgement.",
      },
      { type: "h2", text: "Hybrid arrangements" },
      {
        type: "ul",
        items: [
          "Paid discovery, then a fixed build. A short time-based phase produces the specification, designs and estimate. The build is then priced with far less guesswork.",
          "Fixed budget, flexible scope. Cost and date are fixed, features are ranked, and both sides accept that the lowest items may not be built.",
          "Fixed first version, then a team. The initial release is a project, and a smaller team continues with improvements and support.",
          "Milestones. A large project is split into small fixed pieces, each agreed just before it starts.",
        ],
      },
      { type: "h2", text: "What to agree in either model" },
      {
        type: "ul",
        items: [
          "Ownership of source code, designs and other intellectual property, with access to the repository from the first day.",
          "Hosting, domain and app store accounts held in your name.",
          "A definition of done: tested, reviewed, documented and deployed.",
          "How progress is shown. Working software on a regular schedule tells you more than status reports.",
          "Notice periods and handover duties when the engagement ends. For a team, what happens when a person is replaced.",
          "Confidentiality and how your data is handled.",
          "How defects are treated: a warranty period in a fixed project, an agreed priority in a team.",
        ],
      },
      { type: "h2", text: "Signs you chose the wrong model" },
      {
        type: "p",
        text: "In a fixed project, frequent change requests and growing arguments about what was in scope show that the requirements were not stable. Consider converting the remainder to time-based work. In a team, weeks without a clear priority list, or people waiting for decisions, show that ownership is missing. Appoint an owner, or pause and define a fixed piece of work. Changing model partway through is normal, and it costs less than persisting with one that does not fit.",
      },
    ],
  },
];

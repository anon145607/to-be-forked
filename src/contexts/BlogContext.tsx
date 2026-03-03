import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PostFormat = 'full' | 'summary' | 'paragraph' | 'pareto' | 'bullets';

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  formats: Record<PostFormat, string>;
}

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id'>) => void;
  updatePost: (id: string, post: Omit<BlogPost, 'id'>) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | null>(null);

const STORAGE_KEY = 'licensing-simplified-posts';

const seedPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Microsoft 365 E3 vs E5: A Complete Licensing Breakdown',
    date: '2026-02-28',
    excerpt: 'Understanding the key differences between Microsoft 365 E3 and E5 licenses, including security, compliance, and analytics features.',
    formats: {
      full: `Microsoft 365 E3 and E5 are two of the most popular enterprise licensing plans offered by Microsoft. Both include the core Office apps, Exchange Online, SharePoint, and Teams — but E5 adds a significant layer of advanced security, compliance, voice, and analytics capabilities.\n\n## What's in E3?\nMicrosoft 365 E3 provides a comprehensive productivity suite: Word, Excel, PowerPoint, Outlook, Teams, SharePoint, OneDrive, and Exchange Online. It includes Azure AD P1 for identity management, Intune for device management, and Information Protection for basic data loss prevention.\n\n## What does E5 add?\nE5 builds on everything in E3 and adds:\n- **Microsoft Defender for Office 365 Plan 2** — advanced threat protection with automated investigation and response.\n- **Azure AD P2** — Privileged Identity Management, risk-based Conditional Access.\n- **Microsoft Purview** — advanced eDiscovery, Communication Compliance, Information Barriers.\n- **Power BI Pro** — included at no extra cost.\n- **Phone System & Audio Conferencing** — native PSTN calling capabilities.\n\n## Cost Consideration\nE3 is priced at ~$36/user/month, while E5 comes in at ~$57/user/month. The $21 delta per user is significant at scale, but organizations requiring advanced security postures or unified communications often find E5 more cost-effective than purchasing add-ons individually.\n\n## Recommendation\nFor organizations with fewer than 500 users and basic security needs, E3 with selective add-ons is usually optimal. For enterprises with strict compliance requirements or those consolidating telephony, E5 delivers clear ROI.`,
      summary: 'Microsoft 365 E3 covers core productivity, identity (Azure AD P1), and device management (Intune). E5 adds advanced security (Defender P2, Azure AD P2), compliance (Purview), Power BI Pro, and Phone System. E5 costs ~$21/user/month more but can be cheaper than buying individual add-ons.',
      paragraph: 'Microsoft 365 E3 provides the full Office suite with Azure AD P1 and Intune, while E5 adds Defender for Office 365 Plan 2, Azure AD P2 with Privileged Identity Management, advanced Purview compliance tools, Power BI Pro, and native Phone System capabilities — costing about $21 more per user per month but often proving more cost-effective than purchasing these features as separate add-ons.',
      pareto: '**The 20% you need to know:**\n\n1. **E3** = Office apps + Azure AD P1 + Intune + basic DLP (~$36/user/mo)\n2. **E5** = Everything in E3 + Defender P2 + Azure AD P2 + Purview + Power BI Pro + Phone System (~$57/user/mo)\n3. **Decision driver**: If you need ≥3 of the E5-exclusive features, upgrade — buying them as add-ons costs more.\n4. **Key E5 differentiator**: Advanced threat protection and compliance automation save significant SOC hours.',
      bullets: '- E3 includes Office apps, Exchange, SharePoint, Teams, Azure AD P1, Intune\n- E5 adds Defender for Office 365 Plan 2 (advanced threat protection)\n- E5 includes Azure AD P2 (PIM, risk-based Conditional Access)\n- E5 includes Microsoft Purview advanced compliance tools\n- E5 bundles Power BI Pro at no additional cost\n- E5 includes Phone System & Audio Conferencing\n- E3: ~$36/user/month | E5: ~$57/user/month\n- E5 is more cost-effective if you need 3+ of its exclusive features',
    },
  },
  {
    id: '2',
    title: 'Copilot for Microsoft 365: Licensing Requirements & Gotchas',
    date: '2026-02-20',
    excerpt: 'Everything you need to know about licensing Microsoft 365 Copilot — prerequisites, eligible plans, and common pitfalls.',
    formats: {
      full: `Microsoft 365 Copilot has rapidly become one of the most sought-after AI features in the enterprise space. However, its licensing requirements are more nuanced than many organizations expect.\n\n## Prerequisites\nCopilot for Microsoft 365 is an **add-on license** — it cannot be purchased standalone. Users must have one of the following base licenses:\n- Microsoft 365 E3 or E5\n- Microsoft 365 Business Standard or Business Premium\n- Office 365 E3 or E5\n\n## What's Included\nThe Copilot license ($30/user/month) provides AI-powered assistance across:\n- Word, Excel, PowerPoint, Outlook, Teams\n- Business Chat (cross-app AI reasoning)\n- Microsoft Graph integration for organizational context\n\n## Common Gotchas\n1. **No F-license support** — Copilot is NOT available for Frontline Worker (F1/F3) licenses.\n2. **Tenant-level enablement** — admins must enable Copilot at the tenant level before per-user assignment.\n3. **Data residency** — Copilot processes data through Azure OpenAI Service; check your data residency requirements.\n4. **Semantic Index** — Copilot relies on the Microsoft Graph Semantic Index, which needs time to build after enablement.\n5. **Minimum seat count** — Microsoft initially required 300-seat minimums, but this has been removed for most channels.\n\n## Recommendation\nStart with a pilot group of 50-100 users in knowledge-worker roles. Measure productivity gains before broad rollout. Ensure your Microsoft Graph data is clean — Copilot is only as good as the data it can access.`,
      summary: 'Microsoft 365 Copilot is a $30/user/month add-on requiring an E3/E5 or Business Standard/Premium base license. It provides AI assistance across all Office apps and Business Chat, but is not available for Frontline Worker licenses. Organizations should pilot with 50-100 users and ensure clean Microsoft Graph data before broad rollout.',
      paragraph: 'Microsoft 365 Copilot costs $30/user/month as an add-on to E3/E5 or Business Standard/Premium licenses, delivering AI-powered assistance across Word, Excel, PowerPoint, Outlook, Teams, and Business Chat — but it excludes Frontline Worker licenses, requires tenant-level enablement, depends on the Semantic Index for quality results, and works best when piloted with 50-100 knowledge workers before a full rollout.',
      pareto: '**The 20% you need to know:**\n\n1. **Price**: $30/user/month add-on (not standalone)\n2. **Prerequisite**: Must have M365 E3/E5 or Business Standard/Premium\n3. **Not supported**: Frontline Worker (F1/F3) licenses\n4. **Critical success factor**: Clean Microsoft Graph data = better Copilot results\n5. **Rollout tip**: Pilot 50-100 users, measure ROI, then expand',
      bullets: '- Copilot is an add-on at $30/user/month, not a standalone license\n- Requires base license: M365 E3, E5, Business Standard, or Business Premium\n- NOT available for Frontline Worker (F1/F3) licenses\n- Covers Word, Excel, PowerPoint, Outlook, Teams, and Business Chat\n- Requires tenant-level admin enablement before user assignment\n- Depends on Microsoft Graph Semantic Index (needs build time)\n- No minimum seat requirement for most purchasing channels\n- Pilot with 50-100 knowledge workers before broad rollout',
    },
  },
  {
    id: '3',
    title: 'Azure Reserved Instances vs. Pay-As-You-Go: When to Commit',
    date: '2026-02-10',
    excerpt: 'A cost optimization guide for Azure compute — when Reserved Instances make sense and when flexibility matters more.',
    formats: {
      full: `Azure pricing can be daunting, but one of the most impactful decisions you'll make is whether to use Pay-As-You-Go (PAYG) or commit to Reserved Instances (RIs) for your compute workloads.\n\n## Pay-As-You-Go\nPAYG is the default pricing model. You pay by the hour (or second, depending on the VM series) with no upfront commitment. It's ideal for:\n- Dev/test environments\n- Burst workloads\n- Short-term projects\n- Workloads with unpredictable demand\n\n## Reserved Instances\nRIs offer 1-year or 3-year commitments in exchange for significant discounts:\n- **1-year RI**: ~20-40% savings vs. PAYG\n- **3-year RI**: ~40-60% savings vs. PAYG\n\nRIs are best for:\n- Production workloads running 24/7\n- Database servers (SQL, Cosmos DB)\n- Domain controllers and infrastructure VMs\n\n## Instance Size Flexibility\nA key feature of RIs is **instance size flexibility** within the same VM series. If you reserve a D4s_v5, the discount applies proportionally to D2s_v5 or D8s_v5 VMs in the same series. This reduces the risk of over-committing.\n\n## Savings Plans as an Alternative\nAzure Savings Plans offer similar discounts (up to 65%) but with more flexibility — they apply across VM families, regions, and even across compute services (VMs, App Service, Container Instances). Consider Savings Plans if your workload mix changes frequently.\n\n## Recommendation\nFor stable, predictable workloads: 3-year RIs deliver maximum savings. For organizations still optimizing their cloud footprint: 1-year Savings Plans provide the best balance of savings and flexibility. Never commit RIs for workloads you haven't baselined for at least 3 months.`,
      summary: 'Azure Pay-As-You-Go is best for dev/test and unpredictable workloads, while Reserved Instances save 20-60% on stable production workloads with 1-3 year commitments. Savings Plans offer similar discounts with more flexibility across VM families and regions. Baseline workloads for at least 3 months before committing to any reservation.',
      paragraph: 'Azure Reserved Instances offer 20-60% savings over Pay-As-You-Go pricing for stable production workloads with 1 or 3-year commitments and include instance size flexibility within VM series, while Azure Savings Plans provide comparable discounts with greater flexibility across families, regions, and services — but organizations should baseline workloads for at least 3 months and reserve only for predictable, always-on infrastructure.',
      pareto: '**The 20% you need to know:**\n\n1. **PAYG** = No commitment, full price — use for dev/test and burst workloads\n2. **1-year RI** = 20-40% savings | **3-year RI** = 40-60% savings\n3. **Instance size flexibility** means one RI covers proportional usage across the same VM series\n4. **Savings Plans** = Similar discounts but apply across VM families and regions\n5. **Rule of thumb**: Don\'t commit until you\'ve baselined the workload for 3+ months',
      bullets: '- Pay-As-You-Go: No commitment, per-hour/second billing, ideal for dev/test\n- 1-year Reserved Instances: 20-40% savings over PAYG\n- 3-year Reserved Instances: 40-60% savings over PAYG\n- RIs have instance size flexibility within the same VM series\n- Savings Plans: Up to 65% savings, flexible across VM families and regions\n- Best for RIs: 24/7 production VMs, databases, infrastructure\n- Never commit without 3+ months of baseline usage data\n- Savings Plans are better for organizations with changing workload mixes',
    },
  },
];

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { return seedPosts; }
    }
    return seedPosts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const addPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost: BlogPost = { ...post, id: crypto.randomUUID() };
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (id: string, post: Omit<BlogPost, 'id'>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...post, id } : p));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const getPost = (id: string) => posts.find(p => p.id === id);

  return (
    <BlogContext.Provider value={{ posts, addPost, updatePost, deletePost, getPost }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error('useBlog must be used within BlogProvider');
  return ctx;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PostFormat = 'full' | 'summary' | 'paragraph' | 'pareto' | 'bullets';

export interface CustomFormat {
  key: string;
  label: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  formats: Record<string, string>;
  customFormats: CustomFormat[];
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
    tags: ['Microsoft365', 'E3', 'E5', 'Licensing'],
    customFormats: [],
    formats: {
      full: `<h2>What's in E3?</h2><p>Microsoft 365 E3 provides a comprehensive productivity suite: Word, Excel, PowerPoint, Outlook, Teams, SharePoint, OneDrive, and Exchange Online. It includes Azure AD P1 for identity management, Intune for device management, and Information Protection for basic data loss prevention.</p><h2>What does E5 add?</h2><p>E5 builds on everything in E3 and adds:</p><ul><li><strong>Microsoft Defender for Office 365 Plan 2</strong> — advanced threat protection with automated investigation and response.</li><li><strong>Azure AD P2</strong> — Privileged Identity Management, risk-based Conditional Access.</li><li><strong>Microsoft Purview</strong> — advanced eDiscovery, Communication Compliance, Information Barriers.</li><li><strong>Power BI Pro</strong> — included at no extra cost.</li><li><strong>Phone System &amp; Audio Conferencing</strong> — native PSTN calling capabilities.</li></ul><h2>Cost Consideration</h2><p>E3 is priced at ~$36/user/month, while E5 comes in at ~$57/user/month. The $21 delta per user is significant at scale, but organizations requiring advanced security postures or unified communications often find E5 more cost-effective than purchasing add-ons individually.</p><h2>Recommendation</h2><p>For organizations with fewer than 500 users and basic security needs, E3 with selective add-ons is usually optimal. For enterprises with strict compliance requirements or those consolidating telephony, E5 delivers clear ROI.</p>`,
      summary: '<p>Microsoft 365 E3 covers core productivity, identity (Azure AD P1), and device management (Intune). E5 adds advanced security (Defender P2, Azure AD P2), compliance (Purview), Power BI Pro, and Phone System. E5 costs ~$21/user/month more but can be cheaper than buying individual add-ons.</p>',
      paragraph: '<p>Microsoft 365 E3 provides the full Office suite with Azure AD P1 and Intune, while E5 adds Defender for Office 365 Plan 2, Azure AD P2 with Privileged Identity Management, advanced Purview compliance tools, Power BI Pro, and native Phone System capabilities — costing about $21 more per user per month but often proving more cost-effective than purchasing these features as separate add-ons.</p>',
      pareto: '<p><strong>The 20% you need to know:</strong></p><ol><li><strong>E3</strong> = Office apps + Azure AD P1 + Intune + basic DLP (~$36/user/mo)</li><li><strong>E5</strong> = Everything in E3 + Defender P2 + Azure AD P2 + Purview + Power BI Pro + Phone System (~$57/user/mo)</li><li><strong>Decision driver</strong>: If you need ≥3 of the E5-exclusive features, upgrade — buying them as add-ons costs more.</li><li><strong>Key E5 differentiator</strong>: Advanced threat protection and compliance automation save significant SOC hours.</li></ol>',
      bullets: '<ul><li>E3 includes Office apps, Exchange, SharePoint, Teams, Azure AD P1, Intune</li><li>E5 adds Defender for Office 365 Plan 2 (advanced threat protection)</li><li>E5 includes Azure AD P2 (PIM, risk-based Conditional Access)</li><li>E5 includes Microsoft Purview advanced compliance tools</li><li>E5 bundles Power BI Pro at no additional cost</li><li>E5 includes Phone System &amp; Audio Conferencing</li><li>E3: ~$36/user/month | E5: ~$57/user/month</li><li>E5 is more cost-effective if you need 3+ of its exclusive features</li></ul>',
    },
  },
  {
    id: '2',
    title: 'Copilot for Microsoft 365: Licensing Requirements & Gotchas',
    date: '2026-02-20',
    excerpt: 'Everything you need to know about licensing Microsoft 365 Copilot — prerequisites, eligible plans, and common pitfalls.',
    tags: ['Copilot', 'AI', 'Microsoft365'],
    customFormats: [],
    formats: {
      full: `<h2>Prerequisites</h2><p>Copilot for Microsoft 365 is an <strong>add-on license</strong> — it cannot be purchased standalone. Users must have one of the following base licenses:</p><ul><li>Microsoft 365 E3 or E5</li><li>Microsoft 365 Business Standard or Business Premium</li><li>Office 365 E3 or E5</li></ul><h2>What's Included</h2><p>The Copilot license ($30/user/month) provides AI-powered assistance across Word, Excel, PowerPoint, Outlook, Teams, Business Chat, and Microsoft Graph integration for organizational context.</p><h2>Common Gotchas</h2><ol><li><strong>No F-license support</strong> — Copilot is NOT available for Frontline Worker (F1/F3) licenses.</li><li><strong>Tenant-level enablement</strong> — admins must enable Copilot at the tenant level before per-user assignment.</li><li><strong>Data residency</strong> — Copilot processes data through Azure OpenAI Service; check your data residency requirements.</li><li><strong>Semantic Index</strong> — Copilot relies on the Microsoft Graph Semantic Index, which needs time to build after enablement.</li><li><strong>Minimum seat count</strong> — Microsoft initially required 300-seat minimums, but this has been removed for most channels.</li></ol><h2>Recommendation</h2><p>Start with a pilot group of 50-100 users in knowledge-worker roles. Measure productivity gains before broad rollout. Ensure your Microsoft Graph data is clean — Copilot is only as good as the data it can access.</p>`,
      summary: '<p>Microsoft 365 Copilot is a $30/user/month add-on requiring an E3/E5 or Business Standard/Premium base license. It provides AI assistance across all Office apps and Business Chat, but is not available for Frontline Worker licenses. Organizations should pilot with 50-100 users and ensure clean Microsoft Graph data before broad rollout.</p>',
      paragraph: '<p>Microsoft 365 Copilot costs $30/user/month as an add-on to E3/E5 or Business Standard/Premium licenses, delivering AI-powered assistance across Word, Excel, PowerPoint, Outlook, Teams, and Business Chat — but it excludes Frontline Worker licenses, requires tenant-level enablement, depends on the Semantic Index for quality results, and works best when piloted with 50-100 knowledge workers before a full rollout.</p>',
      pareto: '<p><strong>The 20% you need to know:</strong></p><ol><li><strong>Price</strong>: $30/user/month add-on (not standalone)</li><li><strong>Prerequisite</strong>: Must have M365 E3/E5 or Business Standard/Premium</li><li><strong>Not supported</strong>: Frontline Worker (F1/F3) licenses</li><li><strong>Critical success factor</strong>: Clean Microsoft Graph data = better Copilot results</li><li><strong>Rollout tip</strong>: Pilot 50-100 users, measure ROI, then expand</li></ol>',
      bullets: '<ul><li>Copilot is an add-on at $30/user/month, not a standalone license</li><li>Requires base license: M365 E3, E5, Business Standard, or Business Premium</li><li>NOT available for Frontline Worker (F1/F3) licenses</li><li>Covers Word, Excel, PowerPoint, Outlook, Teams, and Business Chat</li><li>Requires tenant-level admin enablement before user assignment</li><li>Depends on Microsoft Graph Semantic Index (needs build time)</li><li>No minimum seat requirement for most purchasing channels</li><li>Pilot with 50-100 knowledge workers before broad rollout</li></ul>',
    },
  },
  {
    id: '3',
    title: 'Azure Reserved Instances vs. Pay-As-You-Go: When to Commit',
    date: '2026-02-10',
    excerpt: 'A cost optimization guide for Azure compute — when Reserved Instances make sense and when flexibility matters more.',
    tags: ['Azure', 'CostOptimization', 'CloudCompute'],
    customFormats: [],
    formats: {
      full: `<h2>Pay-As-You-Go</h2><p>PAYG is the default pricing model. You pay by the hour (or second, depending on the VM series) with no upfront commitment. It's ideal for dev/test environments, burst workloads, short-term projects, and workloads with unpredictable demand.</p><h2>Reserved Instances</h2><p>RIs offer 1-year or 3-year commitments in exchange for significant discounts:</p><ul><li><strong>1-year RI</strong>: ~20-40% savings vs. PAYG</li><li><strong>3-year RI</strong>: ~40-60% savings vs. PAYG</li></ul><p>RIs are best for production workloads running 24/7, database servers (SQL, Cosmos DB), domain controllers and infrastructure VMs.</p><h2>Instance Size Flexibility</h2><p>A key feature of RIs is <strong>instance size flexibility</strong> within the same VM series. If you reserve a D4s_v5, the discount applies proportionally to D2s_v5 or D8s_v5 VMs in the same series.</p><h2>Savings Plans as an Alternative</h2><p>Azure Savings Plans offer similar discounts (up to 65%) but with more flexibility — they apply across VM families, regions, and even across compute services. Consider Savings Plans if your workload mix changes frequently.</p><h2>Recommendation</h2><p>For stable, predictable workloads: 3-year RIs deliver maximum savings. For organizations still optimizing their cloud footprint: 1-year Savings Plans provide the best balance. Never commit RIs for workloads you haven't baselined for at least 3 months.</p>`,
      summary: '<p>Azure Pay-As-You-Go is best for dev/test and unpredictable workloads, while Reserved Instances save 20-60% on stable production workloads with 1-3 year commitments. Savings Plans offer similar discounts with more flexibility across VM families and regions. Baseline workloads for at least 3 months before committing to any reservation.</p>',
      paragraph: '<p>Azure Reserved Instances offer 20-60% savings over Pay-As-You-Go pricing for stable production workloads with 1 or 3-year commitments and include instance size flexibility within VM series, while Azure Savings Plans provide comparable discounts with greater flexibility across families, regions, and services — but organizations should baseline workloads for at least 3 months and reserve only for predictable, always-on infrastructure.</p>',
      pareto: '<p><strong>The 20% you need to know:</strong></p><ol><li><strong>PAYG</strong> = No commitment, full price — use for dev/test and burst workloads</li><li><strong>1-year RI</strong> = 20-40% savings | <strong>3-year RI</strong> = 40-60% savings</li><li><strong>Instance size flexibility</strong> means one RI covers proportional usage across the same VM series</li><li><strong>Savings Plans</strong> = Similar discounts but apply across VM families and regions</li><li><strong>Rule of thumb</strong>: Don\'t commit until you\'ve baselined the workload for 3+ months</li></ol>',
      bullets: '<ul><li>Pay-As-You-Go: No commitment, per-hour/second billing, ideal for dev/test</li><li>1-year Reserved Instances: 20-40% savings over PAYG</li><li>3-year Reserved Instances: 40-60% savings over PAYG</li><li>RIs have instance size flexibility within the same VM series</li><li>Savings Plans: Up to 65% savings, flexible across VM families and regions</li><li>Best for RIs: 24/7 production VMs, databases, infrastructure</li><li>Never commit without 3+ months of baseline usage data</li><li>Savings Plans are better for organizations with changing workload mixes</li></ul>',
    },
  },
];

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migrate old posts that lack tags/customFormats
        return parsed.map((p: any) => ({
          ...p,
          tags: p.tags || [],
          customFormats: p.customFormats || [],
        }));
      } catch { return seedPosts; }
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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from './contexts/ToastContext';
import { fetchCaseStudies, fetchInsights } from './services/contentService';
import { apiFetch, apiFetchJson } from './services/apiClient';

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  viewport: { once: true, margin: '-80px' }
};

const marqueeBase =
  'AI Automation  ·  Smart Chatbots  ·  Workflow Systems  ·  Make  ·  Zapier  ·  n8n  ·  Fast Delivery  ·  India-based'

const testimonials = [
  {
    quote:
      'Clarix automated our client onboarding. Saved us 3 hours per client. Done in under 2 weeks.',
    initial: 'R',
    name: 'Rohan M.',
    role: 'SaaS Founder',
    grad: 'from-blue-500 to-violet-600'
  },
  {
    quote:
      'The chatbot now handles around 55% of our support queries. My team finally has time for actual work.',
    initial: 'S',
    name: 'Sneha K.',
    role: 'Business Owner',
    grad: 'from-cyan-500 to-sky-700'
  },
  {
    quote: 'No fluff, no delays. Just results. Best Rs.2,000 I\'ve spent on my business.',
    initial: 'A',
    name: 'Arjun T.',
    role: 'Freelance Consultant',
    grad: 'from-amber-500 to-orange-700'
  },
  {
    quote:
      'Within 14 days, our lead response time dropped by 60%. Deepak understood our workflow immediately.',
    initial: 'P',
    name: 'Priya S.',
    role: 'Operations Director',
    grad: 'from-pink-500 to-rose-600'
  },
  {
    quote:
      'We tried DIY automation tools for 6 months. Spent 5x what Clarix charges and got half the results. This was a no-brainer.',
    initial: 'M',
    name: 'Mehul R.',
    role: 'E-commerce Owner',
    grad: 'from-emerald-500 to-teal-600'
  },
  {
    quote:
      'Perfect for bootstrapped startups. Deepak builds exactly what you need, not bloated enterprise software. Highly recommend.',
    initial: 'V',
    name: 'Vani P.',
    role: 'Startup Founder',
    grad: 'from-fuchsia-500 to-purple-600'
  }
];

const workItems = [
  {
    category: 'OPERATIONS',
    title: 'Real Estate Lead Automation',
    body:
      'Automated lead capture, routing, and follow-up journeys for a high-volume property sales workflow.',
    m1: '1.7x',
    l1: 'Qualified leads/week',
    m2: '28%',
    l2: 'Less manual follow-up',
    tools: ['Google Opal', 'Make', 'Google Sheets'],
    duration: '16 days',
    result: 'From scattered WhatsApp leads to a structured, auto-routed pipeline with instant owner alerts.'
  },
  {
    category: 'SUPPORT',
    title: 'D2C Brand Support Bot',
    body:
      'Built an AI-first customer support layer with FAQ retrieval and smart escalation handling.',
    m1: '37%',
    l1: 'Faster first response',
    m2: '22%',
    l2: 'Lower support workload',
    tools: ['Claude AI', 'Zapier', 'Notion'],
    duration: '14 days',
    result: 'Introduced an always-on assistant that resolved repeat tickets and handed off complex cases with context.'
  },
  {
    category: 'SALES',
    title: 'B2B Lead Qualification Assistant',
    body:
      'Deployed a pre-qualification bot that scores inbound leads and books demo slots automatically.',
    m1: '18%',
    l1: 'More sales calls booked',
    m2: '29%',
    l2: 'Lower no-show rate',
    tools: ['GPT-4', 'Calendly', 'HubSpot'],
    duration: '18 days',
    result: 'Sales reps now receive only high-intent leads with summarized context and recommended next action.'
  },
  {
    category: 'FINANCE',
    title: 'Invoice + Payment Follow-up Automation',
    body:
      'Connected invoicing, reminders, and payment status updates into a hands-free finance flow.',
    m1: '34%',
    l1: 'Faster payment cycle',
    m2: '5h',
    l2: 'Weekly admin saved',
    tools: ['Zoho Books', 'Make', 'WhatsApp API'],
    duration: '12 days',
    result: 'Finance team moved from manual reminder tracking to auto-escalated reminders with payment confirmations.'
  },
  {
    category: 'HR OPS',
    title: 'Hiring Pipeline Auto-Screening',
    body:
      'Created a candidate intake and screening system that ranks applicants against role-specific criteria.',
    m1: '1.9x',
    l1: 'Faster shortlist creation',
    m2: '25%',
    l2: 'Reduced interview load',
    tools: ['Typeform', 'n8n', 'Airtable'],
    duration: '15 days',
    result: 'Hiring managers now review only top-fit candidates with AI-generated scorecards and summaries.'
  },
  {
    category: 'MARKETING',
    title: 'Content Repurposing Workflow',
    body:
      'Set up a weekly content engine that converts one long-form idea into social posts, email snippets, and short videos.',
    m1: '2.0x',
    l1: 'Weekly content output',
    m2: '6h',
    l2: 'Saved per week',
    tools: ['Claude AI', 'Canva', 'Notion'],
    duration: '13 days',
    result: 'Team shifted from inconsistent posting to a repeatable publishing cadence with approval checkpoints.'
  },
  {
    category: 'LEAD OPS',
    title: 'WhatsApp Lead Qualification Bot',
    body:
      'Built a WhatsApp-first conversational bot that captures lead details and routes hot prospects instantly.',
    m1: '24%',
    l1: 'Higher lead response rate',
    m2: '19%',
    l2: 'Improved qualified lead ratio',
    tools: ['WhatsApp API', 'Make', 'Google Sheets'],
    duration: '14 days',
    result: 'Leads now receive instant responses and sales owners get lead summaries without manual sorting.'
  },
  {
    category: 'CLIENT SUCCESS',
    title: 'Onboarding Checklist Automation',
    body:
      'Automated onboarding checklists, reminders, and status reporting for new client projects.',
    m1: '30%',
    l1: 'Faster onboarding completion',
    m2: '4h',
    l2: 'Admin saved each week',
    tools: ['Notion', 'Zapier', 'Gmail'],
    duration: '12 days',
    result: 'Client onboarding became predictable and transparent with less back-and-forth coordination.'
  }
];

const insightItems = [
  {
    title: 'How to Pick the Right AI Workflow',
    excerpt: 'A practical checklist to avoid overbuying tools and deploy faster.',
    readTime: '6 min read',
    category: 'Strategy',
    content:
      'Start from one painful workflow, not from a tool. Map each handoff, identify delay points, and assign cost per step. Choose automation only where decision rules are stable and outcomes are measurable. Pilot in one team, document edge cases, then scale. The best stack is the one your team can maintain in 30 minutes a week.'
  },
  {
    title: 'Automation Ideas for Small Teams',
    excerpt: 'Six systems that save hours per week without hiring more staff.',
    readTime: '5 min read',
    category: 'Operations',
    content:
      'High-leverage automations for small teams include lead routing, meeting summaries, invoice reminders, support triage, onboarding checklists, and performance reporting. Prioritize automations with high repeat frequency and low exception rates. Even two focused automations can remove 20 to 40 hours of low-value manual work each month.'
  },
  {
    title: 'From Chatbot to Revenue Engine',
    excerpt: 'How support automation can improve response quality and conversion.',
    readTime: '7 min read',
    category: 'Growth',
    content:
      'A chatbot becomes a revenue engine when it does three things well: instant qualification, contextual recommendations, and seamless handoff to a human closer. Build your bot around user intent trees, not generic FAQ blobs. Track drop-off points weekly, refine prompts, and connect bot interactions directly to CRM stages for measurable revenue impact.'
  },
  {
    title: 'The First 3 Automations to Build as a Student Founder',
    excerpt: 'A realistic starter stack to deliver value without overcomplicating your setup.',
    readTime: '4 min read',
    category: 'Founder Playbook',
    content:
      'Start with a lead intake flow, a follow-up reminder system, and one reporting dashboard. These three deliver immediate value and are easy to maintain. Avoid building complex multi-agent systems too early; instead, prove one outcome quickly and stack improvements week by week.'
  },
  {
    title: 'How to Price AI Services When You Are Starting Out',
    excerpt: 'Use scope-based pricing and protect delivery quality while staying beginner-friendly.',
    readTime: '6 min read',
    category: 'Business',
    content:
      'Anchor pricing to outcomes and scope boundaries, not only effort. Define one clear deliverable per package, include revision limits, and publish timeline expectations. Entry pricing helps win trust, but your positioning should emphasize reliability and measurable outcomes over being the cheapest option.'
  },
  {
    title: 'A Weekly System for Improving Client Results',
    excerpt: 'Use a simple review cadence to improve automations continuously.',
    readTime: '5 min read',
    category: 'Execution',
    content:
      'Every week, review three metrics: usage, failure rate, and business impact. Log edge cases, prioritize fixes by impact, and ship one small improvement per workflow. This cadence compounds quickly and prevents automations from becoming stale after launch.'
  }
];

const processSteps = [
  {
    title: 'We listen first.',
    desc:
      '30-min free call. We map your workflow, find the 3 biggest time-wasters, and design a clear automation plan.'
  },
  {
    title: 'We design the system.',
    desc:
      'Every automation is documented. You approve the plan before we write a single line of code.'
  },
  {
    title: 'We build the first version.',
    desc:
      'Core workflow goes live with all required integrations and quality checks before handover.'
  },
  {
    title: 'We test with real scenarios.',
    desc:
      'We run edge-case tests and fix reliability gaps so your system works during actual daily usage.'
  },
  {
    title: 'We build it fast.',
    desc:
      'You get daily WhatsApp updates. Most projects shipped in 2-3 weeks. No slow agency timelines.'
  },
  {
    title: 'You own it forever.',
    desc:
      'Full video walkthrough + documentation. 10 days of post-launch support included. It\'s yours completely.'
  }
];

const serviceCards = [
  ['⚡', 'AI Agent Building:', 'Custom AI agents built with Claude and GPT. Automate complex decisions 24/7.'],
  ['🔄', 'Workflow Automation:', 'Connect all your apps. Eliminate manual tasks. Make, Zapier, n8n - whatever fits.'],
  ['🤖', 'Chatbot Development:', 'AI chatbots that handle support, sales, and onboarding - without human intervention.'],
  ['🔍', 'AI Audit & Consulting:', 'We map your entire operation, find every automation opportunity, and build the roadmap.'],
  ['📊', 'CRM Automation:', 'Automated lead capture, follow-up sequences, and pipeline management built for you.'],
  ['🎓', 'AI Training:', 'Teach your team to work with AI. Custom workshops, hands-on, practical.']
];

const serviceThemes = [
  {
    border: 'border-cyan-400/35',
    panel: 'from-cyan-500/18 to-blue-500/10',
    glow: 'bg-cyan-400/20',
    chip: 'text-cyan-200 border-cyan-300/30 bg-cyan-400/10'
  },
  {
    border: 'border-blue-400/35',
    panel: 'from-blue-500/16 to-indigo-500/10',
    glow: 'bg-blue-400/20',
    chip: 'text-blue-200 border-blue-300/30 bg-blue-400/10'
  },
  {
    border: 'border-violet-400/35',
    panel: 'from-violet-500/16 to-fuchsia-500/10',
    glow: 'bg-violet-400/20',
    chip: 'text-violet-200 border-violet-300/30 bg-violet-400/10'
  },
  {
    border: 'border-emerald-400/35',
    panel: 'from-emerald-500/16 to-teal-500/10',
    glow: 'bg-emerald-400/20',
    chip: 'text-emerald-200 border-emerald-300/30 bg-emerald-400/10'
  },
  {
    border: 'border-amber-400/35',
    panel: 'from-amber-500/18 to-orange-500/10',
    glow: 'bg-amber-400/20',
    chip: 'text-amber-200 border-amber-300/30 bg-amber-400/10'
  },
  {
    border: 'border-rose-400/35',
    panel: 'from-rose-500/18 to-pink-500/10',
    glow: 'bg-rose-400/20',
    chip: 'text-rose-200 border-rose-300/30 bg-rose-400/10'
  }
];

const offerings = [
  {
    title: 'AI Agent Building',
    body:
      'We build custom AI agents that think through repetitive decisions, route conversations, and execute tasks with reliable logic.'
  },
  {
    title: 'Workflow Automation',
    body:
      'From leads to invoicing, we stitch your tools into one system so work moves automatically with fewer manual handoffs.'
  },
  {
    title: 'Chatbot Development',
    body:
      'Sales and support bots trained on your business context, designed for fast responses and smooth escalation to humans.'
  },
  {
    title: 'CRM Automation',
    body:
      'We automate follow-ups, lead scoring, and status updates so your CRM stays accurate and actionable without busywork.'
  },
  {
    title: 'AI Consulting',
    body:
      'A practical roadmap to prioritize automation opportunities, estimate ROI, and roll out changes with minimum disruption.'
  },
  {
    title: 'AI Training',
    body:
      'Hands-on workshops that make your team productive with AI tools in day-to-day operations, not just theory.'
  }
];

const faqs = [
  ['Which service is best for me?', 'Most clients start with a quick audit call. We identify the highest-impact workflow and begin there.'],
  ['Why should we choose Clarix?', 'You get practical delivery, clear communication, and systems built around outcomes, not agency buzzwords.'],
  ['How long does the process take?', 'Small builds are usually shipped in 1-2 weeks. Larger systems are planned as phased releases.'],
  ['Can I cancel at any time?', 'Yes. We keep engagements flexible and transparent, with clear milestones and handover artifacts.'],
  ['What tools do you use?', 'Claude, GPT, Make, Zapier, n8n, and custom integrations depending on your stack and use case.'],
  ['What if I am not happy with the result?', 'We iterate with revision windows and documented scope so the final system meets your goals.'],
  ['Do I need technical knowledge?', 'No. We handle implementation and train your team on usage with simple playbooks.'],
  ['Do you work with international clients?', 'Yes. We work remotely across time zones with async updates and structured checkpoints.']
];

const HeroWords = () => {
  const words = useMemo(() => ['We', 'automate', 'the', 'work', "that's", 'slowing', 'you', 'down.'], []);

  return (
    <motion.h1
      className="mx-auto max-w-[1000px] text-center font-syne text-[38px] font-extrabold leading-[1.1] tracking-[-2px] text-white/85 md:text-[52px] xl:text-[64px]"
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: { transition: { staggerChildren: 0.07 } }
      }}
    >
      {words.map((word) => (
        <motion.span
          key={word}
          className={`mr-3 inline-block ${word.includes('down.') ? 'text-[var(--cyan)]' : ''}`}
          variants={{
            initial: { y: 60, opacity: 0 },
            animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const upsertMetaTag = (key, content, attr = 'name') => {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const upsertCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const trackEvent = (eventName, payload = {}) => {
  const eventPayload = {
    ...payload,
    path: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventPayload);
  }

  if (typeof window.plausible === 'function') {
    window.plausible(eventName, { props: payload });
  }

  try {
    const key = 'clarix_analytics_events';
    const existing = JSON.parse(window.localStorage.getItem(key) || '[]');
    const next = [...existing, { eventName, ...eventPayload }].slice(-120);
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch (error) {
    // Ignore storage issues to keep UX uninterrupted.
  }
};

function App() {
  const { addToast } = useToast();
  const [currentPath, setCurrentPath] = useState((window.location.pathname || '/').toLowerCase());
  const [adminUnlocked, setAdminUnlocked] = useState(() => window.localStorage.getItem('clarix_admin_unlocked') === '1');
  const [analyticsEvents, setAnalyticsEvents] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loadingContactSubmissions, setLoadingContactSubmissions] = useState(false);
  const [contactSubmissionsError, setContactSubmissionsError] = useState('');
  const [caseStudies, setCaseStudies] = useState(workItems);
  const [insights, setInsights] = useState(insightItems);
  const [workIndex, setWorkIndex] = useState(0);
  const [offeringIndex, setOfferingIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blogFilter, setBlogFilter] = useState('All');
  const [roiInputs, setRoiInputs] = useState({
    hoursPerMonth: 40,
    hourlyCost: 500,
    automationGain: 35
  });
  const [animatedStats, setAnimatedStats] = useState({ projects: 0, hours: 0, clients: 0 });
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [showBars, setShowBars] = useState(false);
  const [processLineProgress, setProcessLineProgress] = useState(0);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const statsRef = useRef(null);
  const processRef = useRef(null);
  const processProgressRef = useRef(0);
  const logoTapRef = useRef({ count: 0, timer: null });
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const marqueeLoop = `${marqueeBase}  ·  ${marqueeBase}  ·  ${marqueeBase}`;

  useEffect(() => {
    const timer = setTimeout(() => setShowBars(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderExpanded(currentScrollY <= 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const node = statsRef.current;
    if (!node || statsAnimated) return;

    const animateCounters = () => {
      const duration = 2000;
      const getNow = () =>
        typeof window !== 'undefined' && window.performance && typeof window.performance.now === 'function'
          ? window.performance.now()
          : Date.now();
      const raf =
        typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
          ? window.requestAnimationFrame
          : (callback) => setTimeout(() => callback(getNow()), 16);
      const start = getNow();
      const targets = { projects: 4, hours: 32, clients: 3 };

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setAnimatedStats({
          projects: Math.round(targets.projects * easeOut),
          hours: Math.round(targets.hours * easeOut),
          clients: Math.round(targets.clients * easeOut)
        });

        if (progress < 1) {
          raf(step);
        }
      };

      raf(step);
      setStatsAnimated(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [statsAnimated]);

  useEffect(() => {
    if (!selectedInsight) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedInsight(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedInsight]);

  const monthlySaving = Math.round(
    Number(roiInputs.hoursPerMonth) * Number(roiInputs.hourlyCost) * (Number(roiInputs.automationGain) / 100)
  );
  const yearlySaving = monthlySaving * 12;
  const estimatedPaybackMonths = Math.max(1, Math.ceil(25000 / Math.max(monthlySaving, 1)));
  const formatInr = (value) => new Intl.NumberFormat('en-IN').format(value);

  useEffect(() => {
    let isMounted = true;

    const loadPublicContent = async () => {
      try {
        const [casesData, insightsData] = await Promise.allSettled([
          fetchCaseStudies(),
          fetchInsights()
        ]);

        if (!isMounted) return;

        if (casesData.status === 'fulfilled' && casesData.value.length > 0) {
          setCaseStudies(casesData.value);
        }

        if (insightsData.status === 'fulfilled' && insightsData.value.length > 0) {
          setInsights(insightsData.value);
        }
      } catch (error) {
        // Keep local fallback data if API is unavailable.
      }
    };

    loadPublicContent();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (workIndex > caseStudies.length - 1) {
      setWorkIndex(0);
    }
  }, [caseStudies.length, workIndex]);

  useEffect(() => {
    const onPop = () => setCurrentPath((window.location.pathname || '/').toLowerCase());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem('clarix_analytics_events') || '[]');
      setAnalyticsEvents(Array.isArray(stored) ? stored.slice(-12).reverse() : []);
    } catch (error) {
      setAnalyticsEvents([]);
    }
  }, [currentPath]);

  useEffect(() => {
    if (currentPath !== '/admin' || !adminUnlocked) return;

    const fetchSubmissions = async () => {
      setLoadingContactSubmissions(true);
      setContactSubmissionsError('');

      try {
        const result = await apiFetchJson('/api/contact/submissions?limit=20');
        setContactSubmissions(Array.isArray(result?.submissions) ? result.submissions : []);
      } catch (error) {
        setContactSubmissionsError(error.message || 'Could not load submissions.');
      } finally {
        setLoadingContactSubmissions(false);
      }
    };

    fetchSubmissions();
  }, [currentPath, adminUnlocked]);

  useEffect(() => {
    const seoMap = {
      '/': {
        title: 'Clarix | AI Automation Projects by Deepak Varma',
        description: 'Student-built AI automation portfolio: chatbots, workflows, CRM automation, and case studies by Deepak Varma.'
      },
      '/about': {
        title: 'About Deepak Varma | Clarix',
        description: 'Meet Deepak Varma, a student founder building practical AI automation systems for real business workflows.'
      },
      '/cases': {
        title: 'Case Studies | Clarix',
        description: 'Explore AI automation case studies covering lead ops, support bots, finance reminders, and onboarding systems.'
      },
      '/blog': {
        title: 'Blog | Clarix AI Notes',
        description: 'Practical articles on AI workflows, automation strategy, and execution playbooks for small teams.'
      },
      '/contact': {
        title: 'Contact Clarix | Start Your AI Project',
        description: 'Get in touch with Deepak to discuss AI agents, chatbot development, and workflow automation projects.'
      },
      '/admin': {
        title: 'Admin | Clarix',
        description: 'Admin dashboard for Clarix site management.'
      }
    };

    const seo = seoMap[currentPath] || seoMap['/'];
    const canonicalPath = currentPath === '/' ? '/' : currentPath;
    const canonicalUrl = `${window.location.origin}${canonicalPath}`;

    document.title = seo.title;
    upsertMetaTag('description', seo.description, 'name');
    upsertMetaTag('og:title', seo.title, 'property');
    upsertMetaTag('og:description', seo.description, 'property');
    upsertMetaTag('og:type', 'website', 'property');
    upsertMetaTag('og:url', canonicalUrl, 'property');
    upsertMetaTag('twitter:card', 'summary_large_image', 'name');
    upsertMetaTag('twitter:title', seo.title, 'name');
    upsertMetaTag('twitter:description', seo.description, 'name');
    upsertMetaTag('robots', currentPath === '/admin' ? 'noindex, nofollow' : 'index, follow', 'name');
    upsertCanonical(canonicalUrl);

    trackEvent('page_view', { page: currentPath, title: seo.title });
  }, [currentPath]);

  useEffect(() => {
    if (currentPath !== '/') return;

    const interval = setInterval(() => {
      setOfferingIndex((prev) => (prev + 1) % offerings.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [currentPath]);

  useEffect(() => {
    if (currentPath !== '/') return;

    let rafId = null;
    const updateProgress = () => {
      const node = processRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const start = viewport * 0.78;
      const end = -rect.height * 0.6;
      const raw = (start - rect.top) / (start - end);
      const clamped = Math.min(1, Math.max(0, raw));
      const slowed = Math.pow(clamped, 2.1);

      // Avoid unnecessary rerenders on tiny scroll deltas.
      if (Math.abs(slowed - processProgressRef.current) > 0.01) {
        processProgressRef.current = slowed;
        setProcessLineProgress(slowed);
      }
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [currentPath]);

  useEffect(() => {
    return () => {
      if (logoTapRef.current.timer) {
        clearTimeout(logoTapRef.current.timer);
      }
    };
  }, []);

  const navigateTo = (path) => {
    const isPathChange = window.location.pathname !== path;
    
    if (isPathChange) {
      const previousPath = window.location.pathname;
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (isPathChange) {
      trackEvent('navigation_click', { from: window.location.pathname, to: path });
    }
  };

  const goTo = (path) => (event) => {
    if (event) event.preventDefault();
    navigateTo(path);
  };

  const handleLogoClick = (event) => {
    if (event) event.preventDefault();

    const tracker = logoTapRef.current;
    tracker.count += 1;

    if (tracker.timer) {
      clearTimeout(tracker.timer);
    }

    tracker.timer = setTimeout(() => {
      tracker.count = 0;
    }, 1800);

    if (tracker.count >= 5) {
      tracker.count = 0;
      window.localStorage.setItem('clarix_admin_unlocked', '1');
      setAdminUnlocked(true);
      trackEvent('admin_unlock', { method: 'logo_5_taps' });
      navigateTo('/admin');
      return;
    }

    navigateTo('/');
  };

  const goToContactForm = (event) => {
    if (event) event.preventDefault();

    trackEvent('contact_cta_click', { from: window.location.pathname });

    const scrollToForm = () => {
      const form = document.getElementById('contact-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (window.location.pathname !== '/contact') {
      window.history.pushState({}, '', '/contact');
      setCurrentPath('/contact');
      setTimeout(scrollToForm, 120);
      return;
    }

    scrollToForm();
  };

  const goToServices = (event) => {
    if (event) event.preventDefault();

    trackEvent('services_nav_click', { from: window.location.pathname });

    const scrollToServices = () => {
      const services = document.getElementById('services');
      if (services) {
        services.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
      setTimeout(scrollToServices, 120);
      return;
    }

    scrollToServices();
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      service: String(formData.get('service') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      message: String(formData.get('message') || '').trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      addToast('Please fill name, email, and project details before submitting.', 'warning', 4000);
      return;
    }

    setIsSubmittingContact(true);

    try {
      const response = await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const firstValidationError = Array.isArray(result?.errors) ? result.errors[0]?.msg : null;
        throw new Error(firstValidationError || result?.message || 'Submission failed. Please try again.');
      }

      trackEvent('contact_form_submit', { source: 'website_form', status: 'success' });
      form.reset();
      addToast('Thank you! Your message has been sent. We will get back to you soon.', 'success', 4500);
    } catch (error) {
      trackEvent('contact_form_submit', { source: 'website_form', status: 'error' });
      addToast(error.message || 'Could not send your message right now. Please try again.', 'error', 4500);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const footerBlock = (
    <footer className="lux-footer border-t border-white/5 px-4 py-8 sm:px-6 lg:px-[80px]">
      <div className="mb-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8"><span className="mb-1 block h-[2px] w-full bg-white" /><span className="block h-[2px] w-full bg-white" /></div>
          <span className="font-syne text-base font-bold">CLARIX</span>
        </div>
        <div className="flex flex-wrap gap-5 text-[13px] text-[var(--muted2)]">
          <a href="/" onClick={goTo('/')} className="transition-colors hover:text-[#aaaacc]">Home</a>
          <a href="/cases" onClick={goTo('/cases')} className="transition-colors hover:text-[#aaaacc]">Cases</a>
          <a href="/about" onClick={goTo('/about')} className="transition-colors hover:text-[#aaaacc]">About</a>
          <a href="/#services" onClick={goToServices} className="transition-colors hover:text-[#aaaacc]">Services</a>
          <a href="/blog" onClick={goTo('/blog')} className="transition-colors hover:text-[#aaaacc]">Blog</a>
        </div>
      </div>
      <p className="mb-4 text-center text-[13px] text-[#333344]">Designed & built with heart by Deepak</p>
      <div className="flex flex-col gap-2 text-[12px] text-[#333344] lg:flex-row lg:items-center lg:justify-between">
        <span>© 2025 Clarix</span>
        <span>Terms · Email Deepak</span>
      </div>
    </footer>
  );

  if (currentPath === '/about') {
    return (
      <div className="bg-[var(--bg)] text-white/90">
        <header 
          className="fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300"
          style={{
            top: isHeaderExpanded ? '12px' : '8px',
          }}
        >
          <div 
            className="rounded-full border border-white/10 bg-[rgba(10,10,10,0.7)] px-3 md:px-5 py-2.5 backdrop-blur-[30px] shadow-[0_8px_32px_rgba(0,200,255,0.15)] transition-all duration-300 flex items-center justify-between gap-2 md:gap-3"
            style={{
              borderRadius: '50px',
              width: mobileMenuOpen
                ? '90vw'
                : (isHeaderExpanded ? 'min(1200px, calc(100vw - 24px))' : 'min(1000px, calc(100vw - 24px))'),
              minWidth: 0
            }}
          >
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex-shrink-0 w-6 h-6 flex flex-col items-center justify-center gap-1"
              whileTap={{ scale: 0.95 }}
            >
              <span className={`block h-0.5 w-5 bg-[var(--white)] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-5 bg-[var(--white)] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-[var(--white)] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </motion.button>

            {mobileMenuOpen ? (
              <motion.nav 
                className="md:hidden absolute top-16 left-0 right-0 flex flex-col gap-3 bg-[rgba(10,10,10,0.95)] p-4 rounded-2xl backdrop-blur-[30px]" 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <a href="/" onClick={(e) => { goTo('/')(e); setMobileMenuOpen(false); }} className="text-sm text-[var(--muted)] hover:text-white font-medium transition-colors">Home</a>
                <a href="/about" onClick={(e) => { goTo('/about')(e); setMobileMenuOpen(false); }} className="text-sm text-white font-medium">About</a>
                <a href="/cases" onClick={(e) => { goTo('/cases')(e); setMobileMenuOpen(false); }} className="text-sm text-[var(--muted)] hover:text-white font-medium transition-colors">Cases</a>
                <a href="/blog" onClick={(e) => { goTo('/blog')(e); setMobileMenuOpen(false); }} className="text-sm text-[var(--muted)] hover:text-white font-medium transition-colors">Blog</a>
              </motion.nav>
            ) : (
              <motion.nav 
                className="hidden items-center gap-6 md:flex flex-shrink-0 md:ml-6" 
                initial="initial" 
                animate="show" 
                variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
              >
                <motion.a href="/" onClick={goTo('/')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Home</motion.a>
                <motion.a href="/about" onClick={goTo('/about')} className="text-xs flex-shrink-0 text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>About</motion.a>
                <motion.a href="/cases" onClick={goTo('/cases')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Cases</motion.a>
                <motion.a href="/blog" onClick={goTo('/blog')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Blog</motion.a>
              </motion.nav>
            )}

            <a href="/" onClick={handleLogoClick} className="text-center transition-all duration-300 flex-shrink-0 mx-auto">
              <div className="mx-auto mb-0.5 w-6">
                <span className="mb-0.5 block h-[1.5px] w-full bg-white" />
                <span className="block h-[1.5px] w-full bg-white" />
              </div>
              <div className="font-syne text-sm font-extrabold tracking-[3px]">CLARIX</div>
              <div className="text-[8px] tracking-[2px] text-[var(--muted)]">AI</div>
            </a>

            <motion.a 
              href="/contact" 
              onClick={goToContactForm} 
              className="hidden rounded-full flex-shrink-0 bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-[11px] font-semibold text-white shadow-[0_6px_20px_rgba(0,200,255,0.25)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,200,255,0.4)] sm:inline-flex sm:px-6 sm:text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </div>
        </header>

        <main className="relative mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-12" style={{
          paddingTop: isHeaderExpanded ? '120px' : '100px'
        }}>
          <div className="pointer-events-none absolute -left-28 top-24 h-[280px] w-[280px] rounded-full bg-cyan-400/10 blur-[90px]" />
          <div className="pointer-events-none absolute -right-24 top-40 h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[90px]" />
          <section className="lux-about-shell relative grid items-start gap-10 lg:grid-cols-[48%_52%]">
            <motion.div
              className="relative overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br from-[#0d1117] to-[#101826]"
              initial={{ opacity: 0, x: -24, y: 16 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <div className="absolute left-8 top-8 h-9 w-9 rounded-full border border-[#c6a76a]/50" />
              <div className="absolute bottom-6 right-6 text-4xl text-[#d8c39e]">✦</div>
              <div className="min-h-[500px]">
                <img
                  src="/deepak-photo.png"
                  alt="Deepak Varma"
                  className="h-[620px] w-full object-cover object-center"
                />
              </div>
              <div className="absolute right-6 top-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-xs text-[var(--muted)] shadow">
                <div className="font-syne text-xl font-bold text-[#00c8ff]">8+</div>
                <div>AI Tools Mastered</div>
              </div>
              <div className="absolute bottom-6 left-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-xs text-[var(--muted)] shadow">
                <div className="font-syne text-xl font-bold text-[#00c8ff]">4</div>
                <div>Core Services</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24, y: 16 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-[#00c8ff]">THE PERSON BEHIND CLARIX</p>
              <h1 className="mt-3 font-syne text-[32px] font-extrabold leading-[1.05] text-white/90 lg:text-[42px]">
                Built with <span className="text-[#00c8ff]">conviction.</span>
              </h1>
              <motion.div
                className="mt-4 h-[2px] w-36"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  transformOrigin: 'left',
                  background: 'linear-gradient(90deg, rgba(0,200,255,0.85), rgba(79,110,247,0.35), transparent)'
                }}
              />
              <p className="mt-4 text-[14px] leading-7 text-[var(--muted)]">
                <strong>My name is Deepak Varma.</strong> I founded Clarix with one conviction: AI should not be confusing,
                expensive, or exclusive to large corporations.
              </p>
              <p className="mt-3 text-[14px] leading-7 text-[var(--muted)]">
                I have spent years studying major AI platforms and automation systems, not because it was required,
                but because I genuinely believe this technology will reshape how every business operates.
              </p>
              <p className="mt-3 text-[14px] leading-7 text-[var(--muted)]">
                Most businesses hear about AI, feel overwhelmed, and do nothing. <strong>Clarix exists to change that.</strong>
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {['AI Generalist', 'Founder', 'Automation', 'India', 'Builder'].map((chip) => (
                  <span key={chip} className="lux-chip rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs text-[#00c8ff]">{chip}</span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/contact" onClick={goToContactForm} className="lux-primary-btn rounded-full bg-white px-7 py-3 text-sm font-semibold text-[var(--bg)]">Work with Deepak →</a>
                <a href="/cases" onClick={goTo('/cases')} className="lux-ghost-btn rounded-full border border-white/30 px-7 py-3 text-sm text-white">See Case Studies</a>
              </div>
            </motion.div>
          </section>
        </main>

        {footerBlock}
      </div>
    );
  }

  if (currentPath === '/contact') {
    return (
      <div className="bg-[var(--bg)] text-white/90">
        <header 
          className="fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300"
          style={{
            top: isHeaderExpanded ? '12px' : '8px',
          }}
        >
          <div 
            className="rounded-full border border-white/10 bg-[rgba(10,10,10,0.7)] px-3 md:px-5 py-2.5 backdrop-blur-[30px] shadow-[0_8px_32px_rgba(0,200,255,0.15)] transition-all duration-300 flex items-center justify-between gap-2 md:gap-3"
            style={{
              borderRadius: '50px',
              width: isHeaderExpanded ? 'min(1200px, calc(100vw - 24px))' : 'min(1000px, calc(100vw - 24px))',
              minWidth: 0
            }}
          >
            <motion.nav 
              className="hidden items-center gap-6 md:flex flex-shrink-0 md:ml-6" 
              initial="initial" 
              animate="show" 
              variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            >
              <motion.a href="/" onClick={goTo('/')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Home</motion.a>
              <motion.a href="/about" onClick={goTo('/about')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>About</motion.a>
              <motion.a href="/cases" onClick={goTo('/cases')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Cases</motion.a>
              <motion.a href="/blog" onClick={goTo('/blog')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Blog</motion.a>
            </motion.nav>

            <a href="/" onClick={handleLogoClick} className="text-center transition-all duration-300 flex-shrink-0 mx-auto">
              <div className="mx-auto mb-0.5 w-6">
                <span className="mb-0.5 block h-[1.5px] w-full bg-white" />
                <span className="block h-[1.5px] w-full bg-white" />
              </div>
              <div className="font-syne text-sm font-extrabold tracking-[3px]">CLARIX</div>
              <div className="text-[8px] tracking-[2px] text-[var(--muted)]">AI</div>
            </a>

            <motion.a 
              href="/contact" 
              onClick={goToContactForm} 
              className="hidden rounded-full flex-shrink-0 bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-[11px] font-semibold text-white shadow-[0_6px_20px_rgba(0,200,255,0.25)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,200,255,0.4)] sm:inline-flex sm:px-6 sm:text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </div>
        </header>

        <main className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-12" style={{
          paddingTop: isHeaderExpanded ? '80px' : '60px'
        }}>
          <section className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#00c8ff]">GET IN TOUCH</p>
              <h1 className="mt-3 font-syne text-[32px] font-extrabold leading-[1.05] text-white/90">
                Let&apos;s build something <span className="text-[#00c8ff]">remarkable.</span>
              </h1>
              <p className="mt-6 max-w-[500px] text-[14px] leading-7 text-[var(--muted)]">
                Whether you have a specific project or just want to explore what AI can do, Deepak is ready to listen.
              </p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
                {[
                  ['EMAIL', 'kottapalli.deepakvarma2005@gmail.com'],
                  ['PHONE', '+91 94937 43580'],
                  ['WHATSAPP', '+91 94937 43580'],
                  ['BASED', 'India · Available Worldwide'],
                  ['RESPONSE', 'Within 24 hours, always.']
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1 border-b border-[var(--border)] last:border-b-0 sm:grid-cols-[130px_1fr]">
                    <div className="bg-black/20 px-4 py-4 text-xs font-semibold tracking-[0.2em] text-[#00c8ff]">{label}</div>
                    <div className="px-4 py-4 text-[14px] text-[#c4c6de]">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-syne text-[48px] font-bold text-white/90">Send a Message</h2>
              <form id="contact-form" onSubmit={handleContactSubmit} className="mt-6 grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Your Name
                    <input name="name" type="text" required placeholder="Full name" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f16] px-4 py-3 text-sm text-white outline-none focus:border-[#00c8ff]" />
                  </label>
                  <label className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Email Address
                    <input name="email" type="email" required placeholder="your@email.com" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f16] px-4 py-3 text-sm text-white outline-none focus:border-[#00c8ff]" />
                  </label>
                </div>

                <label className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Service Needed
                  <select name="service" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f16] px-4 py-3 text-sm text-white outline-none focus:border-[#00c8ff]">
                    <option value="">Select service type</option>
                    <option value="AI Agent Building">AI Agent Building</option>
                    <option value="Workflow Automation">Workflow Automation</option>
                    <option value="Chatbot Development">Chatbot Development</option>
                    <option value="CRM Automation">CRM Automation</option>
                    <option value="AI Consulting">AI Consulting</option>
                    <option value="Team AI Training">Team AI Training</option>
                  </select>
                </label>

                <label className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">WhatsApp Number (Optional)
                  <input name="phone" type="tel" placeholder="+91 XXXXX XXXXX" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f16] px-4 py-3 text-sm text-white outline-none focus:border-[#00c8ff]" />
                </label>

                <label className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Project Details
                  <textarea name="message" required rows="5" placeholder="Describe your business and what you are hoping AI can help with..." className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f16] px-4 py-3 text-sm text-white outline-none focus:border-[#00c8ff]" />
                </label>

                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="mt-2 w-fit rounded-full bg-white px-7 py-3 text-sm font-semibold text-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingContact ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            </div>
          </section>
        </main>

        {footerBlock}
      </div>
    );
  }

  if (currentPath === '/cases') {
    return (
      <div className="bg-[var(--bg)] text-white/90">
        <header 
          className="fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300"
          style={{
            top: isHeaderExpanded ? '12px' : '8px',
          }}
        >
          <div 
            className="rounded-full border border-white/10 bg-[rgba(10,10,10,0.7)] px-3 md:px-5 py-2.5 backdrop-blur-[30px] shadow-[0_8px_32px_rgba(0,200,255,0.15)] transition-all duration-300 flex items-center justify-between gap-2 md:gap-3"
            style={{
              borderRadius: '50px',
              width: isHeaderExpanded ? 'min(1200px, calc(100vw - 24px))' : 'min(1000px, calc(100vw - 24px))',
              minWidth: 0
            }}
          >
            <motion.nav 
              className="hidden items-center gap-6 md:flex flex-shrink-0 md:ml-6" 
              initial="initial" 
              animate="show" 
              variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            >
              <motion.a href="/" onClick={goTo('/')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Home</motion.a>
              <motion.a href="/about" onClick={goTo('/about')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>About</motion.a>
              <motion.a href="/cases" onClick={goTo('/cases')} className="text-xs flex-shrink-0 text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Cases</motion.a>
              <motion.a href="/blog" onClick={goTo('/blog')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Blog</motion.a>
            </motion.nav>

            <a href="/" onClick={handleLogoClick} className="text-center transition-all duration-300 flex-shrink-0 mx-auto">
              <div className="mx-auto mb-0.5 w-6">
                <span className="mb-0.5 block h-[1.5px] w-full bg-white" />
                <span className="block h-[1.5px] w-full bg-white" />
              </div>
              <div className="font-syne text-sm font-extrabold tracking-[3px]">CLARIX</div>
              <div className="text-[8px] tracking-[2px] text-[var(--muted)]">AI</div>
            </a>

            <motion.a 
              href="/contact" 
              onClick={goToContactForm} 
              className="hidden rounded-full flex-shrink-0 bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-[11px] font-semibold text-white shadow-[0_6px_20px_rgba(0,200,255,0.25)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,200,255,0.4)] sm:inline-flex sm:px-6 sm:text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </div>
        </header>

        <main className="relative mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-12">
          <div className="pointer-events-none absolute -left-20 top-28 h-[240px] w-[240px] rounded-full bg-cyan-400/10 blur-[80px]" />
          <div className="pointer-events-none absolute -right-16 top-[360px] h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[90px]" />
          <section className="lux-cases-shell relative">
            <p className="text-xs uppercase tracking-[0.2em] text-[#00c8ff]">CASE STUDIES</p>
            <h1 className="mt-3 font-syne text-[32px] font-extrabold leading-[1.05] text-white/90 lg:text-[42px]">
              Real builds. <span className="text-[#00c8ff]">Real outcomes.</span>
            </h1>
            <motion.div
              className="mt-4 h-[2px] w-40"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              style={{
                transformOrigin: 'left',
                background: 'linear-gradient(90deg, rgba(0,200,255,0.85), rgba(79,110,247,0.35), transparent)'
              }}
            />
            <p className="mt-5 max-w-[700px] text-[14px] leading-7 text-[var(--muted)]">
              A closer look at the systems we design across operations, sales, support, and growth. Each case shows practical outcomes and delivery timelines.
            </p>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            {caseStudies.map((item, idx) => (
              <motion.article
                key={item.title}
                className="lux-case-card rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-8 transition-all duration-300"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.42, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, borderColor: 'rgba(0,200,255,0.35)', boxShadow: '0 18px 44px rgba(0,200,255,0.12)' }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs tracking-widest text-[var(--cyan)]">{item.category}</span>
                  <span className="rounded-full border border-green-500/40 bg-green-500/10 px-2 py-1 text-xs text-green-400">Live ● {item.duration}</span>
                </div>
                <h3 className="font-syne text-[24px] font-bold text-white/90">{item.title}</h3>
                <p className="mt-3 text-sm font-light leading-7 text-[#888899]">{item.body}</p>
                <p className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-6 text-[#9ea0bb]">{item.result}</p>

                <div className="mt-7 grid grid-cols-2 gap-5">
                  <div>
                    <div className="font-syne text-[30px] font-extrabold text-[var(--cyan)]">{item.m1}</div>
                    <div className="text-xs text-[var(--muted)]">{item.l1}</div>
                  </div>
                  <div>
                    <div className="font-syne text-[30px] font-extrabold text-[var(--cyan)]">{item.m2}</div>
                    <div className="text-xs text-[var(--muted)]">{item.l2}</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <span key={tool} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[var(--muted)]">{tool}</span>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200">Resume Proof</p>
                  <p className="mt-2 text-xs leading-6 text-[#b9bfd9]">Role: Student Full-Stack Builder • Scope: Discovery, build, testing, handover • Delivery: {item.duration}</p>
                </div>
              </motion.article>
            ))}
          </section>
        </main>

        {footerBlock}
      </div>
    );
  }

  if (currentPath === '/admin') {
    if (!adminUnlocked) {
      return (
        <div className="bg-[var(--bg)] text-white/90">
          <main className="mx-auto flex min-h-screen max-w-[880px] items-center px-4 py-24 sm:px-6 lg:px-12">
            <section className="w-full rounded-2xl border border-white/10 bg-[var(--bg-card)] p-8 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">Admin Access Locked</p>
              <h1 className="mt-3 font-syne text-[36px] font-extrabold text-white/90">Restricted Area</h1>
              <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-7 text-[var(--muted)]">
                Click the Clarix logo 5 times quickly to unlock admin.
              </p>
              <a href="/" onClick={goTo('/')} className="mt-7 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-[var(--bg)]">
                Go Home
              </a>
            </section>
          </main>
        </div>
      );
    }

    return (
      <div className="bg-[var(--bg)] text-white/90">
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[rgba(10,10,10,0.85)] px-6 backdrop-blur-[20px] lg:px-12">
          <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center">
            <nav className="hidden items-center gap-8 md:flex">
              <a href="/" onClick={goTo('/')} className="text-sm text-[var(--muted)] transition-colors duration-200 hover:text-white">Home</a>
              <a href="/cases" onClick={goTo('/cases')} className="text-sm text-[var(--muted)] transition-colors duration-200 hover:text-white">Cases</a>
              <a href="/blog" onClick={goTo('/blog')} className="text-sm text-[var(--muted)] transition-colors duration-200 hover:text-white">Blog</a>
            </nav>

            <a href="/" onClick={handleLogoClick} className="justify-self-center text-center">
              <div className="mx-auto mb-1 w-8">
                <span className="mb-1 block h-[2px] w-full bg-white" />
                <span className="block h-[2px] w-full bg-white" />
              </div>
              <div className="font-syne text-base font-extrabold tracking-[4px]">CLARIX</div>
              <div className="text-[9px] tracking-[3px] text-[var(--muted)]">ADMIN MODE</div>
            </a>

            <nav className="flex items-center justify-end gap-8">
              <button
                type="button"
                onClick={() => {
                  window.localStorage.removeItem('clarix_admin_unlocked');
                  setAdminUnlocked(false);
                  navigateTo('/');
                }}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white/90 transition-all duration-200 hover:border-[var(--cyan)] hover:text-[var(--cyan)]"
              >
                Lock Admin
              </button>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-[1320px] px-6 py-24 lg:px-12">
          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">Admin Dashboard</p>
            <h1 className="mt-3 font-syne text-[44px] font-extrabold leading-[1.05] text-white/90 lg:text-[58px]">
              Site controls and content overview
            </h1>
            <p className="mt-4 max-w-[720px] text-[16px] leading-7 text-[var(--muted)]">
              Hidden access is active. Use this page as your admin entry point and jump quickly to content sections.
            </p>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Total Case Studies</p>
              <p className="mt-2 font-syne text-[40px] font-extrabold text-[var(--cyan)]">{caseStudies.length}</p>
              <p className="text-sm text-[var(--muted)]">Published in Cases page</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Total Blog Posts</p>
              <p className="mt-2 font-syne text-[40px] font-extrabold text-[var(--cyan)]">{insights.length}</p>
              <p className="text-sm text-[var(--muted)]">Published in Blog page</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">FAQ Entries</p>
              <p className="mt-2 font-syne text-[40px] font-extrabold text-[var(--cyan)]">{faqs.length}</p>
              <p className="text-sm text-[var(--muted)]">Visible in homepage FAQ</p>
            </article>
          </section>

          <section className="mt-8 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
            <h2 className="font-syne text-[24px] font-bold text-white/90">Quick Actions</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/cases" onClick={goTo('/cases')} className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/90 transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)]">Open Cases Page</a>
              <a href="/blog" onClick={goTo('/blog')} className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/90 transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)]">Open Blog Page</a>
              <a href="/contact" onClick={goToContactForm} className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/90 transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)]">Open Contact Page</a>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-syne text-[24px] font-bold text-white/90">Recent Analytics Events</h2>
              <p className="text-xs text-[var(--muted)]">Source: local storage fallback</p>
            </div>

            {analyticsEvents.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted)]">No events yet. Navigate the site and click CTAs to populate this panel.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-white/10 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  <span>Event</span>
                  <span>Path</span>
                  <span>Time</span>
                </div>
                {analyticsEvents.map((event, idx) => (
                  <div key={`${event.eventName}-${event.timestamp}-${idx}`} className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-white/5 px-4 py-2 text-xs text-[#bfc4df] last:border-b-0">
                    <span className="font-medium text-white/90">{String(event.eventName || 'unknown').replaceAll('_', ' ')}</span>
                    <span>{event.path || '-'}</span>
                    <span>{event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : '-'}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-syne text-[24px] font-bold text-white/90">Recent Contact Submissions</h2>
              <button
                type="button"
                onClick={async () => {
                  setLoadingContactSubmissions(true);
                  setContactSubmissionsError('');

                  try {
                    const result = await apiFetchJson('/api/contact/submissions?limit=20');
                    setContactSubmissions(Array.isArray(result?.submissions) ? result.submissions : []);
                  } catch (error) {
                    setContactSubmissionsError(error.message || 'Could not load submissions.');
                  } finally {
                    setLoadingContactSubmissions(false);
                  }
                }}
                className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white/90 transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)]"
              >
                Refresh
              </button>
            </div>

            {loadingContactSubmissions ? (
              <p className="mt-4 text-sm text-[var(--muted)]">Loading submissions...</p>
            ) : null}

            {contactSubmissionsError ? (
              <p className="mt-4 text-sm text-red-300">{contactSubmissionsError}</p>
            ) : null}

            {!loadingContactSubmissions && !contactSubmissionsError && contactSubmissions.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted)]">No contact submissions yet.</p>
            ) : null}

            {!loadingContactSubmissions && !contactSubmissionsError && contactSubmissions.length > 0 ? (
              <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full border-collapse text-left text-xs text-[#c9cde4]">
                  <thead className="bg-black/25 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Service</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactSubmissions.map((submission) => (
                      <tr key={submission._id} className="border-t border-white/5">
                        <td className="px-3 py-2 font-medium text-white/90">{submission.name || '-'}</td>
                        <td className="px-3 py-2">{submission.email || '-'}</td>
                        <td className="px-3 py-2">{submission.service || '-'}</td>
                        <td className="px-3 py-2">
                          <span className={`rounded-full px-2 py-1 text-[11px] ${submission.emailStatus === 'sent' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                            {submission.emailStatus || 'pending'}
                          </span>
                        </td>
                        <td className="px-3 py-2">{submission.createdAt ? new Date(submission.createdAt).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        </main>
      </div>
    );
  }

  if (currentPath === '/blog') {
    return (
      <div className="bg-[var(--bg)] text-white/90">
        <header 
          className="fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300"
          style={{
            top: isHeaderExpanded ? '12px' : '8px',
          }}
        >
          <div 
            className="rounded-full border border-white/10 bg-[rgba(10,10,10,0.7)] px-3 md:px-5 py-2.5 backdrop-blur-[30px] shadow-[0_8px_32px_rgba(0,200,255,0.15)] transition-all duration-300 flex items-center justify-between gap-2 md:gap-3"
            style={{
              borderRadius: '50px',
              width: mobileMenuOpen
                ? '90vw'
                : (isHeaderExpanded ? 'min(1200px, calc(100vw - 24px))' : 'min(1000px, calc(100vw - 24px))'),
              minWidth: 0
            }}
          >
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex-shrink-0 w-6 h-6 flex flex-col items-center justify-center gap-1"
              whileTap={{ scale: 0.95 }}
            >
              <span className={`block h-0.5 w-5 bg-[var(--white)] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-5 bg-[var(--white)] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-[var(--white)] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </motion.button>

            {mobileMenuOpen ? (
              <motion.nav 
                className="md:hidden absolute top-16 left-0 right-0 flex flex-col gap-3 bg-[rgba(10,10,10,0.95)] p-4 rounded-2xl backdrop-blur-[30px]" 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <a href="/" onClick={(e) => { goTo('/')(e); setMobileMenuOpen(false); }} className="text-sm text-[var(--muted)] hover:text-white font-medium transition-colors">Home</a>
                <a href="/about" onClick={(e) => { goTo('/about')(e); setMobileMenuOpen(false); }} className="text-sm text-[var(--muted)] hover:text-white font-medium transition-colors">About</a>
                <a href="/cases" onClick={(e) => { goTo('/cases')(e); setMobileMenuOpen(false); }} className="text-sm text-[var(--muted)] hover:text-white font-medium transition-colors">Cases</a>
                <a href="/blog" onClick={(e) => { goTo('/blog')(e); setMobileMenuOpen(false); }} className="text-sm text-white font-medium">Blog</a>
              </motion.nav>
            ) : (
              <motion.nav 
                className="hidden items-center gap-6 md:flex flex-shrink-0 md:ml-6" 
                initial="initial" 
                animate="show" 
                variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
              >
                <motion.a href="/" onClick={goTo('/')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Home</motion.a>
                <motion.a href="/about" onClick={goTo('/about')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>About</motion.a>
                <motion.a href="/cases" onClick={goTo('/cases')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Cases</motion.a>
                <motion.a href="/blog" onClick={goTo('/blog')} className="text-xs flex-shrink-0 text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Blog</motion.a>
              </motion.nav>
            )}

            <a href="/" onClick={handleLogoClick} className="text-center transition-all duration-300 flex-shrink-0 mx-auto">
              <div className="mx-auto mb-0.5 w-6">
                <span className="mb-0.5 block h-[1.5px] w-full bg-white" />
                <span className="block h-[1.5px] w-full bg-white" />
              </div>
              <div className="font-syne text-sm font-extrabold tracking-[3px]">CLARIX</div>
              <div className="text-[8px] tracking-[2px] text-[var(--muted)]">AI</div>
            </a>

            <motion.a 
              href="/contact" 
              onClick={goToContactForm} 
              className="hidden rounded-full flex-shrink-0 bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-[11px] font-semibold text-white shadow-[0_6px_20px_rgba(0,200,255,0.25)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,200,255,0.4)] sm:inline-flex sm:px-6 sm:text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </div>
        </header>

        <main className="relative mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-12" style={{
          paddingTop: isHeaderExpanded ? '120px' : '100px'
        }}>
          <div className="pointer-events-none absolute -left-20 top-20 h-[230px] w-[230px] rounded-full bg-cyan-400/10 blur-[80px]" />
          <div className="pointer-events-none absolute -right-24 top-72 h-[260px] w-[260px] rounded-full bg-indigo-500/10 blur-[90px]" />
          <section className="lux-blog-shell relative">
            <p className="text-xs uppercase tracking-[0.2em] text-[#00c8ff]">BLOG & INSIGHTS</p>
            <h1 className="mt-3 font-syne text-[32px] font-extrabold leading-[1.05] text-white/90 lg:text-[42px]">
              Learn AI implementation <span className="text-[#00c8ff]">without fluff.</span>
            </h1>
            <motion.div
              className="mt-4 h-[2px] w-40"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                transformOrigin: 'left',
                background: 'linear-gradient(90deg, rgba(0,200,255,0.85), rgba(79,110,247,0.35), transparent)'
              }}
            />
            <p className="mt-5 max-w-[700px] text-[14px] leading-7 text-[var(--muted)]">
              Practical frameworks, startup-friendly tactics, and real lessons from shipping client automation systems.
            </p>
          </section>

          <section className="mt-8 flex flex-wrap gap-3">
            {['All', 'Strategy', 'Operations', 'Growth'].map((category) => (
              <motion.button
                key={category}
                onClick={() => setBlogFilter(category)}
                className={`rounded-full px-6 py-2 text-xs font-semibold transition-all duration-200 ${
                  blogFilter === category
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-[0_6px_20px_rgba(0,200,255,0.25)]'
                    : 'border border-[var(--border-cyan)] text-[var(--cyan)] hover:bg-[var(--bg-card2)]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights
              .filter((item) => blogFilter === 'All' || item.category === blogFilter)
              .map((item) => (
              <motion.article key={item.title} className="lux-blog-card rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border-cyan)]" {...reveal}>
                <div className="mb-4 flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>{item.category}</span>
                  <span>{item.readTime}</span>
                </div>
                <h3 className="font-syne text-xl font-bold text-white/90">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.excerpt}</p>
                <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-[#a8abc8]">
                  {item.content}
                </p>
              </motion.article>
            ))}
          </section>
        </main>

        {footerBlock}
      </div>
    );
  }

  const knownPaths = ['/', '/about', '/contact', '/cases', '/blog', '/admin'];

  if (!knownPaths.includes(currentPath)) {
    return (
      <div className="bg-[var(--bg)] text-white/90">
        <main className="mx-auto flex min-h-screen max-w-[900px] items-center px-4 py-24 sm:px-6 lg:px-12">
          <section className="w-full rounded-2xl border border-white/10 bg-[var(--bg-card)] p-8 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">Page Not Found</p>
            <h1 className="mt-3 font-syne text-[40px] font-extrabold text-white/90">404</h1>
            <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-7 text-[var(--muted)]">
              The page you requested does not exist. Use the home page navigation to continue.
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <a href="/" onClick={goTo('/')} className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[var(--bg)]">Go Home</a>
              <a href="/contact" onClick={goToContactForm} className="rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white/90 transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)]">Contact</a>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] text-white/90">
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes heroPulse {
          0%, 100% { transform: scale(1); opacity: .55; }
          50% { transform: scale(1.08); opacity: .9; }
        }

        @keyframes heroSheen {
          0% { background-position: 100% 0; }
          100% { background-position: -120% 0; }
        }

        @keyframes serviceSweep {
          0% { transform: translateX(-12%) translateY(0); }
          50% { transform: translateX(12%) translateY(-8px); }
          100% { transform: translateX(-12%) translateY(0); }
        }

        @keyframes serviceFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
      `}</style>

      <header 
        className="fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300"
        style={{
          top: isHeaderExpanded ? '12px' : '8px',
        }}
      >
        <div 
          className="rounded-full border border-white/10 bg-[rgba(10,10,10,0.7)] px-3 md:px-5 py-2.5 backdrop-blur-[30px] shadow-[0_8px_32px_rgba(0,200,255,0.15)] transition-all duration-300 flex items-center justify-between gap-2 md:gap-3"
          style={{
            borderRadius: '50px',
            width: isHeaderExpanded ? 'min(1200px, calc(100vw - 24px))' : 'min(1000px, calc(100vw - 24px))',
            minWidth: 0
          }}
        >
          <motion.nav 
            className="hidden items-center gap-6 md:flex flex-shrink-0 md:ml-6" 
            initial="initial" 
            animate="show" 
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
          >
            <motion.a href="/" onClick={goTo('/')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Home</motion.a>
            <motion.a href="/about" onClick={goTo('/about')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>About</motion.a>
            <motion.a href="/cases" onClick={goTo('/cases')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Cases</motion.a>
            <motion.a href="/blog" onClick={goTo('/blog')} className="text-xs flex-shrink-0 text-[var(--muted)] transition-colors duration-200 hover:text-white font-medium" variants={{ initial: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>Blog</motion.a>
          </motion.nav>

          <a href="/" onClick={handleLogoClick} className="text-center transition-all duration-300 flex-shrink-0 mx-auto">
            <div className="mx-auto mb-0.5 w-6">
              <span className="mb-0.5 block h-[1.5px] w-full bg-white" />
              <span className="block h-[1.5px] w-full bg-white" />
            </div>
            <div className="font-syne text-sm font-extrabold tracking-[3px]">CLARIX</div>
            <div className="text-[8px] tracking-[2px] text-[var(--muted)]">AI</div>
          </a>

          <motion.a 
            href="/contact" 
            onClick={goToContactForm} 
            className="hidden rounded-full flex-shrink-0 bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-[11px] font-semibold text-white shadow-[0_6px_20px_rgba(0,200,255,0.25)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,200,255,0.4)] sm:inline-flex sm:px-6 sm:text-xs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
        </div>
      </header>

      <main className="transition-all duration-300" style={{
        paddingTop: isHeaderExpanded ? '80px' : '60px'
      }}>
        <section id="home" className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-[72px] text-center sm:px-6 lg:px-[80px]">
          {/* Enhanced background gradients */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl" style={{ 
            background: 'radial-gradient(circle, rgba(0,200,255,0.25) 0%, rgba(79,110,247,0.12) 40%, transparent 70%)',
            animation: 'heroPulse 12s ease-in-out infinite',
            willChange: 'transform'
          }} />
          <div className="pointer-events-none absolute bottom-0 right-[5%] h-[300px] w-[300px] rounded-full blur-3xl" style={{ 
            background: 'radial-gradient(circle, rgba(79,110,247,0.2) 0%, transparent 70%)',
            animation: 'heroFloat 14s ease-in-out infinite',
            willChange: 'transform'
          }} />
          <div className="pointer-events-none absolute top-1/3 left-[3%] h-[250px] w-[250px] rounded-full blur-3xl" style={{ 
            background: 'radial-gradient(circle, rgba(0,200,255,0.15) 0%, transparent 70%)',
            animation: 'serviceSweep 16s ease-in-out infinite',
            willChange: 'transform'
          }} />

          {/* Grid background effect */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

          <motion.div className="mb-4 flex items-center justify-center" {...reveal}>
            <div className="flex items-center gap-1.5">
              {[
                ['R', 'from-blue-500 to-violet-600'],
                ['S', 'from-cyan-500 to-sky-700'],
                ['A', 'from-amber-500 to-orange-700'],
                ['M', 'from-pink-500 to-rose-700'],
                ['D', 'from-green-500 to-emerald-700']
              ].map(([t, grad], i) => (
                <motion.div 
                  key={t} 
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-[var(--bg)] bg-gradient-to-br ${grad} font-syne font-bold shadow-[0_6px_16px_rgba(0,0,0,0.2)]`}
                  style={{ marginLeft: i ? '-10px' : 0 }}
                  whileHover={{ scale: 1.12, zIndex: 50 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-[12px] font-bold">{t}</span>
                </motion.div>
              ))}
            </div>
            <motion.p className="ml-3 text-[12px] text-[var(--muted)]" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>Loved by 5+ founders</motion.p>
          </motion.div>

          <motion.div
            className="mb-8 inline-flex items-center rounded-full border border-cyan-300/30 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] text-cyan-200 shadow-[0_8px_32px_rgba(0,200,255,0.15)]"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(0,200,255,0.25)' }}
          >
            <span className="mr-2">✨</span>
            Student-led AI Studio
          </motion.div>

          <HeroWords />

          <motion.p 
            className="mt-5 max-w-[580px] text-[14px] leading-relaxed text-[#aabbcc]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Clarix builds <span className="text-[#00c8ff] font-semibold">AI automations</span>, <span className="text-[#00c8ff] font-semibold">chatbots</span>, and <span className="text-[#00c8ff] font-semibold">workflow systems</span> for startups and small businesses. Honest pricing. 1-2 week delivery. Real results.
          </motion.p>

          <motion.div 
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <motion.a
              href="/contact"
              onClick={goToContactForm}
              className="relative group rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_30px_rgba(0,200,255,0.3)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,200,255,0.4)]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-1.5">
                Book a Free Call
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[14px]"
                >
                  →
                </motion.span>
              </span>
            </motion.a>
            <motion.a 
              href="#work" 
              className="rounded-full border-2 border-white/20 bg-white/5 px-7 py-2.5 text-[13px] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
              whileHover={{ scale: 1.05, y: -1.5 }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                See Our Work ↓
              </motion.span>
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {['24h response SLA', 'No lock-in contracts', 'Live WhatsApp support', 'Built for India-first teams'].map((pill, idx) => (
              <motion.span 
                key={pill} 
                className="rounded-full border border-white/20 bg-white/[0.03] px-3.5 py-2 text-[11px] text-[#aac6df] backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08]"
                whileHover={{ scale: 1.04 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                ✓ {pill}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="mt-7 grid w-full max-w-[900px] gap-3 md:grid-cols-3"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {[
              ['Automations Running', '4', 'Across lead capture, support, and ops'],
              ['Avg Team Time Saved', '5 hrs/wk', 'Measured after implementation'],
              ['Launch Window', '12-20 days', 'From audit to live workflow']
            ].map(([k, v, t], idx) => (
              <motion.div 
                key={k} 
                className="group relative rounded-xl border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 text-left shadow-[0_16px_40px_rgba(0,200,255,0.08)] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,200,255,0.15)]"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -3 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: 'radial-gradient(circle at 0% 0%, rgba(0,200,255,0.08), transparent)',
                  pointerEvents: 'none'
                }} />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#00c8ff] font-semibold">{k}</div>
                  <div className="mt-2 font-syne text-[28px] font-extrabold leading-none text-white">{v}</div>
                  <div className="mt-1.5 text-[12px] text-[#aabbcc]">{t}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-6 h-[1px] w-full max-w-[700px]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
            style={{
              background: 'linear-gradient(90deg, rgba(0,200,255,0.0), rgba(0,200,255,0.6), rgba(79,110,247,0.4), rgba(0,200,255,0.0))',
              backgroundSize: '200% 100%',
              animation: 'heroSheen 7s linear infinite',
              transformOrigin: 'center'
            }}
          />
        </section>

        <section
          ref={statsRef}
          className="grid grid-cols-2 border-y border-white/10 bg-[var(--bg)] px-4 py-8 text-center sm:px-6 md:grid-cols-4 lg:px-[80px]"
        >
          {[
            [`${animatedStats.projects}+`, 'Projects Shipped'],
            [`${animatedStats.hours}+`, 'Hours Saved'],
            [`${animatedStats.clients}+`, 'Clients Served'],
            ['2-3 Weeks', 'Avg Delivery Time']
          ].map(([value, label], index) => (
            <div key={label} className={`${index < 3 ? 'md:border-r md:border-white/10' : ''} px-4 py-3`}>
              <div className="font-syne text-[28px] font-extrabold leading-none text-white/90 md:text-[32px]">{value}</div>
              <div className="mt-1.5 text-[12px] font-light text-[var(--muted)]">{label}</div>
            </div>
          ))}
        </section>

        <section className="relative overflow-hidden bg-[var(--bg)] px-4 py-14 text-center sm:px-6 lg:px-[80px]">
          <div className="pointer-events-none absolute left-1/4 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,200,255,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="pointer-events-none absolute right-1/4 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(79,110,247,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <div
              className="mx-auto w-full max-w-[600px] rounded-[20px] border border-cyan-400/20 bg-[#0e0e18] p-7"
              style={{
                boxShadow:
                  '0 0 0 1px rgba(0,200,255,0.05), 0 40px 80px rgba(0,0,0,0.5), 0 0 80px rgba(0,200,255,0.05)',
                animation: 'floatCard 4s ease-in-out infinite'
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y - rect.height / 2) / rect.height) * -8;
                const rotateY = ((x - rect.width / 2) / rect.width) * 8;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
                e.currentTarget.style.transition = 'transform 0.1s ease';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                e.currentTarget.style.transition = 'transform 0.6s ease';
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="text-sm font-medium text-white/90">Clarix Dashboard</div>
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
              </div>

              <div className="mb-4 border-b border-white/10" />

              {[
                ['Lead Bot', 'Running', 'bg-green-500/10 text-green-400 border-green-500/20'],
                ['Invoice Sender', 'Active', 'bg-green-500/10 text-green-400 border-green-500/20'],
                ['Support Agent', 'Live', 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20']
              ].map(([label, badge, cls]) => (
                <div key={label} className="mb-2 flex items-center justify-between rounded-[10px] bg-white/5 px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <span className="text-sm font-normal text-[#ccccdd]">{label}</span>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs ${cls}`}>{badge}</span>
                </div>
              ))}

              <div className="my-4 border-b border-white/10" />

              <div className="grid gap-3">
                {[
                  ['Hours saved:', showBars ? '50%' : '0%', '5h'],
                  ['Tasks done:', showBars ? '100%' : '0%', '46']
                ].map(([label, width, value]) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="min-w-[88px] text-left text-[12px] font-light text-[var(--muted)] sm:min-w-[110px] sm:text-[13px]">{label}</div>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1a1a2e]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #00c8ff, #4f6ef7)',
                          width,
                          transition: 'width 1.5s ease 0.8s'
                        }}
                      />
                    </div>
                    <div className="min-w-[30px] text-right text-sm font-semibold text-white/90 sm:min-w-[36px]">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-light text-[#444466]">All systems running</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                  <span className="text-[11px] font-semibold tracking-[1.5px] text-green-500">LIVE</span>
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="roi" className="px-4 py-[92px] sm:px-6 lg:px-[80px]">
          <motion.div className="mb-10 text-center" {...reveal}>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">QUICK ROI CALCULATOR</p>
            <h2 className="mt-3 font-syne text-[34px] font-extrabold text-white/90 lg:text-[46px]">
              Estimate What Automation Saves You
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-sm leading-7 text-[var(--muted)]">
              Use this quick model to estimate your time and cost savings before booking a strategy call.
            </p>
          </motion.div>

          <motion.div className="grid gap-6 rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] p-7 lg:grid-cols-[1.1fr_0.9fr] lg:p-10" {...reveal}>
            <div className="space-y-6">
              <label className="block">
                <div className="mb-2 text-sm text-[#aaaacc]">Manual hours spent per month</div>
                <input
                  type="number"
                  min="1"
                  value={roiInputs.hoursPerMonth}
                  onChange={(e) => setRoiInputs((prev) => ({ ...prev, hoursPerMonth: Math.max(1, Number(e.target.value) || 1) }))}
                  className="w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-white outline-none transition-colors focus:border-[var(--border-cyan)]"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm text-[#aaaacc]">Average hourly team cost (Rs)</div>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={roiInputs.hourlyCost}
                  onChange={(e) => setRoiInputs((prev) => ({ ...prev, hourlyCost: Math.max(100, Number(e.target.value) || 100) }))}
                  className="w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-white outline-none transition-colors focus:border-[var(--border-cyan)]"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm text-[#aaaacc]">Expected automation gain: {roiInputs.automationGain}%</div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={roiInputs.automationGain}
                  onChange={(e) => setRoiInputs((prev) => ({ ...prev, automationGain: Number(e.target.value) }))}
                  className="w-full accent-cyan-400"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-[rgba(0,200,255,0.06)] p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--cyan)]">Projected Impact</p>
              <div className="mt-5 grid gap-5">
                <div>
                  <p className="text-xs text-[var(--muted)]">Monthly saving</p>
                  <p className="font-syne text-[36px] font-extrabold text-white/90">Rs.{formatInr(monthlySaving)}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Yearly saving</p>
                  <p className="font-syne text-[36px] font-extrabold text-white/90">Rs.{formatInr(yearlySaving)}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Estimated payback</p>
                  <p className="font-syne text-[26px] font-bold text-[var(--cyan)]">~ {estimatedPaybackMonths} month(s)</p>
                </div>
              </div>
              <a
                href="/contact"
                onClick={goToContactForm}
                className="mt-7 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--cyan)]"
              >
                Book a Free Call
              </a>
            </div>
          </motion.div>
        </section>

        <div className="marquee-wrap">
          <div className="marquee-track">
            <span>{marqueeLoop}</span>
            <span>{marqueeLoop}</span>
          </div>
        </div>

        <section id="testimonials" className="px-4 py-[100px] sm:px-6 lg:px-[80px]">
          <motion.div className="overflow-hidden" {...reveal}>
            <div className="testimonial-track">
              {duplicatedTestimonials.map((t, i) => (
                <article key={`${t.name}-${i}`} className="w-[88vw] max-w-[340px] flex-shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-7">
                  <p className="text-[15px] font-light leading-7 text-[#aaaacc]">{t.quote}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.grad} font-syne text-[13px] font-bold`}>{t.initial}</div>
                    <div>
                      <div className="text-sm font-semibold text-white/90">{t.name}</div>
                      <div className="text-[13px] text-[var(--muted)]">{t.role}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        <div className="marquee-wrap">
          <div className="marquee-track">
            <span>{marqueeLoop}</span>
            <span>{marqueeLoop}</span>
          </div>
        </div>

        <section id="work" className="px-4 py-[100px] sm:px-6 lg:px-[80px]">
          <motion.div className="mb-10 overflow-hidden" {...reveal}>
            <div className="whitespace-nowrap font-syne text-[60px] font-black uppercase tracking-[4px] text-white/5 lg:text-[100px]">Work · Work · Work · Work · Work</div>
          </motion.div>

          <div className="mb-6 flex justify-end gap-2">
            <button type="button" onClick={() => setWorkIndex((p) => (p - 1 + caseStudies.length) % caseStudies.length)} className="rounded-full border border-white/10 px-3 py-2 text-[var(--muted)] hover:border-[var(--border-cyan)] hover:text-[var(--cyan)]">←</button>
            <button type="button" onClick={() => setWorkIndex((p) => (p + 1) % caseStudies.length)} className="rounded-full border border-white/10 px-3 py-2 text-[var(--muted)] hover:border-[var(--border-cyan)] hover:text-[var(--cyan)]">→</button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {[caseStudies[workIndex], caseStudies[(workIndex + 1) % caseStudies.length]].map((item) => (
              <motion.article key={item.title} className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-9" {...reveal}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs tracking-widest text-[var(--cyan)]">{item.category}</span>
                  <span className="rounded-full border border-green-500/40 bg-green-500/10 px-2 py-1 text-xs text-green-400">Live ● {item.duration}</span>
                </div>
                <h3 className="font-syne text-[22px] font-bold text-white/90">{item.title}</h3>
                <p className="mt-3 text-sm font-light leading-7 text-[#888899]">{item.body}</p>
                <p className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-6 text-[#9ea0bb]">{item.result}</p>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div><div className="font-syne text-[32px] font-extrabold text-[var(--cyan)]">{item.m1}</div><div className="text-xs text-[var(--muted)]">{item.l1}</div></div>
                  <div><div className="font-syne text-[32px] font-extrabold text-[var(--cyan)]">{item.m2}</div><div className="text-xs text-[var(--muted)]">{item.l2}</div></div>
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <span key={tool} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[var(--muted)]">{tool}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>

          <p className="mt-8 text-sm text-[var(--muted)]">Use arrows to explore all case studies.</p>
        </section>

        <div className="marquee-wrap"><div className="marquee-track">{marqueeBase} {marqueeBase}</div></div>

        <section id="process" ref={processRef} className="px-4 py-[100px] sm:px-6 lg:px-[80px]">
          <motion.div className="mb-10 overflow-hidden" {...reveal}>
            <div className="whitespace-nowrap font-syne text-[60px] font-black uppercase tracking-[4px] text-white/5 lg:text-[100px]">Process · Process · Process</div>
          </motion.div>

          <div className="relative">
            <div className="pointer-events-none absolute left-[20px] top-0 h-full w-[2px] rounded-full bg-white/10" />
            <div
              className="pointer-events-none absolute left-[20px] top-0 w-[2px] rounded-full bg-gradient-to-b from-cyan-300 via-[var(--cyan)] to-blue-500 transition-[height] duration-[1600ms]"
              style={{ height: `${Math.max(4, processLineProgress * 100)}%` }}
            />

            {processSteps.map((step, i) => {
              return (
                <motion.div key={step.title} className="grid grid-cols-[30px_1fr] gap-5 border-b border-white/5 py-10 sm:grid-cols-[40px_1fr] sm:gap-8 sm:py-12" {...reveal}>
                  <div className="pt-2" />
                  <div>
                    <h3 className="mb-3 font-syne text-[28px] font-bold text-white/90 lg:text-[32px]">{step.title}</h3>
                    <p className="max-w-[540px] text-base font-light leading-8 text-[var(--muted)]">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="services" className="relative overflow-hidden px-4 py-[100px] sm:px-6 lg:px-[80px]">
          <div
            className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(0,200,255,0.25) 0%, transparent 70%)', animation: 'serviceSweep 10s ease-in-out infinite' }}
          />
          <div
            className="pointer-events-none absolute right-[-30px] bottom-10 h-52 w-52 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', animation: 'serviceSweep 12s ease-in-out infinite reverse' }}
          />

          <motion.p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--cyan)]" {...reveal}>WHAT WE DO</motion.p>
          <motion.h2 className="mb-4 font-syne text-[36px] font-extrabold text-white/90 lg:text-[48px]" {...reveal}>Here is what we do</motion.h2>
          <motion.p className="mb-12 max-w-[650px] text-sm leading-7 text-[var(--muted)]" {...reveal}>
            Every service is built to deliver one clear business outcome quickly, with clean handover and practical support.
          </motion.p>

          <div className="grid gap-5 md:grid-cols-2">
            {serviceCards.map(([icon, title, text], idx) => {
              const theme = serviceThemes[idx % serviceThemes.length];
              return (
                <motion.article
                  key={title}
                  className={`group relative overflow-hidden rounded-2xl border ${theme.border} bg-gradient-to-br ${theme.panel} px-8 py-7 transition-all duration-300 cursor-pointer`}
                  {...reveal}
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl group-hover:opacity-100 transition-opacity duration-300" style={{ animation: 'serviceFloat 5s ease-in-out infinite' }}>
                    <div className={`h-full w-full rounded-full ${theme.glow}`} />
                  </div>
                  
                  <div className="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full opacity-20 blur-3xl" style={{
                    background: `radial-gradient(circle, ${theme.glow.split(' ')[1]} 0%, transparent 70%)`,
                    animation: 'serviceSweep 8s ease-in-out infinite'
                  }} />

                  <motion.div className="mb-2 inline-flex items-center rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[11px] tracking-[0.14em] text-[#c8cae4]">
                    Service {String(idx + 1).padStart(2, '0')}
                  </motion.div>

                  <div className="flex items-start gap-3 relative z-10">
                    <motion.div
                      className={`mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${theme.chip} text-[24px]`}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4 + idx * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                    >
                      {icon}
                    </motion.div>
                    <div>
                      <h3 className="font-syne text-[18px] font-bold text-white/90 group-hover:text-[#00c8ff] transition-colors duration-300">{title}</h3>
                      <p className="mt-3 text-sm font-light leading-7 text-[#b7b9cf]">{text}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="blog" className="px-4 py-[100px] sm:px-6 lg:px-[80px]">
          <motion.div className="mb-10" {...reveal}>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">BLOG & INSIGHTS</p>
            <h2 className="mt-3 font-syne text-[36px] font-extrabold lg:text-[48px]">Latest from Clarix</h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {insights.map((item, idx) => (
              <motion.article 
                key={item.title} 
                className="group relative rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-7 transition-all duration-300 cursor-pointer hover:border-[var(--border-cyan)] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: 'radial-gradient(circle at 0% 0%, rgba(0,200,255,0.1) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />
                
                <div className="mb-4 flex items-center justify-between text-xs text-[var(--muted)] relative z-10">
                  <motion.span 
                    className="px-2 py-1 rounded-full bg-[rgba(0,200,255,0.1)] text-[#00c8ff]"
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.category}
                  </motion.span>
                  <span>{item.readTime}</span>
                </div>
                <h3 className="font-syne text-xl font-bold text-white/90 group-hover:text-[#00c8ff] transition-colors duration-300 relative z-10">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)] relative z-10">{item.excerpt}</p>
                <motion.button
                  type="button"
                  onClick={() => setSelectedInsight(item)}
                  className="mt-5 inline-block text-sm text-[var(--cyan)] transition-colors hover:text-white relative z-10 group"
                  whileHover={{ x: 4 }}
                >
                  Read more 
                  <motion.span
                    className="inline-block ml-1"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="pricing" className="px-4 py-[100px] sm:px-6 lg:px-[80px]">
          <div className="marquee-wrap mb-12"><div className="marquee-track">Pricing · Pricing · Pricing · Pricing</div></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <motion.article 
              className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-9 group hover:border-[rgba(0,200,255,0.5)] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <h3 className="font-syne text-lg text-[#aaaacc]">Starter</h3>
              <p className="mt-4 font-syne text-[52px] font-extrabold">Rs.1,000</p>
              <p className="mt-2 text-sm text-[var(--muted)]">1 automation or chatbot. Perfect for your first AI project.</p>
              <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
                {['World-class AI build', 'One request at a time', 'Pause or cancel anytime', 'WhatsApp support'].map((f) => (
                  <motion.li key={f} whileHover={{ x: 4 }} className="transition-colors group hover:text-[#00c8ff]">
                    <span className="mr-2 text-[var(--cyan)]">+</span>{f}
                  </motion.li>
                ))}
              </ul>
              <motion.button 
                type="button" 
                onClick={goToContactForm} 
                className="mt-8 w-full rounded-full bg-white py-3 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:bg-[var(--cyan)] hover:shadow-[0_10px_30px_rgba(0,200,255,0.3)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </motion.article>

            <motion.article 
              className="relative rounded-[20px] border border-[rgba(0,200,255,0.5)] bg-[var(--teal-card)] p-9 group overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -12, scale: 1.03 }}
            >
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-300" style={{
                background: 'radial-gradient(circle at 0% 0%, rgba(0,200,255,0.2), transparent)',
                pointerEvents: 'none'
              }} />
              <motion.span 
                className="absolute right-0 top-0 rounded-bl-xl bg-[var(--cyan)] px-3 py-1 text-xs font-semibold text-[var(--bg)]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Most Popular
              </motion.span>
              <h3 className="font-syne text-lg text-white/90">Standard</h3>
              <p className="mt-4 font-syne text-[52px] font-extrabold">Rs.2,000</p>
              <p className="mt-2 text-sm text-white/80">2 automations + chatbot. Ideal for growing businesses.</p>
              <ul className="mt-6 space-y-2 text-sm text-white/80 relative z-10">
                {['Full-Time AI Engineer', 'Expert Project Manager', 'Daily WhatsApp updates', '2 revisions included', 'Pause or cancel anytime', 'Priority support'].map((f) => (
                  <motion.li key={f} whileHover={{ x: 4 }} className="transition-colors group hover:text-white">
                    <span className="mr-2 text-white">+</span>{f}
                  </motion.li>
                ))}
              </ul>
              <motion.button 
                type="button" 
                onClick={goToContactForm} 
                className="mt-8 w-full rounded-full bg-[var(--cyan)] py-3 text-sm font-semibold text-[var(--bg)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,200,255,0.4)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </motion.article>

            <motion.article 
              className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-9 group hover:border-[rgba(0,200,255,0.5)] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <h3 className="font-syne text-lg text-[#aaaacc]">Custom</h3>
              <p className="mt-4 font-syne text-[52px] font-extrabold">Rs.3,000+</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Full AI system. Complex workflows, multiple automations.</p>
              <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
                {['2x AI Engineers', 'Dedicated Project Manager', 'Unlimited revisions', 'Slack direct access', 'Full documentation', '30-day post-launch support'].map((f) => (
                  <motion.li key={f} whileHover={{ x: 4 }} className="transition-colors group hover:text-[#00c8ff]">
                    <span className="mr-2 text-[var(--cyan)]">+</span>{f}
                  </motion.li>
                ))}
              </ul>
              <motion.a 
                href="/contact" 
                onClick={goToContactForm} 
                className="mt-8 block w-full rounded-full border border-white/30 py-3 text-center text-sm text-white transition-all duration-300 hover:border-[var(--cyan)] hover:text-[var(--cyan)] hover:shadow-[0_10px_30px_rgba(0,200,255,0.2)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Book a Call
              </motion.a>
            </motion.article>
          </div>
        </section>

        <section id="about" className="grid gap-10 px-4 py-[100px] sm:px-6 lg:grid-cols-[40%_60%] lg:px-[80px]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">HERE IS WHAT WE DO</p>
            <div className="mt-8 space-y-3">
              {offerings.map((item, i) => (
                <button
                  type="button"
                  key={item.title}
                  onClick={() => setOfferingIndex(i)}
                  className={`flex w-full items-center gap-3 text-left font-syne text-2xl transition-colors ${offeringIndex === i ? 'font-bold text-[var(--cyan)]' : 'font-normal text-[var(--muted2)] hover:text-[#aaaacc]'}`}
                >
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs ${offeringIndex === i ? 'border-[var(--border-cyan)] bg-[rgba(0,200,255,0.12)] text-[var(--cyan)]' : 'border-white/10 text-[var(--muted2)]'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{item.title}{offeringIndex === i ? ' ←' : ''}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={offerings[offeringIndex].title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--cyan)]">
                  Step {String(offeringIndex + 1).padStart(2, '0')} / {String(offerings.length).padStart(2, '0')}
                </p>
                <h3 className="font-syne text-[30px] font-extrabold text-white/90 lg:text-[36px]">{offerings[offeringIndex].title}</h3>
                <p className="mt-5 max-w-[720px] text-lg leading-8 text-[var(--muted)]">{offerings[offeringIndex].body}</p>
                <div className="mt-6 h-1 w-full max-w-[420px] overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--cyan)] to-blue-400 transition-all duration-500"
                    style={{ width: `${((offeringIndex + 1) / offerings.length) * 100}%` }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section id="faq" className="grid gap-12 px-4 py-[100px] sm:px-6 lg:grid-cols-[40%_60%] lg:px-[80px]">
          <motion.div {...reveal}>
            <h2 className="font-syne text-[52px] font-extrabold leading-none lg:text-[64px]">Frequently<br />asked<br /><span className="text-[var(--cyan)]">questions</span></h2>
            <p className="mt-6 max-w-[320px] text-sm leading-7 text-[var(--muted)]">
              (Find answers to frequently asked questions about Clarix, our range of services, how we operate, and insights on maximizing the benefits of our AI services.)
            </p>
          </motion.div>

          <div>
            {faqs.map(([q, a], i) => (
              <div key={q} className="border-b border-[var(--border)] py-5">
                <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setOpenFaq((prev) => (prev === i ? null : i))}>
                  <span className="font-syne text-base font-semibold">{q}</span>
                  <span className="text-xl text-[var(--muted)]">{openFaq === i ? '↑' : '↓'}</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="pt-3 text-sm leading-7 text-[#888899]">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className="px-4 py-[100px] text-center sm:px-6 lg:px-[80px]">
          <div className="marquee-wrap mb-10"><div className="marquee-track text-[var(--cyan)]">· AI Automation · Chatbots · Workflow · Make · Zapier · n8n · AI Automation · Chatbots · Workflow ·</div></div>
          <motion.h2 className="mx-auto max-w-[900px] font-syne text-[38px] font-extrabold leading-tight lg:text-[52px]" {...reveal}>
            More Than Just Automations:<br />We are Your AI Partners!
          </motion.h2>
          <motion.p className="mx-auto mt-6 max-w-[620px] text-base text-[var(--muted)]" {...reveal}>
            Got questions, project ideas, or just want to say hi? We are all ears!
          </motion.p>
          <motion.a href="/contact" onClick={goToContactForm} className="mt-8 inline-block rounded-full bg-white px-10 py-4 text-base font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--cyan)]" {...reveal}>
            Book a Free Call →
          </motion.a>
        </section>
      </main>

      {footerBlock}

      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedInsight(null)}
          >
            <motion.article
              className="relative w-full max-w-[760px] rounded-[24px] border border-[var(--border-cyan)] bg-[#0f1118] p-8"
              initial={{ y: 30, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedInsight(null)}
                className="absolute right-4 top-4 h-9 w-9 rounded-full border border-white/20 text-lg text-[var(--muted)] transition-colors hover:border-white/50 hover:text-white"
                aria-label="Close insight"
              >
                ×
              </button>

              <div className="mb-4 flex items-center gap-3 text-xs text-[var(--muted)]">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[var(--cyan)]">{selectedInsight.category}</span>
                <span>{selectedInsight.readTime}</span>
              </div>

              <h3 className="pr-10 font-syne text-[30px] font-extrabold leading-tight text-white/90">
                {selectedInsight.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-[#a8abc8]">{selectedInsight.content}</p>

              <div className="mt-7 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--cyan)]">Implementation Tip</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Apply this with one workflow first, define baseline metrics, and compare weekly outcomes before scaling.
                </p>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;


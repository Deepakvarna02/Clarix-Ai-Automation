import { apiFetchJson } from './apiClient';

const mapCaseItem = (item) => ({
  category: item.category || 'GENERAL',
  title: item.title || 'Untitled case',
  body: item.description || '',
  m1: item.result1Number || '-',
  l1: item.result1Label || '',
  m2: item.result2Number || '-',
  l2: item.result2Label || '',
  tools: Array.isArray(item.tools) ? item.tools : [],
  duration: item.duration || '14 days',
  result: item.summary || item.description || 'Outcome details not provided yet.'
});

const mapInsightItem = (item) => ({
  title: item.title || 'Untitled insight',
  excerpt: item.excerpt || '',
  readTime: item.readTime || '5 min read',
  category: item.category || 'General',
  content: item.content || ''
});

export const fetchCaseStudies = async () => {
  const data = await apiFetchJson('/api/cases');
  return Array.isArray(data) ? data.map(mapCaseItem) : [];
};

export const fetchInsights = async () => {
  const data = await apiFetchJson('/api/insights');
  return Array.isArray(data) ? data.map(mapInsightItem) : [];
};

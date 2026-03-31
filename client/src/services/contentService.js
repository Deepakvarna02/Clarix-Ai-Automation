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

// Helper function to add timeout to fetch requests
const fetchWithTimeout = (path, timeout = 5000, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return apiFetchJson(path, {
    ...options,
    signal: controller.signal
  }).finally(() => clearTimeout(timeoutId));
};

export const fetchCaseStudies = async () => {
  try {
    const data = await fetchWithTimeout('/api/cases', 5000);
    return Array.isArray(data) ? data.map(mapCaseItem) : [];
  } catch (error) {
    console.warn('Failed to fetch case studies:', error.message);
    return [];
  }
};

export const fetchInsights = async () => {
  try {
    const data = await fetchWithTimeout('/api/insights', 5000);
    return Array.isArray(data) ? data.map(mapInsightItem) : [];
  } catch (error) {
    console.warn('Failed to fetch insights:', error.message);
    return [];
  }
};

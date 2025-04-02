import { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://etxelhjnqbrgwuitltyk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0eGVsaGpucWJyZ3d1aXRsdHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTE5NzAsImV4cCI6MjA1NjI2Nzk3MH0.EvaK9bCSYaBVaVOIgakKTAVoM8UrDYg2HX7Z-iyWoD4';

/**
 * @typedef {Object} Article
 * @property {number} id
 * @property {string} title
 * @property {string} grade
 * @property {string} published_at
 * @property {string} content
 * @property {string} discipline
 * @property {string} journal
 * @property {string} link
 */

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchDisciplines = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/showed_articles?select=discipline`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch disciplines');
      }

      const data = await response.json();
      // Extraire les disciplines uniques et les trier
      const uniqueDisciplines = Array.from(new Set(data.map(item => item.discipline)))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'fr'));
      setDisciplines(uniqueDisciplines);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchArticles = async (discipline = null) => {
    try {
      setLoading(true);
      let url = `${SUPABASE_URL}/rest/v1/showed_articles?select=id,title,grade,published_at,content,discipline,journal,link`;
      
      if (discipline) {
        url += `&discipline=eq.${encodeURIComponent(discipline)}`;
      }

      url += '&order=published_at.desc';

      const response = await fetch(url, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const selectArticle = (article) => {
    setSelectedArticle(article);
  };

  const selectDiscipline = (discipline) => {
    setSelectedDiscipline(discipline);
    setSelectedArticle(null);
    fetchArticles(discipline);
  };

  useEffect(() => {
    fetchDisciplines();
    fetchArticles();
  }, []);

  return {
    articles,
    disciplines,
    loading,
    error,
    selectedArticle,
    selectedDiscipline,
    selectArticle,
    selectDiscipline
  };
}; 
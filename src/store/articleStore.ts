import { create } from 'zustand';

interface Article {
  id: number;
  article_id: number;
  discipline: string;
  title: string;
  content: string;
  journal: string;
  published_at: string;
  link: string | null;
  grade: string;
  is_article_of_the_day: boolean;
}

interface DisciplineData {
  discipline: string;
}

interface ArticlesByDiscipline {
  [discipline: string]: {
    articles: Article[];
    hasMore: boolean;
    page: number;
  };
}

interface ArticleStore {
  // State
  articles: Article[];
  disciplines: string[];
  selectedArticle: Article | null;
  selectedDiscipline: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  articlesByDiscipline: ArticlesByDiscipline;
  
  // Actions
  initializeStore: () => Promise<void>;
  selectArticle: (article: Article | null) => void;
  selectDiscipline: (discipline: string | null) => Promise<void>;
  loadMoreArticles: () => Promise<void>;
}

const SUPABASE_URL = 'https://etxelhjnqbrgwuitltyk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0eGVsaGpucWJyZ3d1aXRsdHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTE5NzAsImV4cCI6MjA1NjI2Nzk3MH0.EvaK9bCSYaBVaVOIgakKTAVoM8UrDYg2HX7Z-iyWoD4'
const ARTICLES_PER_PAGE = 15;

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

async function fetchSupabase<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint.replace(/\/$/, '')}`;
    console.log('Fetching Supabase URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase fetch error:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        error: errorText
      });
      throw new Error(`Supabase API error (${response.status}): ${errorText || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [],
  disciplines: [],
  selectedArticle: null,
  selectedDiscipline: null,
  loading: false,
  error: null,
  isInitialized: false,
  articlesByDiscipline: {},

  initializeStore: async () => {
    const state = get();
    if (state.isInitialized) return;

    set({ loading: true, error: null });
    try {
      // Fetch distinct disciplines
      console.log('Fetching disciplines...');
      const disciplinesData = await fetchSupabase<DisciplineData[]>(
        'showed_articles?select=discipline&order=discipline&limit=999'
      );
      
      console.log('Received disciplines data:', disciplinesData);
      
      // Extract unique disciplines and sort them
      const uniqueDisciplines = Array.from(new Set(
        disciplinesData
          .map(d => d.discipline)
          .filter(Boolean)
      )).sort((a, b) => a.localeCompare(b));

      console.log('Processed disciplines:', uniqueDisciplines);

      // Initialize articles cache for each discipline
      const articlesByDiscipline: ArticlesByDiscipline = {};
      uniqueDisciplines.forEach(discipline => {
        articlesByDiscipline[discipline] = {
          articles: [],
          hasMore: true,
          page: 0
        };
      });

      // Fetch initial articles for all disciplines
      console.log('Fetching initial articles...');
      const articles = await fetchSupabase<Article[]>(
        'showed_articles?select=*&order=published_at.desc&limit=' + ARTICLES_PER_PAGE
      );

      console.log('Received articles:', articles.length);
      set({ 
        disciplines: uniqueDisciplines,
        articles,
        articlesByDiscipline,
        isInitialized: true,
        loading: false 
      });
    } catch (error) {
      console.error('Store initialization error:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectArticle: (article) => {
    set({ selectedArticle: article });
  },

  selectDiscipline: async (discipline) => {
    const state = get();
    set({ selectedDiscipline: discipline, loading: true, error: null });

    try {
      if (discipline === null) {
        // Fetch latest articles without discipline filter
        const articles = await fetchSupabase<Article[]>(
          'showed_articles?select=*&order=published_at.desc&limit=' + ARTICLES_PER_PAGE
        );
        
        set({ articles, loading: false });
        return;
      }

      // Check if we already have articles for this discipline
      const disciplineCache = state.articlesByDiscipline[discipline];
      if (disciplineCache && disciplineCache.articles.length > 0) {
        set({ articles: disciplineCache.articles, loading: false });
        return;
      }

      // Fetch articles for selected discipline
      const articles = await fetchSupabase<Article[]>(
        `showed_articles?select=*&discipline=eq.${encodeURIComponent(discipline)}&order=published_at.desc&limit=${ARTICLES_PER_PAGE}`
      );

      // Update cache
      set(state => ({
        articles,
        loading: false,
        articlesByDiscipline: {
          ...state.articlesByDiscipline,
          [discipline]: {
            articles,
            hasMore: articles.length === ARTICLES_PER_PAGE,
            page: 1
          }
        }
      }));
    } catch (error) {
      console.error('Discipline selection error:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  loadMoreArticles: async () => {
    const state = get();
    const { selectedDiscipline, articlesByDiscipline } = state;
    
    if (state.loading) return;
    set({ loading: true, error: null });

    try {
      const currentPage = selectedDiscipline 
        ? articlesByDiscipline[selectedDiscipline]?.page || 0 
        : Math.floor(state.articles.length / ARTICLES_PER_PAGE);

      const offset = currentPage * ARTICLES_PER_PAGE;

      let endpoint = `showed_articles?select=*&order=published_at.desc&limit=${ARTICLES_PER_PAGE}&offset=${offset}`;
      if (selectedDiscipline) {
        endpoint += `&discipline=eq.${encodeURIComponent(selectedDiscipline)}`;
      }

      const newArticles = await fetchSupabase<Article[]>(endpoint);

      if (selectedDiscipline) {
        // Update discipline-specific cache
        set(state => ({
          articles: [...state.articles, ...newArticles],
          loading: false,
          articlesByDiscipline: {
            ...state.articlesByDiscipline,
            [selectedDiscipline]: {
              articles: [...(state.articlesByDiscipline[selectedDiscipline]?.articles || []), ...newArticles],
              hasMore: newArticles.length === ARTICLES_PER_PAGE,
              page: currentPage + 1
            }
          }
        }));
      } else {
        // Update general articles list
        set(state => ({
          articles: [...state.articles, ...newArticles],
          loading: false
        }));
      }
    } catch (error) {
      console.error('Load more articles error:', error);
      set({ error: (error as Error).message, loading: false });
    }
  }
})); 
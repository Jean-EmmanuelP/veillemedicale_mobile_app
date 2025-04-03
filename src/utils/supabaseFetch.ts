const SUPABASE_URL = 'https://etxelhjnqbrgwuitltyk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0eGVsaGpucWJyZ3d1aXRsdHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTE5NzAsImV4cCI6MjA1NjI2Nzk3MH0.EvaK9bCSYaBVaVOIgakKTAVoM8UrDYg2HX7Z-iyWoD4';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export async function supabaseFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const isAuthEndpoint = endpoint.startsWith('auth/v1/');
    const baseEndpoint = isAuthEndpoint ? '' : 'rest/v1/';
    const url = `${SUPABASE_URL}/${baseEndpoint}${endpoint.replace(/^\//, '')}`;
    console.log('Fetching Supabase URL:', url);
    
    const response = await fetch(url, {
      method: options.method || 'GET',
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

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
} 
/**
 * Helper utility to fetch RSS feed in development without CORS issues
 * Uses the local Flask server as a proxy
 */

// Helper function for development environments, uses local proxy
export async function fetchWithDevProxy(url) {
  // Only use in development mode
  if (!import.meta.env.DEV) {
    throw new Error('devProxyFetch should only be used in development');
  }
  
  try {
    // Use the Flask server from server.py as a proxy
    const proxyUrl = 'http://localhost:5000/proxy';
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      throw new Error(`Proxy error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Dev proxy fetch error:', error);
    throw error;
  }
}

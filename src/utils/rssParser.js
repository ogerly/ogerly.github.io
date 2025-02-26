/**
 * RSS-Parser mit CORS-Proxy und Fehlerbehandlung
 */
export async function fetchRssFeed(url) {
  try {
    // URL bereinigen (view-source: entfernen)
    const cleanUrl = url.replace('view-source:', '');
    
    // CORS-Proxy verwenden
    const corsProxies = [
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?'
    ];
    
    // Versuche es mit verschiedenen CORS-Proxies
    let response = null;
    let text = null;
    let error = null;
    
    for (const proxy of corsProxies) {
      try {
        console.log(`Versuche RSS-Feed mit Proxy ${proxy} abzurufen...`);
        response = await fetch(`${proxy}${encodeURIComponent(cleanUrl)}`);
        if (response.ok) {
          text = await response.text();
          break; // Wenn erfolgreich, Schleife beenden
        }
      } catch (err) {
        console.warn(`Proxy ${proxy} fehlgeschlagen:`, err);
        error = err;
      }
    }
    
    // Wenn kein Proxy funktioniert hat, probiere direkt (funktioniert in Entwicklungsumgebungen mit CORS-Erweiterungen)
    if (!text) {
      try {
        console.log('Versuche direkten Zugriff auf den RSS-Feed...');
        response = await fetch(cleanUrl);
        if (response.ok) {
          text = await response.text();
        }
      } catch (err) {
        console.warn('Direkter Zugriff fehlgeschlagen:', err);
        error = error || err;
      }
    }
    
    // Wenn immer noch kein Text verfügbar ist, fehlerhafte Antwort
    if (!text) {
      throw error || new Error('Konnte RSS-Feed nicht abrufen');
    }
    
    // Parse XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    // Prüfen auf Parse-Fehler
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('XML Parse Error:', parseError);
      throw new Error('Fehler beim Parsen des XML: ' + parseError.textContent);
    }
    
    // Extract blog information
    const channel = xmlDoc.querySelector("channel");
    if (!channel) {
      console.error('Kein Channel-Element im XML gefunden');
      throw new Error('Ungültiges RSS-Format: Kein Channel-Element gefunden');
    }
    
    const blogTitle = channel.querySelector("title")?.textContent || "Blog";
    const blogDescription = channel.querySelector("description")?.textContent || "";
    
    // Extract blog posts
    const items = xmlDoc.querySelectorAll("item");
    console.log(`${items.length} Blog-Einträge gefunden.`);
    
    const posts = Array.from(items).map(item => {
      // Extract the post image if available
      let content = item.querySelector("content\\:encoded")?.textContent || 
                    item.querySelector("description")?.textContent || "";
      
      // Extract first image from content if exists
      let imageUrl = "";
      const imgMatch = content.match(/<img.*?src="(.*?)".*?>/);
      if (imgMatch && imgMatch[1]) {
        imageUrl = imgMatch[1];
      }
      
      // Clean content (remove HTML)
      let cleanContent = content.replace(/<[^>]*>?/gm, '');
      cleanContent = cleanContent.substring(0, 150) + "...";
      
      return {
        title: item.querySelector("title")?.textContent || "Untitled",
        link: item.querySelector("link")?.textContent || "#",
        pubDate: formatDate(item.querySelector("pubDate")?.textContent || ""),
        description: cleanContent,
        imageUrl: imageUrl
      };
    });
    
    return {
      title: blogTitle,
      description: blogDescription,
      posts: posts
    };
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return {
      title: "Blog",
      description: "Failed to load blog content.",
      posts: [],
      error: error.message
    };
  }
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
}

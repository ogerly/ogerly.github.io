/**
 * RSS-Parser mit CORS-Proxy und verbesserter Fehlerbehandlung
 */
export async function fetchRssFeed(url) {
  try {
    // Verbesserte Logging für das Debugging
    console.log('Starte RSS-Feed-Abruf von:', url);
    
    // URL bereinigen (view-source: entfernen)
    const cleanUrl = url.replace('view-source:', '');
    console.log('Bereinigte URL:', cleanUrl);
    
    // CORS-Proxy verwenden mit zuverlässigen Diensten
    const corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/'
    ];
    
    // Versuche es mit verschiedenen CORS-Proxies
    let response = null;
    let text = null;
    let error = null;
    
    // Versuche zuerst direkt (funktioniert in Entwicklungsumgebungen)
    try {
      console.log('Versuche direkten Zugriff auf den RSS-Feed...');
      response = await fetch(cleanUrl);
      if (response.ok) {
        text = await response.text();
        console.log('Direkter Zugriff erfolgreich, Länge des Textes:', text.length);
      } else {
        console.warn('Direkter Zugriff fehlgeschlagen:', response.status);
      }
    } catch (err) {
      console.warn('Direkter Zugriff fehlgeschlagen:', err);
    }
    
    // Wenn direkter Zugriff nicht funktioniert, probiere CORS-Proxies
    if (!text) {
      console.log('Direkter Zugriff fehlgeschlagen, verwende CORS-Proxies...');
      
      for (const proxy of corsProxies) {
        if (text) break; // Wenn bereits erfolgreich, Schleife abbrechen
        
        try {
          const proxyUrl = `${proxy}${encodeURIComponent(cleanUrl)}`;
          console.log(`Versuche RSS-Feed mit Proxy ${proxy} abzurufen...`);
          console.log('Proxy-URL:', proxyUrl);
          
          response = await fetch(proxyUrl);
          
          if (response.ok) {
            text = await response.text();
            console.log(`Proxy ${proxy} erfolgreich, Länge des Textes:`, text.length);
            break; // Wenn erfolgreich, Schleife beenden
          } else {
            console.warn(`Proxy ${proxy} fehlgeschlagen mit Status:`, response.status);
          }
        } catch (err) {
          console.warn(`Proxy ${proxy} fehlgeschlagen:`, err);
          error = err;
        }
      }
    }
    
    // Verwende einen Fallback-Feed wenn alles fehlschlägt
    if (!text) {
      console.warn('Alle Proxy-Versuche fehlgeschlagen, verwende Fallback-Feed');
      // Statischer Fallback-Feed aus Datei oder eingebettete Daten
      text = getFallbackRSS();
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
    
    // Prüfen ob es ein RSS- oder Atom-Feed ist
    const isRSS = xmlDoc.querySelector("channel") !== null;
    const isAtom = xmlDoc.querySelector("feed") !== null;
    
    let blogTitle, blogDescription, items;
    
    if (isRSS) {
      // Extract blog information for RSS
      const channel = xmlDoc.querySelector("channel");
      blogTitle = channel.querySelector("title")?.textContent || "Blog";
      blogDescription = channel.querySelector("description")?.textContent || "";
      items = xmlDoc.querySelectorAll("item");
    } else if (isAtom) {
      // Extract blog information for Atom
      const feed = xmlDoc.querySelector("feed");
      blogTitle = feed.querySelector("title")?.textContent || "Blog";
      blogDescription = feed.querySelector("subtitle")?.textContent || "";
      items = xmlDoc.querySelectorAll("entry");
    } else {
      throw new Error('Unbekanntes Feed-Format: Weder RSS noch Atom erkannt');
    }
    
    console.log(`Feed-Typ erkannt: ${isRSS ? 'RSS' : isAtom ? 'Atom' : 'Unbekannt'}`);
    console.log(`${items.length} Blog-Einträge gefunden.`);
    
    // Extrahiere Beiträge, abhängig vom Feed-Typ
    const posts = Array.from(items).map(item => {
      if (isRSS) {
        return parseRSSItem(item);
      } else {
        return parseAtomItem(item);
      }
    });
    
    console.log('Blog-Daten erfolgreich geparst:', blogTitle, posts.length);
    
    return {
      title: blogTitle,
      description: blogDescription,
      posts: posts
    };
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    
    // Fallback mit einigen Beispiel-Posts
    return getFallbackBlogData();
  }
}

function parseRSSItem(item) {
  // Extract content
  let content = item.querySelector("content\\:encoded")?.textContent || 
                item.querySelector("description")?.textContent || "";
  
  // Extract image
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
}

function parseAtomItem(item) {
  // Extract content
  let content = item.querySelector("content")?.textContent || 
                item.querySelector("summary")?.textContent || "";
  
  // Extract image
  let imageUrl = "";
  const imgMatch = content.match(/<img.*?src="(.*?)".*?>/);
  if (imgMatch && imgMatch[1]) {
    imageUrl = imgMatch[1];
  }
  
  // Clean content (remove HTML)
  let cleanContent = content.replace(/<[^>]*>?/gm, '');
  cleanContent = cleanContent.substring(0, 150) + "...";
  
  // Get link from href attribute in <link> tag
  const linkTag = item.querySelector("link");
  const link = linkTag ? linkTag.getAttribute("href") : "#";
  
  return {
    title: item.querySelector("title")?.textContent || "Untitled",
    link: link,
    pubDate: formatDate(item.querySelector("published")?.textContent || 
                        item.querySelector("updated")?.textContent || ""),
    description: cleanContent,
    imageUrl: imageUrl
  };
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

// Fallback-Feed für den Fall, dass der Abruf fehlschlägt
function getFallbackRSS() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Im Sumpf Blog</title>
    <description>Gedanken und Notizen aus dem Sumpf</description>
    <item>
      <title>Die Welt der dezentralen Technologien</title>
      <link>https://imsumpf.blogspot.com/dezentrale-technologien</link>
      <description>Eine Einführung in die Welt der dezentralen Technologien und wie sie unsere Zukunft beeinflussen werden.</description>
      <pubDate>Mon, 20 May 2023 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Web3 und seine Anwendungsfälle</title>
      <link>https://imsumpf.blogspot.com/web3-anwendungsfaelle</link>
      <description>Web3 ist mehr als nur ein Buzzword. Hier sind einige konkrete Anwendungsfälle, die bereits heute umgesetzt werden.</description>
      <pubDate>Wed, 15 Mar 2023 14:30:00 GMT</pubDate>
    </item>
    <item>
      <title>Die Geschichte des Amiga Computers</title>
      <link>https://imsumpf.blogspot.com/amiga-geschichte</link>
      <description>Ein Rückblick auf die Geschichte des Amiga Computers und warum er auch heute noch eine treue Fangemeinde hat.</description>
      <pubDate>Fri, 10 Jan 2023 09:15:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
}

function getFallbackBlogData() {
  console.log('Verwende Fallback-Blog-Daten');
  return {
    title: "Im Sumpf Blog",
    description: "Gedanken und Notizen aus dem Sumpf",
    posts: [
      {
        title: "Die Welt der dezentralen Technologien",
        link: "https://imsumpf.blogspot.com/dezentrale-technologien",
        description: "Eine Einführung in die Welt der dezentralen Technologien und wie sie unsere Zukunft beeinflussen werden.",
        pubDate: "20. Mai 2023",
        imageUrl: ""
      },
      {
        title: "Web3 und seine Anwendungsfälle",
        link: "https://imsumpf.blogspot.com/web3-anwendungsfaelle",
        description: "Web3 ist mehr als nur ein Buzzword. Hier sind einige konkrete Anwendungsfälle, die bereits heute umgesetzt werden.",
        pubDate: "15. März 2023",
        imageUrl: ""
      },
      {
        title: "Die Geschichte des Amiga Computers",
        link: "https://imsumpf.blogspot.com/amiga-geschichte",
        description: "Ein Rückblick auf die Geschichte des Amiga Computers und warum er auch heute noch eine treue Fangemeinde hat.",
        pubDate: "10. Januar 2023",
        imageUrl: ""
      }
    ],
    error: null
  };
}

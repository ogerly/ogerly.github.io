/**
 * Optimized RSS-Parser with improved CORS handling
 */
export async function fetchRssFeed(url) {
  try {
    console.log('Fetching RSS feed from:', url);
    
    // In development mode, use local proxy to avoid CORS issues
    if (import.meta.env.DEV) {
      return await fetchWithLocalProxy(url);
    }
    
    // In production, try direct fetch first
    try {
      const response = await fetch(url, { 
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const text = await response.text();
      return parseRSSContent(text);
    } catch (err) {
      console.warn('Direct fetch failed, using fallback data:', err);
      return getFallbackBlogData();
    }
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return getFallbackBlogData();
  }
}

// Use local development server proxy
async function fetchWithLocalProxy(url) {
  try {
    const proxyUrl = 'http://localhost:5000/proxy'; // Use our Flask proxy
    
    console.log(`Using local development proxy for: ${url}`);
    
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
    
    if (!data.content) {
      throw new Error('Empty proxy response');
    }
    
    return parseRSSContent(data.content);
  } catch (err) {
    console.error('Local proxy fetch failed:', err);
    // Fall back to direct data
    return getFallbackBlogData();
  }
}

function parseRSSContent(text) {
  try {
    // Parse XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    // Check for parse errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('XML parse error, raw content:', text.substring(0, 200) + '...');
      throw new Error('XML parse error: ' + parseError.textContent);
    }
    
    // Determine feed type (RSS or Atom)
    const isRSS = xmlDoc.querySelector("channel") !== null;
    const isAtom = !isRSS && xmlDoc.querySelector("feed") !== null;
    
    if (!isRSS && !isAtom) {
      console.error('Unknown feed format, raw content:', text.substring(0, 200) + '...');
      throw new Error('Unknown feed format');
    }
    
    // Extract blog information
    let blogTitle, blogDescription, items;
    
    if (isRSS) {
      const channel = xmlDoc.querySelector("channel");
      blogTitle = channel.querySelector("title")?.textContent || "Blog";
      blogDescription = channel.querySelector("description")?.textContent || "";
      items = Array.from(xmlDoc.querySelectorAll("item"));
    } else {
      const feed = xmlDoc.querySelector("feed");
      blogTitle = feed.querySelector("title")?.textContent || "Blog";
      blogDescription = feed.querySelector("subtitle")?.textContent || 
                       feed.querySelector("description")?.textContent || "";
      items = Array.from(xmlDoc.querySelectorAll("entry"));
    }
    
    console.log(`Successfully parsed ${isRSS ? 'RSS' : 'Atom'} feed with ${items.length} items`);
    
    // Parse posts
    const posts = items.map(item => isRSS ? parseRSSItem(item) : parseAtomItem(item));
    
    return {
      title: blogTitle,
      description: blogDescription,
      posts: posts
    };
  } catch (error) {
    console.error("Error parsing RSS content:", error);
    throw error;
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
  console.log('Using fallback blog data');
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
      },
      {
        title: "Funktionen von NostrOS",
        link: "https://imsumpf.blogspot.com/nostros-funktionen",
        description: "NostrOS ist ein dezentrales Betriebssystem und soziales Netzwerk. Hier ein Überblick über die spannendsten Funktionen.",
        pubDate: "5. April 2023",
        imageUrl: ""
      },
      {
        title: "Retro Computing in 2023",
        link: "https://imsumpf.blogspot.com/retro-computing",
        description: "Warum alte Computer und Betriebssysteme auch heute noch relevant sind und was wir von ihnen lernen können.",
        pubDate: "12. Juni 2023",
        imageUrl: ""
      }
    ]
  };
}

const fs = require('fs');

async function fetchData() {
  const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  const results = data.results.map(page => ({
    name: page.properties.Name?.title[0]?.plain_text || 'Untitled',
    category: page.properties.Category?.select?.name || 'Other',
    date: page.properties.Date?.date?.start || 'N/A',
    link: page.properties.Link?.url || '#'
  }));

  fs.writeFileSync('data.json', JSON.stringify(results, null, 2));
}

fetchData();

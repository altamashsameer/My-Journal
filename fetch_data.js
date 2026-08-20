const fs = require('fs');

async function fetchData() {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!data.results) {
      console.error('Notion API Error:', data);
      fs.writeFileSync('data.json', JSON.stringify([], null, 2));
      return;
    }

    const results = data.results.map(page => {
      const props = page.properties;
      return {
        name: props.Name?.title[0]?.plain_text || 'Untitled',
        category: props.Category?.select?.name || 'Other',
        date: props.Date?.date?.start || 'N/A',
        link: props.Link?.url || '#'
      };
    });

    fs.writeFileSync('data.json', JSON.stringify(results, null, 2));
    console.log(`Successfully saved ${results.length} entries to data.json`);
  } catch (err) {
    console.error('Fetch failed:', err);
    fs.writeFileSync('data.json', JSON.stringify([], null, 2));
  }
}

fetchData();

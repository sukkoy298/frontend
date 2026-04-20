process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
fetch('https://www.bcv.org.ve/')
  .then(res => res.text())
  .then(text => {
    console.log("Includes #dolar:", text.includes('id="dolar"'));
    const match = text.match(/<div id="dolar"[^>]*>([\s\S]*?)<\/div>/);
    if (match) {
        console.log("Match:", match[1].substring(0, 200));
        const strongMatch = match[1].match(/<strong>\s*(.*?)\s*<\/strong>/);
        if (strongMatch) console.log("Price:", strongMatch[1]);
    }
  })
  .catch(console.error);

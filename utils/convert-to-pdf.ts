import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { marked } from "marked";

marked.setOptions({
    breaks: true,
    gfm: true
});

// Read the markdown file
const markdown: string = readFileSync("./README.md", "utf8");

// Convert markdown to HTML
const html: string = await marked.parse(markdown);

// Create the HTML template
const template: string = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.2;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
    }

    h1, h2, h3, h4, h5, h6 {
      color: #2c3e50;
      margin-top: 1.2em;
      margin-bottom: 0.4em;
    }

    h1 {
      font-size: 2em;
      border-bottom: 2px solid #eee;
      padding-bottom: 0.3em;
    }

    h2 {
      font-size: 1.2em;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3em;
    }

    h3 {
      font-size: 1em;
    }

    p {
      font-size: .8em;
    }

    a {
      color: #0366d6;
      text-decoration: none;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    .badge {
      display: inline-block;
      margin: 0 5px 5px 0;
      padding: 3px 7px;
      border-radius: 3px;
      font-size: 0.8em;
      font-weight: bold;
      color: white;
    }

    [src*="shields.io"] {
      margin: 0 5px 5px 0;
    }

    ul, ol {
      padding-left: 2em;
    }

    li {
      margin: 0.5em 0;
      font-size: .8em;
    }

    pre {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 16px;
      overflow: auto;
    }

    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 0.9em;
      background-color: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }

    blockquote {
      margin: 0;
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }

    th, td {
      border: 1px solid #dfe2e5;
      padding: 6px 13px;
    }

    th {
      background-color: #f6f8fa;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
`;

const generatePDF = async (): Promise<void> => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    // Set the content
    await page.setContent(template, {
        waitUntil: "networkidle0"
    });

    // Generate PDF
    await page.pdf({
        path: "./cv.pdf",
        format: "A4",
        margin: {
            top: "1cm",
            right: "1cm",
            bottom: "1cm",
            left: "1cm"
        },
        printBackground: true
    });

    await browser.close();
    console.log("✅ PDF generated successfully!");
};

generatePDF().catch((error: Error) => console.error(error)); 
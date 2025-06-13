// const fs = require('fs').promises;
// const path = require('path');

// export default async function handler(req, res) {
//     if (req.method !== 'GET') {
//         return res.status(405).json({ error: 'Method not allowed' });
//     }

//     try {
//         const templateFilePath = path.join(process.cwd(), 'templates.json');
//         const fileContent = await fs.readFile(templateFilePath, 'utf8');
//         const templates = JSON.parse(fileContent);
        
//         res.json({
//             success: true,
//             templates: templates,
//             count: templates.length
//         });
//     } catch (error) {
//         res.json({
//             success: true,
//             templates: [],
//             count: 0,
//             message: 'No templates found'
//         });
//     }
// }
// pages/api/template.ts (or app/api/template/route.ts if using App Router with Edge disabled)
// import fs from 'fs/promises';
// import path from 'path';

// export async function GET(request) {
//   try {
//     const templateFilePath = path.join(process.cwd(), 'templates.json');
//     const fileContent = await fs.readFile(templateFilePath, 'utf8');
//     const templatesArr = JSON.parse(fileContent);

//     // Flatten templates array into a map: { "template-1": "<div>...</div>", ... }
//     const templates = {};
//     templatesArr.forEach(section => {
//       if (Array.isArray(section.templates)) {
//         section.templates.forEach(template => {
//           templates[template.id] = template.outerHTML || template.innerHTML || '';
//         });
//       }
//     });

//     return new Response(
//       JSON.stringify({
//         success: true,
//         templates,
//         count: Object.keys(templates).length,
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({
//         success: true,
//         templates: {},
//         count: 0,
//         message: 'No templates found',
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }
// import fs from 'fs/promises';
// import path from 'path';

// export async function GET(request) {
//   try {
//     const templateFilePath = path.join(process.cwd(), 'templates.json');
//     const fileContent = await fs.readFile(templateFilePath, 'utf8');
//     const templatesArr = JSON.parse(fileContent);

//     const templates = {};

//     templatesArr.forEach(section => {
//       if (Array.isArray(section.templates)) {
//         section.templates.forEach(template => {
//           const styles = template.computedStyles || {};
//           const styleString = Object.entries(styles)
//             .map(([k, v]) => `${k}: ${v};`)
//             .join(' ');

//           // Inject inline style into the outerHTML if available
//           const tagMatch = template.outerHTML.match(/^<([a-zA-Z0-9\-]+)/);
//           const tagName = tagMatch ? tagMatch[1] : 'div';

//           const styledHtml = template.outerHTML.replace(
//             new RegExp(`^<${tagName}`),
//             `<${tagName} style="${styleString}"`
//           );

//           templates[template.id] = styledHtml || template.innerHTML || '';
//         });
//       }
//     });

//     return new Response(
//       JSON.stringify({
//         success: true,
//         templates,
//         count: Object.keys(templates).length,
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({
//         success: true,
//         templates: {},
//         count: 0,
//         message: 'No templates found',
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }
import fs from 'fs/promises';
import fssync from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const publicAssetsPath = path.join(process.cwd(), 'public/assets');

async function ensureAssetFolder() {
  if (!fssync.existsSync(publicAssetsPath)) {
    await fs.mkdir(publicAssetsPath, { recursive: true });
  }
}

async function downloadImageIfNotExists(imageUrl, filename) {
  const filePath = path.join(publicAssetsPath, filename);
  if (fssync.existsSync(filePath)) return; // already exists

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch ${imageUrl}`);
    const buffer = await response.buffer();
    await fs.writeFile(filePath, buffer);
    console.log(`✅ Downloaded ${filename}`);
  } catch (err) {
    console.error(`❌ Failed to download ${filename}:`, err.message);
  }
}

export async function GET(request) {
  try {
    await ensureAssetFolder();

    const templateFilePath = path.join(process.cwd(), 'templates.json');
    const fileContent = await fs.readFile(templateFilePath, 'utf8');
    const templatesArr = JSON.parse(fileContent);

    const templates = {};

    for (const section of templatesArr) {
      if (!Array.isArray(section.templates)) continue;

      for (const template of section.templates) {
        const styles = template.computedStyles || {};
        const styleString = Object.entries(styles)
          .map(([k, v]) => `${k}: ${v};`)
          .join(' ');

        const tagMatch = template.outerHTML?.match(/^<([a-zA-Z0-9\-]+)/);
        const tagName = tagMatch ? tagMatch[1] : template.tagName || 'div';

        let contentHtml = template.outerHTML?.trim();
        if (!contentHtml || contentHtml.length < 10) {
          contentHtml = `<${tagName}>${template.innerHTML || ''}</${tagName}>`;
        }

        // Find all <img src="..."> and download if external
        const imgMatches = [...contentHtml.matchAll(/<img[^>]*src=["']([^"']+)["']/g)];
        for (const match of imgMatches) {
          const imgUrl = match[1];
          const isRemote = /^https?:\/\//.test(imgUrl);
          const fileName = imgUrl.split('/').pop();

          if (!fileName) continue;

          if (isRemote) {
            await downloadImageIfNotExists(imgUrl, fileName);
            contentHtml = contentHtml.replace(imgUrl, `/assets/${fileName}`);
          } else if (imgUrl.startsWith('/assets/')) {
            const localPath = path.join(publicAssetsPath, imgUrl.split('/').pop());
            if (!fssync.existsSync(localPath)) {
              console.warn(`⚠️ Missing local image: ${imgUrl}`);
            }
          }
        }

        // Inject styles
        const styledHtml = contentHtml.replace(
          new RegExp(`^<${tagName}`),
          `<${tagName} style="${styleString}"`
        );

        templates[template.id] = styledHtml;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        templates,
        count: Object.keys(templates).length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Template load error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        templates: {},
        count: 0,
        message: 'Failed to load templates',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}


// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   const body = await req.json();
//   const { htmlCode, optimizedHtml, html, rawHtml } = body;

//   // Accept multiple possible field names
//   const htmlToConvert = htmlCode || optimizedHtml || html || rawHtml;

//   if (!htmlToConvert) {
//     return NextResponse.json({ error: 'Missing HTML code. Please provide one of: htmlCode, optimizedHtml, html, or rawHtml' }, { status: 400 });
//   }

//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) {
//     return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
//   }

//   try {
//     const prompt = `You are an expert at converting HTML structure into JSON layout representation. Your task is to convert the provided bare minimum HTML code into a clean JSON layout structure.

// CRITICAL REQUIREMENTS:
// - Convert HTML structure into JSON layout format
// - Extract ONLY the layout structure and CSS properties
// - NEVER include any widget/content HTML tags like <span>, <h1>, <p>, <img>, <button>, <a>, <input>, etc.
// - Template placeholders ({{template-1}}, {{template-2}}, etc.) should ONLY appear in the "children" array where content would normally be
// - Focus ONLY on layout containers like div, section, main, header, aside, footer, nav, article
// - Create a hierarchical JSON structure representing the layout tree
// - Replace all content elements with {{template-n}} placeholders

// JSON STRUCTURE FORMAT:
// {
//   "element": "div|section|main|header|aside|footer|nav|article",
//   "className": "class-name-if-any",
//   "styles": {
//     "display": "flex|grid|block",
//     "flexDirection": "column|row",
//     "gridTemplateColumns": "value",
//     "gridTemplateRows": "value",
//     "width": "value",
//     "height": "value",
//     "position": "relative|absolute|fixed",
//     "backgroundColor": "value",
//     "padding": "value",
//     "margin": "value",
//     "gap": "value",
//     "alignItems": "value",
//     "justifyContent": "value"
//     // ... other CSS layout properties only
//   },
//   "children": [
//     // Child layout elements or {{template-n}} placeholders
//     "{{template-1}}",
//     "{{template-2}}",
//     {
//       "element": "div",
//       "styles": { ... },
//       "children": ["{{template-3}}"]
//     }
//   ]
// }

// STRICT RULES:
// 1. Extract layout structure from HTML containers ONLY (div, section, main, header, aside, footer, nav, article)
// 2. Convert inline styles and CSS classes to "styles" object
// 3. Template placeholders ({{template-n}}) go ONLY in "children" arrays where content elements would be
// 4. NEVER include content/widget HTML tags in the JSON structure
// 5. Maintain the exact hierarchy and nesting from the HTML
// 6. Include all relevant CSS properties for layout positioning and styling
// 7. Each content element should be replaced with a unique {{template-n}} placeholder
// 8. Number templates sequentially: {{template-1}}, {{template-2}}, {{template-3}}, etc.

// HTML CODE TO CONVERT:
// ${htmlToConvert}

// Please return ONLY the JSON layout structure. Do not include explanations or additional text.`;

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: 'gpt-4-turbo',
//         messages: [
//           {
//             role: 'system',
//             content: 'You are an expert at converting HTML structure to JSON layout format. Extract ONLY layout containers (div, section, main, header, aside, footer, nav, article) and positioning. Replace ALL content/widget elements with {{template-n}} placeholders in children arrays.'
//           },
//           {
//             role: 'user',
//             content: prompt
//           }
//         ],
//         max_tokens: 3000,
//         temperature: 0.1,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error?.message || 'OpenAI API error');
//     }

//     const data = await response.json();
//     let jsonLayout = data.choices[0]?.message?.content;

//     if (!jsonLayout) {
//       throw new Error('No response from OpenAI');
//     }

//     // Clean up the response to ensure it's valid JSON
//     jsonLayout = jsonLayout.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
//     // Validate JSON
//     try {
//       const parsedLayout = JSON.parse(jsonLayout);
//       return NextResponse.json({ jsonLayout: parsedLayout });
//     } catch (parseError) {
//       // If JSON parsing fails, return as string and let client handle
//       console.warn('JSON parsing failed:', parseError);
//       return NextResponse.json({ jsonLayout: jsonLayout, warning: 'JSON parsing failed, returned as string' });
//     }

//   } catch (error) {
//     console.error('Error converting HTML to JSON layout:', error);
//     return NextResponse.json({ error: error.message || 'Failed to convert HTML to JSON layout' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { htmlCode, optimizedHtml, html, rawHtml } = body;

  // Accept multiple possible field names
  const htmlToConvert = htmlCode || optimizedHtml || html || rawHtml;

  if (!htmlToConvert) {
    return NextResponse.json({ error: 'Missing HTML code. Please provide one of: htmlCode, optimizedHtml, html, or rawHtml' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const prompt = `You are an expert at converting HTML structure into JSON layout representation. Your task is to convert the provided bare minimum HTML code into a clean JSON layout structure.

CRITICAL REQUIREMENTS:
- Convert HTML structure into JSON layout format
- Extract ONLY the layout structure and CSS properties
- NEVER include any widget/content HTML tags like <span>, <h1>, <p>, <img>, <button>, <a>, <input>, etc.
- When you see <span>{{template-n}}</span>, extract ONLY the {{template-n}} part
- Template placeholders ({{template-1}}, {{template-2}}, etc.) should ONLY appear in the "children" array
- Focus ONLY on layout containers like div, section, main, header, aside, footer, nav, article
- Create a hierarchical JSON structure representing the layout tree
- Preserve the logical grouping from the HTML structure

JSON STRUCTURE FORMAT:
{
  "element": "div|section|main|header|aside|footer|nav|article",
  "className": "class-name-if-any",
  "styles": {
    "display": "flex|grid|block",
    "flexDirection": "column|row",
    "gridTemplateColumns": "value",
    "gridTemplateRows": "value",
    "width": "value",
    "height": "value",
    "position": "relative|absolute|fixed",
    "backgroundColor": "value",
    "padding": "value",
    "margin": "value",
    "gap": "value",
    "alignItems": "value",
    "justifyContent": "value"
    // ... other CSS layout properties only
  },
  "children": [
    // Child layout elements or {{template-n}} placeholders (without <span> tags)
    "{{template-1}}",
    "{{template-2}}",
    {
      "element": "div",
      "styles": { ... },
      "children": ["{{template-3}}"]
    }
  ]
}

STRICT RULES:
1. Extract layout structure from HTML containers ONLY (div, section, main, header, aside, footer, nav, article)
2. Convert inline styles and CSS classes to "styles" object
3. When you see <span>{{template-n}}</span>, include ONLY {{template-n}} in children array
4. NEVER include <span> or any other content/widget HTML tags in the JSON structure
5. Maintain the exact hierarchy and nesting from the HTML
6. Include all relevant CSS properties for layout positioning and styling
7. Preserve logical grouping - if multiple templates are in the same container, keep them together
8. Remove all HTML tags, keep only layout containers and template placeholders

EXAMPLES:
Input HTML: <div class="hero-section"><span>{{template-1}}</span><span>{{template-2}}</span></div>
Output JSON: 
{
  "element": "div",
  "className": "hero-section",
  "children": ["{{template-1}}", "{{template-2}}"]
}

HTML CODE TO CONVERT:
${htmlToConvert}

Please return ONLY the JSON layout structure. Do not include explanations or additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at converting HTML structure to JSON layout format. Extract ONLY layout containers and positioning. When you see <span>{{template-n}}</span>, extract only {{template-n}} for the children array. Preserve logical grouping.'
          },
          {
            role: 'user',
            content: prompt
          }                                                                                         
        ],
        max_tokens: 3000,                                                                                                                                                                                                                                                                                                                                                                                     
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    let jsonLayout = data.choices[0]?.message?.content;

    if (!jsonLayout) {
      throw new Error('No response from OpenAI');
    }

    // Clean up the response to ensure it's valid JSON
    jsonLayout = jsonLayout.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Validate JSON
    try {
      const parsedLayout = JSON.parse(jsonLayout);
      return NextResponse.json({ jsonLayout: parsedLayout });
    } catch (parseError) {
      // If JSON parsing fails, return as string and let client handle
      console.warn('JSON parsing failed:', parseError);
      return NextResponse.json({ jsonLayout: jsonLayout, warning: 'JSON parsing failed, returned as string' });
    }

  } catch (error) {
    console.error('Error converting HTML to JSON layout:', error);
    return NextResponse.json({ error: error.message || 'Failed to convert HTML to JSON layout' }, { status: 500 });
  }
}
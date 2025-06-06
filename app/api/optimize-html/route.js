

// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   const body = await req.json();
//   const { rawHtml, computedStyles } = body;

//   if (!rawHtml || !computedStyles) {
//     return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//   }

//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) {
//     return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
//   }

//   try {
//     const prompt = `You are an expert HTML optimizer. Your task is to convert raw HTML code into minimal, clean HTML that achieves the same visual layout using modern CSS flex and grid properties.

// INSTRUCTIONS:
// 1. Analyze the provided raw HTML and computed styles
// 2. Remove unnecessary wrapper divs and redundant elements
// 3. Convert the layout to use modern CSS flex and grid properties
// 4. Keep only essential HTML structure
// 5. Ensure the optimized HTML achieves the same visual result
// 6. Use semantic HTML elements where appropriate
// 7. Include inline styles or provide separate CSS

// RAW HTML:
// ${rawHtml}

// COMPUTED STYLES:
// ${computedStyles}

// REQUIREMENTS:
// - Remove all unnecessary div wrappers
// - Use flex and grid properties efficiently
// - Maintain the same visual layout
// - Keep HTML structure minimal
// - Use semantic HTML elements
// - Provide clean, readable code

// Please return ONLY the optimized HTML code with inline styles or a style block. Do not include explanations or additional text.`;

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
//             content: 'You are an expert HTML and CSS optimizer specializing in modern layout techniques with flex and grid.'
//           },
//           {
//             role: 'user',
//             content: prompt
//           }                                                                                         
//         ],
//         max_tokens: 2000,                                                                                                                                                                                                                                                                                                                                                                                     
//         temperature: 0.1,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error?.message || 'OpenAI API error');
//     }

//     const data = await response.json();
//     const optimizedHtml = data.choices[0]?.message?.content;

//     if (!optimizedHtml) {
//       throw new Error('No response from OpenAI');
//     }

//     return NextResponse.json({ optimizedHtml });
//   } catch (error) {
//     console.error('Error optimizing HTML:', error);
//     return NextResponse.json({ error: error.message || 'Failed to optimize HTML' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { rawHtml, computedStyles } = body;

  if (!rawHtml || !computedStyles) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const prompt = `You are an expert HTML optimizer. Your task is to convert raw HTML code into minimal, clean HTML that achieves the EXACT SAME visual layout using modern CSS flex and grid properties.

CRITICAL REQUIREMENTS:
- Analyze the raw HTML structure to understand the logical grouping of elements
- DO NOT create separate divs for each template placeholder
- Group related content logically into appropriate containers (header sections, content areas, button groups, etc.)
- Use semantic HTML structure that makes sense for the content layout
- Replace ONLY the actual content/widgets with template placeholders: <span>{{template-n}}</span>
- Use efficient flex/grid layouts without unnecessary wrapper divs

LAYOUT ANALYSIS APPROACH:
1. Identify content groups (hero sections, text blocks, button areas, image galleries, etc.)
2. Create logical containers for these groups
3. Use flex/grid properties to position these containers appropriately
4. Place multiple related templates within the same container when they belong together
5. Avoid creating individual divs for each template - group them semantically

EXAMPLE OF CORRECT GROUPING:
Instead of: 
<div><span>{{template-1}}</span></div>
<div><span>{{template-2}}</span></div>
<div><span>{{template-3}}</span></div>

Use logical grouping:
<div class="hero-section">
  <span>{{template-1}}</span>
  <span>{{template-2}}</span>
</div>
<div class="content-area">
  <span>{{template-3}}</span>
</div>

RAW HTML:
${rawHtml}

COMPUTED STYLES:
${computedStyles}

REQUIREMENTS:
- Create logical, semantic HTML structure
- Group related templates into appropriate containers
- Use efficient flex/grid layouts
- Avoid unnecessary wrapper divs for individual templates
- Maintain exact visual positioning and spacing
- Create clean, optimized code that groups content logically

Please return ONLY the optimized HTML code with logical content grouping and template placeholders. Do not include explanations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HTML and CSS optimizer. Analyze the raw HTML structure and create logical, semantic HTML groupings. DO NOT create separate divs for each template placeholder. Group related content into appropriate containers using efficient flex/grid layouts.'
          },
          {
            role: 'user',
            content: prompt
          }                                                                                         
        ],
        max_tokens: 2000,                                                                                                                                                                                                                                                                                                                                                                                     
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    let optimizedHtml = data.choices[0]?.message?.content;

    if (!optimizedHtml) {
      throw new Error('No response from OpenAI');
    }

    // Post-process to ensure template placeholders are properly formatted
    optimizedHtml = optimizedHtml.replace(/\{\{template-(\d+)\}\}/g, (match, number) => {
      // If not already wrapped in span, wrap it
      if (!optimizedHtml.includes(`<span>${match}</span>`)) {
        return `<span>{{template-${number}}}</span>`;
      }
      return match;
    });

    return NextResponse.json({ optimizedHtml });
  } catch (error) {
    console.error('Error optimizing HTML:', error);
    return NextResponse.json({ error: error.message || 'Failed to optimize HTML' }, { status: 500 });
  }
}
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
// - Extract only the layout structure and CSS properties
// - Do NOT include any HTML content tags like <span>, <h1>, <p>, etc.
// - Template placeholders ({{template-n}}) should ONLY appear in the "children" array
// - Focus on layout containers, positioning, and styling properties
// - Create a hierarchical JSON structure representing the layout tree

// JSON STRUCTURE FORMAT:
// {
//   "element": "div|section|main|header|etc",
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
//     // ... other CSS properties
//   },
//   "children": [
//     // Child elements or {{template-n}} placeholders
//     "{{template-1}}",
//     "{{template-2}}",
//     {
//       "element": "div",
//       "styles": { ... },
//       "children": ["{{template-3}}"]
//     }
//   ]
// }

// RULES:
// 1. Extract layout structure from HTML elements (div, section, main, etc.)
// 2. Convert inline styles and CSS classes to "styles" object
// 3. Template placeholders go ONLY in "children" arrays
// 4. Do not include content HTML tags in the JSON structure
// 5. Maintain the exact hierarchy and nesting from the HTML
// 6. Include all relevant CSS properties for layout positioning

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
//             content: 'You are an expert at converting HTML structure to JSON layout format. Extract only layout containers and positioning, with template placeholders in children arrays only.'
//           },
//           {
//             role: 'user',
//             content: prompt
//           }                                                                                         
//         ],
//         max_tokens: 2000,                                                                                                                                                                                                                                                                                                                                                                                     
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
//       return NextResponse.json({ jsonLayout: jsonLayout, warning: 'JSON parsing failed, returned as string' });
//     }

//   } catch (error) {
//     console.error('Error converting HTML to JSON layout:', error);
//     return NextResponse.json({ error: error.message || 'Failed to convert HTML to JSON layout' }, { status: 500 });
//   }
// }
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

// EXAMPLES OF WHAT TO EXCLUDE (replace with {{template-n}}):
// - <h1>, <h2>, <h3>, <h4>, <h5>, <h6> → {{template-1}}
// - <p>, <span>, <strong>, <em> → {{template-2}}
// - <img>, <video>, <audio> → {{template-3}}
// - <button>, <input>, <select>, <textarea> → {{template-4}}
// - <a> → {{template-5}}
// - <ul>, <ol>, <li> → {{template-6}}
// - <table>, <tr>, <td>, <th> → {{template-7}}

// EXAMPLES OF WHAT TO INCLUDE (layout containers):
// - <div>, <section>, <main>, <header>, <aside>, <footer>, <nav>, <article>

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
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   const body = await req.json();
//   const { rawHtml, computedStyles } = body;

//   if (!rawHtml || !computedStyles) {
//     return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//   }

//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) {
//     return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
//   }

//   try {
//     const prompt = `You are an expert HTML optimizer. Your task is to convert raw HTML code into minimal, clean HTML that achieves the EXACT SAME visual layout using modern CSS flex and grid properties.

// CRITICAL REQUIREMENTS:
// - Analyze the raw HTML structure to understand the logical grouping of elements
// - DO NOT create separate divs for each template placeholder
// - Group related content logically into appropriate containers (header sections, content areas, button groups, etc.)
// - Use semantic HTML structure that makes sense for the content layout
// - Replace ONLY the actual content/widgets with template placeholders: <span>{{template-n}}</span>
// - Use efficient flex/grid layouts without unnecessary wrapper divs

// LAYOUT ANALYSIS APPROACH:
// 1. Identify content groups (hero sections, text blocks, button areas, image galleries, etc.)
// 2. Create logical containers for these groups
// 3. Use flex/grid properties to position these containers appropriately
// 4. Place multiple related templates within the same container when they belong together
// 5. Avoid creating individual divs for each template - group them semantically

// EXAMPLE OF CORRECT GROUPING:
// Instead of: 
// <div><span>{{template-1}}</span></div>
// <div><span>{{template-2}}</span></div>
// <div><span>{{template-3}}</span></div>

// Use logical grouping:
// <div class="hero-section">
//   <span>{{template-1}}</span>
//   <span>{{template-2}}</span>
// </div>
// <div class="content-area">
//   <span>{{template-3}}</span>
// </div>

// RAW HTML:
// ${rawHtml}

// COMPUTED STYLES:
// ${computedStyles}

// REQUIREMENTS:
// - Create logical, semantic HTML structure
// - Group related templates into appropriate containers
// - Use efficient flex/grid layouts
// - Avoid unnecessary wrapper divs for individual templates
// - Maintain exact visual positioning and spacing
// - Create clean, optimized code that groups content logically

// Please return ONLY the optimized HTML code with logical content grouping and template placeholders. Do not include explanations.`;

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
//             content: 'You are an expert HTML and CSS optimizer. Analyze the raw HTML structure and create logical, semantic HTML groupings. DO NOT create separate divs for each template placeholder. Group related content into appropriate containers using efficient flex/grid layouts.'
//           },
//           {
//             role: 'user',
//             content: prompt
//           }                                                                                         
//         ],
//         max_tokens: 2000,                                                                                                                                                                                                                                                                                                                                                                                     
//         temperature: 0.1,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error?.message || 'OpenAI API error');
//     }

//     const data = await response.json();
//     let optimizedHtml = data.choices[0]?.message?.content;

//     if (!optimizedHtml) {
//       throw new Error('No response from OpenAI');
//     }

//     // Post-process to ensure template placeholders are properly formatted
//     optimizedHtml = optimizedHtml.replace(/\{\{template-(\d+)\}\}/g, (match, number) => {
//       // If not already wrapped in span, wrap it
//       if (!optimizedHtml.includes(`<span>${match}</span>`)) {
//         return `<span>{{template-${number}}}</span>`;
//       }
//       return match;
//     });

//     return NextResponse.json({ optimizedHtml });
//   } catch (error) {
//     console.error('Error optimizing HTML:', error);
//     return NextResponse.json({ error: error.message || 'Failed to optimize HTML' }, { status: 500 });
//   }
// }
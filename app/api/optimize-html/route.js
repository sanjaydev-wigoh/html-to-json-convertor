// PART - 1

// import { NextResponse } from 'next/server';

// export async function GET(request) {
//   // Replace this with your actual bare minimum HTML logic
//   const bareMinimumHtml = '<div>Hello, this is bare minimum HTML!</div>';
//   return new Response(JSON.stringify({ bareMinimumHtml }), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' }
//   });
// }

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
//     const prompt = `You are an expert HTML optimizer. Your task is to convert raw HTML code into minimal, clean HTML WITH INLINE STYLES that achieves the EXACT SAME visual layout using modern CSS flex and grid properties.

// CRITICAL REQUIREMENTS:
// - Analyze the raw HTML structure and computed styles to understand the exact layout positioning
// - Create meaningful HTML structure with INLINE STYLES that capture the layout requirements
// - Group related templates into logical parent containers without individual wrapper divs
// - DO NOT use <span> or <div> tags to wrap individual template placeholders
// - Place templates directly within their logical parent containers
// - Apply ALL necessary inline styles (position, display, flex, grid, margins, padding, width, height, etc.)
// - Ensure the bare minimum HTML with inline styles can reconstruct the exact visual layout

// LAYOUT ANALYSIS APPROACH:
// 1. Identify the main layout structure from computed styles
// 2. Analyze positioning, spacing, and layout properties 
// 3. Create semantic parent containers with inline styles
// 4. Place multiple related templates directly within these containers
// 5. Apply inline styles that capture the essential layout properties for exact reproduction

// EXAMPLE OF CORRECT STRUCTURE WITH INLINE STYLES:
// <div style="display: flex; flex-direction: column; width: 100%; padding: 20px; background: #f5f5f5;">
//   {{template-1}}
//   {{template-2}}
// </div>
// <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
//   {{template-3}}
//   {{template-4}}
// </div>

// RAW HTML:
// ${rawHtml}

// COMPUTED STYLES:
// ${computedStyles}

// REQUIREMENTS:
// - Create semantic HTML structure with inline styles for exact layout reproduction
// - Group related templates into logical parent containers
// - DO NOT wrap individual templates in spans or divs
// - Apply ALL essential CSS properties as inline styles: display, position, flex, grid, margins, padding, width, height, background, border, etc.
// - Include layout-critical properties that affect positioning and spacing
// - Use modern CSS techniques (flexbox, grid) in inline styles
// - The final HTML with inline styles MUST render identically to the original layout

// Please return ONLY the optimized HTML code with:
// 1. Logical parent containers with complete inline styles
// 2. Template placeholders placed directly within containers (no individual wrappers)
// 3. All layout-critical CSS properties applied as inline styles
// 4. Structure that reproduces the exact visual layout when rendered

// DO NOT include explanations or separate CSS - everything must be inline styles within the HTML.`;

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
//             content: 'You are an expert HTML and CSS optimizer. Create minimal HTML structure with complete inline styles that reproduce exact layouts. Group templates logically without individual wrappers and apply all necessary styling inline for pixel-perfect reproduction.'
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
//     let optimizedHtml = data.choices[0]?.message?.content;

//     if (!optimizedHtml) {
//       throw new Error('No response from OpenAI');
//     }

//     // Clean up the HTML - remove any code block markers
//     optimizedHtml = optimizedHtml.replace(/```html\s*/, '').replace(/```\s*$/, '').trim();
    
//     // Remove any explanatory text that might be before or after the HTML
//     const lines = optimizedHtml.split('\n');
//     let htmlStart = -1, htmlEnd = -1;
    
//     for (let i = 0; i < lines.length; i++) {
//       if (lines[i].trim().startsWith('<') && htmlStart === -1) {
//         htmlStart = i;
//       }
//       if (lines[i].trim().startsWith('<') || lines[i].trim() === '') {
//         htmlEnd = i;
//       }
//     }
    
//     if (htmlStart !== -1) {
//       optimizedHtml = lines.slice(htmlStart, htmlEnd + 1).join('\n').trim();
//     }

//     // Ensure template placeholders are clean (no wrapping tags)
//     optimizedHtml = optimizedHtml.replace(/<(?:span|div)[^>]*>\s*(\{\{template-\d+\}\})\s*<\/(?:span|div)>/g, '$1');

//     return NextResponse.json({ 
//       optimizedHtml: optimizedHtml || 'No HTML generated'
//     });
//   } catch (error) {
//     console.error('Error optimizing HTML:', error);
//     return NextResponse.json({ error: error.message || 'Failed to optimize HTML' }, { status: 500 });
//   }
// }



// PART - 2

import { NextResponse } from 'next/server';

// Function to parse HTML and extract elements with their attributes
function parseHtmlElements(html) {
  const elements = [];
  const elementRegex = /<(\w+)([^>]*?)>(.*?)<\/\1>/gs;
  const selfClosingRegex = /<(\w+)([^>]*?)\/>/g;
  
  let match;
  
  // Parse regular elements
  while ((match = elementRegex.exec(html)) !== null) {
    const [fullMatch, tagName, attributes, content] = match;
    const element = {
      tagName,
      attributes: parseAttributes(attributes),
      content: content.trim(),
      fullMatch,
      isSelfClosing: false
    };
    elements.push(element);
  }
  
  // Parse self-closing elements
  while ((match = selfClosingRegex.exec(html)) !== null) {
    const [fullMatch, tagName, attributes] = match;
    const element = {
      tagName,
      attributes: parseAttributes(attributes),
      content: '',
      fullMatch,
      isSelfClosing: true
    };
    elements.push(element);
  }
  
  return elements;
}

// Function to parse attributes from attribute string
function parseAttributes(attributeString) {
  const attributes = {};
  const attrRegex = /(\w+)=["']([^"']*?)["']/g;
  let match;
  
  while ((match = attrRegex.exec(attributeString)) !== null) {
    attributes[match[1]] = match[2];
  }
  
  return attributes;
}

// Function to match computed styles with HTML elements by selector
function matchStylesWithElements(elements, computedStyles) {
  const matchedElements = [];
  
  // Parse computed styles
  let styles = {};
  if (typeof computedStyles === 'string') {
    try {
      styles = JSON.parse(computedStyles);
    } catch (e) {
      console.error('Failed to parse computed styles:', e);
      return matchedElements;
    }
  } else {
    styles = computedStyles;
  }
  
  for (const element of elements) {
    const matchedStyle = {};
    
    // Check for matches by ID, class, and tag name
    const elementId = element.attributes.id;
    const elementClasses = element.attributes.class ? element.attributes.class.split(' ') : [];
    const tagName = element.tagName.toLowerCase();
    
    // Match by ID selector (#id)
    if (elementId && styles[`#${elementId}`]) {
      Object.assign(matchedStyle, styles[`#${elementId}`]);
    }
    
    // Match by class selectors (.class)
    for (const className of elementClasses) {
      if (styles[`.${className}`]) {
        Object.assign(matchedStyle, styles[`.${className}`]);
      }
    }
    
    // Match by tag name selector
    if (styles[tagName]) {
      Object.assign(matchedStyle, styles[tagName]);
    }
    
    // Match by combined selectors (tag.class, tag#id)
    if (elementId && styles[`${tagName}#${elementId}`]) {
      Object.assign(matchedStyle, styles[`${tagName}#${elementId}`]);
    }
    
    for (const className of elementClasses) {
      if (styles[`${tagName}.${className}`]) {
        Object.assign(matchedStyle, styles[`${tagName}.${className}`]);
      }
    }
    
    matchedElements.push({
      ...element,
      computedStyles: matchedStyle
    });
  }
  
  return matchedElements;
}

// Function to extract only layout-critical properties
function extractLayoutCriticalProperties(styles) {
  const layoutCritical = [
    // Display and positioning
    'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
    
    // Grid properties
    'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
    'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow',
    'grid-column-gap', 'grid-row-gap', 'gap', 'column-gap', 'row-gap',
    'grid-column', 'grid-row', 'grid-area',
    'justify-items', 'align-items', 'place-items',
    'justify-content', 'align-content', 'place-content',
    'justify-self', 'align-self', 'place-self',
    
    // Flex properties
    'flex-direction', 'flex-wrap', 'flex-flow',
    'justify-content', 'align-items', 'align-content',
    'flex', 'flex-grow', 'flex-shrink', 'flex-basis',
    'align-self', 'order',
    
    // Box model
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'box-sizing',
    
    // Visual properties that affect layout
    'overflow', 'overflow-x', 'overflow-y'
  ];
  
  const filtered = {};
  for (const prop of layoutCritical) {
    if (styles[prop] && styles[prop] !== 'initial' && styles[prop] !== 'auto' && styles[prop] !== 'none') {
      filtered[prop] = styles[prop];
    }
  }
  
  return filtered;
}

// Function to convert properties to inline style string
function stylesToInlineString(styles) {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
}

// Main function to create bare minimum HTML with exact layout
function createBareMinimumHtml(rawHtml, computedStyles) {
  // Parse HTML elements
  const elements = parseHtmlElements(rawHtml);
  
  // Match elements with their computed styles
  const matchedElements = matchStylesWithElements(elements, computedStyles);
  
  // Extract all templates from raw HTML
  const allTemplates = rawHtml.match(/\{\{template-\d+\}\}/g) || [];
  const templateSet = new Set(allTemplates);
  
  // Build optimized HTML
  let optimizedHtml = '';
  const processedElements = new Set();
  const includedTemplates = new Set();
  
  for (const element of matchedElements) {
    // Skip if already processed (avoid duplicates)
    if (processedElements.has(element.fullMatch)) continue;
    processedElements.add(element.fullMatch);
    
    // Extract only layout-critical properties
    const layoutStyles = extractLayoutCriticalProperties(element.computedStyles);
    
    // Check if element contains templates
    const elementTemplates = element.content.match(/\{\{template-\d+\}\}/g) || [];
    const hasTemplates = elementTemplates.length > 0;
    
    // Skip elements with no layout-critical styles AND no templates
    if (Object.keys(layoutStyles).length === 0 && !hasTemplates) {
      continue;
    }
    
    // Create inline style string
    const inlineStyle = stylesToInlineString(layoutStyles);
    
    // Build the optimized element
    if (element.isSelfClosing) {
      optimizedHtml += `<${element.tagName}${inlineStyle ? ` style="${inlineStyle}"` : ''}/>`;
    } else {
      // Process content to ensure templates are in div tags
      let processedContent = element.content;
      
      // Replace templates with div-wrapped versions
      processedContent = processedContent.replace(/\{\{template-\d+\}\}/g, (match) => {
        includedTemplates.add(match);
        return `<div>${match}</div>`;
      });
      
      // Remove any span wrappers around templates
      processedContent = processedContent.replace(/<span[^>]*>\s*(<div>\{\{template-\d+\}\}<\/div>)\s*<\/span>/g, '$1');
      
      optimizedHtml += `<${element.tagName}${inlineStyle ? ` style="${inlineStyle}"` : ''}>${processedContent}</${element.tagName}>`;
    }
    
    optimizedHtml += '\n';
  }
  
  // Ensure ALL templates are included - add missing ones
  const missingTemplates = [...templateSet].filter(template => !includedTemplates.has(template));
  if (missingTemplates.length > 0) {
    for (const template of missingTemplates) {
      optimizedHtml += `<div>${template}</div>\n`;
    }
  }
  
  return optimizedHtml.trim();
}

export async function GET(request) {
  const bareMinimumHtml = '<div style="padding: 20px; font-family: Arial, sans-serif;">Hello, this is bare minimum HTML!</div>';
  return new Response(JSON.stringify({ bareMinimumHtml }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(req) {
  const body = await req.json();
  const { rawHtml, computedStyles } = body;

  if (!rawHtml || !computedStyles) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // First, create bare minimum HTML using direct analysis
    const directOptimizedHtml = createBareMinimumHtml(rawHtml, computedStyles);
    
    // Parse elements for detailed analysis
    const elements = parseHtmlElements(rawHtml);
    const matchedElements = matchStylesWithElements(elements, computedStyles);
    
    // Create analysis summary
    const analysis = {
      totalElements: elements.length,
      elementsWithStyles: matchedElements.filter(el => Object.keys(el.computedStyles).length > 0).length,
      layoutElements: matchedElements.filter(el => {
        const layoutStyles = extractLayoutCriticalProperties(el.computedStyles);
        return Object.keys(layoutStyles).length > 0;
      }).length
    };
    
    // Enhanced AI prompt with specific element analysis
    const elementAnalysis = matchedElements.map(el => {
      const layoutStyles = extractLayoutCriticalProperties(el.computedStyles);
      return {
        element: `<${el.tagName}${el.attributes.id ? ` id="${el.attributes.id}"` : ''}${el.attributes.class ? ` class="${el.attributes.class}"` : ''}>`,
        layoutStyles,
        content: el.content.substring(0, 100) + (el.content.length > 100 ? '...' : '')
      };
    }).filter(el => Object.keys(el.layoutStyles).length > 0);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        optimizedHtml: directOptimizedHtml,
        analysis,
        elementAnalysis,
        message: 'OpenAI API key not configured, returning direct analysis result'
      });
    }

    // Extract all template placeholders from raw HTML
    const templateMatches = rawHtml.match(/\{\{template-\d+\}\}/g) || [];
    const templateList = [...new Set(templateMatches)]; // Remove duplicates
    
    const prompt = `TASK: Create BARE MINIMUM HTML with EXACT LAYOUT reproduction using inline styles.

CRITICAL TEMPLATE REQUIREMENT:
ALL these templates MUST be included in the final HTML: ${templateList.join(', ')}

ELEMENT ANALYSIS FROM HTML + COMPUTED STYLES MATCHING:
${JSON.stringify(elementAnalysis, null, 2)}

RAW HTML STRUCTURE:
${rawHtml}

COMPUTED STYLES REFERENCE:
${JSON.stringify(computedStyles, null, 2)}

MANDATORY REQUIREMENTS:
1. INCLUDE ALL TEMPLATES: Every template (${templateList.join(', ')}) MUST appear in the final HTML
2. MATCH layout styles by ID/class/tag from computed styles
3. Apply layout-critical properties as inline styles: display, grid-*, flex-*, position, margin, padding, width, height
4. Templates go directly inside layout containers: <div style="...">{{template-n}}</div>
5. NO <span> tags around templates - only <div> or other block elements
6. NO missing templates - every template from the original HTML must be preserved

TEMPLATE PLACEMENT RULES:
- Templates must be placed directly inside their layout containers
- Use <div style="...">{{template-n}}</div> structure
- Never use <span>{{template-n}}</span>
- Never omit templates from the output
- If a template has its own layout styles, apply them to its container div

CRITICAL LAYOUT REPRODUCTION RULES:
- If element has display: grid → include ALL grid properties inline
- If element has display: flex → include ALL flex properties inline  
- If element has position properties → include position, top, left, etc. inline
- If element has margin/padding → include exact margin/padding values inline
- Preserve parent-child relationships for elements with layout styles

EXPECTED OUTPUT STRUCTURE (ALL TEMPLATES INCLUDED):
<div style="display: grid; grid-template-columns: 300px 1fr 200px; gap: 20px; padding: 30px;">
  <div>{{template-1}}</div>
  <div>{{template-2}}</div>
  <div>{{template-3}}</div>
</div>

VERIFICATION CHECKLIST:
✓ All templates (${templateList.join(', ')}) are included
✓ Templates are inside <div> tags, not <span> tags
✓ Layout styles are applied as inline styles
✓ No templates are missing from the output

Return ONLY the bare minimum HTML code with complete inline styles and ALL TEMPLATES INCLUDED - NO explanations.`;

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
            content: 'You are an expert at HTML analysis and CSS optimization. Create bare minimum HTML that exactly reproduces layouts by matching HTML elements with computed styles and applying only layout-critical properties as inline styles.'
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
      return NextResponse.json({ 
        optimizedHtml: directOptimizedHtml,
        analysis,
        elementAnalysis,
        message: 'AI optimization failed, returning direct analysis result'
      });
    }

    const data = await response.json();
    let aiOptimizedHtml = data.choices[0]?.message?.content;

    if (aiOptimizedHtml) {
      // Clean up AI response
      aiOptimizedHtml = aiOptimizedHtml
        .replace(/```html\s*/, '')
        .replace(/```\s*$/, '')
        .trim();
      
      // Remove span tags around templates (force div structure)
      aiOptimizedHtml = aiOptimizedHtml.replace(/<span[^>]*>\s*(\{\{template-\d+\}\})\s*<\/span>/g, '<div>$1</div>');
      
      // Ensure templates are inside div tags if they're not already wrapped
      aiOptimizedHtml = aiOptimizedHtml.replace(/(?<!<[^>]*>)\s*(\{\{template-\d+\}\})\s*(?!<\/)/g, '<div>$1</div>');
      
      // Verify all templates are included
      const originalTemplates = rawHtml.match(/\{\{template-\d+\}\}/g) || [];
      const outputTemplates = aiOptimizedHtml.match(/\{\{template-\d+\}\}/g) || [];
      
      // If templates are missing, add them to the structure
      for (const template of originalTemplates) {
        if (!outputTemplates.includes(template)) {
          // Find where to insert the missing template based on original structure
          aiOptimizedHtml = aiOptimizedHtml.replace(/(<\/div>\s*$)/, `  <div>${template}</div>\n$1`);
        }
      }
    }

    return NextResponse.json({ 
      optimizedHtml: aiOptimizedHtml || directOptimizedHtml,
      directAnalysisHtml: directOptimizedHtml,
      analysis,
      elementAnalysis,
      method: aiOptimizedHtml ? 'ai_optimized' : 'direct_analysis'
    });

  } catch (error) {
    console.error('Error optimizing HTML:', error);
    
    // Fallback to direct analysis
    const fallbackHtml = createBareMinimumHtml(rawHtml, computedStyles);
    
    return NextResponse.json({ 
      optimizedHtml: fallbackHtml,
      error: error.message,
      method: 'fallback_direct_analysis'
    }, { status: 200 }); // Return 200 since we have fallback result
  }
}


// PART - 3


// import { NextResponse } from 'next/server';

// // Function to parse HTML and extract elements with their attributes
// function parseHtmlElements(html) {
//   const elements = [];
//   const elementRegex = /<(\w+)([^>]*?)>(.*?)<\/\1>/gs;
//   const selfClosingRegex = /<(\w+)([^>]*?)\/>/g;
  
//   let match;
  
//   // Parse regular elements
//   while ((match = elementRegex.exec(html)) !== null) {
//     const [fullMatch, tagName, attributes, content] = match;
//     const element = {
//       tagName,
//       attributes: parseAttributes(attributes),
//       content: content.trim(),
//       fullMatch,
//       isSelfClosing: false
//     };
//     elements.push(element);
//   }
  
//   // Parse self-closing elements
//   while ((match = selfClosingRegex.exec(html)) !== null) {
//     const [fullMatch, tagName, attributes] = match;
//     const element = {
//       tagName,
//       attributes: parseAttributes(attributes),
//       content: '',
//       fullMatch,
//       isSelfClosing: true
//     };
//     elements.push(element);
//   }
  
//   return elements;
// }

// // Function to parse attributes from attribute string
// function parseAttributes(attributeString) {
//   const attributes = {};
//   const attrRegex = /(\w+)=["']([^"']*?)["']/g;
//   let match;
  
//   while ((match = attrRegex.exec(attributeString)) !== null) {
//     attributes[match[1]] = match[2];
//   }
  
//   return attributes;
// }

// // Function to match computed styles with HTML elements by selector
// function matchStylesWithElements(elements, computedStyles) {
//   const matchedElements = [];
  
//   // Parse computed styles
//   let styles = {};
//   if (typeof computedStyles === 'string') {
//     try {
//       styles = JSON.parse(computedStyles);
//     } catch (e) {
//       console.error('Failed to parse computed styles:', e);
//       return matchedElements;
//     }
//   } else {
//     styles = computedStyles;
//   }
  
//   for (const element of elements) {
//     const matchedStyle = {};
    
//     // Check for matches by ID, class, and tag name
//     const elementId = element.attributes.id;
//     const elementClasses = element.attributes.class ? element.attributes.class.split(' ') : [];
//     const tagName = element.tagName.toLowerCase();
    
//     // Match by ID selector (#id)
//     if (elementId && styles[`#${elementId}`]) {
//       Object.assign(matchedStyle, styles[`#${elementId}`]);
//     }
    
//     // Match by class selectors (.class)
//     for (const className of elementClasses) {
//       if (styles[`.${className}`]) {
//         Object.assign(matchedStyle, styles[`.${className}`]);
//       }
//     }
    
//     // Match by tag name selector
//     if (styles[tagName]) {
//       Object.assign(matchedStyle, styles[tagName]);
//     }
    
//     // Match by combined selectors (tag.class, tag#id)
//     if (elementId && styles[`${tagName}#${elementId}`]) {
//       Object.assign(matchedStyle, styles[`${tagName}#${elementId}`]);
//     }
    
//     for (const className of elementClasses) {
//       if (styles[`${tagName}.${className}`]) {
//         Object.assign(matchedStyle, styles[`${tagName}.${className}`]);
//       }
//     }
    
//     matchedElements.push({
//       ...element,
//       computedStyles: matchedStyle
//     });
//   }
  
//   return matchedElements;
// }

// // Function to extract only layout-critical properties
// function extractLayoutCriticalProperties(styles) {
//   const layoutCritical = [
//     // Display and positioning
//     'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
    
//     // Grid properties
//     'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
//     'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow',
//     'grid-column-gap', 'grid-row-gap', 'gap', 'column-gap', 'row-gap',
//     'grid-column', 'grid-row', 'grid-area',
//     'justify-items', 'align-items', 'place-items',
//     'justify-content', 'align-content', 'place-content',
//     'justify-self', 'align-self', 'place-self',
    
//     // Flex properties
//     'flex-direction', 'flex-wrap', 'flex-flow',
//     'justify-content', 'align-items', 'align-content',
//     'flex', 'flex-grow', 'flex-shrink', 'flex-basis',
//     'align-self', 'order',
    
//     // Box model
//     'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
//     'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
//     'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
//     'box-sizing',
    
//     // Visual properties that affect layout
//     'overflow', 'overflow-x', 'overflow-y'
//   ];
  
//   const filtered = {};
//   for (const prop of layoutCritical) {
//     if (styles[prop] && styles[prop] !== 'initial' && styles[prop] !== 'auto' && styles[prop] !== 'none') {
//       filtered[prop] = styles[prop];
//     }
//   }
  
//   return filtered;
// }

// // Function to convert properties to inline style string
// function stylesToInlineString(styles) {
//   return Object.entries(styles)
//     .map(([key, value]) => `${key}: ${value}`)
//     .join('; ');
// }

// // Main function to create bare minimum HTML with exact layout
// function createBareMinimumHtml(rawHtml, computedStyles) {
//   // Parse HTML elements
//   const elements = parseHtmlElements(rawHtml);
  
//   // Match elements with their computed styles
//   const matchedElements = matchStylesWithElements(elements, computedStyles);
  
//   // Build optimized HTML
//   let optimizedHtml = '';
//   const processedElements = new Set();
  
//   for (const element of matchedElements) {
//     // Skip if already processed (avoid duplicates)
//     if (processedElements.has(element.fullMatch)) continue;
//     processedElements.add(element.fullMatch);
    
//     // Extract only layout-critical properties
//     const layoutStyles = extractLayoutCriticalProperties(element.computedStyles);
    
//     // Skip elements with no layout-critical styles unless they contain templates
//     if (Object.keys(layoutStyles).length === 0 && !element.content.includes('{{template-')) {
//       continue;
//     }
    
//     // Create inline style string
//     const inlineStyle = stylesToInlineString(layoutStyles);
    
//     // Build the optimized element
//     if (element.isSelfClosing) {
//       optimizedHtml += `<${element.tagName}${inlineStyle ? ` style="${inlineStyle}"` : ''}/>`;
//     } else {
//       // Remove unnecessary wrapper divs around templates
//       if (element.content.trim().match(/^{{\s*template-\d+\s*}}$/)) {
//         // If element only contains a template, check if it needs a wrapper
//         if (Object.keys(layoutStyles).length > 0) {
//           optimizedHtml += `<${element.tagName}${inlineStyle ? ` style="${inlineStyle}"` : ''}>${element.content}</${element.tagName}>`;
//         } else {
//           // No wrapper needed, just add the template
//           optimizedHtml += element.content;
//         }
//       } else {
//         optimizedHtml += `<${element.tagName}${inlineStyle ? ` style="${inlineStyle}"` : ''}>${element.content}</${element.tagName}>`;
//       }
//     }
    
//     optimizedHtml += '\n';
//   }
  
//   return optimizedHtml.trim();
// }

// export async function GET(request) {
//   const bareMinimumHtml = '<div style="padding: 20px; font-family: Arial, sans-serif;">Hello, this is bare minimum HTML!</div>';
//   return new Response(JSON.stringify({ bareMinimumHtml }), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' }
//   });
// }

// export async function POST(req) {
//   const body = await req.json();
//   const { rawHtml, computedStyles } = body;

//   if (!rawHtml || !computedStyles) {
//     return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//   }

//   try {
//     // First, create bare minimum HTML using direct analysis
//     const directOptimizedHtml = createBareMinimumHtml(rawHtml, computedStyles);
    
//     // Parse elements for detailed analysis
//     const elements = parseHtmlElements(rawHtml);
//     const matchedElements = matchStylesWithElements(elements, computedStyles);
    
//     // Create analysis summary
//     const analysis = {
//       totalElements: elements.length,
//       elementsWithStyles: matchedElements.filter(el => Object.keys(el.computedStyles).length > 0).length,
//       layoutElements: matchedElements.filter(el => {
//         const layoutStyles = extractLayoutCriticalProperties(el.computedStyles);
//         return Object.keys(layoutStyles).length > 0;
//       }).length
//     };
    
//     // Enhanced AI prompt with specific element analysis
//     const elementAnalysis = matchedElements.map(el => {
//       const layoutStyles = extractLayoutCriticalProperties(el.computedStyles);
//       return {
//         element: `<${el.tagName}${el.attributes.id ? ` id="${el.attributes.id}"` : ''}${el.attributes.class ? ` class="${el.attributes.class}"` : ''}>`,
//         layoutStyles,
//         content: el.content.substring(0, 100) + (el.content.length > 100 ? '...' : '')
//       };
//     }).filter(el => Object.keys(el.layoutStyles).length > 0);

//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json({ 
//         optimizedHtml: directOptimizedHtml,
//         analysis,
//         elementAnalysis,
//         message: 'OpenAI API key not configured, returning direct analysis result'
//       });
//     }

//     const prompt = `TASK: Create BARE MINIMUM HTML with EXACT LAYOUT reproduction using inline styles.

// ELEMENT ANALYSIS FROM HTML + COMPUTED STYLES MATCHING:
// ${JSON.stringify(elementAnalysis, null, 2)}

// RAW HTML STRUCTURE:
// ${rawHtml}

// COMPUTED STYLES REFERENCE:
// ${JSON.stringify(computedStyles, null, 2)}

// REQUIREMENTS FOR BARE MINIMUM HTML:
// 1. MATCH each HTML element with its computed styles by ID/class/tag
// 2. Extract ONLY layout-critical properties: display, grid-*, flex-*, position, margin, padding, width, height
// 3. Apply ALL matched layout properties as inline styles
// 4. Remove elements that don't affect layout AND don't contain templates
// 5. Group related templates only when they share a parent container with layout styles
// 6. NO individual wrapper divs around single templates unless they have layout styles

// CRITICAL LAYOUT REPRODUCTION RULES:
// - If element has display: grid → include ALL grid properties inline
// - If element has display: flex → include ALL flex properties inline  
// - If element has position properties → include position, top, left, etc. inline
// - If element has margin/padding → include exact margin/padding values inline
// - Preserve parent-child relationships for elements with layout styles
// - Remove empty containers unless they have layout-affecting styles

// EXPECTED OUTPUT STRUCTURE:
// <div style="display: grid; grid-template-columns: 300px 1fr 200px; gap: 20px; padding: 30px;">
//   {{template-1}}
//   {{template-2}}
//   {{template-3}}
// </div>

// Return ONLY the bare minimum HTML code with complete inline styles - NO explanations.`;

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
//             content: 'You are an expert at HTML analysis and CSS optimization. Create bare minimum HTML that exactly reproduces layouts by matching HTML elements with computed styles and applying only layout-critical properties as inline styles.'
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
//       return NextResponse.json({ 
//         optimizedHtml: directOptimizedHtml,
//         analysis,
//         elementAnalysis,
//         message: 'AI optimization failed, returning direct analysis result'
//       });
//     }

//     const data = await response.json();
//     let aiOptimizedHtml = data.choices[0]?.message?.content;

//     if (aiOptimizedHtml) {
//       // Clean up AI response
//       aiOptimizedHtml = aiOptimizedHtml
//         .replace(/```html\s*/, '')
//         .replace(/```\s*$/, '')
//         .trim();
      
//       // Remove unwanted wrapper divs around single templates
//       aiOptimizedHtml = aiOptimizedHtml.replace(/<div[^>]*>\s*(\{\{template-\d+\}\})\s*<\/div>/g, '$1');
//     }

//     return NextResponse.json({ 
//       optimizedHtml: aiOptimizedHtml || directOptimizedHtml,
//       directAnalysisHtml: directOptimizedHtml,
//       analysis,
//       elementAnalysis,
//       method: aiOptimizedHtml ? 'ai_optimized' : 'direct_analysis'
//     });

//   } catch (error) {
//     console.error('Error optimizing HTML:', error);
    
//     // Fallback to direct analysis
//     const fallbackHtml = createBareMinimumHtml(rawHtml, computedStyles);
    
//     return NextResponse.json({ 
//       optimizedHtml: fallbackHtml,
//       error: error.message,
//       method: 'fallback_direct_analysis'
//     }, { status: 200 }); // Return 200 since we have fallback result
//   }
// }



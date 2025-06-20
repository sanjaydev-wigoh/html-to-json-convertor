// export async function POST(request) {
//   const { htmlContent } = await request.json();

//   if (!htmlContent) {
//     return new Response(JSON.stringify({ error: 'Missing HTML content' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }

//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) {
//     return new Response(JSON.stringify({ error: 'OpenAI API key not configured on server' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }

//   try {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'system',
//             content: `You are an expert HTML structure optimizer. Your job is to convert complex HTML into the most efficient, clean code while maintaining EXACT visual output and functionality.

// CRITICAL REQUIREMENT: ALL STYLES MUST BE INLINE - NO EXTERNAL CSS OR <style> TAGS ALLOWED.

// ANALYSIS PROCESS:
// 1. Analyze the HTML structure and identify the most efficient layout method for each section
// 2. Determine whether Grid, Flexbox, or absolute positioning is most appropriate
// 3. Identify redundant wrapper elements and unnecessary nesting
// 4. Convert ALL CSS to inline styles on each element

// OPTIMIZATION STRATEGY:
// 1. **Layout Method Priority** (choose the most efficient):
//    - CSS Grid: For 2D layouts, card grids, complex positioning (inline: style="display: grid; grid-template-columns: ...")
//    - Flexbox: For 1D layouts, centering, flexible spacing (inline: style="display: flex; justify-content: ...")
//    - Absolute positioning: Only when Grid/Flex cannot achieve the layout efficiently (inline: style="position: absolute; top: 10px; left: 20px;")

// 2. **Structure Simplification**:
//    - Remove unnecessary wrapper divs that don't contribute to layout or styling
//    - Combine elements where possible without losing functionality
//    - Flatten nested structures when they can be achieved with modern CSS

// 3. **INLINE STYLES REQUIREMENT**:
//    - Convert ALL CSS rules to inline style attributes
//    - Move all <style> tag contents to inline styles on respective elements
//    - Move all external CSS classes to inline styles
//    - NO <style> tags, NO external CSS, NO class references allowed
//    - Every visual property must be in a style="" attribute

// 4. **PRESERVE EXACTLY**:
//    - All visual appearance (colors, fonts, spacing, shadows, etc.)
//    - All interactive elements and functionality
//    - All form elements and their behavior
//    - All content and text
//    - All IDs and important attributes (but convert classes to inline styles)
//    - All responsive behavior (use inline media queries if needed)

// 5. **REMOVE ONLY**:
//    - Empty divs with no purpose
//    - Redundant wrapper elements
//    - All CSS classes (convert to inline styles)
//    - All <style> tags (convert to inline styles)
//    - All external CSS references
//    - Duplicate or overridden styles
//    - Unused CSS rules

// CONVERSION RULES:
// - Every element with visual styling must have a style="" attribute
// - Choose the most semantic and efficient layout method for each component
// - Maintain exact visual spacing and alignment
// - Preserve all functionality and interactivity
// - Ensure cross-browser compatibility
// - Convert hover/focus states to inline event handlers if needed

// OUTPUT FORMAT:
// - Complete HTML document with <!DOCTYPE html>
// - NO <style> tags anywhere in the document
// - NO external CSS references
// - NO CSS classes - everything converted to inline styles
// - Optimized structure using the most appropriate layout methods
// - Clean, readable code with proper indentation
// - All original functionality and appearance preserved

// EXAMPLE CONVERSION:
// Before: <div class="header" style="color: red;"><h1 class="title">Hello</h1></div>
// After: <div style="background: #f0f0f0; padding: 20px; color: red;"><h1 style="font-size: 24px; margin: 0; font-weight: bold;">Hello</h1></div>

// CRITICAL: The output must render and function IDENTICALLY to the input, just with cleaner structure and ALL styles inline.`
//           },
//           {
//             role: 'user',
//             content: `Optimize this HTML structure by choosing the most efficient layout methods (Grid/Flex/Position) for each section. Convert ALL styles to inline and remove unnecessary wrapper elements while preserving exact visual appearance and functionality:

// ${htmlContent}

// REQUIREMENTS:
// 1. Convert ALL CSS to inline styles - NO <style> tags or external CSS allowed
// 2. Analyze each layout section and choose the most efficient CSS method
// 3. Remove only truly unnecessary wrapper elements
// 4. Preserve ALL visual styling and functionality exactly
// 5. Use Grid for 2D layouts, Flex for 1D layouts, absolute positioning sparingly
// 6. Every styled element must have style="" attribute
// 7. Return complete, optimized HTML document with only inline styles

// The output must look and function EXACTLY the same as the input, with ALL styles inline.`
//           }
//         ],
//         max_tokens: 4000,
//         temperature: 0
//       })
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error?.message || 'OpenAI API error');
//     }

//     const minimizedHTML = data.choices[0].message.content;

//     return new Response(JSON.stringify({ 
//       success: true, 
//       minimizedHTML,  // Changed from optimizedHTML to minimizedHTML to match frontend
//       originalLength: htmlContent.length,
//       minimizedLength: minimizedHTML.length,
//       reductionPercentage: Math.round((1 - minimizedHTML.length / htmlContent.length) * 100)
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });

//   } catch (error) {
//     console.error('Optimization error:', error);
//     return new Response(JSON.stringify({ 
//       error: 'Failed to optimize HTML', 
//       details: error.message 
//     }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }
// export async function POST(request) {
//   const { htmlContent } = await request.json();

//   if (!htmlContent) {
//     return new Response(JSON.stringify({ error: 'Missing HTML content' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) {
//     return new Response(
//       JSON.stringify({ error: 'OpenAI API key not configured on server' }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }

//   try {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'system',
//             content: `
// You are an expert HTML optimizer.

// Your goal is to convert messy or deeply nested HTML into clean, **bare minimum HTML** with simplified structure — while maintaining the **EXACT layout and visual output**.

// Follow these rules carefully:

// ---

// 1. **If a <section> is found**, treat it as the **background container**.
//    - Set its background properties correctly (\`background\`, \`background-color\`, \`background-image\`, etc.)
//    - Create it as the **main parent container**.
//    - All other elements should go **inside this parent**.

// 2. **Create sub-containers** as needed inside the parent.
//    - You are allowed to use \`grid\`, \`flex\`, or \`position\` (absolute or relative) to **exactly match the layout**.
//    - Use **as many child containers as required**, but keep it **minimal**.

// 3. All **CSS must be inline only**.
//    - No external styles.
//    - No <style> tags.
//    - No CSS classes.
//    - All styles must go inside \`style=""\` attributes.

// 4. **Preserve all IDs, data attributes, and placeholders** like \`{{template-1}}\` exactly as they are.

// 5. **Remove all unnecessary divs** or wrappers that serve no layout or visual purpose.

// 6. Final output must:
//    - Keep the **exact layout and positioning** (pixel-perfect)
//    - Show the **same visual appearance**
//    - Use **clean minimal HTML**
//    - Have **100% inline styles**

// Return only the final optimized HTML document with no explanation.
//             `.trim(),
//           },
//           {
//             role: 'user',
//             content: `Convert this HTML based on the instructions:

// ${htmlContent}`,
//           },
//         ],
//         max_tokens: 4000,
//         temperature: 0,
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error?.message || 'OpenAI API error');
//     }

//     const minimizedHTML = data.choices[0].message.content;

//     return new Response(
//       JSON.stringify({
//         success: true,
//         minimizedHTML,
//         originalLength: htmlContent.length,
//         minimizedLength: minimizedHTML.length,
//         reductionPercentage: Math.round(
//           (1 - minimizedHTML.length / htmlContent.length) * 100
//         ),
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (error) {
//     console.error('Optimization error:', error);
//     return new Response(
//       JSON.stringify({
//         error: 'Failed to optimize HTML',
//         details: error.message,
//       }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }


// export async function POST(request) {
//   const { htmlContent } = await request.json();

//   if (!htmlContent) {
//     return new Response(JSON.stringify({ error: 'Missing HTML content' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) {
//     return new Response(
//       JSON.stringify({ error: 'OpenAI API key not configured on server' }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }

//   try {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'system',
//             content: `
// You are a professional HTML converter tasked with rebuilding complex HTML layouts into **pixel-perfect**, **bare-minimum** HTML using inline styles and minimal structure.

// ---

// ## ✅ Main Responsibilities:

// 1. **Section-Based Layout:**
//   - do not create a new section if one already exists.
//    - If you think \`<section>\` tag is not needed you can remove it.
//    - Apply any \`background-color\`, \`background-image\`, or \`video/image\` backgrounds directly on the section or one direct div inside.
//    - if background playing on any other element remove the element and apply the background to the section.
//    - if same height playing multiple times on other element remove the element and apply the height to the right element.
//    - If no \`<section>\` is found, create one as the main container.
 

// 2. **Background Handling:**
//    - If an \`<img>\` or \`<video>\` is found visually behaving like a background, place it under \`<section>\` as a **background wrapper** div.

// 3. **Parent Content Wrapper:**
//    - remove all unnecessary divs and wrappers.
//    - if same height or width are set on the multiple div's, set them to right one place and remove all unnecessary divs.
//    - Inside the \`<section>\`, create **one clean parent container** for all widgets.
//    - This container will hold all content elements and layout blocks.
//    remove unnecessary height elemnts and set the height to the parent container.

// 4. **Widget Handling:**
//    - Identify visual **widgets** (headings, buttons, images, icons, paragraphs, etc.).
//    - Wrap each widget only if needed, using **one level of wrapper div max**.
//    - Layout these widgets using **grid**, **flex**, or **absolute positioning** to match the visual structure.
//    - Keep the layout **exactly the same** as the original.

// 5. **Inline Styling Only:**
//    - Use only \`style=""\` attributes.
//    - No class names, no external styles, no \`<style>\` tags.
//    - All visual details (font, spacing, color, borders, shadows, positions) must be preserved with inline styles.

// 6. **Wrapper Optimization:**
//    - **Minimize div nesting**.
//    - Remove any divs that are unnecessary for visual structure or layout.
//    - Ensure the DOM tree is neat, clean, and minimal.

// 7. **Preserve:**
//    - All IDs
//    - Template placeholders (like \`{{template-1}}\`)
//    - Data attributes that look important (e.g. \`data-testid\`, \`data-mesh-id\`)

// ---

// ## 📌 Output Requirements:

// - Must look **100% visually identical** to the original input
// - Must be **clean, minimal**, and **inline-styled only**
// - Must use **section**, then background div (if needed), then **one parent container**, and inside that — clean widgets

// Return only the final cleaned HTML. No explanation.
// `.trim()
//           },
//           {
//             role: 'user',
//             content: `Clean and rebuild the following HTML, following all rules strictly:

// ${htmlContent}`,
//           },
//         ],
//         max_tokens: 4000,
//         temperature: 0,
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error?.message || 'OpenAI API error');
//     }

//     const minimizedHTML = data.choices[0].message.content;

//     return new Response(
//       JSON.stringify({
//         success: true,
//         minimizedHTML,
//         originalLength: htmlContent.length,
//         minimizedLength: minimizedHTML.length,
//         reductionPercentage: Math.round(
//           (1 - minimizedHTML.length / htmlContent.length) * 100
//         ),
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (error) {
//     console.error('Optimization error:', error);
//     return new Response(
//       JSON.stringify({
//         error: 'Failed to optimize HTML',
//         details: error.message,
//       }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }
// import { z } from 'zod';
// import OpenAI from 'openai';

// const requestSchema = z.object({
//   htmlCode: z.string().min(1, 'HTML code is required')
// });

// export async function POST(request) {
//   try {
//     // Check if API key exists in environment
//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey) {
//       return new Response(JSON.stringify({ 
//         error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' 
//       }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Parse and validate request data
//     const body = await request.json();
//     const { htmlCode } = requestSchema.parse(body);

//     // Initialize OpenAI with environment API key
//     const openai = new OpenAI({
//       apiKey: apiKey,
//     });

//     // Create the prompt for optimization
//     const prompt = `
// You are an expert web developer. Analyze the following HTML code and create an optimized version that:

// 1. Reduces code lines by 60-70% while maintaining the exact same visual layout
// 2. Uses modern CSS techniques (flexbox, grid, utility classes)
// 3. Removes redundant code and unnecessary elements
// 4. Combines similar styles
// 5. Uses semantic HTML5 elements where appropriate
// 6. Maintains all functionality and visual appearance
// 7. Uses efficient CSS selectors and properties

// Original HTML Code:
// \`\`\`html
// ${htmlCode}
// \`\`\`

// Please provide ONLY the optimized HTML code in your response, wrapped in a code block. Focus on significant line reduction while preserving the exact layout and styling.
// `;

//     // Call OpenAI API
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "You are an expert web developer specializing in HTML/CSS optimization. Always respond with clean, optimized code that maintains visual fidelity while reducing complexity."
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       max_tokens: 2000,
//       temperature: 0.3,
//     });

//     const optimizedCode = completion.choices[0]?.message?.content || '';
    
//     // Extract code from markdown if present
//     const codeMatch = optimizedCode.match(/```html\n([\s\S]*?)\n```/) || 
//                      optimizedCode.match(/```\n([\s\S]*?)\n```/);
    
//     const cleanCode = codeMatch ? codeMatch[1] : optimizedCode;

//     // Calculate reduction percentage
//     const originalLines = htmlCode.split('\n').length;
//     const optimizedLines = cleanCode.split('\n').length;
//     const reduction = Math.round(((originalLines - optimizedLines) / originalLines) * 100);

//     return new Response(JSON.stringify({
//       success: true,
//       originalCode: htmlCode,
//       optimizedCode: cleanCode,
//       originalLines,
//       optimizedLines,
//       reductionPercentage: reduction
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });

//   } catch (error) {
//     console.error('API Error:', error);

//     if (error instanceof z.ZodError) {
//       return new Response(JSON.stringify({
//         error: 'Validation error',
//         details: error.errors
//       }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     if (error.code === 'insufficient_quota') {
//       return new Response(JSON.stringify({
//         error: 'OpenAI API quota exceeded. Please check your billing.'
//       }), {
//         status: 402,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     if (error.code === 'invalid_api_key') {
//       return new Response(JSON.stringify({
//         error: 'Invalid OpenAI API key provided.'
//       }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     return new Response(JSON.stringify({
//       error: 'Failed to optimize HTML',
//       message: error.message
//     }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }
// import { z } from 'zod';
// import OpenAI from 'openai';

// const requestSchema = z.object({
//   htmlCode: z.string().min(1, 'HTML code is required')
// });

// export async function POST(request) {
//   try {
//     // Check if API key exists in environment
//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey) {
//       return new Response(JSON.stringify({ 
//         error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' 
//       }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Parse and validate request data
//     const body = await request.json();
//     const { htmlCode } = requestSchema.parse(body);

//     // Initialize OpenAI with environment API key
//     const openai = new OpenAI({
//       apiKey: apiKey,
//     });

//     // Create the prompt for optimization
//     const prompt = `
// You are an expert web developer specializing in ultra-efficient HTML/CSS implementation. Your task is to:

// 1. FIRST analyze the visual layout, spacing, colors, and typography of the provided HTML
// 2. THEN create a completely new minimal HTML structure that reproduces the EXACT same visual appearance
// 3. Use the absolute bare minimum HTML elements required
// 4. Implement all styling using highly optimized inline styles with CSS shorthand
// 5. Remove ALL unnecessary elements, wrappers, and redundant styles

// **CRITICAL REQUIREMENTS:**
// - Output must look IDENTICAL to the original when rendered
// - Use 60-70% fewer lines of code than original
// - Only use inline styles (no CSS classes or style tags)
// - Implement modern layout techniques (Flexbox/Grid) in inline styles
// - Use semantic HTML5 elements where appropriate
// - Combine and optimize all style properties using CSS shorthand
// - Remove all default/redundant style properties
// - Keep all functionality (hover states, etc.) as inline styles

// **OPTIMIZATION STRATEGIES:**
// 1. Layout Analysis:
//    - Identify the visual structure (columns, sections, spacing)
//    - Note all colors, fonts, and decorative elements
//    - Understand spacing relationships between elements

// 2. HTML Reconstruction:
//    - Use the fewest possible HTML elements
//    - Replace nested divs with semantic elements where possible
//    - Implement layout using efficient Flexbox/Grid in inline styles
//    - Combine elements with similar styling

// 3. Inline Style Optimization:
//    - Use maximum CSS shorthand properties
//    - Combine multiple properties into single declarations
//    - Remove all default/redundant values
//    - Use efficient color codes (#fff instead of white)
//    - Remove px units from 0 values
//    - Consolidate similar styles across elements

// **OUTPUT REQUIREMENTS:**
// - Provide ONLY the complete optimized HTML code
// - All styles must be inline
// - Code should be extremely minimal but visually identical
// - No explanations or comments in the output

// Original HTML Code:
// \`\`\`html
// ${htmlCode}
// \`\`\`

// Provide your optimized HTML code that reproduces the exact same visual appearance with minimal code:
// `;

//     // Call OpenAI API
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4-turbo", 
//       messages: [
//         {
//           role: "system",
//           content: "You are an expert web developer who specializes in recreating visual layouts with absolute minimal HTML and optimized inline styles. You first analyze the visual appearance, then reconstruct it using the fewest possible elements and most efficient CSS shorthand properties. You never use CSS classes or style tags - everything is implemented through optimized inline styles."
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       max_tokens: 4000,
//       temperature: 0.1, // Lower temperature for more deterministic output
//     });

//     let optimizedCode = completion.choices[0]?.message?.content || '';
    
//     // Clean the output to get just the HTML
//     optimizedCode = optimizedCode.trim();
//     const codeMatch = optimizedCode.match(/```(?:html)?\n([\s\S]*?)\n```/);
//     if (codeMatch) {
//       optimizedCode = codeMatch[1];
//     }

//     // Remove any remaining markdown or explanations
//     optimizedCode = optimizedCode.split('```')[0].trim();

//     // Calculate metrics
//     const originalLines = htmlCode.split('\n').length;
//     const optimizedLines = optimizedCode.split('\n').length;
//     const reduction = originalLines > 0 
//       ? Math.round(((originalLines - optimizedLines) / originalLines) * 100)
//       : 0;

//     return new Response(JSON.stringify({
//       success: true,
//       originalCode: htmlCode,
//       optimizedCode,
//       originalLines,
//       optimizedLines,
//       reductionPercentage: reduction
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });

//   } catch (error) {
//     console.error('API Error:', error);

//     if (error instanceof z.ZodError) {
//       return new Response(JSON.stringify({
//         error: 'Validation error',
//         details: error.errors
//       }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     return new Response(JSON.stringify({
//       error: 'Failed to optimize HTML',
//       message: error.message
//     }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }

// import { z } from 'zod';
// import OpenAI from 'openai';

// const requestSchema = z.object({
//   htmlCode: z.string().min(1, 'HTML code is required')
// });

// export async function POST(request) {
//   try {
//     // Check if API key exists in environment
//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey) {
//       return new Response(JSON.stringify({ 
//         error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' 
//       }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Parse and validate request data
//     const body = await request.json();
//     const { htmlCode } = requestSchema.parse(body);

//     // Initialize OpenAI with environment API key
//     const openai = new OpenAI({
//       apiKey: apiKey,
//     });

//     // Create the aggressive optimization prompt
//     const prompt = `
// You are an expert web developer who specializes in extreme HTML/CSS optimization while maintaining identical visual output.

// **TARGET: Reduce code by 60-70% while keeping IDENTICAL visual appearance**

// **STEP-BY-STEP OPTIMIZATION PROCESS:**

// 1. **VISUAL ANALYSIS FIRST:**
//    - Identify the exact visual layout, colors, spacing, typography
//    - Note all interactive elements and their behaviors
//    - Map the visual hierarchy and content flow

// 2. **AGGRESSIVE STRUCTURAL OPTIMIZATION:**
//    - Replace multiple nested divs with single elements using advanced CSS
//    - Convert complex layouts to efficient Flexbox/Grid with minimal markup
//    - Eliminate ALL unnecessary wrapper elements
//    - Combine elements that serve similar visual purposes
//    - Use CSS pseudo-elements (::before, ::after) to reduce HTML elements

// 3. **MAXIMUM CSS SHORTHAND & INLINE OPTIMIZATION:**
//    - Use ultimate CSS shorthand: margin, padding, border, background, font
//    - Combine ALL possible properties into single declarations
//    - Remove ALL default values and redundant properties
//    - Use shortest possible color codes (#fff, #000, etc.)
//    - Eliminate 'px' from 0 values, use efficient units

// 4. **ULTRA-MINIMAL HTML TECHNIQUES:**
//    - Use semantic elements that provide styling by default
//    - Implement layouts with minimal container elements
//    - Use CSS Grid/Flexbox properties to eliminate spacer elements
//    - Leverage CSS positioning to reduce structural elements
//    - Use CSS transforms and positioning instead of extra markup

// **CRITICAL SUCCESS CRITERIA:**
// ✅ 60-70% fewer lines of code than original
// ✅ Visually IDENTICAL when rendered (pixel-perfect match)
// ✅ All functionality preserved (hover, responsive, etc.)
// ✅ Only inline styles (no external CSS or classes)

// **AGGRESSIVE OPTIMIZATION EXAMPLES:**
// - Instead of: <div><div><p>text</p></div></div> → Use: <p style="...">text</p>
// - Multiple containers → Single container with advanced CSS
// - Spacer elements → CSS margins/padding
// - Layout divs → CSS Grid/Flexbox properties
// - Wrapper elements → CSS positioning and transforms

// **OUTPUT REQUIREMENTS:**
// - Provide ONLY the final optimized HTML code
// - Must achieve 60-70% line reduction
// - Must look identical when rendered
// - No explanations, comments, or markdown formatting
// - CRITICAL: Do not send any output without wrapping it in {{template-n}} tags

// Original HTML Code (${htmlCode.split('\n').length} lines):
// \`\`\`html
// ${htmlCode}
// \`\`\`

// Provide ultra-optimized HTML wrapped in {{template-n}} tags (targeting ${Math.round(htmlCode.split('\n').length * 0.3)}-${Math.round(htmlCode.split('\n').length * 0.4)} lines):`;

//     // First attempt with aggressive optimization
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "You are an expert at extreme HTML/CSS optimization. You excel at reducing code by 60-70% while maintaining pixel-perfect visual accuracy. You use advanced CSS techniques, maximum shorthand properties, and minimal HTML structure. You always prioritize achieving the target reduction percentage while preserving visual fidelity. CRITICAL: You must wrap all output in {{template-n}} tags and never send plain HTML code."
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       max_tokens: 4000,
//       temperature: 0.2, // Slight creativity for optimization techniques
//       top_p: 0.9,
//     });

//     let optimizedCode = completion.choices[0]?.message?.content || '';
    
//     // Clean the output - look for {{template-n}} tags first
//     optimizedCode = optimizedCode.trim();
    
//     // First try to extract from {{template-n}} tags
//     const templateMatch = optimizedCode.match(/\{\{template-n\}\}([\s\S]*?)\{\{\/template-n\}\}/);
//     if (templateMatch) {
//       optimizedCode = templateMatch[1].trim();
//     } else {
//       // Fallback to markdown code blocks
//       const codeMatch = optimizedCode.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/);
//       if (codeMatch) {
//         optimizedCode = codeMatch[1].trim();
//       }
//     }

//     // Calculate metrics
//     const originalLines = htmlCode.split('\n').filter(line => line.trim()).length;
//     const optimizedLines = optimizedCode.split('\n').filter(line => line.trim()).length;
//     let reduction = originalLines > 0 
//       ? Math.round(((originalLines - optimizedLines) / originalLines) * 100)
//       : 0;

//     // If reduction is less than 50%, try a second more aggressive attempt
//     if (reduction < 50 && optimizedCode) {
//       const secondPrompt = `
// The previous optimization only achieved ${reduction}% reduction. I need 60-70% reduction while maintaining identical visual appearance.

// **ULTRA-AGGRESSIVE OPTIMIZATION REQUIRED:**

// Apply these extreme techniques to the following code:
// 1. **Eliminate ALL unnecessary HTML elements** - Use CSS positioning, flexbox, grid to replace structural markup
// 2. **Maximum CSS consolidation** - Combine every possible property into shorthand
// 3. **Advanced CSS techniques** - Use pseudo-elements, transforms, absolute positioning to minimize HTML
// 4. **Single-line formatting** - Put multiple small elements on single lines where possible
// 5. **Ultimate shorthand** - Use shortest possible CSS values and properties

// **MANDATE: Must achieve 60-70% line reduction**

// Previous attempt (${optimizedLines} lines, ${reduction}% reduction):
// \`\`\`html
// ${optimizedCode}
// \`\`\`

// Provide EVEN MORE optimized version wrapped in {{template-n}} tags (target: ${Math.round(originalLines * 0.3)}-${Math.round(originalLines * 0.4)} lines):`;

//       const secondCompletion = await openai.chat.completions.create({
//         model: "gpt-4-turbo",
//         messages: [
//           {
//             role: "system",
//             content: "You are an expert at extreme HTML optimization. You must achieve 60-70% code reduction using ultra-aggressive techniques while maintaining visual accuracy. Use advanced CSS positioning, pseudo-elements, and maximum shorthand to minimize HTML structure. CRITICAL: Always wrap your output in {{template-n}} tags."
//           },
//           {
//             role: "user",
//             content: secondPrompt
//           }
//         ],
//         max_tokens: 4000,
//         temperature: 0.3,
//         top_p: 0.8,
//       });

//       let secondOptimized = secondCompletion.choices[0]?.message?.content || '';
//       secondOptimized = secondOptimized.trim();
      
//       // First try to extract from {{template-n}} tags
//       const templateMatch = secondOptimized.match(/\{\{template-n\}\}([\s\S]*?)\{\{\/template-n\}\}/);
//       if (templateMatch) {
//         secondOptimized = templateMatch[1].trim();
//       } else {
//         // Fallback to markdown code blocks
//         const secondCodeMatch = secondOptimized.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/);
//         if (secondCodeMatch) {
//           secondOptimized = secondCodeMatch[1].trim();
//         }
//       }

//       const secondOptimizedLines = secondOptimized.split('\n').filter(line => line.trim()).length;
//       const secondReduction = originalLines > 0 
//         ? Math.round(((originalLines - secondOptimizedLines) / originalLines) * 100)
//         : 0;

//       // Use the better optimization
//       if (secondReduction > reduction && secondOptimized) {
//         optimizedCode = secondOptimized;
//         reduction = secondReduction;
//       }
//     }

//     // Final metrics calculation
//     const finalOptimizedLines = optimizedCode.split('\n').filter(line => line.trim()).length;
//     const finalReduction = originalLines > 0 
//       ? Math.round(((originalLines - finalOptimizedLines) / originalLines) * 100)
//       : 0;

//     const originalChars = htmlCode.length;
//     const optimizedChars = optimizedCode.length;
//     const charReduction = originalChars > 0 
//       ? Math.round(((originalChars - optimizedChars) / originalChars) * 100)
//       : 0;

//     return new Response(JSON.stringify({
//       success: true,
//       originalCode: htmlCode,
//       optimizedCode,
//       targetAchieved: finalReduction >= 60,
//       metrics: {
//         originalLines,
//         optimizedLines: finalOptimizedLines,
//         lineReduction: finalReduction,
//         originalChars,
//         optimizedChars,
//         charReduction: Math.max(0, charReduction),
//         targetRange: "60-70%",
//         achieved: finalReduction >= 60 ? "✅ Target achieved" : `❌ Only ${finalReduction}% (need 60%+)`
//       }
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });

//   } catch (error) {
//     console.error('API Error:', error);

//     if (error instanceof z.ZodError) {
//       return new Response(JSON.stringify({
//         error: 'Validation error',
//         details: error.errors
//       }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     return new Response(JSON.stringify({
//       error: 'Failed to optimize HTML',
//       message: error.message
//     }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }
// import { z } from 'zod';
// import OpenAI from 'openai';

// const requestSchema = z.object({
//   htmlCode: z.string().min(1, 'HTML code is required')
// });

// export async function POST(request) {
//   try {
//     // Check if API key exists
//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey) {
//       return new Response(JSON.stringify({ 
//         error: 'OpenAI API key not configured' 
//       }), { status: 500 });
//     }

//     // Parse and validate request
//     const body = await request.json();
//     const { htmlCode } = requestSchema.parse(body);

//     const openai = new OpenAI({ apiKey });

//     // Strict prompt with template tag enforcement
//     const prompt = `
// CRITICAL REQUIREMENTS:
// 1. MUST wrap final output in {{template-n}} tags
// 2. MUST preserve ALL {{template-xx}} placeholders
// 3. MUST achieve 70-80% line reduction
// 4. MUST maintain pixel-perfect visual match
// 4. MUST use line-styles only (no classes, no <style> tags)
// 5. MUST use maximum CSS shorthand
// 6. MUST remove all unnecessary elements and wrappers
// 7. MUST use modern CSS techniques (Flexbox/Grid)

// OPTIMIZATION TECHNIQUES TO USE:
// - Remove ALL unnecessary wrapper divs
// - Use CSS Grid/Flexbox efficiently
// - Maximum CSS shorthand (inset, margin/padding shorthand)
// - Combine redundant styles
// - Eliminate empty/irrelevant elements

// FAILURE CONDITIONS:
// ❌ Missing {{template-n}} wrapper
// ❌ Missing any {{template-xx}} placeholder  
// ❌ Less than 70% reduction
// ❌ Visual differences

// Original HTML (${htmlCode.split('\n').length} lines):
// \`\`\`html
// ${htmlCode}
// \`\`\`

// Provide optimized HTML wrapped in {{template-n}} tags (target ${Math.round(htmlCode.split('\n').length * 0.2)} lines):`;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4-turbo",
//       messages: [
//         {
//           role: "system",
//           content: `You are an HTML optimization expert. You MUST:
// 1. Preserve ALL {{template-xx}} placeholders
// 2. Wrap output in {{template-n}} tags
// 3. Achieve 70-80% line reduction
// 4. Maintain identical visual output
// 5. Use maximum CSS shorthand
// 6. Remove redundant elements`
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       temperature: 0.1, // Low for deterministic output
//       max_tokens: 4000
//     });

//     let optimizedCode = completion.choices[0]?.message?.content || '';
    
//     // Strict template tag extraction
//     const templateMatch = optimizedCode.match(/\{\{template-n\}\}([\s\S]*?)\{\{\/template-n\}\}/);
//     if (!templateMatch) {
//       // Recovery attempt if tags missing
//       const recovery = await openai.chat.completions.create({
//         model: "gpt-4-turbo",
//         messages: [
//           {
//             role: "system",
//             content: "You MUST wrap the HTML in {{template-n}} tags. No other output is acceptable."
//           },
//           {
//             role: "assistant", 
//             content: optimizedCode
//           },
//           {
//             role: "user",
//             content: "Please wrap this HTML in {{template-n}} tags exactly like this: {{template-n}}[HTML HERE]{{/template-n}}"
//           }
//         ],
//         temperature: 0
//       });
//       optimizedCode = recovery.choices[0]?.message?.content || '';
//     }

//     // Final extraction
//     const finalMatch = optimizedCode.match(/\{\{template-n\}\}([\s\S]*?)\{\{\/template-n\}\}/);
//     optimizedCode = finalMatch ? finalMatch[1].trim() : '';

//     // Verify all template placeholders exist
//     const missingPlaceholders = [];
//     for (let i = 1; i <= 15; i++) {
//       if (!optimizedCode.includes(`{{template-${i}}}`)) {
//         missingPlaceholders.push(i);
//       }
//     }

//     // Calculate metrics
//     const originalLines = htmlCode.split('\n').filter(l => l.trim()).length;
//     const optimizedLines = optimizedCode.split('\n').filter(l => l.trim()).length;
//     const reduction = originalLines > 0 
//       ? Math.round(((originalLines - optimizedLines) / originalLines) * 100)
//       : 0;

//     return new Response(JSON.stringify({
//       success: missingPlaceholders.length === 0,
//       originalCode: htmlCode,
//       optimizedCode,
//       metrics: {
//         originalLines,
//         optimizedLines, 
//         reduction,
//         missingPlaceholders,
//         targetAchieved: reduction >= 70
//       },
//       warnings: missingPlaceholders.length > 0 
//         ? `Missing placeholders: ${missingPlaceholders.join(', ')}`
//         : null
//     }), { status: 200 });

//   } catch (error) {
//     console.error('Error:', error);
//     return new Response(JSON.stringify({
//       error: error.message
//     }), { status: 500 });
//   }
// }


import { z } from 'zod';
import OpenAI from 'openai';

// Input validation schema
const requestSchema = z.object({
  htmlCode: z.string().min(1, 'HTML code is required')
});

// Output validation schemas
const metricsSchema = z.object({
  originalLines: z.number().min(0),
  optimizedLines: z.number().min(0),
  reduction: z.number().min(0).max(100),
  missingPlaceholders: z.array(z.number().min(1).max(15)),
  targetAchieved: z.boolean()
});

const successResponseSchema = z.object({
  success: z.boolean(),
  originalCode: z.string(),
  optimizedCode: z.string(),
  metrics: metricsSchema,
  warnings: z.string().nullable()
});

const errorResponseSchema = z.object({
  error: z.string()
});

export async function POST(request) {
  try {
    // Check if API key exists
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify(
          errorResponseSchema.parse({ 
            error: 'OpenAI API key not configured' 
          })
        ), 
        { status: 500 }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const { htmlCode } = requestSchema.parse(body);

    const openai = new OpenAI({ apiKey });

    // Strict prompt with template tag enforcement
    const prompt = `
CRITICAL REQUIREMENTS:
1. MUST wrap final output in {{template-n}} tags
2. MUST preserve ALL {{template-xx}} placeholders
3. MUST achieve 70-80% line reduction
4. MUST maintain pixel-perfect visual match
4. MUST use line-styles only (no classes, no <style> tags)
5. MUST use maximum CSS shorthand
6. MUST remove all unnecessary elements and wrappers
7. MUST use modern CSS techniques (Flexbox/Grid)

OPTIMIZATION TECHNIQUES TO USE:
- Remove ALL unnecessary wrapper divs
- Use CSS Grid/Flexbox efficiently
- Maximum CSS shorthand (inset, margin/padding shorthand)
- Combine redundant styles
- Eliminate empty/irrelevant elements

FAILURE CONDITIONS:
❌ Missing {{template-n}} wrapper
❌ Missing any {{template-xx}} placeholder  
❌ Less than 70% reduction
❌ Visual differences

Original HTML (${htmlCode.split('\n').length} lines):
\`\`\`html
${htmlCode}
\`\`\`

Provide optimized HTML wrapped in {{template-n}} tags (target ${Math.round(htmlCode.split('\n').length * 0.2)} lines):`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are an HTML optimization expert. You MUST:
1. Preserve ALL {{template-xx}} placeholders
2. Wrap output in {{template-n}} tags
3. Achieve 70-80% line reduction
4. Maintain identical visual output
5. Use maximum CSS shorthand
6. Remove redundant elements`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    let optimizedCode = completion.choices[0]?.message?.content || '';
    
    // Strict template tag extraction
    const templateMatch = optimizedCode.match(/\{\{template-n\}\}([\s\S]*?)\{\{\/template-n\}\}/);
    if (!templateMatch) {
      // Recovery attempt if tags missing
      const recovery = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You MUST wrap the HTML in {{template-n}} tags. No other output is acceptable."
          },
          {
            role: "assistant", 
            content: optimizedCode
          },
          {
            role: "user",
            content: "Please wrap this HTML in {{template-n}} tags exactly like this: {{template-n}}[HTML HERE]{{/template-n}}"
          }
        ],
        temperature: 0
      });
      optimizedCode = recovery.choices[0]?.message?.content || '';
    }

    // Final extraction
    const finalMatch = optimizedCode.match(/\{\{template-n\}\}([\s\S]*?)\{\{\/template-n\}\}/);
    optimizedCode = finalMatch ? finalMatch[1].trim() : '';

    // Verify all template placeholders exist
    const missingPlaceholders = [];
    for (let i = 1; i <= 15; i++) {
      if (!optimizedCode.includes(`{{template-${i}}}`)) {
        missingPlaceholders.push(i);
      }
    }

    // Calculate metrics
    const originalLines = htmlCode.split('\n').filter(l => l.trim()).length;
    const optimizedLines = optimizedCode.split('\n').filter(l => l.trim()).length;
    const reduction = originalLines > 0 
      ? Math.round(((originalLines - optimizedLines) / originalLines) * 100)
      : 0;

    // Build and validate success response
    const successResponse = successResponseSchema.parse({
      success: missingPlaceholders.length === 0,
      originalCode: htmlCode,
      optimizedCode,
      metrics: {
        originalLines,
        optimizedLines, 
        reduction,
        missingPlaceholders,
        targetAchieved: reduction >= 70
      },
      warnings: missingPlaceholders.length > 0 
        ? `Missing placeholders: ${missingPlaceholders.join(', ')}`
        : null
    });

    return new Response(JSON.stringify(successResponse), { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    // Build and validate error response
    const errorResponse = errorResponseSchema.parse({
      error: error.message
    });
    return new Response(JSON.stringify(errorResponse), { status: 500 });
  }
}

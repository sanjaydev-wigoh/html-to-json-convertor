// const fs = require('fs').promises;
// const path = require('path');
// const { JSDOM } = require('jsdom');

// // Template counter for unique template IDs
// let templateCounter = 1;

// // Function to extract and replace widgets with template placeholders
// function processHtmlSection(htmlString) {
//     const dom = new JSDOM(htmlString);
//     const document = dom.window.document;
//     const templates = [];
    
//     // Define actual widget elements (content elements, not layout elements)
//     const widgetSelectors = [
//         'h1', 'h2', 'h3', 'h4', 'h5', 'h6',  // Headings
//         'p',                                   // Paragraphs
//         'span',                               // Inline text
//         'button',                             // Buttons
//         'a',                                  // Links
//         'img',                                // Images
//         'svg',                                // SVG icons/graphics
//         'video',                              // Videos
//         'audio',                              // Audio
//         'input',                              // Form inputs
//         'textarea',                           // Text areas
//         'select',                             // Dropdowns
//         'label',                              // Form labels
//         'strong', 'b',                        // Bold text
//         'em', 'i',                           // Italic text
//         'ul', 'ol', 'li',                    // Lists
//         'table', 'tr', 'td', 'th',           // Tables
//         'form',                               // Forms
//         'iframe'                              // Embedded content
//     ].join(', ');
    
//     // Find all widget elements (excluding layout containers like div, section, article, etc.)
//     const widgets = document.querySelectorAll(widgetSelectors);
    
//     widgets.forEach((widget, index) => {
//         const templateId = `template-${templateCounter++}`;
        
//         // Extract widget information
//         const widgetInfo = {
//             id: templateId,
//             type: getWidgetType(widget),
//             tagName: widget.tagName.toLowerCase(),
//             attributes: extractAttributes(widget),
//             innerHTML: widget.innerHTML,
//             outerHTML: widget.outerHTML,
//             className: widget.className || '',
//             dataAttributes: extractDataAttributes(widget),
//             textContent: widget.textContent || '',
//             isContentWidget: true
//         };
        
//         templates.push(widgetInfo);
        
//         // Replace widget with template placeholder
//         const placeholder = document.createElement('span');
//         placeholder.textContent = `{{${templateId}}}`;
//         widget.parentNode.replaceChild(placeholder, widget);
//     });
    
//     return {
//         processedHtml: document.documentElement.outerHTML,
//         templates: templates
//     };
// }

// // Helper function to determine widget type
// function getWidgetType(element) {
//     const tagName = element.tagName.toLowerCase();
//     const className = element.className || '';
    
//     // Content widgets classification
//     if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) return 'heading';
//     if (tagName === 'p') return 'paragraph';
//     if (tagName === 'span') return 'text-span';
//     if (tagName === 'button') return 'button';
//     if (tagName === 'a') return 'link';
//     if (tagName === 'img') return 'image';
//     if (tagName === 'svg') return 'svg-icon';
//     if (tagName === 'video') return 'video';
//     if (tagName === 'audio') return 'audio';
//     if (['input', 'textarea', 'select'].includes(tagName)) return 'form-input';
//     if (tagName === 'label') return 'form-label';
//     if (tagName === 'form') return 'form';
//     if (['strong', 'b'].includes(tagName)) return 'bold-text';
//     if (['em', 'i'].includes(tagName)) return 'italic-text';
//     if (['ul', 'ol'].includes(tagName)) return 'list';
//     if (tagName === 'li') return 'list-item';
//     if (['table', 'tr', 'td', 'th'].includes(tagName)) return 'table-element';
//     if (tagName === 'iframe') return 'embedded-content';
    
//     // Fallback for unknown content widgets
//     return 'content-widget';
// }

// // Helper function to extract all attributes
// function extractAttributes(element) {
//     const attributes = {};
//     for (let attr of element.attributes) {
//         attributes[attr.name] = attr.value;
//     }
//     return attributes;
// }

// // Helper function to extract data attributes
// function extractDataAttributes(element) {
//     const dataAttrs = {};
//     for (let attr of element.attributes) {
//         if (attr.name.startsWith('data-')) {
//             dataAttrs[attr.name] = attr.value;
//         }
//     }
//     return dataAttrs;
// }

// // Function to save template data to JSON file
// async function saveTemplateToFile(templateData) {
//     const templateFilePath = path.join(process.cwd(), 'templates.json');
    
//     try {
//         // Read existing templates
//         let existingTemplates = [];
//         try {
//             const fileContent = await fs.readFile(templateFilePath, 'utf8');
//             existingTemplates = JSON.parse(fileContent);
//         } catch (error) {
//             // File doesn't exist or is empty, start with empty array
//             existingTemplates = [];
//         }
        
//         // Add new template data
//         existingTemplates.push(templateData);
        
//         // Write back to file with proper formatting
//         await fs.writeFile(
//             templateFilePath, 
//             JSON.stringify(existingTemplates, null, 2),
//             'utf8'
//         );
        
//         console.log(`Template saved successfully. Total templates: ${existingTemplates.length}`);
        
//     } catch (error) {
//         console.error('Error saving template to file:', error);
//         throw error;
//     }
// }

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ error: 'Method not allowed' });
//     }

//     try {
//         const { htmlInput, sectionName } = req.body;
        
//         if (!htmlInput) {
//             return res.status(400).json({ error: 'HTML input is required' });
//         }
        
//         // Process the HTML
//         const result = processHtmlSection(htmlInput);
        
//         // Create template data structure
//         const templateData = {
//             sectionName: sectionName || `section_${Date.now()}`,
//             createdAt: new Date().toISOString(),
//             originalHtml: htmlInput,
//             processedHtml: result.processedHtml,
//             templates: result.templates,
//             metadata: {
//                 totalTemplates: result.templates.length,
//                 templateIds: result.templates.map(t => t.id)
//             }
//         };
        
//         // Save to templates.json
//         await saveTemplateToFile(templateData);
        
//         res.json({
//             success: true,
//             message: 'HTML converted successfully',
//             data: templateData
//         });
        
//     } catch (error) {
//         console.error('Error processing HTML:', error);
//         res.status(500).json({ 
//             error: 'Failed to process HTML', 
//             details: error.message 
//         });
//     }
// }

//important

// import fs from 'fs/promises';
// import path from 'path';
// import { JSDOM } from 'jsdom';

// // Template counter for unique template IDs
// let templateCounter = 1;

// // Function to extract and replace widgets with template placeholders
// function processHtmlSection(htmlString) {
//     const dom = new JSDOM(htmlString);
//     const document = dom.window.document;
//     const templates = [];
    
//     // Define actual widget elements (content elements, not layout elements)
//     const widgetSelectors = [
//         'h1', 'h2', 'h3', 'h4', 'h5', 'h6',  // Headings
//         'p',                                   // Paragraphs
//         'span',                               // Inline text
//         'button',                             // Buttons
//         'a',                                  // Links
//         'img',                                // Images
//         'svg',                                // SVG icons/graphics
//         'video',                              // Videos
//         'audio',                              // Audio
//         'input',                              // Form inputs
//         'textarea',                           // Text areas
//         'select',                             // Dropdowns
//         'label',                              // Form labels
//         'strong', 'b',                        // Bold text
//         'em', 'i',                           // Italic text
//         'ul', 'ol', 'li',                    // Lists
//         'table', 'tr', 'td', 'th',           // Tables
//         'form',                               // Forms
//         'iframe'                              // Embedded content
//     ].join(', ');
    
//     // Find all widget elements (excluding layout containers like div, section, article, etc.)
//     const widgets = document.querySelectorAll(widgetSelectors);
    
//     widgets.forEach((widget, index) => {
//         const templateId = `template-${templateCounter++}`;
        
//         // Extract widget information
//         const widgetInfo = {
//             id: templateId,
//             type: getWidgetType(widget),
//             tagName: widget.tagName.toLowerCase(),
//             attributes: extractAttributes(widget),
//             innerHTML: widget.innerHTML,
//             outerHTML: widget.outerHTML,
//             className: widget.className || '',
//             dataAttributes: extractDataAttributes(widget),
//             textContent: widget.textContent || '',
//             isContentWidget: true
//         };
        
//         templates.push(widgetInfo);
        
//         // Replace widget with template placeholder
//         const placeholder = document.createElement('span');
//         placeholder.textContent = `{{${templateId}}}`;
//         widget.parentNode.replaceChild(placeholder, widget);
//     });
    
//     return {
//         processedHtml: document.documentElement.outerHTML,
//         templates: templates
//     };
// }

// // Helper function to determine widget type
// function getWidgetType(element) {
//     const tagName = element.tagName.toLowerCase();
//     const className = element.className || '';
    
//     // Content widgets classification
//     if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) return 'heading';
//     if (tagName === 'p') return 'paragraph';
//     if (tagName === 'span') return 'text-span';
//     if (tagName === 'button') return 'button';
//     if (tagName === 'a') return 'link';
//     if (tagName === 'img') return 'image';
//     if (tagName === 'svg') return 'svg-icon';
//     if (tagName === 'video') return 'video';
//     if (tagName === 'audio') return 'audio';
//     if (['input', 'textarea', 'select'].includes(tagName)) return 'form-input';
//     if (tagName === 'label') return 'form-label';
//     if (tagName === 'form') return 'form';
//     if (['strong', 'b'].includes(tagName)) return 'bold-text';
//     if (['em', 'i'].includes(tagName)) return 'italic-text';
//     if (['ul', 'ol'].includes(tagName)) return 'list';
//     if (tagName === 'li') return 'list-item';
//     if (['table', 'tr', 'td', 'th'].includes(tagName)) return 'table-element';
//     if (tagName === 'iframe') return 'embedded-content';
    
//     // Fallback for unknown content widgets
//     return 'content-widget';
// }

// // Helper function to extract all attributes
// function extractAttributes(element) {
//     const attributes = {};
//     for (let attr of element.attributes) {
//         attributes[attr.name] = attr.value;
//     }
//     return attributes;
// }

// // Helper function to extract data attributes
// function extractDataAttributes(element) {
//     const dataAttrs = {};
//     for (let attr of element.attributes) {
//         if (attr.name.startsWith('data-')) {
//             dataAttrs[attr.name] = attr.value;
//         }
//     }
//     return dataAttrs;
// }

// // Function to save template data to JSON file
// async function saveTemplateToFile(templateData) {
//     const templateFilePath = path.join(process.cwd(), 'templates.json');
    
//     try {
//         // Read existing templates
//         let existingTemplates = [];
//         try {
//             const fileContent = await fs.readFile(templateFilePath, 'utf8');
//             existingTemplates = JSON.parse(fileContent);
//         } catch (error) {
//             // File doesn't exist or is empty, start with empty array
//             existingTemplates = [];
//         }
        
//         // Add new template data
//         existingTemplates.push(templateData);
        
//         // Write back to file with proper formatting
//         await fs.writeFile(
//             templateFilePath, 
//             JSON.stringify(existingTemplates, null, 2),
//             'utf8'
//         );
        
//         console.log(`Template saved successfully. Total templates: ${existingTemplates.length}`);
        
//     } catch (error) {
//         console.error('Error saving template to file:', error);
//         throw error;
//     }
// }

// // Next.js 13+ API Route Handler (Edge/Node)
// export async function POST(request) {
//     try {
//         const { htmlInput, sectionName } = await request.json();
        
//         if (!htmlInput) {
//             return new Response(JSON.stringify({ error: 'HTML input is required' }), {
//                 status: 400,
//                 headers: { 'Content-Type': 'application/json' }
//             });
//         }
        
//         // Process the HTML
//         const result = processHtmlSection(htmlInput);
        
//         // Create template data structure
//         const templateData = {
//             sectionName: sectionName || `section_${Date.now()}`,
//             createdAt: new Date().toISOString(),
//             originalHtml: htmlInput,
//             processedHtml: result.processedHtml,
//             templates: result.templates,
//             metadata: {
//                 totalTemplates: result.templates.length,
//                 templateIds: result.templates.map(t => t.id)
//             }
//         };
        
//         // Save to templates.json
//         await saveTemplateToFile(templateData);
        
//         return new Response(JSON.stringify({
//             success: true,
//             message: 'HTML converted successfully',
//             data: templateData
//         }), {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' }
//         });
        
//     } catch (error) {
//         console.error('Error processing HTML:', error);
//         return new Response(JSON.stringify({ 
//             error: 'Failed to process HTML', 
//             details: error.message 
//         }), {
//             status: 500,
//             headers: { 'Content-Type': 'application/json' }
//         });
//     }
// }
"use server";

import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let templateCounter = 1;

const WIDGET_TAGS = [
  'h1','h2','h3','h4','h5','h6','p','span','button','a','img','svg','video','audio',
  'input','textarea','select','label','strong','b','em','i','ul','ol','li','table',
  'tr','td','th','form','iframe'
];

function extractAttributes(el) {
  const attrs = {};
  for (let attr of el.attributes) {
    attrs[attr.name] = attr.value;
  }
  return attrs;
}

function extractDataAttributes(el) {
  const data = {};
  for (let attr of el.attributes) {
    if (attr.name.startsWith('data-')) {
      data[attr.name] = attr.value;
    }
  }
  return data;
}

function getWidgetType(tag) {
  if (['h1','h2','h3','h4','h5','h6'].includes(tag)) return 'heading';
  if (tag === 'p') return 'paragraph';
  if (tag === 'span') return 'text-span';
  if (tag === 'button') return 'button';
  if (tag === 'a') return 'link';
  if (tag === 'img') return 'image';
  if (tag === 'svg') return 'svg-icon';
  if (tag === 'video') return 'video';
  if (tag === 'audio') return 'audio';
  if (['input','textarea','select'].includes(tag)) return 'form-input';
  if (tag === 'label') return 'form-label';
  if (tag === 'form') return 'form';
  if (['strong','b'].includes(tag)) return 'bold-text';
  if (['em','i'].includes(tag)) return 'italic-text';
  if (['ul','ol'].includes(tag)) return 'list';
  if (tag === 'li') return 'list-item';
  if (['table','tr','td','th'].includes(tag)) return 'table-element';
  if (tag === 'iframe') return 'embedded-content';
  return 'content-widget';
}

async function getMatchedStylesFromAI(widgets, computedStyles) {
  const prompt = `
Given the following HTML widget info and a computedStyles object, extract only the relevant style properties for each widget. Match using the best available identifier: className, id, tagName, or selector (e.g. svg[role='presentation'], path.st0, h5.title#main).

Each object should return:
- "id"
- "computedStyles": all applicable styles found for this widget.

Widgets:
${JSON.stringify(widgets, null, 2)}

Computed Styles:
${JSON.stringify(computedStyles, null, 2)}

Return JSON array of widget objects with id and computedStyles only. Do not include any explanation.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0
  });

  const raw = completion.choices[0].message.content.trim();
  console.log("OpenAI raw output:", raw);

  // Attempt to parse as full JSON
  try {
    const parsed = JSON.parse(raw);
    const map = {};
    for (const w of parsed) {
      map[w.id] = w.computedStyles || {};
    }
    return map;
  } catch {
    // Fallback if JSON is wrapped in text
    const jsonMatch = raw.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error('Could not parse JSON from OpenAI response');
    const extracted = JSON.parse(jsonMatch[0]);
    const map = {};
    for (const w of extracted) {
      map[w.id] = w.computedStyles || {};
    }
    return map;
  }
}

async function processHtmlSection(htmlString, computedStyles = null) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;
  const templates = [];

  const widgets = document.querySelectorAll(WIDGET_TAGS.join(','));

  for (const widget of widgets) {
    const templateId = `template-${templateCounter++}`;
   const tagName = widget.tagName.toLowerCase();
const className = widget.getAttribute('class') || '';
const idAttr = widget.getAttribute('id') || '';

widget.removeAttribute('style');

const selector = `${tagName}${idAttr ? '#' + idAttr : ''}${className ? '.' + className.trim().split(/\s+/).join('.') : ''}`;


    const widgetData = {
      id: templateId,
      type: getWidgetType(tagName),
      tagName,
      attributes: extractAttributes(widget),
      innerHTML: widget.innerHTML,
      outerHTML: widget.outerHTML,
      className,
      dataAttributes: extractDataAttributes(widget),
      textContent: widget.textContent || '',
      isContentWidget: true,
      tag: tagName,
      idAttr,
      selector
    };

    templates.push(widgetData);

    const placeholder = document.createElement('span');
    placeholder.textContent = `{{${templateId}}}`;
    widget.parentNode.replaceChild(placeholder, widget);
  }

  let computedMap = {};
  if (computedStyles) {
    computedMap = await getMatchedStylesFromAI(templates, computedStyles);
    console.log("Computed style map:", computedMap);
  }

  for (let w of templates) {
    w.computedStyles = computedMap[w.id] || {};
  }

  return {
    processedHtml: document.documentElement.outerHTML,
    templates
  };
}

async function saveTemplateToFile(data) {
  const filePath = path.join(process.cwd(), 'templates.json');
  let existing = [];
  try {
    const content = await fs.readFile(filePath, 'utf8');
    existing = JSON.parse(content);
  } catch {
    // file may not exist yet
  }
  existing.push(data);
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
}

export async function POST(request) {
  try {
    const { htmlInput, sectionName, computedStyles } = await request.json();
    if (!htmlInput) {
      return new Response(JSON.stringify({ error: 'Missing HTML input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await processHtmlSection(htmlInput, computedStyles);

    const dataToSave = {
      sectionName: sectionName || `section_${Date.now()}`,
      createdAt: new Date().toISOString(),
      originalHtml: htmlInput,
      processedHtml: result.processedHtml,
      templates: result.templates
    };

    console.log("Final data to save:", dataToSave);

    await saveTemplateToFile(dataToSave);

    return new Response(JSON.stringify({ success: true, data: dataToSave }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error processing HTML:', err);
    return new Response(JSON.stringify({
      error: 'Failed to convert HTML',
      detail: err.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

import React, { useState } from 'react';
import { Upload, Download, Filter, FileText, Eye, Code } from 'lucide-react';

export default function LayoutFilterApp() {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // ✅ Allowed layout/size/position/background styles (STRICT - only these are kept)
  const allowedStyles = new Set([
    // Flexbox properties
    'display',
    'flex-direction', 'flexDirection',
    'flex-wrap', 'flexWrap',
    'justify-content', 'justifyContent',
    'align-items', 'alignItems',
    'align-content', 'alignContent',
    'align-self', 'alignSelf',
    'order',
    'flex-grow', 'flexGrow',
    'flex-shrink', 'flexShrink',
    'flex-basis', 'flexBasis',
    'gap',
    'row-gap', 'rowGap',
    'column-gap', 'columnGap',

    // Grid properties
    'grid-template-columns', 'gridTemplateColumns',
    'grid-template-rows', 'gridTemplateRows',
    'grid-column', 'gridColumn',
    'grid-row', 'gridRow',
    'grid-column-start', 'gridColumnStart',
    'grid-column-end', 'gridColumnEnd',
    'grid-row-start', 'gridRowStart',
    'grid-row-end', 'gridRowEnd',
    'grid-area', 'gridArea',
    'place-items', 'placeItems',
    'place-content', 'placeContent',
    'place-self', 'placeSelf',

    // Position properties
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'z-index', 'zIndex',

    // Size properties (width/height only)
    'width',
    'height',

    // Background properties
    'background',
    'background-color', 'backgroundColor',
    'background-image', 'backgroundImage',
    'background-size', 'backgroundSize',
    'background-position', 'backgroundPosition',
    'background-repeat', 'backgroundRepeat',
    'background-attachment', 'backgroundAttachment'
  ]);

  // Layout container tags that should be preserved
  const layoutTags = new Set([
    'div',
    'section',
    'header',
    'footer',
    'main',
    'aside',
    'nav',
    'article',
    'container',
    'wrapper',
    'layout',
    'grid',
    'flex'
  ]);

  // Widget tags that should be removed entirely
  const widgetTags = new Set([
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Text elements
    'p', 'span', 'strong', 'em', 'b', 'i', 'small', 'mark', 'del', 'ins', 'sub', 'sup',
    // Media elements
    'img', 'image', 
    'svg', 'path', 'circle', 'rect', 'line', 'polygon', 'ellipse', 'g', 'defs', 'use',
    'video', 'audio', 'source', 'track',
    'canvas', 'iframe', 'embed', 'object',
    // Interactive elements
    'button', 'input', 'textarea', 'select', 'option', 'optgroup',
    'a', 'link',
    // List elements
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    // Table elements
    'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'caption', 'colgroup', 'col',
    // Form elements
    'form', 'label', 'fieldset', 'legend',
    // Other content elements
    'blockquote', 'cite', 'q', 'abbr', 'dfn', 'time', 'code', 'var', 'samp', 'kbd',
    'pre', 'address', 'hr', 'br', 'wbr'
  ]);

  function toCamelCase(str) {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  }

  function isLayoutContainer(tagName) {
    return layoutTags.has(tagName.toLowerCase());
  }

  function isWidget(tagName) {
    return widgetTags.has(tagName.toLowerCase());
  }

  // Convert character-indexed object to string
  function reconstructStringFromIndexes(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    // Check if this looks like a character-indexed object
    const keys = Object.keys(obj);
    const isCharIndexed = keys.every(key => /^\d+$/.test(key));
    
    if (isCharIndexed) {
      // Sort keys numerically and reconstruct string
      const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
      return sortedKeys.map(key => obj[key]).join('');
    }
    
    return obj;
  }

  // Parse HTML string to extract tag info and create full element structure
  function parseHtmlToElement(htmlString) {
    if (!htmlString || typeof htmlString !== 'string') return null;
    
    // Extract tag name
    const tagMatch = htmlString.match(/<(\w+)/);
    if (!tagMatch) return null;
    
    const tag = tagMatch[1].toUpperCase();
    
    // Extract id
    const idMatch = htmlString.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : null;
    
    // Extract class
    const classMatch = htmlString.match(/class="([^"]+)"/);
    const className = classMatch ? classMatch[1] : null;
    
    // Create the element structure like in the document
    const element = {
      tag,
      id,
      className,
      html: htmlString
    };

    // Add empty styles object for layout properties to be added later
    if (isLayoutContainer(tag.toLowerCase()) || tag === 'DIV' || tag === 'SECTION') {
      element.styles = {};
    }
    
    return element;
  }

  function processCharacterIndexedData(data) {
    if (!data || typeof data !== 'object') return data;
    
    if (Array.isArray(data)) {
      return data.map(processCharacterIndexedData);
    }
    
    const processed = {};
    
    for (const key in data) {
      const value = data[key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Check if this is a character-indexed object
        const keys = Object.keys(value);
        const isCharIndexed = keys.length > 0 && keys.every(k => /^\d+$/.test(k));
        
        if (isCharIndexed) {
          // Convert to HTML string and parse
          const htmlString = reconstructStringFromIndexes(value);
          if (htmlString && htmlString.includes('<')) {
            const elementInfo = parseHtmlToElement(htmlString);
            if (elementInfo) {
              processed[key] = elementInfo;
            }
          }
        } else {
          // Regular nested objects - process recursively
          processed[key] = processCharacterIndexedData(value);
        }
      } else {
        processed[key] = value;
      }
    }
    
    return processed;
  }

  function filterLayoutOnly(node) {
    if (!node || typeof node !== 'object') return node;
    
    if (Array.isArray(node)) {
      return node.map(filterLayoutOnly).filter(item => item !== null);
    }

    const filtered = {};

    for (const key in node) {
      const element = node[key];
      
      // Handle the case where we have tag, id, className structure
      if (element && typeof element === 'object' && element.tag) {
        const tagName = element.tag.toLowerCase();
        
        // Skip widget elements entirely
        if (isWidget(tagName)) {
          continue;
        }
        
        // Only keep layout containers
        if (isLayoutContainer(tagName) || (element.styles && Object.keys(element.styles).length > 0)) {
          const newElement = { ...element };
          
          // Filter styles to keep only layout/position/background properties
          if (newElement.styles && typeof newElement.styles === 'object') {
            const filteredStyles = {};
            for (const styleKey in newElement.styles) {
              const camelKey = toCamelCase(styleKey);
              // Check both the original key and camelCase version
              if (allowedStyles.has(styleKey) || allowedStyles.has(camelKey)) {
                filteredStyles[styleKey] = newElement.styles[styleKey];
              }
            }
            newElement.styles = filteredStyles;
          }
          
          // Recursively filter children
          if (newElement.children) {
            newElement.children = filterLayoutOnly(newElement.children);
          }
          
          filtered[key] = newElement;
        }
      } else {
        // Handle regular nested objects
        if (typeof element === 'object' && element !== null) {
          const processedElement = filterLayoutOnly(element);
          if (processedElement && Object.keys(processedElement).length > 0) {
            filtered[key] = processedElement;
          }
        } else {
          filtered[key] = element;
        }
      }
    }

    return filtered;
  }

  const processJson = () => {
    if (!inputJson.trim()) {
      setError('Please enter JSON data');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const parsed = JSON.parse(inputJson);
      
      // Process character-indexed data to reconstruct proper element structure
      const reconstructed = processCharacterIndexedData(parsed);
      
      // Apply layout filtering to keep only layout containers and properties
      const filtered = filterLayoutOnly(reconstructed);
      
      setOutputJson(JSON.stringify(filtered, null, 2));
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputJson(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const downloadJson = () => {
    if (!outputJson) return;
    
    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout-filtered.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sampleJson = {
    "element1": {
      "0": "<",
      "1": "s",
      "2": "e",
      "3": "c",
      "4": "t",
      "5": "i",
      "6": "o",
      "7": "n",
      "8": " ",
      "9": "i",
      "10": "d",
      "11": "=",
      "12": "\"",
      "13": "c",
      "14": "o",
      "15": "m",
      "16": "p",
      "17": "-",
      "18": "l",
      "19": "t",
      "20": "8",
      "21": "q",
      "22": "h",
      "23": "f",
      "24": "a",
      "25": "f",
      "26": "1",
      "27": "\"",
      "28": " ",
      "29": "c",
      "30": "l",
      "31": "a",
      "32": "s",
      "33": "s",
      "34": "=",
      "35": "\"",
      "36": "O",
      "37": "q",
      "38": "n",
      "39": "i",
      "40": "s",
      "41": "f",
      "42": " ",
      "43": "c",
      "44": "o",
      "45": "m",
      "46": "p",
      "47": "-",
      "48": "l",
      "49": "t",
      "50": "8",
      "51": "q",
      "52": "h",
      "53": "f",
      "54": "a",
      "55": "f",
      "56": "1",
      "57": " ",
      "58": "w",
      "59": "i",
      "60": "x",
      "61": "u",
      "62": "i",
      "63": "-",
      "64": "s",
      "65": "e",
      "66": "c",
      "67": "t",
      "68": "i",
      "69": "o",
      "70": "n",
      "71": "\"",
      "72": ">",
      "73": "<",
      "74": "/",
      "75": "s",
      "76": "e",
      "77": "c",
      "78": "t",
      "79": "i",
      "80": "o",
      "81": "n",
      "82": ">"
    },
    "layoutData": {
      "tag": "SECTION",
      "id": "comp-lt8qhfaf1",
      "className": "Oqnisf comp-lt8qhfaf1 wixui-section",
      "html": "<section id=\"comp-lt8qhfaf1\" tabindex=\"-1\" class=\"Oqnisf comp-lt8qhfaf1 wixui-section\" data-block-level-container=\"ClassicSection\"></section>",
      "styles": {
        "align-self": "start",
        "bottom": "0px",
        "grid-column-end": "2",
        "grid-column-start": "1",
        "grid-row-end": "4",
        "grid-row-start": "3",
        "height": "1218px",
        "left": "0px",
        "min-height": "auto",
        "min-width": "980px",
        "position": "relative",
        "right": "0px",
        "top": "0px",
        "background-color": "#ffffff",
        "padding": "20px"
      }
    },
    "widgetExample": {
      "tag": "H4",
      "id": "",
      "className": "font_4 wixui-rich-text__text",
      "html": "<h4>Sample heading</h4>",
      "styles": {
        "color": "rgb(47, 46, 46)",
        "font-family": "raleway, sans-serif",
        "font-size": "40px",
        "height": "47px",
        "width": "287px",
        "border-color": "rgb(47, 46, 46)",
        "text-decoration": "none solid rgb(47, 46, 46)"
      }
    }
  };

  const loadSample = () => {
    setInputJson(JSON.stringify(sampleJson, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Filter className="text-blue-600" />
            Layout Properties Filter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Filter JSON layouts to keep only layout containers (div, section, header) with 
            layout properties (flex, grid, position, backgrounds) while removing all widget elements
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Upload className="text-blue-600" />
                Input JSON
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={loadSample}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                >
                  Load Sample
                </button>
                <label className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded cursor-pointer transition-colors">
                  <FileText size={16} className="inline mr-1" />
                  Upload File
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder="Paste your JSON here or upload a file..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <button
              onClick={processJson}
              disabled={isProcessing || !inputJson.trim()}
              className="w-full mt-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Filter size={18} />
                  Filter Layout Properties
                </>
              )}
            </button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Eye className="text-green-600" />
                Filtered Output
              </h2>
              {outputJson && (
                <button
                  onClick={downloadJson}
                  className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors flex items-center gap-1"
                >
                  <Download size={16} />
                  Download
                </button>
              )}
            </div>
            
            <textarea
              value={outputJson}
              readOnly
              placeholder="Filtered JSON will appear here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none bg-gray-50"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Code className="text-purple-600" />
            Filtering Rules
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">🔄 Character Index Conversion</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automatically converts numbered character objects to HTML</li>
                <li>• Extracts tag, id, className, and html properties</li>
                <li>• Creates clean element structure like the document format</li>
                <li>• Example: {'{"0": "&lt;", "1": "d", "2": "i"...}'} → proper DIV element</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-700 mb-2">✅ Preserved Layout Properties (STRICT)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Flexbox: display, flex-direction, justify-content, align-items, gap</li>
                <li>• Grid: grid-template-columns, grid-template-rows, grid-area</li>
                <li>• Position: position, top, left, right, bottom, z-index</li>
                <li>• Size: width, height ONLY (no min/max dimensions)</li>
                <li>• Background: background-color, background-image, background-*</li>
                <li>• NO margin, padding, border, or overflow properties</li>
              </ul>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="font-medium text-red-700 mb-2">❌ Removed Widget Elements (COMPLETE REMOVAL)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Text: h1-h6, p, span, strong, em, small, mark</li>
                <li>• Media: img, svg, video, audio, canvas, iframe</li>
                <li>• Interactive: button, input, textarea, select, a</li>
                <li>• Lists: ul, ol, li, dl, dt, dd</li>
                <li>• Tables: table, tr, td, th, thead, tbody</li>
                <li>• Forms: form, label, fieldset, legend</li>
                <li>• Code: pre, code, var, samp, kbd</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-700 mb-2">🏗️ Kept Layout Containers</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Structural: div, section, header, footer, main</li>
                <li>• Navigation: nav, aside</li>
                <li>• Content: article</li>
                <li>• Layout: container, wrapper, layout</li>
                <li>• CSS Layout: grid, flex</li>
                <li>• Only these elements survive the filtering process</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
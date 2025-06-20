// 'use client;'
// import { useState, useEffect, use } from 'react';
// import Head from 'next/head';
// import styles from './Home.module.css'; // Adjust the path as necessary

// export default function Home() {
//   const [htmlInput, setHtmlInput] = useState('');
//   const [sectionName, setSectionName] = useState('wix-hero-section');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [results, setResults] = useState(null);

//   // Load example HTML on page load
//   useEffect(() => {
//     const loadExampleHtml = async () => {
//       try {
//         const response = await fetch('/api/example-section');
//         if (response.ok) {
//           const html = await response.text();
//           setHtmlInput(html);
//         }
//       } catch (error) {
//         console.error('Failed to load example HTML:', error);
//         setHtmlInput('<!-- Failed to load example HTML -->');
//       }
//     };
//     loadExampleHtml();
//   }, []);

//   const processHtml = async () => {
//     if (!htmlInput.trim()) {
//       showMessage('Please enter HTML code to convert', 'error');
//       return;
//     }

//     setLoading(true);
//     setMessage('');
//     setResults(null);

//     try {
//       const response = await fetch('/api/convertor', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           htmlInput,
//           sectionName: sectionName || `section_${Date.now()}`,
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setResults(result.data);
//         showMessage(`✅ Successfully converted! ${result.data.templates.length} templates extracted.`, 'success');
//       } else {
//         showMessage(`❌ Error: ${result.error}`, 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showMessage(`❌ Network error: ${error.message}`, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showMessage = (msg, type) => {
//     setMessage({ text: msg, type });
//   };

//   const downloadTemplates = async () => {
//     try {
//       const response = await fetch('/api/download-templates');
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'templates.json';
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//         showMessage('✅ Templates file downloaded successfully!', 'success');
//       } else {
//         showMessage('❌ Error downloading templates file', 'error');
//       }
//     } catch (error) {
//       showMessage(`❌ Download error: ${error.message}`, 'error');
//     }
//   };

//  const formatHtml = (html) => {
//   return html.replace(/></g, '>\n<').replace(/\{\{/g, '\n{{').replace(/\}\}/g, '}}\n');
// };
//   const copyToClipboard = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       showMessage('✅ Copied to clipboard!', 'success');
//     } catch (error) {
//       showMessage('❌ Failed to copy to clipboard', 'error');
//     }
//   };

//   const clearInput = () => {
//     setHtmlInput('');
//     setResults(null);
//     setMessage('');
//   };

//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Wix to Template Converter</title>
//         <meta name="description" content="Convert Wix HTML sections to reusable templates" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           Wix to Template Converter
//         </h1>

//         <p className={styles.description}>
//           Convert your Wix HTML sections into reusable templates with dynamic placeholders.
//         </p>

//         <div className={styles.grid}>
//           <div className={styles.card}>
//             <h2>Input Configuration</h2>
            
//             <div className={styles.inputGroup}>
//               <label htmlFor="sectionName">Section Name:</label>
//               <input
//                 id="sectionName"
//                 type="text"
//                 value={sectionName}
//                 onChange={(e) => setSectionName(e.target.value)}
//                 placeholder="Enter section name"
//                 className={styles.input}
//               />
//             </div>

//             <div className={styles.inputGroup}>
//               <label htmlFor="htmlInput">HTML Code:</label>
//               <textarea
//                 id="htmlInput"
//                 value={htmlInput}
//                 onChange={(e) => setHtmlInput(e.target.value)}
//                 placeholder="Paste your Wix HTML code here..."
//                 className={styles.textarea}
//                 rows={15}
//               />
//             </div>

//             <div className={styles.buttonGroup}>
//               <button
//                 onClick={processHtml}
//                 disabled={loading}
//                 className={`${styles.button} ${styles.primary}`}
//               >
//                 {loading ? 'Converting...' : 'Convert to Template'}
//               </button>
              
//               <button
//                 onClick={clearInput}
//                 className={`${styles.button} ${styles.secondary}`}
//               >
//                 Clear
//               </button>
//             </div>

//             {message && (
//               <div className={`${styles.message} ${styles[message.type]}`}>
//                 {message.text}
//               </div>
//             )}
//           </div>

//           {results && (
//             <div className={styles.card}>
//               <h2>Conversion Results</h2>
              
//               <div className={styles.resultsSummary}>
//                 <p><strong>Templates Generated:</strong> {results.templates.length}</p>
//                 <p><strong>Variables Extracted:</strong> {results.variables ? results.variables.length : 0}</p>
//               </div>

//               <div className={styles.buttonGroup}>
//                 <button
//                   onClick={downloadTemplates}
//                   className={`${styles.button} ${styles.primary}`}
//                 >
//                   Download Templates
//                 </button>
//               </div>

//               <div className={styles.templatesContainer}>
//                 {results.templates.map((template, index) => (
//                   <div key={index} className={styles.templateCard}>
//                     <div className={styles.templateHeader}>
//                       <h3>{template.name || `Template ${index + 1}`}</h3>
//                       <button
//                         onClick={() => copyToClipboard(template.html)}
//                         className={`${styles.button} ${styles.small}`}
//                       >
//                         Copy HTML
//                       </button>
//                     </div>
                    
//                     <div className={styles.codeBlock}>
//                       <pre><code>{formatHtml(template.html)}</code></pre>
//                     </div>

//                     {template.variables && template.variables.length > 0 && (
//                       <div className={styles.variablesSection}>
//                         <h4>Template Variables:</h4>
//                         <ul className={styles.variablesList}>
//                           {template.variables.map((variable, varIndex) => (
//                             <li key={varIndex}>
//                               <code>{variable.name}</code> - {variable.type || 'text'}
//                               {variable.defaultValue && (
//                                 <span className={styles.defaultValue}>
//                                   (default: {variable.defaultValue})
//                                 </span>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className={styles.instructions}>
//           <h2>How to Use</h2>
//           <ol>
//             <li>Enter a descriptive name for your section</li>
//             <li>Paste your Wix HTML code into the textarea</li>
//             <li>Click "Convert to Template" to process the HTML</li>
//             <li>Review the generated templates and variables</li>
//             <li>Download the templates file or copy individual templates</li>
//           </ol>
          
//           <div className={styles.features}>
//             <h3>Features</h3>
//             <ul>
//               <li>Automatically extracts dynamic content as template variables</li>
//               <li>Preserves HTML structure and styling</li>
//               <li>Generates reusable template components</li>
//               <li>Supports multiple template extraction from single HTML input</li>
//               <li>Provides downloadable JSON template files</li>
//             </ul>
//           </div>
//         </div>
//       </main>

//       <footer className={styles.footer}>
//         <p>
//           Powered by{' '}
//           <a
//             href="https://nextjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Next.js
//           </a>
//         </p>
//       </footer>
//     </div>
//   );
// }
// import { useState, useEffect } from 'react';
// import Head from 'next/head';

// export default function WixConverter() {
//   const [htmlInput, setHtmlInput] = useState('');
//   const [computedStylesJson, setComputedStylesJson] = useState('');
//   const [sectionName, setSectionName] = useState('wix-hero-section');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [results, setResults] = useState(null);

//   // Load example HTML on page load
//   useEffect(() => {
//     const loadExampleHtml = async () => {
//       try {
//         const response = await fetch('/api/example-section');
//         if (response.ok) {
//           const html = await response.text();
//           setHtmlInput(html);
//         }
//       } catch (error) {
//         console.error('Failed to load example HTML:', error);
//         setHtmlInput('<!-- Failed to load HTML -->');
//       }
//     };
//     loadExampleHtml();
//   }, []);

//   // Validate JSON input
//   const validateJson = (jsonString) => {
//     if (!jsonString.trim()) return true; // Empty is valid
//     try {
//       JSON.parse(jsonString);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const processHtml = async () => {
//     if (!htmlInput.trim()) {
//       showMessage('Please enter HTML code to convert', 'error');
//       return;
//     }

//     if (computedStylesJson.trim() && !validateJson(computedStylesJson)) {
//       showMessage('Please enter valid JSON for computed styles', 'error');
//       return;
//     }

//     setLoading(true);
//     setMessage(null);
//     setResults(null);

//     try {
//       const response = await fetch('/api/convertor', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           htmlInput,
//           computedStylesJson,
//           sectionName: sectionName || `section_${Date.now()}`,
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setResults(result.data);
//         const stylesMsg = result.data.metadata.hasStyles ? ' with styles' : '';
//         showMessage(`✅ Successfully converted${stylesMsg}! ${result.data.templates.length} templates extracted.`, 'success');
//       } else {
//         showMessage(`❌ Error: ${result.error}`, 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showMessage(`❌ Network error: ${error.message}`, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showMessage = (text, type) => {
//     setMessage({ text, type });
//   };

//   const downloadTemplates = async () => {
//     try {
//       const response = await fetch('/api/download-templates');
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'templates.json';
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//         showMessage('✅ Templates file downloaded successfully!', 'success');
//       } else {
//         showMessage('❌ Error downloading templates file', 'error');
//       }
//     } catch (error) {
//       showMessage(`❌ Download error: ${error.message}`, 'error');
//     }
//   };

//   const formatHtml = (html) => {
//     return html.replace(/></g, '>\n<').replace(/\{\{/g, '\n{{').replace(/\}\}/g, '}}\n');
//   };

//   const clearAll = () => {
//     setHtmlInput('');
//     setComputedStylesJson('');
//     setSectionName('wix-hero-section');
//     setResults(null);
//     setMessage(null);
//   };

//   const loadExampleStyles = () => {
//     const exampleStyles = {
//       "h1": {
//         "color": "#333333",
//         "fontSize": "2.5rem",
//         "fontWeight": "bold",
//         "marginBottom": "1rem"
//       },
//       ".hero-title": {
//         "color": "#1a365d",
//         "fontSize": "3rem",
//         "fontWeight": "700",
//         "textAlign": "center"
//       },
//       "p": {
//         "color": "#666666",
//         "fontSize": "1rem",
//         "lineHeight": "1.6"
//       },
//       "button": {
//         "backgroundColor": "#3182ce",
//         "color": "white",
//         "padding": "0.75rem 1.5rem",
//         "borderRadius": "0.5rem",
//         "border": "none",
//         "cursor": "pointer"
//       }
//     };
//     setComputedStylesJson(JSON.stringify(exampleStyles, null, 2));
//   };

//   return (
//     <>
//       <Head>
//         <title>Wix to Template Converter</title>
//         <meta name="description" content="Convert Wix HTML sections to templated format with automatic widget extraction and style processing" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       </Head>
      
//       <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
//         <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-8 text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-3">🔄 Wix to Template Converter</h1>
//             <p className="text-lg md:text-xl opacity-90">Convert Wix HTML sections to templated format with automatic widget extraction and style processing</p>
//           </div>

//           {/* Main Content */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
//             {/* Input Section */}
//             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-6">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">📝 Input Configuration</h2>
              
//               <div>
//                 <label htmlFor="sectionName" className="block mb-2 font-medium text-gray-700">
//                   Section Name
//                 </label>
//                 <input
//                   type="text"
//                   id="sectionName"
//                   value={sectionName}
//                   onChange={(e) => setSectionName(e.target.value)}
//                   placeholder="e.g., hero-section, navbar, footer"
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none transition-colors"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="htmlInput" className="block mb-2 font-medium text-gray-700">
//                   Wix HTML Code
//                 </label>
//                 <textarea
//                   id="htmlInput"
//                   value={htmlInput}
//                   onChange={(e) => setHtmlInput(e.target.value)}
//                   placeholder="Paste your Wix HTML section here..."
//                   rows={8}
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none transition-colors font-mono text-sm resize-y min-h-[150px]"
//                 />
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label htmlFor="computedStylesJson" className="font-medium text-gray-700">
//                     Computed Styles JSON (Optional)
//                   </label>
//                   <button
//                     onClick={loadExampleStyles}
//                     className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
//                   >
//                     Load Example
//                   </button>
//                 </div>
//                 <textarea
//                   id="computedStylesJson"
//                   value={computedStylesJson}
//                   onChange={(e) => setComputedStylesJson(e.target.value)}
//                   placeholder='{"h1": {"color": "#333", "fontSize": "2rem"}, "button": {"backgroundColor": "#blue"}}'
//                   rows={6}
//                   className={`w-full p-3 border-2 rounded-md focus:outline-none transition-colors font-mono text-sm resize-y min-h-[120px] ${
//                     computedStylesJson.trim() && !validateJson(computedStylesJson)
//                       ? 'border-red-500 focus:border-red-500'
//                       : 'border-gray-300 focus:border-indigo-500'
//                   }`}
//                 />
//                 {computedStylesJson.trim() && !validateJson(computedStylesJson) && (
//                   <p className="text-red-500 text-sm mt-1">⚠️ Invalid JSON format</p>
//                 )}
//               </div>

//               <button
//                 onClick={processHtml}
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-md font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
//               >
//                 {loading ? '🔄 Converting...' : '🚀 Convert to Template'}
//               </button>

//               {/* Loading Spinner */}
//               {loading && (
//                 <div className="text-center py-5">
//                   <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin mb-2"></div>
//                   <p className="text-gray-600">Processing HTML and styles...</p>
//                 </div>
//               )}

//               {/* Message Display */}
//               {message && (
//                 <div className={`mt-4 p-4 rounded-md border ${
//                   message.type === 'error' 
//                     ? 'bg-red-50 text-red-700 border-red-200' 
//                     : 'bg-green-50 text-green-700 border-green-200'
//                 }`}>
//                   {message.text}
//                 </div>
//               )}
//             </div>

//             {/* Output Section */}
//             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">📤 Template Output</h2>
              
//               {/* Stats */}
//               {results && (
//                 <div className="grid grid-cols-3 gap-3 mb-6">
//                   <div className="bg-white p-4 rounded-md border text-center">
//                     <div className="text-2xl font-bold text-indigo-500">{results.templates.length}</div>
//                     <div className="text-gray-600 text-xs mt-1">Templates</div>
//                   </div>
//                   <div className="bg-white p-4 rounded-md border text-center">
//                     <div className="text-2xl font-bold text-green-500">
//                       {results.templates.filter(t => Object.keys(t.styles || {}).length > 0).length}
//                     </div>
//                     <div className="text-gray-600 text-xs mt-1">With Styles</div>
//                   </div>
//                   <div className="bg-white p-4 rounded-md border text-center">
//                     <div className="text-2xl font-bold text-purple-500">
//                       {results.metadata.hasStyles ? '✓' : '✗'}
//                     </div>
//                     <div className="text-gray-600 text-xs mt-1">Styles JSON</div>
//                   </div>
//                 </div>
//               )}

//               {/* Processed HTML */}
//               <h3 className="font-semibold text-gray-700 mb-2">Processed HTML:</h3>
//               <div className="bg-white border-2 border-gray-200 rounded-md p-4 mb-4 min-h-[120px] font-mono text-sm overflow-x-auto whitespace-pre-wrap">
//                 {results ? formatHtml(results.processedHtml) : 'Converted HTML will appear here...'}
//               </div>

//               {/* Template List */}
//               <h3 className="font-semibold text-gray-700 mb-2">Extracted Templates:</h3>
//               <div className="bg-white border border-gray-200 rounded-md max-h-[250px] overflow-y-auto mb-4">
//                 {results && results.templates.length > 0 ? (
//                   results.templates.map((template, index) => (
//                     <div key={index} className="p-4 border-b border-gray-100 last:border-b-0">
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <div className="font-semibold text-indigo-600">{template.id}</div>
//                           <small className="text-gray-500">{template.tagName}</small>
//                         </div>
//                         <div className="flex gap-2">
//                           <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
//                             {template.type}
//                           </span>
//                           {Object.keys(template.styles || {}).length > 0 && (
//                             <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
//                               +styles
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       {Object.keys(template.styles || {}).length > 0 && (
//                         <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
//                           {Object.keys(template.styles).length} style properties
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <p className="p-5 text-center text-gray-500">No templates extracted yet</p>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               {results && (
//                 <div className="space-y-3">
//                   <button
//                     onClick={downloadTemplates}
//                     className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
//                   >
//                     💾 Download templates.json
//                   </button>
//                   <button
//                     onClick={clearAll}
//                     className="w-full bg-gray-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
//                   >
//                     🗑️ Clear All
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// import { useState, useEffect } from 'react';
// import Head from 'next/head';

// export default function WixConverter() {
//   const [htmlInput, setHtmlInput] = useState('');
//   const [sectionName, setSectionName] = useState('wix-hero-section');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [results, setResults] = useState(null);

//   // Load example HTML on page load
//   useEffect(() => {
//     const loadExampleHtml = async () => {
//       try {
//         const response = await fetch('/api/example-section');
//         if (response.ok) {
//           const html = await response.text();
//           setHtmlInput(html);
//         }
//       } catch (error) {
//         console.error('Failed to load example HTML:', error);
//         setHtmlInput('<!-- Failed to load HTML -->');
//       }
//     };
//     loadExampleHtml();
//   }, []);

//   const processHtml = async () => {
//     if (!htmlInput.trim()) {
//       showMessage('Please enter HTML code to convert', 'error');
//       return;
//     }

//     setLoading(true);
//     setMessage(null);
//     setResults(null);

//     try {
//       const response = await fetch('/api/convertor', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           htmlInput,
//           sectionName: sectionName || `section_${Date.now()}`,
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setResults(result.data);
//         showMessage(`✅ Successfully converted! ${result.data.templates.length} templates extracted.`, 'success');
//       } else {
//         showMessage(`❌ Error: ${result.error}`, 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showMessage(`❌ Network error: ${error.message}`, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showMessage = (text, type) => {
//     setMessage({ text, type });
//   };

//   const downloadTemplates = async () => {
//     try {
//       const response = await fetch('/api/download-templates');
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'templates.json';
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//         showMessage('✅ Templates file downloaded successfully!', 'success');
//       } else {
//         showMessage('❌ Error downloading templates file', 'error');
//       }
//     } catch (error) {
//       showMessage(`❌ Download error: ${error.message}`, 'error');
//     }
//   };

//   const formatHtml = (html) => {
//     return html.replace(/></g, '>\n<').replace(/\{\{/g, '\n{{').replace(/\}\}/g, '}}\n');
//   };

//   const clearAll = () => {
//     setHtmlInput('');
//     setSectionName('wix-hero-section');
//     setResults(null);
//     setMessage(null);
//   };

//   return (
//     <>
//       <Head>
//         <title>Wix to Template Converter</title>
//         <meta name="description" content="Convert Wix HTML sections to templated format with automatic widget extraction" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       </Head>
      
//       <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
//         <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-8 text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-3">🔄 Wix to Template Converter</h1>
//             <p className="text-lg md:text-xl opacity-90">Convert Wix HTML sections to templated format with automatic widget extraction</p>
//           </div>

//           {/* Main Content */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
//             {/* Input Section */}
//             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">📝 Input Configuration</h2>
              
//               <div className="mb-5">
//                 <label htmlFor="sectionName" className="block mb-2 font-medium text-gray-700">
//                   Section Name
//                 </label>
//                 <input
//                   type="text"
//                   id="sectionName"
//                   value={sectionName}
//                   onChange={(e) => setSectionName(e.target.value)}
//                   placeholder="e.g., hero-section, navbar, footer"
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none transition-colors"
//                 />
//               </div>

//               <div className="mb-6">
//                 <label htmlFor="htmlInput" className="block mb-2 font-medium text-gray-700">
//                   Wix HTML Code
//                 </label>
//                 <textarea
//                   id="htmlInput"
//                   value={htmlInput}
//                   onChange={(e) => setHtmlInput(e.target.value)}
//                   placeholder="Paste your Wix HTML section here..."
//                   rows={12}
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none transition-colors font-mono text-sm resize-y min-h-[200px]"
//                 />
//               </div>

//               <button
//                 onClick={processHtml}
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-md font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
//               >
//                 {loading ? '🔄 Converting...' : '🚀 Convert to Template'}
//               </button>

//               {/* Loading Spinner */}
//               {loading && (
//                 <div className="text-center py-5">
//                   <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin mb-2"></div>
//                   <p className="text-gray-600">Processing HTML...</p>
//                 </div>
//               )}

//               {/* Message Display */}
//               {message && (
//                 <div className={`mt-4 p-4 rounded-md border ${
//                   message.type === 'error' 
//                     ? 'bg-red-50 text-red-700 border-red-200' 
//                     : 'bg-green-50 text-green-700 border-green-200'
//                 }`}>
//                   {message.text}
//                 </div>
//               )}
//             </div>

//             {/* Output Section */}
//             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">📤 Template Output</h2>
              
//               {/* Stats */}
//               {results && (
//                 <div className="grid grid-cols-2 gap-4 mb-6">
//                   <div className="bg-white p-4 rounded-md border text-center">
//                     <div className="text-3xl font-bold text-indigo-500">{results.templates.length}</div>
//                     <div className="text-gray-600 text-sm mt-1">Templates Created</div>
//                   </div>
//                   <div className="bg-white p-4 rounded-md border text-center">
//                     <div className="text-3xl font-bold text-indigo-500">{results.templates.length}</div>
//                     <div className="text-gray-600 text-sm mt-1">Widgets Extracted</div>
//                   </div>
//                 </div>
//               )}

//               {/* Processed HTML */}
//               <h3 className="font-semibold text-gray-700 mb-2">Processed HTML:</h3>
//               <div className="bg-white border-2 border-gray-200 rounded-md p-4 mb-6 min-h-[150px] font-mono text-sm overflow-x-auto whitespace-pre-wrap">
//                 {results ? formatHtml(results.processedHtml) : 'Converted HTML will appear here...'}
//               </div>

//               {/* Template List */}
//               <h3 className="font-semibold text-gray-700 mb-2">Extracted Templates:</h3>
//               <div className="bg-white border border-gray-200 rounded-md max-h-[300px] overflow-y-auto mb-4">
//                 {results && results.templates.length > 0 ? (
//                   results.templates.map((template, index) => (
//                     <div key={index} className="flex justify-between items-center p-4 border-b border-gray-100 last:border-b-0">
//                       <div>
//                         <div className="font-semibold text-indigo-600">{template.id}</div>
//                         <small className="text-gray-500">{template.tagName}</small>
//                       </div>
//                       <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
//                         {template.type}
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="p-5 text-center text-gray-500">No templates extracted yet</p>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               {results && (
//                 <div className="space-y-3">
//                   <button
//                     onClick={downloadTemplates}
//                     className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
//                   >
//                     💾 Download templates.json
//                   </button>
//                   <button
//                     onClick={clearAll}
//                     className="w-full bg-gray-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
//                   >
//                     🗑️ Clear All
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

       
//         </div>
//       </div>
//     </>
//   );
// }
"use client";

import { useState, useEffect } from "react";

export default function WixConverterPage() {
  const [sectionName, setSectionName] = useState("wix-hero-section");
  const [htmlInput, setHtmlInput] = useState("");
  const [computedStylesInput, setComputedStylesInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Set default computed styles
    const exampleStyles = {
      ".hero-title": {
        color: "#2c3e50",
        "font-size": "48px",
        "font-weight": "bold",
        "line-height": "1.2",
        "margin-bottom": "20px",
      },
      ".hero-subtitle": {
        color: "#7f8c8d",
        "font-size": "18px",
        "line-height": "1.6",
        "margin-bottom": "30px",
      },
      ".cta-button": {
        "background-color": "#3498db",
        color: "#ffffff",
        padding: "15px 30px",
        "border-radius": "8px",
        "font-weight": "600",
        "text-decoration": "none",
      },
    };
    setComputedStylesInput(JSON.stringify(exampleStyles, null, 2));

    
  }, []);

   useEffect(() => {
    const loadExampleHtml = async () => {
      try {
        const response = await fetch('/api/example-section');
        if (response.ok) {
          const html = await response.text();
          setHtmlInput(html);
        }
      } catch (error) {
        console.error('Failed to load example HTML:', error);
        setHtmlInput('<!-- Failed to load HTML -->');
      }
    };
    loadExampleHtml();
  }, []);


  const processHtml = async () => {
    if (!htmlInput.trim()) {
      setMessage({ type: "error", text: "Please enter HTML code to convert" });
      return;
    }

    let computedStyles = null;
    if (computedStylesInput.trim()) {
      try {
        computedStyles = JSON.parse(computedStylesInput);
      } catch (e) {
        setMessage({ type: "error", text: "Invalid JSON in computed styles." });
        return;
      }
    }

    setLoading(true);
    setMessage(null);
    setResult(null);

    try {
      const res = await fetch("/api/convertor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          htmlInput,
          sectionName: sectionName || `section_${Date.now()}`,
          computedStyles,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setResult(json.data);
        setMessage({ type: "success", text: `Successfully converted! ${json.data.templates.length} templates extracted.` });
      } else {
        setMessage({ type: "error", text: json.error });
      }
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplates = async () => {
    try {
      const res = await fetch("/api/download-templates");
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "templates.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="p-4 max-w-[1400px] mx-auto bg-white rounded-lg shadow-md">
      <div className="bg-gradient-to-r from-indigo-800 to-blue-700 text-white p-6 text-center rounded-t-lg">
        <h1 className="text-3xl font-bold">🔄 Wix to Template Converter</h1>
        <p className="text-sm opacity-90">Convert Wix HTML sections to templated format with automatic widget extraction and computed styles</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-black" >📝 Input Configuration</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Section Name</label>
            <input
              className="w-full p-2 border-2 text-black border-gray-300 rounded"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="e.g., hero-section, navbar, footer"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Wix HTML Code</label>
            <textarea
              className="w-full p-2 border-2 text-black border-gray-300 rounded h-[200px] font-mono"
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Computed Styles JSON (Optional)</label>
            <textarea
              className="w-full p-2 border-2 border-blue-200 rounded h-[120px] text-black font-mono bg-blue-50"
              value={computedStylesInput}
              onChange={(e) => setComputedStylesInput(e.target.value)}
            />
          </div>
          <button onClick={processHtml} disabled={loading} className="btn p-3 border border-gray-300 rounded text-black">
            🚀 Convert to Template
          </button>
          {loading && <p className="text-center mt-4">Processing...</p>}
          {message && (
            <div className={`mt-4 p-3 rounded ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {message.text}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-black">📤 Template Output</h2>
          {result && (
            <>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <div className="text-indigo-600 font-bold text-2xl">{result.templates.length}</div>
                  <div className="text-sm text-gray-600">Templates Created</div>
                </div>
                <div>
                  <div className="text-indigo-600 font-bold text-2xl">{result.templates.length}</div>
                  <div className="text-sm text-gray-600">Widgets Extracted</div>
                </div>
                <div>
                  <div className="text-indigo-600 font-bold text-2xl">{result.stylesExtracted || 0}</div>
                  <div className="text-sm text-gray-600">Styles Mapped</div>
                </div>
              </div>
              <pre className="bg-gray-100 p-3 rounded text-sm text-black overflow-auto whitespace-pre-wrap">
                {result.processedHtml.replace(/></g, ">\n<")}
              </pre>
              <div className="mt-4 max-h-[300px] overflow-y-auto border rounded">
                {result.templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <div>
                      <div className="font-semibold text-indigo-600">{tpl.id}</div>
                      <small className="text-gray-500">{tpl.tagName}{tpl.computedStyles ? " • Styled" : ""}</small>
                    </div>
                    <div className="text-xs bg-gray-200 px-2 py-1 rounded">{tpl.type}</div>
                  </div>
                ))}
              </div>
              <button onClick={downloadTemplates} className="btn mt-4 bg-green-600 hover:bg-green-700 text-white">
                💾 Download templates.json
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
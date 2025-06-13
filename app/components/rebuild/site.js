// import { useState } from 'react';

// export default function SiteRebuilder() {
//   const [rawHtml, setRawHtml] = useState('');
//   const [optimizedHtml, setOptimizedHtml] = useState('');
//   const [rebuiltHtml, setRebuiltHtml] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [step, setStep] = useState(1);

//   // Function to get optimized HTML from AI automatically
//   const getOptimizedHtml = async () => {
//     if (!rawHtml.trim()) {
//       setError('Please provide raw HTML first');
//       return;
//     }

//     setIsProcessing(true);
//     setError('');
    
//     try {
//       const response = await fetch('/api/optimize-html', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           rawHtml: rawHtml,
//           computedStyles: '' // Not needed as per your requirement
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to optimize HTML');
//       }

//       const data = await response.json();
//       setOptimizedHtml(data.optimizedHtml);
//       setStep(2);
//     } catch (err) {
//       setError(`Error getting optimized HTML: ${err.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Function to rebuild site by accessing template.json and replacing placeholders
//   const rebuildSite = async () => {
//     if (!optimizedHtml.trim()) {
//       setError('No optimized HTML available. Please get optimized HTML first.');
//       return;
//     }

//     setIsProcessing(true);
//     setError('');
    
//     try {
//       // Access template.json file
//       const templateResponse = await fetch('/template.json');
//       if (!templateResponse.ok) {
//         throw new Error('Could not access template.json file. Make sure it exists in your public folder.');
//       }
      
//       const templates = await templateResponse.json();
      
//       // Start with the optimized HTML
//       let rebuiltContent = optimizedHtml;
      
//       // Replace each template placeholder with actual widget content
//       Object.keys(templates).forEach(templateKey => {
//         const placeholder = `{{${templateKey}}}`;
//         const widgetContent = templates[templateKey];
        
//         // Replace all occurrences of this placeholder
//         rebuiltContent = rebuiltContent.replace(new RegExp(placeholder, 'g'), widgetContent);
//       });
      
//       setRebuiltHtml(rebuiltContent);
//       setStep(3);
//     } catch (err) {
//       setError(`Error rebuilding site: ${err.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const downloadHtml = () => {
//     const blob = new Blob([rebuiltHtml], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'rebuilt-site.html';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const resetProcess = () => {
//     setRawHtml('');
//     setOptimizedHtml('');
//     setRebuiltHtml('');
//     setError('');
//     setStep(1);
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
//         <h1>Site Rebuilder - AI Optimization & Template Replacement</h1>
//         {step > 1 && (
//           <button
//             onClick={resetProcess}
//             style={{
//               backgroundColor: '#6c757d',
//               color: 'white',
//               border: 'none',
//               padding: '8px 16px',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             Start Over
//           </button>
//         )}
//       </div>

//       {/* Progress Indicator */}
//       <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
//         <div style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           color: step >= 1 ? '#28a745' : '#6c757d',
//           fontWeight: step === 1 ? 'bold' : 'normal'
//         }}>
//           <span style={{ 
//             width: '24px', 
//             height: '24px', 
//             borderRadius: '50%', 
//             backgroundColor: step >= 1 ? '#28a745' : '#6c757d',
//             color: 'white',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '12px',
//             marginRight: '8px'
//           }}>1</span>
//           Raw HTML Input
//         </div>
//         <div style={{ flex: 1, height: '2px', backgroundColor: step >= 2 ? '#28a745' : '#dee2e6' }} />
//         <div style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           color: step >= 2 ? '#28a745' : '#6c757d',
//           fontWeight: step === 2 ? 'bold' : 'normal'
//         }}>
//           <span style={{ 
//             width: '24px', 
//             height: '24px', 
//             borderRadius: '50%', 
//             backgroundColor: step >= 2 ? '#28a745' : '#6c757d',
//             color: 'white',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '12px',
//             marginRight: '8px'
//           }}>2</span>
//           AI Optimization
//         </div>
//         <div style={{ flex: 1, height: '2px', backgroundColor: step >= 3 ? '#28a745' : '#dee2e6' }} />
//         <div style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           color: step >= 3 ? '#28a745' : '#6c757d',
//           fontWeight: step === 3 ? 'bold' : 'normal'
//         }}>
//           <span style={{ 
//             width: '24px', 
//             height: '24px', 
//             borderRadius: '50%', 
//             backgroundColor: step >= 3 ? '#28a745' : '#6c757d',
//             color: 'white',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '12px',
//             marginRight: '8px'
//           }}>3</span>
//           Site Rebuilt
//         </div>
//       </div>

//       {error && (
//         <div style={{ 
//           backgroundColor: '#fee', 
//           border: '1px solid #fcc', 
//           padding: '15px', 
//           borderRadius: '4px',
//           marginBottom: '20px',
//           color: '#c00'
//         }}>
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {/* Step 1: Raw HTML Input */}
//       <div style={{ 
//         marginBottom: '30px', 
//         border: '2px solid ' + (step === 1 ? '#007bff' : '#ddd'), 
//         padding: '20px', 
//         borderRadius: '8px',
//         backgroundColor: step === 1 ? '#f8f9ff' : 'white'
//       }}>
//         <h2>Step 1: Raw HTML Input</h2>
//         <p style={{ marginBottom: '15px', color: '#666' }}>
//           Paste your raw HTML code here. The AI will automatically optimize it and create template placeholders.
//         </p>
//         <textarea
//           value={rawHtml}
//           onChange={(e) => setRawHtml(e.target.value)}
//           placeholder="Paste your raw HTML here..."
//           style={{
//             width: '100%',
//             height: '200px',
//             padding: '10px',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             fontFamily: 'monospace',
//             fontSize: '12px',
//             marginBottom: '15px'
//           }}
//         />
//         <button
//           onClick={getOptimizedHtml}
//           disabled={isProcessing || !rawHtml.trim()}
//           style={{
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             padding: '12px 24px',
//             borderRadius: '4px',
//             cursor: (isProcessing || !rawHtml.trim()) ? 'not-allowed' : 'pointer',
//             opacity: (isProcessing || !rawHtml.trim()) ? 0.6 : 1,
//             fontSize: '16px',
//             fontWeight: 'bold'
//           }}
//         >
//           {isProcessing ? 'Getting AI Optimization...' : 'Get AI Optimized HTML'}
//         </button>
//       </div>

//       {/* Step 2: Optimized HTML Display */}
//       {optimizedHtml && (
//         <div style={{ 
//           marginBottom: '30px', 
//           border: '2px solid ' + (step === 2 ? '#28a745' : '#ddd'), 
//           padding: '20px', 
//           borderRadius: '8px',
//           backgroundColor: step === 2 ? '#f8fff8' : 'white'
//         }}>
//           <h2>Step 2: AI Optimized HTML</h2>
//           <p style={{ marginBottom: '15px', color: '#666' }}>
//             AI has optimized your HTML with template placeholders. Click "Rebuild Site" to replace placeholders with actual widgets.
//           </p>
//           <textarea
//             value={optimizedHtml}
//             readOnly
//             style={{
//               width: '100%',
//               height: '200px',
//               padding: '10px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               fontFamily: 'monospace',
//               fontSize: '12px',
//               backgroundColor: '#f8f9fa',
//               marginBottom: '15px'
//             }}
//           />
//           <button
//             onClick={rebuildSite}
//             disabled={isProcessing}
//             style={{
//               backgroundColor: '#28a745',
//               color: 'white',
//               border: 'none',
//               padding: '12px 24px',
//               borderRadius: '4px',
//               cursor: isProcessing ? 'not-allowed' : 'pointer',
//               opacity: isProcessing ? 0.6 : 1,
//               fontSize: '16px',
//               fontWeight: 'bold'
//             }}
//           >
//             {isProcessing ? 'Rebuilding Site...' : 'Rebuild Site'}
//           </button>
//           <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
//             This will automatically access your template.json file and replace all {'{{template-n}}'} placeholders.
//           </p>
//         </div>
//       )}

//       {/* Step 3: Final Result */}
//       {rebuiltHtml && (
//         <div style={{ 
//           border: '2px solid #28a745', 
//           padding: '20px', 
//           borderRadius: '8px',
//           backgroundColor: '#f8fff8'
//         }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
//             <h2>Step 3: Rebuilt Site</h2>
//             <button
//               onClick={downloadHtml}
//               style={{
//                 backgroundColor: '#17a2b8',
//                 color: 'white',
//                 border: 'none',
//                 padding: '10px 20px',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 fontWeight: 'bold'
//               }}
//             >
//               Download HTML File
//             </button>
//           </div>
          
//           <p style={{ marginBottom: '15px', color: '#666' }}>
//             Your site has been successfully rebuilt with all widgets replaced!
//           </p>
          
//           <textarea
//             value={rebuiltHtml}
//             readOnly
//             style={{
//               width: '100%',
//               height: '200px',
//               padding: '10px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               fontFamily: 'monospace',
//               fontSize: '12px',
//               backgroundColor: '#f8f9fa',
//               marginBottom: '20px'
//             }}
//           />
          
//           {/* Live Preview */}
//           <div style={{ marginTop: '20px' }}>
//             <h3>Live Preview:</h3>
//             <div 
//               style={{ 
//                 border: '1px solid #ddd', 
//                 padding: '20px', 
//                 borderRadius: '4px',
//                 backgroundColor: 'white',
//                 minHeight: '200px',
//                 overflow: 'auto'
//               }}
//               dangerouslySetInnerHTML={{ __html: rebuiltHtml }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useState } from 'react';

// export default function RebuildPage() {
//   const [rawHtml, setRawHtml] = useState('');
//   const [rebuiltHtml, setRebuiltHtml] = useState('');
//   const [error, setError] = useState('');

//   const handleRebuild = async () => {
//     try {
//       const res = await fetch('/api/template');
//       const data = await res.json();

//       if (!data.success) throw new Error('Failed to load templates');

//       const templates = data.templates;

//       const result = rawHtml.replace(/{{template-(\d+)}}/g, (_, num) => {
//         return templates[`template-${num}`] || `<div style="color:red">Missing: template-${num}</div>`;
//       });

//       setRebuiltHtml(result);
//       setError('');
//     } catch (err) {
//       setError(err.message || 'Unknown error');
//     }
//   };

//   return (
//     <div >
//       <h1 className="text-2xl font-bold mb-4">Rebuild Site</h1>

//       <textarea
//         className="w-full h-40 p-3 border border-gray-300 rounded mb-4"
//         placeholder="Paste raw HTML like <div>{{template-1}}</div>"
//         value={rawHtml}
//         onChange={(e) => setRawHtml(e.target.value)}
//       />

//       <button
//         onClick={handleRebuild}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
//       >
//         Rebuild Site
//       </button>

//       {error && (
//         <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
//           {error}
//         </div>
//       )}

//       <div className="w-full mt-2">
//         <h2 className="text-xl font-semibold mb-2">Rendered Output</h2>
//         <div
//           className="w-full p-4 rounded bg-gray-50"
//           dangerouslySetInnerHTML={{ __html: rebuiltHtml }}
//         />
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState } from 'react';

// export default function RebuildPage() {
//   const [rawHtml, setRawHtml] = useState('');
//   const [rebuiltHtml, setRebuiltHtml] = useState('');
//   const [error, setError] = useState('');

//   const handleRebuild = async () => {
//     try {
//       const res = await fetch('/api/template');
//       const data = await res.json();

//       if (!data.success) throw new Error('Failed to load templates');

//       const templates = data.templates;

//       const result = rawHtml.replace(/{{template-(\d+)}}/g, (_, num) => {
//         return templates[`template-${num}`] || `<div style="color:red">Missing: template-${num}</div>`;
//       });

//       setRebuiltHtml(result);
//       setError('');
//     } catch (err) {
//       setError(err.message || 'Unknown error');
//     }
//   };

//   return (
//     <div className=" mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Rebuild Site</h1>

//       <textarea
//         className="w-full h-40 p-3 border border-gray-300 rounded mb-4"
//         placeholder="Paste raw HTML like <div>{{template-1}}</div>"
//         value={rawHtml}
//         onChange={(e) => setRawHtml(e.target.value)}
//       />

//       <button
//         onClick={handleRebuild}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
//       >
//         Rebuild Site
//       </button>

//       {error && (
//         <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
//           {error}
//         </div>
//       )}

//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-2">Rendered Output</h2>
//         <div
//           className="border p-4 rounded bg-white"
//           dangerouslySetInnerHTML={{ __html: rebuiltHtml }}
//         />
//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';

export default function RebuildPage() {
  const [rawHtml, setRawHtml] = useState('');
  const [rebuiltHtml, setRebuiltHtml] = useState('');
  const [error, setError] = useState('');

  const handleRebuild = async () => {
    try {
      const res = await fetch('/api/template');
      const data = await res.json();

      if (!data.success) throw new Error('Failed to load templates');

      const templates = data.templates;

      const result = rawHtml.replace(/{{template-(\d+)}}/g, (_, num) => {
        return templates[`template-${num}`] || `<div style="color:red">Missing: template-${num}</div>`;
      });

      setRebuiltHtml(result);
      setError('');
    } catch (err) {
      setError(err.message || 'Unknown error');
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4">Rebuild Site</h1>

      <textarea
        className="w-full h-40 p-3 border border-gray-300 rounded mb-4"
        placeholder="Paste raw HTML like <div>{{template-1}}</div>"
        value={rawHtml}
        onChange={(e) => setRawHtml(e.target.value)}
      />

      <button
        onClick={handleRebuild}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
      >
        Rebuild Site
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Rendered Output</h2>
        <div
          className="border p-4 rounded bg-white"
          dangerouslySetInnerHTML={{ __html: rebuiltHtml }}
        />
      </div>
    </div>
  );
}

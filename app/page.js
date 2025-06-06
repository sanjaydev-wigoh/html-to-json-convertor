// // pages/html-optimizer.js
// 'use client';
// import { useState } from 'react';
// import Head from 'next/head';

// export default function HtmlOptimizer() {
//   const [rawHtml, setRawHtml] = useState('');
//   const [computedStyles, setComputedStyles] = useState('');
//   const [optimizedHtml, setOptimizedHtml] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const optimizeHtml = async () => {
//     if (!rawHtml.trim() || !computedStyles.trim()) {
//       setError('Please fill in both HTML and CSS fields');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/optimize-html', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           rawHtml,
//           computedStyles
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to optimize HTML');
//       }

//       setOptimizedHtml(data.optimizedHtml);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <>
//       <Head>
//         <title>HTML Optimizer - Convert to Minimal Flex/Grid</title>
//         <meta name="description" content="Convert raw HTML to minimal code using flex and grid properties" />
//       </Head>

//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               HTML Optimizer
//             </h1>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Convert raw HTML to minimal code using modern flex and grid properties. 
//               Removes unnecessary divs and optimizes structure based on computed styles.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//             {/* Raw HTML Input */}
//             <div className="bg-white rounded-lg shadow">
//               <div className="p-4 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900">Raw HTML</h2>
//                 <p className="text-sm text-gray-600">Paste your original HTML code here</p>
//               </div>
//               <div className="p-4">
//                 <textarea
                
//                   value={rawHtml}
//                   onChange={(e) => setRawHtml(e.target.value)}
//                   placeholder="<div class='container'>
//   <div class='wrapper'>
//     <div class='content'>
//       <h1>Title</h1>
//       <p>Content</p>
//     </div>
//   </div>
// </div>"
//                   className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
//                 />
//               </div>
//             </div>

//             {/* Computed Styles Input */}
//             <div className="bg-white rounded-lg shadow">
//               <div className="p-4 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900">Computed Styles</h2>
//                 <p className="text-sm text-gray-600">Paste the computed CSS styles</p>
//               </div>
//               <div className="p-4">
//                 <textarea
//                   value={computedStyles}
//                   onChange={(e) => setComputedStyles(e.target.value)}
//                   placeholder=".container {
//   display: flex;
//   flex-direction: column;
//   padding: 20px;
// }
// .wrapper {
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   gap: 16px;
// }
// .content {
//   flex: 1;
// }"
//                   className="w-full h-64 px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Optimize Button */}
//           <div className="text-center mb-6">
//             <button
//               onClick={optimizeHtml}
//               disabled={isLoading}
//               className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
//             >
//               {isLoading ? 'Optimizing...' : 'Optimize HTML'}
//             </button>
//           </div>

//           {/* Error Display */}
//           {error && (
//             <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-800">{error}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Optimized HTML Output */}
//           {optimizedHtml && (
//             <div className="bg-white rounded-lg shadow">
//               <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Optimized HTML</h2>
//                   <p className="text-sm text-gray-600">Minimal HTML with flex/grid properties</p>
//                 </div>
//                 <button
//                   onClick={() => copyToClipboard(optimizedHtml)}
//                   className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                 >
//                   Copy
//                 </button>
//               </div>
//               <div className="p-4">
//                 <pre className="bg-gray-50 p-4 rounded-md text-black overflow-auto text-sm font-mono whitespace-pre-wrap">
//                   {optimizedHtml}
//                 </pre>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

'use client';
import { useState } from 'react';
import Head from 'next/head';

export default function HtmlOptimizer() {
  const [rawHtml, setRawHtml] = useState('');
  const [computedStyles, setComputedStyles] = useState('');
  const [bareMinimumHtml, setBareMinimumHtml] = useState('');
  const [jsonLayout, setJsonLayout] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const convertHtml = async () => {
    if (!rawHtml.trim() || !computedStyles.trim()) {
      setError('Please fill in both HTML and CSS fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setBareMinimumHtml('');
    setJsonLayout('');

    try {
      // Step 1: Get bare minimum HTML
      const optimizeResponse = await fetch('/api/optimize-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawHtml,
          computedStyles
        }),
      });

      const optimizeData = await optimizeResponse.json();

      if (!optimizeResponse.ok) {
        throw new Error(optimizeData.error || 'Failed to optimize HTML');
      }

      setBareMinimumHtml(optimizeData.optimizedHtml);

      // Step 2: Convert to JSON layout
      const jsonResponse = await fetch('/api/html-to-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optimizedHtml: optimizeData.optimizedHtml
        }),
      });

      const jsonData = await jsonResponse.json();

      if (!jsonResponse.ok) {
        throw new Error(jsonData.error || 'Failed to convert to JSON layout');
      }

      // Format JSON for display
      const formattedJson = typeof jsonData.jsonLayout === 'string' 
        ? jsonData.jsonLayout 
        : JSON.stringify(jsonData.jsonLayout, null, 2);
      
      setJsonLayout(formattedJson);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Head>
        <title>HTML to JSON Layout Converter</title>
        <meta name="description" content="Convert raw HTML to bare minimum code and JSON layout structure with template placeholders" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              HTML to JSON Layout Converter
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Convert raw HTML to bare minimum code and generate JSON layout structure with template placeholders.
              No widget tags like &lt;span&gt;, &lt;h1&gt;, &lt;p&gt; will appear in the JSON output.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Raw HTML Input */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Raw HTML</h2>
                <p className="text-sm text-gray-600">Paste your original HTML code here</p>
              </div>
              <div className="p-4">
                <textarea
                  value={rawHtml}
                  onChange={(e) => setRawHtml(e.target.value)}
                  placeholder="<div class='container'>
  <div class='wrapper'>
    <div class='content'>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  </div>
</div>"
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>

            {/* Computed Styles Input */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Computed Styles</h2>
                <p className="text-sm text-gray-600">Paste the computed CSS styles</p>
              </div>
              <div className="p-4">
                <textarea
                  value={computedStyles}
                  onChange={(e) => setComputedStyles(e.target.value)}
                  placeholder=".container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
}
.content {
  flex: 1;
}"
                  className="w-full h-64 px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <div className="text-center mb-6">
            <button
              onClick={convertHtml}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Converting...</span>
                </div>
              ) : (
                'Convert to Bare Minimum HTML & JSON Layout'
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {(bareMinimumHtml || jsonLayout) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bare Minimum HTML Output */}
              {bareMinimumHtml && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Bare Minimum HTML</h2>
                      <p className="text-sm text-gray-600">Minimal HTML with flex/grid properties</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bareMinimumHtml)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className="p-4">
                    <pre className="bg-gray-50 p-4 rounded-md text-black overflow-auto text-sm font-mono whitespace-pre-wrap max-h-96 border">
                      {bareMinimumHtml}
                    </pre>
                  </div>
                </div>
              )}

              {/* JSON Layout Output */}
              {jsonLayout && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">JSON Layout</h2>
                      <p className="text-sm text-gray-600">Layout structure with  {'{{template-n}}'} placeholders</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(jsonLayout)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className="p-4">
                    <pre className="bg-gray-50 p-4 rounded-md text-black overflow-auto text-sm font-mono whitespace-pre-wrap max-h-96 border">
                      {jsonLayout}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          {bareMinimumHtml && jsonLayout && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    ✅ Successfully converted to bare minimum HTML and JSON layout! 
                    Note: JSON layout contains only layout containers with {'{{template-n}}'} placeholders for content.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
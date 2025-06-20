"use client";
import { useState } from 'react';
import Head from 'next/head';

export default function BareHtml() {
  const [htmlCode, setHtmlCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptimize = async () => {
    if (!htmlCode.trim()) {
      setError('Please provide HTML code to optimize');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          htmlCode: htmlCode.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to optimize HTML');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Head>
        <title>HTML Code Optimizer</title>
        <meta name="description" content="Optimize HTML code using OpenAI API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5', 
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '30px',
            textAlign: 'center'
          }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>
              HTML Code Optimizer
            </h1>
            <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
              Reduce your HTML code by 60-70% while maintaining the exact layout
            </p>
          </div>

          <div style={{ padding: '30px' }}>
            {/* HTML Input */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Raw HTML Code
              </label>
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="Paste your HTML code here..."
                rows={12}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  fontFamily: 'Monaco, Consolas, monospace',
                  resize: 'vertical',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Optimize Button */}
            <button
              onClick={handleOptimize}
              disabled={loading || !htmlCode.trim()}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: loading ? '#9ca3af' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '20px'
              }}
              onMouseOver={(e) => {
                if (!loading && htmlCode.trim()) {
                  e.target.style.backgroundColor = '#5a67d8';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#667eea';
                }
              }}
            >
              {loading ? 'Optimizing...' : 'Optimize HTML Code'}
            </button>

            {/* Error Display */}
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Results */}
            {result && (
              <div style={{ marginTop: '30px' }}>
                {/* Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  marginBottom: '25px'
                }}>
                  <div style={{
                    backgroundColor: '#f3f4f6',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>
                      {result.originalLines}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>Original Lines</div>
                  </div>
                  <div style={{
                    backgroundColor: '#f3f4f6',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>
                      {result.optimizedLines}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>Optimized Lines</div>
                  </div>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                      {result.reductionPercentage}%
                    </div>
                    <div style={{ color: '#15803d', fontSize: '14px' }}>Code Reduction</div>
                  </div>
                </div>

                {/* Optimized Code */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <h3 style={{ margin: 0, color: '#374151' }}>Optimized Code</h3>
                    <button
                      onClick={() => copyToClipboard(result.optimizedCode)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Copy Code
                    </button>
                  </div>
                  <pre style={{
                    backgroundColor: '#1f2937',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    overflow: 'auto',
                    fontSize: '14px',
                    fontFamily: 'Monaco, Consolas, monospace',
                    lineHeight: '1.5',
                    maxHeight: '400px'
                  }}>
                    <code>{result.optimizedCode}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
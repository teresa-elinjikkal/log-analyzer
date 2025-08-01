import React, { useState } from 'react';

const QueryBox: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setResponse('⚠️ Error: Backend is not running or API failed.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow-xl bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">Gemini RAG Assistant</h1>

      <textarea
        className="w-full p-3 border rounded mb-4"
        rows={4}
        placeholder="Ask your question here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        onClick={handleQuery}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Ask Gemini'}
      </button>

      {response && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-gray-800 whitespace-pre-wrap">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default QueryBox;

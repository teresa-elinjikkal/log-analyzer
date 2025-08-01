import React, { useState } from 'react';

export const RagQueryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.response || 'No response received.');
    } catch (error) {
      console.error('Error querying backend:', error);
      setResponse('❌ Failed to get response from server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">RAG Query</h1>
        <p className="text-gray-400">Ask questions from your uploaded PDF using AI + ChromaDB</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700 space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question here..."
          rows={4}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleQuerySubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Processing...' : 'Ask'}
        </button>

        {response && (
          <div className="mt-4 p-4 bg-gray-700 text-white rounded border border-gray-600">
            <h2 className="font-semibold mb-2">Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

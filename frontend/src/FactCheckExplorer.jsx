// client/src/App.jsx
import React, { useState, useEffect } from 'react';

// The URL of your Express Backend
const API_BASE_URL = 'http://localhost:5000'; 

function FactCheckExplorer() {
  const [query, setQuery] = useState('');
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch data from your Express API
  const fetchData = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Call your custom Express endpoint with the search query
      const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setClaims(data);
    } catch (err) {
      setError(err.message);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  // Load recent claims on the first render (empty query)
  useEffect(() => {
    fetchData('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(query);
  };
  
  // A simple component to display the fact-check result
  const ClaimCard = ({ claim }) => {
    const review = claim.claimReview?.[0]; // Access the first review safely
    
    // Safely get the rating and source name
    const rating = review?.textualRating || 'N/A';
    const publisher = review?.publisher?.name || 'Unknown Source';

    return (
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
        <h3>{claim.text}</h3>
        <p><strong>Verdict:</strong> <span style={{ color: rating.includes('False') ? 'red' : 'green' }}>{rating}</span></p>
        <p><strong>Source:</strong> {publisher}</p>
        {review?.url && <a href={review.url} target="_blank" rel="noopener noreferrer">Read Full Fact Check</a>}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>🔍 Fact Check Search</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a claim to search (e.g., 'climate change is a hoax')"
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 15px' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {/* Display States */}
      {error && <p style={{ color: 'red' }}>Error: {error}. Check your backend server and API key.</p>}
      
      <h2>{claims.length > 0 ? `Results (${claims.length})` : 'Recent Claims'}</h2>
      <div className="results-list">
        {claims.length > 0 ? (
          claims.map((claim, index) => <ClaimCard key={index} claim={claim} />)
        ) : (
          !loading && <p>No claims found. Try searching for something else.</p>
        )}
      </div>
    </div>
  );
}

export default FactCheckExplorer;
import React, { useState, useEffect } from 'react';
import '../styles/KeywordAnalysisPage.css';

const KeywordAnalysisPage = () => {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePlatform, setActivePlatform] = useState('all');

  // Platforms list
  const platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'tiktok', name: 'TikTok' }
  ];

  // Mock data - Replace with actual API call
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/keywords');
        // const data = await response.json();
        
        // Mock data for now
        const mockData = [
          { id: 1, keyword: 'social media marketing', searchVolume: 8500, competition: 'High' },
          { id: 2, keyword: 'content strategy', searchVolume: 4200, competition: 'Medium' },
          { id: 3, keyword: 'instagram hashtags', searchVolume: 7800, competition: 'Medium' },
          { id: 4, keyword: 'facebook ads', searchVolume: 9200, competition: 'High' },
          { id: 5, keyword: 'twitter engagement', searchVolume: 3100, competition: 'Low' },
          { id: 6, keyword: 'linkedin b2b marketing', searchVolume: 2700, competition: 'Medium' },
          { id: 7, keyword: 'tiktok trends', searchVolume: 12400, competition: 'High' },
          { id: 8, keyword: 'social media analytics', searchVolume: 5600, competition: 'Medium' },
        ];
        
        setKeywords(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch keywords');
        setLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  // Filter keywords based on search term and platform
  const filteredKeywords = keywords.filter(keyword => 
    keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activePlatform === 'all' || keyword.platform === activePlatform)
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePlatformChange = (platformId) => {
    setActivePlatform(platformId);
  };

  if (loading) return <div className="loading">Loading keyword data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="keyword-analysis-page">
      <h1 className="page-title">Keyword Analysis</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for keywords..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      
      <div className="platform-selector">
        {platforms.map(platform => (
          <button
            key={platform.id}
            onClick={() => handlePlatformChange(platform.id)}
            className={`platform-button ${activePlatform === platform.id ? 'active' : ''}`}
          >
            {platform.name}
          </button>
        ))}
      </div>
      
      {filteredKeywords.length > 0 ? (
        <table className="keyword-table">
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Search Volume</th>
              <th>Competition</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeywords.map(keyword => (
              <tr key={keyword.id}>
                <td>{keyword.keyword}</td>
                <td>{keyword.searchVolume.toLocaleString()}</td>
                <td>{keyword.competition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-results">No keywords found. Try a different search term.</div>
      )}
    </div>
  );
};

export default KeywordAnalysisPage;

import React, { useState, useEffect } from 'react';
import '../styles/KeywordAnalysisPage.css';
import { searchKeywords } from '../services/keywordService';

const KeywordAnalysisPage = () => {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePlatform, setActivePlatform] = useState('google'); // Default to "Google"
  const [language, setLanguage] = useState('English'); // Default language

  const platforms = [
    { id: 'google', name: 'Google' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'amazon', name: 'Amazon' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'tiktok', name: 'TikTok' },
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setLoading(true);
        const mockData = [
          { id: 1, keyword: 'social media marketing', searchVolume: 8500, competition: 'High', platform: 'google' },
          { id: 2, keyword: 'content strategy', searchVolume: 4200, competition: 'Medium', platform: 'instagram' },
          { id: 3, keyword: 'amazon deals', searchVolume: 7800, competition: 'Medium', platform: 'amazon' },
          { id: 4, keyword: 'facebook ads', searchVolume: 9200, competition: 'High', platform: 'facebook' },
          { id: 5, keyword: 'twitter engagement', searchVolume: 3100, competition: 'Low', platform: 'twitter' },
          { id: 6, keyword: 'linkedin b2b marketing', searchVolume: 2700, competition: 'Medium', platform: 'linkedin' },
          { id: 7, keyword: 'tiktok trends', searchVolume: 12400, competition: 'High', platform: 'tiktok' },
          { id: 8, keyword: 'social media analytics', searchVolume: 5600, competition: 'Medium', platform: 'google' },
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

  // Filter keywords based on search term and active platform
  const filteredKeywords = keywords.filter(
    (keyword) =>
      keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activePlatform === 'all' || keyword.platform === activePlatform)
  );

  // Handle search functionality
  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await searchKeywords(searchTerm);
      setKeywords(results);
      setLoading(false);
    } catch (error) {
      setError('Error fetching suggestions');
      setLoading(false);
    }
  };

  // Handle platform selection
  const handlePlatformChange = (platformId) => {
    setActivePlatform(platformId);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  if (loading) return <div className="loading">Loading keyword data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="keyword-analysis-page">
      <h1 className="page-title">Find Awesome Keywords On Various Platforms</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          list="keyword-suggestions" // Future autocomplete capability
        />
        <datalist id="keyword-suggestions">
          {/* Placeholder for future autocomplete suggestions */}
        </datalist>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="language-selector"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="platform-selector">
        {platforms.map((platform) => (
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
              <th>Platform</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeywords.map((keyword) => (
              <tr key={keyword.id}>
                <td>{keyword.keyword}</td>
                <td>{keyword.searchVolume.toLocaleString()}</td>
                <td>{keyword.competition}</td>
                <td>{keyword.platform}</td>
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

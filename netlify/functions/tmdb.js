// netlify/functions/tmdb.js
// This handles all TMDB API requests securely

const axios = require('axios');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Get the API key from environment variable (set in Netlify)
  const TMDB_KEY = process.env.TMDB_API_KEY;
  
  if (!TMDB_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'TMDB API key not configured' })
    };
  }

  // Get the endpoint from query parameters
  // Example: /.netlify/functions/tmdb?endpoint=person/237254
  const { endpoint } = event.queryStringParameters || {};

  if (!endpoint) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Endpoint parameter required' })
    };
  }

  try {
    // Make request to TMDB API
    const response = await axios.get(
      `https://api.themoviedb.org/3/${endpoint}`,
      {
        params: { api_key: TMDB_KEY }
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('TMDB API Error:', error.message);
    
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch data from TMDB',
        message: error.message 
      })
    };
  }
};
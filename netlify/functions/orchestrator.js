//functions/orchestrator.js

const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    // Step 1: Fetch news articles
    const newsResponse = await axios.get(`${process.env.URL}/.netlify/functions/fetch-news`);
    const articles = newsResponse.data;

    if (articles.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No articles found." }),
      };
    }

    const articleTitle = articles[0].title; // Using the first article's title for simplicity

    // Step 2: Generate a story based on the first article's title
    const storyResponse = await axios.get(`${process.env.URL}/.netlify/functions/generate-story`, {
      params: { articleTitle: encodeURIComponent(articleTitle) } // Ensure title is URL-encoded
    });
    
    // Ensure correct parsing of the response structure
    const { headline, story } = storyResponse.data;

    // Decode the headline to ensure spaces are properly represented
    const decodedHeadline = decodeURIComponent(headline);

    return {
      statusCode: 200,
      body: JSON.stringify({ headline: decodedHeadline, story }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to orchestrate function calls', details: error.message }),
    };
  }
};

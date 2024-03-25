// netlify/functions/fetch-news.js

const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        apiKey: process.env.NEWS_API_KEY,
        q: 'climate change',
        language: 'en',
        sortBy: 'publishedAt',
      },
    });

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(articles),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news articles', details: error.message }),
    };
  }
};

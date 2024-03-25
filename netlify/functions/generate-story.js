// netlify/functions/generate-story.js

const axios = require('axios');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK once
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  const { articleTitle } = event.queryStringParameters;

  if (!articleTitle) {
    return {
      statusCode: 400,
      body: 'Article title is required',
    };
  }

  try {
    // const newsAgencies = ['Fox News', 'The Wall Street Journal', 'The Daily Telegraph', 'The Telegraph', 'The Spectator', 'The Times', 'GBNews'];

    // const randomAgency = newsAgencies[Math.floor(Math.random() * newsAgencies.length)];

    const prompt = `Write a 60 word paragraph in the tone of Fox News about : "${articleTitle}"`;

    const messages = [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }];

    const openAIResponse = await axios.post('https://api.openai.com/v1/chat/completions', { messages: messages, model: "gpt-3.5-turbo" }, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
    const story = openAIResponse.data.choices[0].message.content;

    // Decode the article title before storing it in Firebase
    const decodedArticleTitle = decodeURIComponent(articleTitle);

    await db.collection('stories').add({
      headline: decodedArticleTitle,
      story,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ headline: decodedArticleTitle, story }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate and save story', details: error.message }),
    };
  }
};
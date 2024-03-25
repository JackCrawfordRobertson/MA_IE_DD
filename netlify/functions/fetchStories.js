// netlify/functions/fetchStories.js
const admin = require('firebase-admin');
const {getFirestore} = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) { // Check if already initialized
  admin.initializeApp({
    // Ensure you configure these environment variables in your Netlify settings
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: "https://climate-chatbot-default-rtdb.europe-west1.firebasedatabase.app/",
});
}

exports.handler = async (event, context) => {
  const db = getFirestore();
  const storiesRef = db.collection('stories');
  try {
    const snapshot = await storiesRef.orderBy('createdAt', 'desc').get();
    const stories = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        headline: data.headline,
        content: data.story,
        createdAt: data.createdAt?.toDate().toString(),
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ stories }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch stories." }),
    };
  }
};

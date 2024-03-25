const axios = require("axios");
const admin = require("firebase-admin");

// Using environment variables for Firebase Admin SDK initialization
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  // Include other necessary fields from the service account JSON as required
};

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const action = event.queryStringParameters?.action;
    const articleTitle = event.queryStringParameters?.articleTitle;

    if (!action || ![ "fetchNews", "generateStory", "fetchStories" ].includes(action)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid action. Please provide a valid action parameter: fetchNews, generateStory, or fetchStories.",
        }),
      };
    }

    if (action === "generateStory" && !articleTitle) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing articleTitle parameter for generateStory action. Please provide the articleTitle parameter.",
        }),
      };
    }

    let response;
    if (action === "fetchNews") {
      response = await fetchNews();
    } else if (action === "generateStory") {
      response = await generateStory(articleTitle);
    } else {
      response = await fetchStories();
    }

    return response;
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Internal server error. Please try again later."}),
    };
  }
};
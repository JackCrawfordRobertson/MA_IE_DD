const axios = require('axios');

const triggerOrchestrator = () => {
    axios.get('http://localhost:8888/.netlify/functions/orchestrator')
        .then(() => console.log('Orchestrator triggered successfully.'))
        .catch(error => console.error('Error triggering orchestrator:', error));
};

// Calculate milliseconds until next 10th minute
const now = new Date();
const millisecondsUntilNextTenMinute = (10 - (now.getMinutes() % 10)) * 60000 - now.getSeconds() * 1000 - now.getMilliseconds();

// Schedule the triggerOrchestrator function to run every hour at the 10th minute
setTimeout(() => {
    triggerOrchestrator();
    setInterval(triggerOrchestrator, 600000); // Repeat every hour (600000 milliseconds)
}, millisecondsUntilNextTenMinute);

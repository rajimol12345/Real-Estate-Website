const axios = require('axios');

const testBotSettings = async () => {
    try {
        const res = await axios.get('http://localhost:5001/api/bot-settings');
        console.log('SUCCESS:', res.data);
    } catch (error) {
        console.error('ERROR:', error.response ? error.response.status : error.message);
        if (error.response) {
            console.error('DATA:', error.response.data);
        }
    }
};

testBotSettings();

const axios = require('axios');

const testChat = async () => {
    try {
        console.log('Sending request to /api/chat...');
        const response = await axios.post('http://localhost:5005/api/chat', {
            message: 'Hello',
            threadId: 'test-thread-' + Date.now(),
            userEmail: 'test@example.com',
            userName: 'Test User'
        });
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
        if (!error.response) {
            console.error('Error Message:', error.message);
        }
    }
};

testChat();

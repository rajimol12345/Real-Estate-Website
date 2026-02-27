const axios = require('axios');

const testChat = async () => {
    try {
        console.log("Sending test request to /api/chat...");
        const response = await axios.post('http://localhost:5005/api/chat', {
            message: "Hello",
            threadId: "test-thread-123"
        });
        console.log("Response status:", response.status);
        console.log("Response data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Test failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error message:", error.message);
        }
    }
};

testChat();

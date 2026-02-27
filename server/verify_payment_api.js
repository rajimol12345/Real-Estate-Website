const axios = require('axios');

const testPayment = async () => {
    const baseUrl = 'http://localhost:5005/api';
    let token = '';

    try {
        console.log('1. Logging in to get token...');
        const loginRes = await axios.post(`${baseUrl}/auth/login`, {
            email: 'testuser@example.com',
            password: 'password123'
        });
        token = loginRes.data.token;
        console.log('✓ Logged in');

        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        console.log('\n2. Fetching a property to book...');
        const propRes = await axios.get(`${baseUrl}/properties`);
        const property = propRes.data.properties[0];
        console.log(`✓ Selected property: ${property.title.en} (ID: ${property._id})`);

        console.log('\n3. Creating payment order...');
        const orderRes = await axios.post(`${baseUrl}/payments/create-order`, {
            propertyId: property._id,
            amount: property.price
        }, authHeader);
        const orderId = orderRes.data.orderId;
        console.log(`✓ Order created: ${orderId}`);

        console.log('\n4. Verifying payment...');
        const verifyRes = await axios.post(`${baseUrl}/payments/verify`, {
            orderId,
            paymentId: 'pay_test_12345',
            signature: 'sig_test_12345'
        }, authHeader);
        console.log('✓ Payment verified:', verifyRes.data.message);

        console.log('\n5. Checking updated property status...');
        const updatedPropRes = await axios.get(`${baseUrl}/properties/${property._id}`);
        console.log('✓ Property isBooked:', updatedPropRes.data.isBooked);

        if (updatedPropRes.data.isBooked === true) {
            console.log('\n✅ VERIFICATION SUCCESSFUL');
        } else {
            console.log('\n❌ VERIFICATION FAILED: Property not marked as booked');
        }

    } catch (error) {
        console.error('\n❌ Verification failed with error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Message:', error.message);
        }
    }
};

testPayment();

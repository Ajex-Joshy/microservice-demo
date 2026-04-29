const http = require('http');

const BASE_URL = 'http://localhost:3000/api/v1';
let authToken = '';
let userId = '';
let orderId = '';

const request = (method, path, body, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        } catch (e) {
          console.error(`Failed to parse JSON for ${res.statusCode}:`, data);
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function runTests() {
  console.log('🚀 Starting End-to-End Tests...\n');

  try {
    // 1. Register User
    console.log('1. Testing User Registration...');
    const regRes = await request('POST', '/users/register', {
      email: `test_${Date.now()}@example.com`,
      password: 'Password123!',
      name: 'Test User'
    });
    console.log('   Status:', regRes.status);
    console.log('   Body:', JSON.stringify(regRes.body, null, 2));
    if (regRes.status !== 201) throw new Error('Registration failed');
    userId = regRes.body.user.id;

    // 2. Login
    console.log('\n2. Testing Login...');
    const loginRes = await request('POST', '/users/login', {
      email: regRes.body.user.email,
      password: 'Password123!'
    });
    console.log('   Status:', loginRes.status);
    if (loginRes.status !== 200) throw new Error('Login failed');
    authToken = loginRes.body.token;
    console.log('   Token received ✅');

    // 3. Create Order
    console.log('\n3. Testing Create Order...');
    const orderRes = await request('POST', '/orders/', {
      item: 'MacBook Pro',
      quantity: 1,
      price: 1999
    }, { 'Authorization': `Bearer ${authToken}` });
    console.log('   Status:', orderRes.status);
    console.log('   Body:', JSON.stringify(orderRes.body, null, 2));
    console.log('   Correlation-ID:', orderRes.headers['x-correlation-id']);
    if (orderRes.status !== 201) throw new Error('Order creation failed');
    orderId = orderRes.body.id;

    // 4. Get Orders
    console.log('\n4. Testing Get Orders...');
    const listRes = await request('GET', '/orders/', null, { 'Authorization': `Bearer ${authToken}` });
    console.log('   Status:', listRes.status);
    console.log('   Order Count:', listRes.body.length);
    if (listRes.status !== 200) throw new Error('Get orders failed');

    // 5. Update Status (Transition Test)
    console.log('\n5. Testing Order Status Transition (PENDING -> PROCESSING)...');
    // Note: To update status, user needs to be ADMIN. We'll check if the exception is thrown correctly or if it works.
    const updateRes = await request('PATCH', `/orders/${orderId}/status`, {
      status: 'PROCESSING'
    }, { 'Authorization': `Bearer ${authToken}` });
    console.log('   Status:', updateRes.status);
    console.log('   Body:', JSON.stringify(updateRes.body, null, 2));

    // 6. Test Invalid Transition (PENDING -> SHIPPED is invalid, must go to PROCESSING first)
    console.log('\n6. Testing Invalid Transition (PENDING -> SHIPPED)...');
    const invalidRes = await request('PATCH', `/orders/${orderId}/status`, {
      status: 'SHIPPED'
    }, { 'Authorization': `Bearer ${authToken}` });
    console.log('   Status:', invalidRes.status);
    console.log('   Body:', JSON.stringify(invalidRes.body, null, 2));

    console.log('\n✨ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

runTests();

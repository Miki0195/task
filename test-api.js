#!/usr/bin/env node
import https from 'https';

const BASE_URL = 'https://test.superhero.hu';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Dynamic-Form-App/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPI() {
  console.log('Testing API endpoints...\n');
  
  try {
    console.log('Testing GET /form');
    const formResponse = await makeRequest('/form');
    console.log(`   Status: ${formResponse.status}`);
    console.log(`   Data:`, JSON.stringify(formResponse.data, null, 2));
    console.log('');

    const formFields = formResponse.data;
    const choiceFields = formFields.filter(field => field.widget === 'choice');
    
    if (choiceFields.length > 0) {
      const choiceField = choiceFields[0];
      console.log(`Testing GET /choice/${choiceField.id}`);
      const choiceResponse = await makeRequest(`/choice/${choiceField.id}`);
      console.log(`   Status: ${choiceResponse.status}`);
      console.log(`   Data:`, JSON.stringify(choiceResponse.data, null, 2));
      console.log('');
    }

    console.log('Testing POST /save');
    const sampleData = {};
    formFields.forEach(field => {
      switch (field.widget) {
        case 'integer':
          sampleData[field.id] = 42;
          break;
        case 'text':
          sampleData[field.id] = 'Sample text';
          break;
        case 'choice':
          sampleData[field.id] = 'sample-choice';
          break;
      }
    });
    
    const submitResponse = await makeRequest('/save', 'POST', sampleData);
    console.log(`   Status: ${submitResponse.status}`);
    console.log(`   Data:`, JSON.stringify(submitResponse.data, null, 2));
    console.log('');

    console.log('API testing completed!');
    
  } catch (error) {
    console.error('API testing failed:', error.message);
  }
}

testAPI();

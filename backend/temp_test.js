const axios = require('axios');
axios.post('http://localhost:5000/api/execution/run', {
  sourceCode: 'print("hello")',
  language: 'python',
  customInput: ''
})
.then(res => console.log('SUCCESS:', res.data))
.catch(err => console.log('ERROR:', err.response?.data || err.message));

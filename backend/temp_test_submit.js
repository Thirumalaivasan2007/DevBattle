const axios = require('axios');
axios.post('http://localhost:5000/api/submissions/submit', {
  sourceCode: 'print("hello")',
  language: 'python',
  problemId: '6a2f86a2e454514de90c6506', // Valid objectId, doesn't matter if it exists
  contestId: null
})
.then(res => console.log('SUCCESS:', res.data))
.catch(err => console.log('ERROR:', err.response?.data || err.message));

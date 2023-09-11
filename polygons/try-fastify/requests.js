const axios = require('axios');

axios.post('http://127.0.0.1:5000/', {
  hello: "fastify",
  didICallYou: "no"
}).then((response) => {
  const { data } = response;
  console.log(data);
});

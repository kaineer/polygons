const Fastify = require('fastify');

const fastify = Fastify({ logger: true });

fastify.addContentTypeParser(
  'application/json',
  { parseAs: 'string' },
  fastify.getDefaultJsonParser('ignore', 'ignore')
);

fastify.get('/', async (req, res) => {
  res.type('application/json').code(200);
  return { hello: "fastify" };
});

fastify.post('/', async (req, res) => {
  const body = req.body;
  console.log({ body });

  res.type('application/json').code(200);
  return ([{ foo: "bar" }]);
});

fastify.listen({ port: 5000 }, (err, address) => {
  console.log({ address });
});

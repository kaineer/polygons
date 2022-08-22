// index.js

const Joi = require("joi");
const { stringify } = require("yaml");

const { string, alternatives } = Joi.types();

// const remoteServerSchema = Joi.object({
//   server: Joi.when("protocol", { is: "remote", then: string.required() }),
//   bucket: Joi.when("protocol", { is: "s3", then: string.required() }),
//   protocol: alternatives.valid("s3", "remote").optional(),
// });

const remoteServerSchema = (base = {}) => alternatives.try(
  Joi.object({
    ...base,
    protocol: Joi.any().valid("remote").optional(),
    server: string.required(),
  }),
  Joi.object({
    ...base,
    protocol: Joi.any().valid("s3").required(),
    bucket: string.required(),
  })
);

const scheme = remoteServerSchema({
  path: string
});

const { error, value } = scheme.validate({
  protocol: "s3",
  bucket: "bucket",
  // server: "server",
  path: "string",
});

if (error) {
  console.log(stringify({error}));
} else {
  console.log(stringify({value}));
}

const { z } = require("zod");

const positiveIdString = z.string().regex(/^\d+$/, "Must be a positive integer").refine(
  (val) => parseInt(val, 10) > 0,
  { message: "Must be a positive integer" }
);

const createWebhookSchema = z.object({
  body: z.object({
    targetUrl: z.string().url(),
    secret: z.string().min(1, "Secret is required").max(255)
  }),
  params: z.object({}),
  query: z.object({})
});

const webhookIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: positiveIdString
  }),
  query: z.object({})
});

module.exports = {
  createWebhookSchema,
  webhookIdParamSchema
};

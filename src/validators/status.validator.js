const { z } = require("zod");

const positiveIdString = z.string().regex(/^\d+$/, "Must be a positive integer").refine(
  (val) => parseInt(val, 10) > 0,
  { message: "Must be a positive integer" }
);

const updateMerchantStatusSchema = z.object({
  body: z.object({
    newStatus: z.enum(["PENDING_KYB", "ACTIVE", "SUSPENDED"]),
    reason: z.string().max(500).optional()
  }),
  params: z.object({
    id: positiveIdString
  }),
  query: z.object({})
});

module.exports = {
  updateMerchantStatusSchema
};

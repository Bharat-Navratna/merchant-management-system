const { z } = require("zod");

const positiveIdString = z.string().regex(/^\d+$/, "Must be a positive integer").refine(
  (val) => parseInt(val, 10) > 0,
  { message: "Must be a positive integer" }
);

const createMerchantSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(255),
    category: z.string().min(1, "Category is required").max(100),
    city: z.string().min(1, "City is required").max(100),
    contactEmail: z.string().email(),
    pricingTier: z.string().max(50).optional()
  }),
  params: z.object({}),
  query: z.object({})
});

const updateMerchantSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(255).optional(),
      category: z.string().min(1).max(100).optional(),
      city: z.string().min(1).max(100).optional(),
      contactEmail: z.string().email().optional(),
      pricingTier: z.string().min(1).max(50).optional()
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      { message: "At least one field must be provided" }
    ),
  params: z.object({
    id: positiveIdString
  }),
  query: z.object({})
});

const listMerchantsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    status: z.string().optional(),
    city: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional()
  })
});

const merchantIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: positiveIdString
  }),
  query: z.object({})
});

module.exports = {
  createMerchantSchema,
  updateMerchantSchema,
  listMerchantsSchema,
  merchantIdParamSchema
};

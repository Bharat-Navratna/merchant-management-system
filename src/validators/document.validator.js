const { z } = require("zod");

const positiveIdString = z.string().regex(/^\d+$/, "Must be a positive integer").refine(
  (val) => parseInt(val, 10) > 0,
  { message: "Must be a positive integer" }
);

const uploadDocumentSchema = z.object({
  body: z.object({
    type: z.enum(["BUSINESS_REGISTRATION", "OWNER_IDENTITY", "BANK_ACCOUNT_PROOF"]),
    fileUrl: z.string().url()
  }),
  params: z.object({
    merchantId: positiveIdString
  }),
  query: z.object({})
});

const verifyDocumentSchema = z.object({
  body: z.object({}),
  params: z.object({
    merchantId: positiveIdString,
    documentId: positiveIdString
  }),
  query: z.object({})
});

const merchantDocumentsParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    merchantId: positiveIdString
  }),
  query: z.object({})
});

module.exports = {
  uploadDocumentSchema,
  verifyDocumentSchema,
  merchantDocumentsParamSchema
};

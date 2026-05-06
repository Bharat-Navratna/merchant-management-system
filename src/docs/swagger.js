const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fintech Merchant API",
      version: "1.0.0",
      description: `REST API for merchant onboarding with KYB (Know Your Business) verification.

**KYB Workflow:**
1. Create a merchant — starts in \`PENDING_KYB\` status
2. Upload the three required documents: \`BUSINESS_REGISTRATION\`, \`OWNER_IDENTITY\`, \`BANK_ACCOUNT_PROOF\`
3. An operator verifies each document
4. Once all three documents are verified, the merchant can be transitioned to \`ACTIVE\`
5. Active merchants can be \`SUSPENDED\` and re-activated as needed

**Authentication:** All protected routes require a JWT Bearer token obtained via \`POST /auth/login\`.
Tokens expire in 15 minutes; use \`POST /auth/refresh\` to obtain a new pair.`
    },
    servers: [
      {
        url: process.env.API_URL || `http://localhost:${process.env.PORT || 3001}/api`,
        description: "API server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" }
          }
        },
        Operator: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["ADMIN", "OPERATOR"] }
          }
        },
        AuthTokens: {
          type: "object",
          properties: {
            operator: { $ref: "#/components/schemas/Operator" },
            accessToken: { type: "string" },
            refreshToken: { type: "string" }
          }
        },
        Merchant: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            category: { type: "string" },
            city: { type: "string" },
            contact_email: { type: "string", format: "email" },
            pricing_tier: { type: "string", example: "STANDARD" },
            status: {
              type: "string",
              enum: ["PENDING_KYB", "ACTIVE", "SUSPENDED"]
            },
            created_by: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        },
        MerchantDocument: {
          type: "object",
          properties: {
            id: { type: "integer" },
            merchant_id: { type: "integer" },
            document_type: {
              type: "string",
              enum: ["BUSINESS_REGISTRATION", "OWNER_IDENTITY", "BANK_ACCOUNT_PROOF"]
            },
            document_reference: { type: "string", format: "uri" },
            is_uploaded: { type: "boolean" },
            is_verified: { type: "boolean" },
            uploaded_at: { type: "string", format: "date-time" },
            verified_at: { type: "string", format: "date-time", nullable: true }
          }
        },
        WebhookSubscription: {
          type: "object",
          properties: {
            id: { type: "integer" },
            target_url: { type: "string", format: "uri" },
            secret: { type: "string" },
            is_active: { type: "boolean" },
            created_at: { type: "string", format: "date-time" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsdoc(options);

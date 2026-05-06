const request = require("supertest");
const app = require("../src/app");

describe("GET /api/health", () => {
  it("should return 200 with server status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Server is running"
    });
  });
});

describe("GET /api-docs", () => {
  it("should serve Swagger UI", async () => {
    const response = await request(app).get("/api-docs/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Swagger UI");
  });
});

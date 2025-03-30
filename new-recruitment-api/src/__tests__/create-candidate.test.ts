import request from "supertest";
import { Application } from "express";
import { setupApp } from "../app";
import { setupDb } from "../db";

describe("Create Candidate", () => {
  let app: Application;
  let db: any;
  beforeAll(async () => {
    app = await setupApp();
    db = await setupDb();
  });

  it("should create a new candidate successfully", async () => {
    const newDate = new Date().toISOString();
    const response = await request(app)
      .post("/api/candidates")
      .set("x-api-key", "0194ec39-4437-7c7f-b720-7cd7b2c8d7f4")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "9876543210",
        experience: 5,
        notes: "A strong candidate with great experience.",
        status: "nowy",
        consentDate: newDate,
      });
    expect(response.status).toBe(201);
  });
  it("should return all users", async () => {
    const response = await request(app).get("/api/candidates");
    expect(response.status).toBe(200);
  });
});

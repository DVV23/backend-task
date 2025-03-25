import request from "supertest";
import { Application } from "express";
import { setupApp } from "../app";

describe("Create Candidate", () => {
  let app: Application;

  beforeAll(async () => {
    app = await setupApp();
  });

  it("should create a new candidate successfully", async () => {
    const response = await request(app).post("/api/candidates").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "123-456-7890",
      yearsOfExperience: 5,
      recruiterNotes: "A strong candidate with great experience.",
      recruitmentStatus: "nowy",
      consentDate: "2025-03-25",
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User successfuly saved to Legacy DB");
  });
  it("should return an error if email already exists", async () => {
    const existingCandidate = {
      firstName: "Jane",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "987-654-3210",
      experience: 3,
      notes: "Another candidate with same email.",
      status: "nowy",
      consentDate: "2025-03-25T00:00:00Z",
    };

    const response = await request(app)
      .post("/api/candidates")
      .send(existingCandidate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body.error).toBe("Email should be unique.");
  });
});

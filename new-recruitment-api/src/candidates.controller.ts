import { Request, Response, Router, response } from "express";
import { newCandidateSchema } from "./utils/newCandidateValidation";
import { setupDb } from "./db";
import { createCandidate } from "./utils/sendDataToLegacy";
import getCandidates from "./utils/getCandidates";

export class CandidatesController {
  readonly router = Router();

  constructor() {
    this.router.get("/candidates", this.getAll.bind(this));
    this.router.post("/candidates", this.create.bind(this));
  }

  async getAll(req: Request, res: Response) {
    try {
      const database = await setupDb();
      const { page = "1", limit = "100" } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const candidates = await getCandidates(database, Number(limit), offset);

      if (!candidates) {
        throw new Error("No candidates found.");
      }
      res.status(201).json({
        data: candidates,
        length: candidates.length,
        message: "List of candidates",
      });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { error } = newCandidateSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error?.details[0]?.message });
      }
      const dataBase = await setupDb();
      const {
        firstName,
        lastName,
        email,
        phone,
        experience,
        notes,
        status,
        consentDate,
      } = req.body;
      const uniqueEmail = await dataBase.get(
        "SELECT * FROM Candidate WHERE email = ?",
        [email]
      );
      if (!uniqueEmail) {
        throw new Error("Email should be unique.");
      }
      const createdAt = new Date().toISOString();
      const randomJobOffer = await dataBase.get(
        "SELECT * FROM JobOffer ORDER BY RANDOM() LIMIT 1"
      );
      await dataBase.run(
        `INSERT INTO candidates (firstName, lastName, email, phone, experience, notes, status, consentDate,createdAt, jobOffers) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          firstName,
          lastName,
          email,
          phone,
          experience,
          notes,
          status,
          consentDate,
          createdAt,
          randomJobOffer,
        ]
      );
      const candidateData = {
        firstName,
        lastName,
        email,
        phone,
        experience,
        notes,
        status,
        consentDate,
        createdAt,
        randomJobOffer,
      };
      const userSaved = await createCandidate(candidateData);
      if (userSaved) {
        return response
          .status(201)
          .json({ message: "User successfuly saved to Legacy DB" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

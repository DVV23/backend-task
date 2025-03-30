import { Request, Response, Router, response } from "express";
import { newCandidateSchema } from "./utils/newCandidateValidation";
import { setupDb } from "./db";
import { createCandidate } from "./utils/sendDataToLegacy";
import getCandidates from "./utils/getCandidates";
import { error } from "console";

export class CandidatesController {
  readonly router = Router();
  private database: any;
  constructor() {
    this.router.get("/candidates", this.getAll.bind(this));
    this.router.post("/candidates", this.create.bind(this));
    this.initializeDbOnce();
  }
  async initializeDbOnce() {
    this.database = await setupDb();
  }
  async getAll(req: Request, res: Response) {
    try {
      const { page = "1", limit = "100" } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const candidates = await getCandidates(
        this.database,
        Number(limit),
        offset
      );

      if (!candidates) {
        throw new Error("No candidates found.");
      }
      res.status(200).json({
        data: candidates,
        length: candidates.length,
        message: "List of candidates",
      });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async create(req: Request, res: Response) {
    if (!req.headers["x-api-key"]) {
      return res.status(400).json({ error: "API key is not defined" });
    }
    try {
      const { error } = newCandidateSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error?.details[0]?.message });
      }
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
      const uniqueEmail = await this.database.all(
        "SELECT * FROM Candidate WHERE email = ?",
        [email]
      );
      if (!uniqueEmail) {
        return res.status(400).json({ error: "Email should be unique" });
      }
      const createdAt = new Date().toISOString();
      const randomJobOffer = await this.database.get(
        "SELECT id FROM JobOffer ORDER BY RANDOM() LIMIT 1"
      );
      const jobOfferIdentificator = randomJobOffer ? randomJobOffer.id : null;
      await this.database.run(
        `INSERT INTO Candidate (firstName, lastName, email, phoneNumber, yearsOfExperience, recruiterNotes, recruitmentStatus, consentDate,createdAt, jobOffer) 
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
          jobOfferIdentificator,
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
        jobOfferIdentificator,
      };
      const userSaved = await createCandidate(candidateData, req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

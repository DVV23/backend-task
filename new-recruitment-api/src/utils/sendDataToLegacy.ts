import { Request, Response } from "express";

export type TCandidateData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  notes: string;
  status: StatusType;
  consentDate: Date;
  createdAt: string;
  jobOfferIdentificator: string | string[];
};

type StatusType = "nowy" | "w trakcie rozmów" | "zaakceptowany" | "odrzucony";

export const createCandidate = async (
  candidateData: TCandidateData,
  req: Request,
  res: Response
) => {
  const {
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
  } = candidateData;

  try {
    const response = await fetch("http://localhost:4040/candidates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "0194ec39-4437-7c7f-b720-7cd7b2c8d7f4",
      },
      body: JSON.stringify({
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
      }),
    });

    if (!response.ok) {
      return res.status(400).json({ error: "Email should be unique" });
    }

    const data = await response.json();
    if (data) {
      return res.status(201).json({ message: data });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error while creating a candidate:" });
  }
};

import { Database } from "sqlite";

export default async function getCandidates(
  database: Database,
  limit: number,
  offset: number
) {
  const candidates = await database.all(
    `SELECT 
      Candidate.id AS candidateId, 
      Candidate.firstName, 
      Candidate.lastName, 
      Candidate.email, 
      Candidate.phoneNumber, 
      Candidate.yearsOfExperience, 
      Candidate.recruiterNotes, 
      Candidate.recruitmentStatus, 
      Candidate.consentDate, 
      Candidate.createdAt, 
      Candidate.jobOffer AS jobOfferId,
      JobOffer.title AS jobOfferTitle, 
      JobOffer.description AS jobOfferDescription,
      JobOffer.salary_range AS jobOfferSalary,
      JobOffer.location AS jobOfferLocation,
      JobOffer.created_at AS jobOfferCreatedAt
    FROM Candidate
    LEFT JOIN JobOffer ON Candidate.jobOffer = JobOffer.id
    ORDER BY Candidate.createdAt DESC
    LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return candidates;
}

import { Database } from "sqlite";

export default async function getCandidates(
  database: Database,
  limit: number,
  offset: number
) {
  const candidates = await database.all(
    `SELECT * FROM Candidate LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return candidates;
}

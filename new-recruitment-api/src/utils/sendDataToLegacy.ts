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
  randomJobOffer: string | string[];
};

type StatusType = "nowy" | "w trakcie rozmów" | "zaakceptowany" | "odrzucony";

export const createCandidate = async (candidateData: TCandidateData) => {
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
    randomJobOffer,
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
        randomJobOffer,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while creating a candidate:", error);
  }
};

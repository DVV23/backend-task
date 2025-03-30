import Joi from "joi";

export const newCandidateSchema = Joi.object({
  firstName: Joi.string().min(2).max(40).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\d{9,15}$/)
    .required(),
  experience: Joi.number().integer().min(0).required(),
  notes: Joi.string().allow(""),
  status: Joi.string()
    .valid("nowy", "w trakcie rozmów", "zaakceptowany", "odrzucony")
    .default("nowy"),
  consentDate: Joi.date().iso(),
});

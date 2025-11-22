import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details[0].message,
      });
      return;
    }

    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, { convert: true });

    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details[0].message,
      });
      return;
    }

    req.query = value;

    next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number",
    }),
  phone: Joi.string()
    .pattern(/^[\+]?[0-9][\d]{0,15}$/)
    .optional(),
  address: Joi.string().max(500).optional(),
  dateOfBirth: Joi.date().iso().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string()
    .pattern(/^[\+]?[0-9][\d]{0,15}$/)
    .optional()
    .allow(""),
  address: Joi.string().max(500).optional().allow(""),
  dateOfBirth: Joi.date().iso().optional(),
  gender: Joi.string().valid("male", "female", "other").optional().allow(""),
});

// Password Reset Validation Schemas
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number",
    }),
});

export const contactMessageSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(1000).required(),
});

export const getUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  search: Joi.string().max(100).optional(),
  isActive: Joi.boolean().optional(),
});

export const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number'
    })
});

export const changeEmailSchema = Joi.object({
  email: Joi.string().email().required()
});

// Review Validation Schemas
// Note: tourId is in URL params, not in body
export const createTourReviewSchema = Joi.object({
  rate: Joi.number().integer().min(1).max(5).required(),
  content: Joi.string().min(10).max(2000).required(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional().default([]),
});

export const updateTourReviewSchema = Joi.object({
  rate: Joi.number().integer().min(1).max(5).optional(),
  content: Joi.string().min(10).max(2000).optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
});

// Note: attractionId is in URL params, not in body
export const createAttractionReviewSchema = Joi.object({
  rate: Joi.number().integer().min(1).max(5).required(),
  content: Joi.string().min(10).max(2000).required(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional().default([]),
});

export const updateAttractionReviewSchema = Joi.object({
  rate: Joi.number().integer().min(1).max(5).optional(),
  content: Joi.string().min(10).max(2000).optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
});

export const toggleFavoriteTourSchema = Joi.object({
  tourId: Joi.string().uuid().required().messages({
    'string.uuid': '"tourId" must be a valid UUID',
    'any.required': '"tourId" is required',
  }),
});

export const getReviewsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sortBy: Joi.string().valid('createdAt', 'rate').optional(),
  order: Joi.string().valid('asc', 'desc').optional(),
});
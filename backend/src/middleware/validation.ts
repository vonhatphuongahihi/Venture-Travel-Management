import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body);

        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.details[0].message
            });
            return;
        }

        next();
    };
};

// Validation schemas
export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/).required()
        .messages({
            'string.pattern.base': 'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number'
        }),
    phone: Joi.string().pattern(/^[\+]?[0-9][\d]{0,15}$/).optional(),
    address: Joi.string().max(500).optional(),
    date_of_birth: Joi.date().iso().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const verifyEmailSchema = Joi.object({
    token: Joi.string().required()
});

export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^[\+]?[0-9][\d]{0,15}$/).optional().allow(''),
    address: Joi.string().max(500).optional().allow(''),
    date_of_birth: Joi.date().iso().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional().allow('')
});

// Password Reset Validation Schemas
export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/).required()
        .messages({
            'string.pattern.base': 'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number'
        })
});

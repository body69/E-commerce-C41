import joi from "joi";
import generalFields from "../../utils/generalFields.js";

export const getCategorySchema=joi.object({
    categoryId:generalFields.id
}).required()

export const createCategorySchema=joi.object({
    name:joi.string().max(20).min(3).trim().required(),
    file:generalFields.file
}).required()

export const updatecategorySchema=joi.object({
    authorization:joi.string().required(),
    name:joi.string().max(20).min(3).trim(),
    categoryId:generalFields.id,
    file:generalFields.file
}).required()

export const tokenSchema=joi.object({
    authorization:joi.string().required()
}).required()
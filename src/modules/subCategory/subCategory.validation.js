import joi from "joi";
import generalFields from "../../utils/generalFields.js";
// import {generalFields} from "../../utils/generalFields.js"
export const getSubCategorySchema=joi.object({
    subCategoryId:generalFields.id
}).required()

export const createSubCategorySchema=joi.object({
    name:joi.string().max(20).min(3).trim().required(),
    file:generalFields.file,
    categoryId:generalFields.id

}).required()

export const updateSubCategorySchema=joi.object({
    subCategoryId:generalFields.id,
    name:joi.string().max(20).min(3).trim(),
    file:generalFields.file
}).required()

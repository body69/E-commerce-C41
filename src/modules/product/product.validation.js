import joi from "joi";
import generalFields from "../../utils/generalFields.js";


export const tokenSchema=joi.object({
    authorization:joi.string().required()
}).required()

export const createProductSchema=joi.object({
    name:joi.string().min(5).max(35).required(),
    description:joi.string().min(5).max(500),
    price:joi.number().positive().min(1).required(),
    discount:joi.number().positive(),
    stock:joi.number().positive().integer().min(1).required(),
    color:joi.array(),
    size:joi.array(),
    files:joi.object({
        mainImage:joi.array().items(generalFields.file.required()).length(1).required(),
        subImage:joi.array().items(generalFields.file.required()).min(1).max(5),
    }).required(),
    categoryId:generalFields.id,
    subCategoryId:generalFields.id,
    brandId:generalFields.id,
}).required()

export const updateProductSchema=joi.object({
    name:joi.string().min(5).max(35),
    description:joi.string().min(5).max(500),
    price:joi.number().positive().min(1),
    discount:joi.number().positive(),
    stock:joi.number().positive().integer().min(1),
    color:joi.array(),
    size:joi.array(),
    files:joi.object({
        mainImage:joi.array().items(generalFields.file.required()).length(1),
        subImage:joi.array().items(generalFields.file.required()).min(1).max(5),
    }),
    productId:generalFields.id,
    subCategoryId:generalFields._id,
    brandId:generalFields._id,
}).required()

export const OneProductSchema=joi.object({
    productId:generalFields.id,
}).required()

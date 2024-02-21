import joi from 'joi'
import generalFields from '../../utils/generalFields.js'

export const tokenSchema=joi.object({
    authorization:joi.string().required()
}).required()

export const createOrderSchema=joi.object({
    address:joi.string().required(),
    phone:joi.array().items(joi.string().required()),
    paymentType:joi.string().valid('card','cash').required(),
    note:joi.string().min(20),
    couponName:joi.string().min(2).max(30).trim(),
    products:joi.array().items(joi.object({
        productId:generalFields._id,
        quantity:joi.number().min(1).positive().integer().required()
    }).required())
}).required()

export const cancelOrderSchema=joi.object({
    orderId:generalFields.id
}).required()
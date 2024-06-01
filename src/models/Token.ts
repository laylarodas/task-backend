import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createdAt: Date
}

const tokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        expires: 3600
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token
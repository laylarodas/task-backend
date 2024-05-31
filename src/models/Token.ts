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
    userId: {
        type: Types.ObjectId,
        ref: 'User'
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        expires: "1d" 
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token
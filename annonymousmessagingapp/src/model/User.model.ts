import mongoose, {Schema, Document, } from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date
}
// Upr waala jo code hai woh TS mein likha hua hai isliye string kaa s small hai
// Niche waala jo code hai woh mongoose ka hai isliye string kaa s capital hai
// There's no difference bss style of writing different hai

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[]

}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        match: [/.+\@.+\..+/,'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true,"Password is required"],
    },
    verifyCode: {
        required: [true,"Verify code is required"]
       
    },
    isVerified: {
        default: false
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true,"Verify code expiry is required"]
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true,
    },
    message: [MessageSchema]

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;
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
// The above code is the message blueprint which tells us about how the message will look like

export interface User extends Document{
    username: string
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[] // This means array of messages which means that user can send more than one messages

}
//The above code is nothing just a blueprint for how the users should look like

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
        type: String,
        required: [true,"Verify code is required"]
       
    },
    isVerified: {
        type: Boolean,
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
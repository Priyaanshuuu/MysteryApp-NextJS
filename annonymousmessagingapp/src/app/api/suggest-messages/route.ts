import OpenAI from "openai";
import {OpenAIStream, StreamingTextResponse} from 'ai'

const openai = new OpenAI({
    apiKey : process.env.OPENAI_KEY
})

export const runtime = 'edge';

export async function POST(req:Request) {
try {
    const prompt = ""

    
    const response = await openai.chat.completions.create({
        model:'gpt-3.5-turbo-instruct',
        max_tokens:400,
        stream: true,
        prompt,
    })
    
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
} catch (error) {
    if (error instanceof OpenAI.APIError){
        const {name,status,headers,message},
        {status}
    }
    else{
        console.error("An unexpected error happend",error)
              throw error
    }
           
       
    
}
    
}
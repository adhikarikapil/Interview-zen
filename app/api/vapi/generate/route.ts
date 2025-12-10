import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/app/firebase/admin";

export async function GET() {
  return Response.json({ success: true, data: "Thank You!" }, { status: 200 });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  // Check if API key is configured
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set");
    return Response.json({ 
      success: false, 
      error: {
        name: "ConfigurationError",
        message: "Google AI API key is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY environment variable."
      }
    }, { status: 500 });
  }

  // Log API key info for debugging (first 10 chars only for security)
  const apiKeyPreview = process.env.GOOGLE_GENERATIVE_AI_API_KEY.substring(0, 10) + "...";
  console.log("Using Google AI API key:", apiKeyPreview);

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should be towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]

        Thank you!
`,
    });

        const interview = {
            role, type, level,
            techstack: techstack.split(','),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            createdAt: new Date().toISOString()
        }

        await db.collection('interviews').add(interview)
        return Response.json({success: true}, {status: 200})

  } catch (error) {
    console.error("Error generating interview questions:", error);
    
    }
}

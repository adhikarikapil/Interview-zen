import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/app/firebase/admin";

export async function GET() {
  return Response.json({ success: true, data: "Thank You!" }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const { type, role, level, techstack, amount, userid } =
      await request.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error(
        "GOOGLE_GENERATIVE_AI_API_KEY enviornment variable is not set.",
      );
      return Response.json(
        {
          success: false,
          error: {
            name: "ConfigurationError",
            message: "Google AI API key is not configured.",
          },
        },
        { status: 500 },
      );
    }

    let questionsText;

    try {
      const { text } = await generateText({
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
      questionsText = text;
    } catch (googleError: any) {
      console.error("GOOGLE ERROR:", googleError);
      const googleMessage =
        googleError?.lastError?.message ||
        googleError?.message ||
        "Google API error";

      return Response.json(
        {
          success: false,
          error: {
            name: "GoogleAPIError",
            message: googleMessage,
            statusCode: googleError?.statusCode || 429,
          },
        },
        { status: googleError?.statusCode || 429 },
      );
    }

    const questions = JSON.parse(questionsText);
    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: questions,
      userId: userid,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);
    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error generating interview questions:", error);

    return Response.json(
      {
        success: false,
        error: {
          name: error?.name || "GenerationError",
          message: error?.message || "Failed to generate interview questions",
          statusCode: error?.statusCode || 500,
        },
      },
      { status: 500 },
    );
  }
}

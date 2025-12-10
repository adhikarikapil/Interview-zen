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
      // Use a currently supported model id for v1beta
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

        // Storing these questions to db
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
    
    // Extract meaningful error information
    const errorObj = error as {
      name?: string;
      message?: string;
      reason?: string;
      cause?: { reason?: string };
      statusCode?: number;
      response?: { status?: number };
      errors?: Array<{
        name?: string;
        statusCode?: number;
        responseBody?: string;
        message?: string;
      }>;
      lastError?: {
        name?: string;
        message?: string;
        statusCode?: number;
        responseBody?: string;
      };
    };

    // Try to extract quota error details from responseBody
    let quotaError: { message?: string; retryAfter?: string } | undefined;
    
    if (errorObj?.lastError?.responseBody) {
      try {
        const parsed = JSON.parse(errorObj.lastError.responseBody);
        if (parsed?.error?.code === 429) {
          quotaError = {
            message: parsed.error.message || "Quota exceeded",
            retryAfter: parsed.error.details?.find((d: { "@type"?: string; retryDelay?: string }) => 
              d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
            )?.retryDelay,
          };
        }
      } catch {
        // Ignore parsing errors
      }
    }

    // Check errors array for quota issues
    if (!quotaError && errorObj?.errors) {
      for (const err of errorObj.errors) {
        const apiError = err as { responseBody?: string; statusCode?: number };
        if (apiError?.statusCode === 429 && apiError?.responseBody) {
          try {
            const parsed = JSON.parse(apiError.responseBody);
            if (parsed?.error?.code === 429) {
              quotaError = {
                message: parsed.error.message || "Quota exceeded",
                retryAfter: parsed.error.details?.find((d: { "@type"?: string; retryDelay?: string }) => 
                  d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
                )?.retryDelay,
              };
              break;
            }
          } catch {
            // Ignore parsing errors
          }
        }
      }
    }

    const errorDetails = {
      name: errorObj?.name || "UnknownError",
      message: quotaError?.message || errorObj?.message || "An unknown error occurred",
      reason: errorObj?.reason || errorObj?.cause?.reason || undefined,
      statusCode: errorObj?.lastError?.statusCode || errorObj?.statusCode || errorObj?.response?.status || undefined,
      isQuotaError: !!quotaError,
      retryAfter: quotaError?.retryAfter,
      errors: errorObj?.errors?.map((err) => ({
        name: (err as { name?: string }).name,
        statusCode: (err as { statusCode?: number }).statusCode,
      })),
      lastError: errorObj?.lastError ? {
        name: errorObj.lastError.name,
        message: errorObj.lastError.message,
        statusCode: errorObj.lastError.statusCode,
      } : undefined,
    };

    // Return appropriate status code for quota errors
    const statusCode = errorDetails.statusCode === 429 ? 429 : 500;

    return Response.json({ 
      success: false, 
      error: errorDetails 
    }, { status: statusCode });
  }
}

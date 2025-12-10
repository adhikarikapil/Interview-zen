"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Image from "next/image";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";

const roleOptions = ["Senior", "Junior", "Intern"];
const typeOptions = [
  "technical",
  "behavioral",
  "mixed between technical and behaviroul",
];

const interviewFormSchema = z.object({
  role: z.string().min(1),
  level: z.string().min(1),
  type: z.string().min(1),
  techstack: z.string().min(1),
  amount: z.string().min(1),
});

type FormType = z.infer<typeof interviewFormSchema>;

const TakeInterview = ({ userName, userId }: AgentProps) => {
  const route = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      role: "",
      level: "",
      type: "",
      techstack: "",
      amount: "",
    },
  });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("Api Url is missing. Did you set the correct api url?");
    }
    
  const onSubmit = async (data: FormType) => {
    try {
      const payload = {
        ...data,
        userid: userId,
      };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      
      if (responseData?.success) {
        toast.success("Interview Generation successfull.");
        route.push("/");
      } else {
        // Handle API errors with detailed messages
        const error = responseData?.error;
        let errorMessage = error?.message || error?.name || "Failed to generate interview questions";
        
        // Special handling for quota errors
        if (error?.isQuotaError || error?.statusCode === 429) {
          errorMessage = "API quota exceeded. ";
          if (error?.retryAfter) {
            const retrySeconds = Math.ceil(parseFloat(error.retryAfter.replace("s", "")));
            errorMessage += `Please try again in ${retrySeconds} seconds. `;
          }
          errorMessage += "You may need to check your Google AI API quota limits or upgrade your plan.";
        }
        
        const errorReason = error?.reason && !error?.isQuotaError
          ? ` (${error.reason})` 
          : "";
        console.error("API Error:", error);
        toast.error(`${errorMessage}${errorReason}`);
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      toast.error(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="card-border lg:min-w-[566px] ">
          <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
              <Image src="/logo.svg" alt="logo" height={32} width={38} />
              <h2 className="text-primary-100">Generate Your Interview</h2>
            </div>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full mt-4 form"
              >
                <FormField
                  control={form.control}
                  name="techstack"
                  label="TechStack"
                  placeholder="What are the techstack of your Interviewe?"
                />
                <FormField
                  control={form.control}
                  name="amount"
                  label="Amount"
                  placeholder="How many question do you like to prepare?"
                />
                <FormField
                  control={form.control}
                  name="role"
                  label="Role"
                                    placeholder="In which role are you applying?"
                />
                <FormField
                  control={form.control}
                  name="type"
                  label="Type"
                  type="select"
                  options={typeOptions}
                />
                <FormField
                  control={form.control}
                  name="level"
                  label="Level"
                  type="select"
                  options={roleOptions}
                />
                <Button
                  type="submit"
                  className="btn"
                >
                  Generate
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default TakeInterview;

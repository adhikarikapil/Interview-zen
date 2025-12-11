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
      let responseData = null;
      try {
        responseData = await response.json();
      } catch (error) {
        console.warn("Response had no JSON body", error);
      }
      if (!response.ok) {
        const errorMessage =
          responseData?.error?.message ?? "Failed to generate interview";
        toast.error(errorMessage);
        return;
      }

      console.log("Success: ", responseData);
      toast.success("Interview generation successfull.");
      route.push("/");
    } catch (error: any) {
      console.error("Error generating interview questions: ", error);
      toast.error("Error: ", error);
      return Response.json(
        {
          success: false,
          error: {
            name: error?.name || "GenerationError",
            message: error?.message || "Failed to generate interview questions",
            statusCode: error?.statusCode || 500,
            reason: error?.reason || "unknown",
          },
        },
        { status: error?.statusCode || 500 },
      );
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
                <Button type="submit" className="btn">
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

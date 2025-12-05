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

const Agent = ({ userName, userId }: AgentProps) => {
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

  const onSubmit = async (data: FormType) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const payload = {
      ...data,
      userid: userId,
    };
    if (!apiUrl) {
      throw new Error("Api Url is missing. Did you set the correct api url?");
    }
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const responseData = await response.json();
    console.log(responseData);
    try {
      if (responseData?.success) {
        toast.success("Interview Generation successfull.");
        route.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(`There is an error: ${error}`);
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

export default Agent;

// import { cn } from "@/utils";
// import Image from "next/image";
//
// enum CallStatus {
//   INACTIVE = "INACTIVE",
//   CONNECTING = "CONNECTING",
//   ACTIVE = "ACTIVE",
//   FINISHED = "FINISHED",
// }
//
// const Agent = ({ userName, userId, type }: AgentProps) => {
//   const callStatus = CallStatus.ACTIVE;
//   const isSpeaking = true;
//   const messages = [
//     "What's your name?",
//     "My name is Kapil Adhikari, nice to meet you!",
//   ];
//   const lastMessage = messages[messages.length - 1];
//
//   return (
//     <>
//       <div className="call-view">
//         <div className="card-interviewer">
//           <div className="avatar">
//             <Image
//               src="/ai-avatar.png"
//               alt="ai avatar"
//               width={65}
//               height={54}
//               className="object-cover"
//             />
//             {isSpeaking && <span className="animate-speak" />}
//           </div>
//           <h3>AI Interviewer</h3>
//         </div>
//         <div className="card-border">
//           <div className="card-content">
//             <Image
//               src="/user-avatar.png"
//               alt="User avatar"
//               width={540}
//               height={540}
//               className="rounded-full object-cover size-[120px]"
//             />
//             <h3>{userName}</h3>
//           </div>
//         </div>
//       </div>
//       {messages.length > 0 && (
//         <div className="transcript-border">
//           <div className="transcript">
//             <p
//               key={lastMessage}
//               className={cn(
//                 "transition-opacity duration-500 opacity-0",
//                 "animate-fadeIn opacity-100",
//               )}
//             >
//               {lastMessage}
//             </p>
//           </div>
//         </div>
//       )}
//       <div className="w-full flex justify-center">
//         {callStatus !== "ACTIVE" ? (
//           <button className="relative btn-call">
//             <span
//               className={cn(
//                 "absolute animate-ping rounded-full opacity-75",
//                 callStatus !== "CONNECTING" && "hidden",
//               )}
//             />
//             <span>
//               {callStatus == "INACTIVE" || callStatus == "FINISHED"
//                 ? "Call"
//                 : "..."}
//             </span>
//           </button>
//         ) : (
//           <>
//             <button className="btn-disconnect">End</button>
//           </>
//         )}
//       </div>
//     </>
//   );
// };
//
// export default Agent;
//
//
//

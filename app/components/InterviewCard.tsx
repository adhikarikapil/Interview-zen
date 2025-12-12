import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";
import { getCurrentUser, getUserByUserId } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { cn } from "@/lib/utils";
    

const InterviewCard = async ({
  id: interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback = userId && interviewId
    ? await getFeedbackByInterviewId({ interviewId, userId })
    : null;


  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    const badgeColor = {
        Behavioral: "bg-light-400",
        Mixed: "bg-light-600",
        Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600"
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now(),
  ).format("MMM D, YYYY");

  const currentUser = await getCurrentUser();
  if (!userId || !currentUser?.id) return null;

    const interviewOwner = await getUserByUserId(userId!)

    let isOwner = false
    if(currentUser === interviewOwner) {
        isOwner = true
    }

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className={cn("absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600", badgeColor)}>
            <p className="badge-text">{normalizedType}</p>
          </div>
          {isOwner ? (
            <div className="flex flex-row items-center space-x-7">
              <Image
                src="/mic.svg"
                alt="cover image"
                width={90}
                height={90}
                className="rounded-full object-git size-[90px]"
              />
              <div className="flex flex-row gap-2 items-center">
                <Image src="/star.svg" alt="star" width={22} height={22} />
                <h2>
                  <p>{feedback?.totalScore || "---"}/100</p>
                </h2>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center space-x-4">
              <Image
                src="/mic.svg"
                alt="cover image"
                width={90}
                height={90}
                className="rounded-full object-git size-[90px]"
              />
              <div className="text-lg">Created by: {interviewOwner?.name || "NA"}</div>
            </div>
          )}
          <h3 className="mt-5 capitalized">{role} Interview</h3>
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                alt="calendar"
                width={22}
                height={22}
              />
              <p>{formattedDate}</p>
            </div>
            {isOwner ? (
              <div></div>
            ) : (
              <div className="flex flex-row gap-2 items-center">
                <Image src="/star.svg" alt="star" width={22} height={22} />
                <p>{feedback?.totalScore || "---"}/100</p>
              </div>
            )}
          </div>
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken the interview yet. Take it now to improve your skills."}
          </p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <DisplayTechIcons techStack={techstack} />
          <div className="flex flex-col gap-2">
            <Button className="btn-primary">
              <Link
                href={
                  feedback
                    ? `/interview/${interviewId}/feedback`
                    : `/interview/${interviewId}`
                }
              >
                {feedback ? "Check Feedback" : "Take Interview"}
              </Link>
            </Button>
            {feedback && (
              <Button className="btn-secondary">
                <Link href={`/interview/${interviewId}`}>
                  Retake Interview
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;

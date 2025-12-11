import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";
import { getCurrentUser, getUserByUserId } from "@/lib/actions/auth.action";
 
    

const InterviewCard = async ({
  id: interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback = null as Feedback | null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
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
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
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
        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />
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
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;

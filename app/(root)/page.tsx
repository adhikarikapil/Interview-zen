import { Button } from "@/components/ui/button";
import { dummyInterviews, interviewCovers } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import InterviewCard from "../components/InterviewCard";
import {
  getCurrentUser,
  getInterviewByUserId,
  getLatestInterviews,
  getUserByUserId,
} from "@/lib/actions/auth.action";

const page = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("No current user found.");
  }
  // Parallel Request
  const [userInterview, latestInterview] = await Promise.all([
    await getInterviewByUserId(currentUser?.id),
    await getLatestInterviews({ userId: currentUser?.id! }),
  ]);

  let hasPastInterview = false;
  if (userInterview && userInterview?.length > 0) {
    hasPastInterview = true;
  }
  let hasLatestInterview = false;
  if (latestInterview && latestInterview?.length > 0) {
    hasLatestInterview = true;
  }

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice on real interview questions & get instant feedback.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterview ? (
            userInterview?.map((interview) => (
              <InterviewCard
                {...interview}
                key={interview.id}
                userId={interview?.userId}
              />
            ))
          ) : (
            <p>You haven&apos;t generated any interview yet. </p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {hasLatestInterview ? (
            latestInterview?.map((interview) => (
              <InterviewCard
                {...interview}
                key={interview.id}
                userId={interview?.userId}
              />
            ))
          ) : (
            <p>You have&apos;t taken any interviews yet.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;

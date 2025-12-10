import TakeInterview from "@/app/components/TakeInterview";

import { getCurrentUser } from "@/lib/actions/auth.action";

const page = async() => {
    const currentUser = await getCurrentUser()
  return (
    <>
            <h3>Interview Generation</h3>
            <TakeInterview userName={currentUser?.name} userId={currentUser?.id} />
    </>
  );
};

export default page;

import Agent from "@/app/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const page = async() => {
    const currentUser = await getCurrentUser()
  return (
    <>
            <h3>Interview Generation</h3>
            <Agent userName={currentUser?.name} userId={currentUser?.id} />
    </>
  );
};

export default page;

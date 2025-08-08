import { ROUTES } from "@/lib/routes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.workspaceSlug) {
    redirect(ROUTES.WORKSPACE_ALL_DOCS(session.workspaceSlug));
  }

  redirect(ROUTES.LOGIN);
}

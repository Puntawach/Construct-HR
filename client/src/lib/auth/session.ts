import { redirect } from "next/navigation";
import { auth } from "./auth";
import z from "zod";

const currentUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  accessToken: z.string(),
  avatarUrl: z.string().nullable(),
  role: z.enum(["ADMIN", "WORKER", "LEADER", "SUPER_ADMIN"]),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;

export const getCurrentUser = async () => {
  const session = await auth();
  if (!session) redirect("/login");

  const { success, data, error } = currentUserSchema.safeParse(session.user);

  if (!success) {
    console.log("session error in invalid \n", z.prettifyError(error));
    redirect("/login");
  }

  return data;
};

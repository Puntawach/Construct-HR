import { signOut } from "@/lib/auth/auth";

export async function GET() {
  await signOut();
}

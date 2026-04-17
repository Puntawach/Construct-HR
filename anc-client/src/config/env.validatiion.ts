import z from "zod";

const serverEnvSchema = z.object({
  BACKEND_URL: z.url(),
  AUTH_SECRET: z.string().min(32),
});

const serverResult = serverEnvSchema.safeParse(process.env);

if (!serverResult.success) {
  console.error(
    `Invalid server environment: \n`,
    z.prettifyError(serverResult.error),
  );
  process.exit(1);
}

export const serverEnv = serverResult.data;

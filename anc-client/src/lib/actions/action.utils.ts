import { ErrorActionResult } from "@/lib/actions/action.type";
import { ApiError } from "@/lib/api/api.error";

export const formatActionError = (error: unknown): ErrorActionResult => {
  if (error instanceof ApiError) {
    return { success: false, ...error };
  }
  return {
    success: false,
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  };
};

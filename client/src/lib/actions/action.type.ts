export type SuccessActionResult<T = unknown> = {
  success: true;
  data?: T;
};

export type ErrorActionResult = {
  success: false;
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
};

export type ActionResult<T = unknown> =
  | SuccessActionResult<T>
  | ErrorActionResult;

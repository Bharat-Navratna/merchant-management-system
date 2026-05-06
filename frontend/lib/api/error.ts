import { AxiosError } from "axios";

type ErrorPayload = { message?: string };

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return (error.response?.data as ErrorPayload | undefined)?.message ?? fallback;
  }
  return fallback;
}

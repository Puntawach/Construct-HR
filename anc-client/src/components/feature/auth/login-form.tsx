"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/auth-action";
import { LoginInputForm } from "@/lib/schemas/auth.schema";
import { Loader } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInputForm>({
    defaultValues: { email: "", password: "" },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: LoginInputForm) => {
    startTransition(async () => {
      const res = await login(data);
      if (!res.success) {
        setError("root", {
          message: "Email or password you entered is incorrected",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <Alert variant="destructive" className="mb-4 bg-red-100 border-red-500">
          <AlertTitle>{errors.root.message}</AlertTitle>
        </Alert>
      )}
      <FieldGroup>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel className="text-white" htmlFor={field.name}>
                Email
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Email"
                aria-invalid={fieldState.invalid}
                className="bg-gray-100 focus:bg-white transition-colors"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]}></FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel className="text-white" htmlFor={field.name}>
                Password
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="password"
                aria-invalid={fieldState.invalid}
                className="bg-gray-100 focus:bg-white transition-colors"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]}></FieldError>
              )}
            </Field>
          )}
        />

        {/* buttin */}
        <Field className="mt-4">
          <Button className="rounded-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader className="animate-spin" /> Logging you in ...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

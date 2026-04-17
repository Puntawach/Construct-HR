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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { register } from "@/lib/actions/auth-action";
import {
  CreateEmployeeInput,
  createEmployeeSchema,
} from "@/lib/schemas/employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, UserPlus } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

export default function CreateEmployeeForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateEmployeeInput>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      identificationId: "",
      role: undefined,
      dailyRate: undefined,
      allowancePerDay: undefined,
    },
    resolver: zodResolver(createEmployeeSchema),
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: CreateEmployeeInput) => {
    startTransition(async () => {
      const res = await register(data);
      if (!res.success && res.code === "EMAIL_ALREADY_EXISTS") {
        setError("email", { message: res.message });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create Employee</h1>
        <p className="text-white/40 text-sm mt-1">
          Add a new employee to the workforce
        </p>
      </div>

      {errors.root && (
        <Alert variant="destructive" className="mb-4 bg-red-100 border-red-500">
          <AlertTitle>{errors.root.message}</AlertTitle>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* ── Personal Info ─────────────────────────────────────────────── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase text-white/30 tracking-wider mb-4">
              Personal Information
            </p>

            <FieldGroup>
              {/* Name row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-white/60 text-xs"
                        htmlFor={field.name}
                      >
                        First Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="-"
                        aria-invalid={fieldState.invalid}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-white/60 text-xs"
                        htmlFor={field.name}
                      >
                        Last Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="-"
                        aria-invalid={fieldState.invalid}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* Phone & ID */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-white/60 text-xs"
                        htmlFor={field.name}
                      >
                        Phone Number
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="0812345678"
                        aria-invalid={fieldState.invalid}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="identificationId"
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-white/60 text-xs"
                        htmlFor={field.name}
                      >
                        ID Number
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="1234567890"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        aria-invalid={fieldState.invalid}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* Address */}
              <Controller
                control={control}
                name="address"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="text-white/60 text-xs"
                      htmlFor={field.name}
                    >
                      Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="123 ถนนสุขุมวิท กรุงเทพฯ"
                      aria-invalid={fieldState.invalid}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* ── Account ───────────────────────────────────────────────────── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase text-white/30 tracking-wider mb-4">
              Account
            </p>

            <FieldGroup>
              {/* Email */}
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="text-white/60 text-xs"
                      htmlFor={field.name}
                    >
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="somchai@anc.co.th"
                      aria-invalid={fieldState.invalid}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="text-white/60 text-xs"
                      htmlFor={field.name}
                    >
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Role */}
              <Controller
                control={control}
                name="role"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="text-white/60 text-xs"
                      htmlFor={field.name}
                    >
                      Role
                    </FieldLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="bg-white/5 border-white/10 text-white"
                      >
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="WORKER">Worker</SelectItem>
                        <SelectItem value="LEADER">Leader</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* ── Pay Rate ──────────────────────────────────────────────────── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase text-white/30 tracking-wider mb-4">
              Pay Rate{" "}
              <span className="text-white/20 normal-case font-normal">
                (optional)
              </span>
            </p>

            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="dailyRate"
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-white/60 text-xs"
                        htmlFor={field.name}
                      >
                        Daily Rate (฿)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        placeholder="Daily Rate"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          field.onChange(isNaN(val) ? undefined : val); // NaN → undefined
                        }}
                        onBlur={field.onBlur}
                        aria-invalid={fieldState.invalid}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="allowancePerDay"
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-white/60 text-xs"
                        htmlFor={field.name}
                      >
                        Allowance / Day (฿)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        placeholder="allowance"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          field.onChange(isNaN(val) ? undefined : val);
                        }}
                        onBlur={field.onBlur}
                        aria-invalid={fieldState.invalid}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </div>

          {/* ── Submit ────────────────────────────────────────────────────── */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-white/50 text-white hover:bg-white/5 p-6 bg-white/50"
              onClick={() => redirect("/admin/employees")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 bg-purple-950/50 border-white/50 text-white p-6"
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Employee
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

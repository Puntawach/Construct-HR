'use client'

import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { login } from "@/lib/actions/auth-action"
import { LoginInputForm } from "@/lib/schemas/auth.schema"
import { Loader, Shield, User } from "lucide-react"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"

const DEMO_ACCOUNTS = [
  {
    label: "ทดลองใช้ Admin",
    email: "admin@anc.co.th",
    password: "password123",
    icon: Shield,
    color: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
  },
  {
    label: "ทดลองใช้ Worker",
    email: "worker@anc.co.th",
    password: "password123",
    icon: User,
    color: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
  },
]

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginInputForm>({
    defaultValues: { email: "", password: "" },
  })

  const [isPending, startTransition] = useTransition()

  const onSubmit = (data: LoginInputForm) => {
    startTransition(async () => {
      const res = await login(data)
      if (!res.success) {
        setError("root", { message: "Email หรือ Password ไม่ถูกต้อง" })
      }
    })
  }

  function handleDemo(email: string, password: string) {
    setValue("email", email)
    setValue("password", password)
    startTransition(async () => {
      const res = await login({ email, password })
      if (!res.success) {
        setError("root", { message: "Email หรือ Password ไม่ถูกต้อง" })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <FieldLabel className="text-white" htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Email"
                aria-invalid={fieldState.invalid}
                className="bg-gray-100 focus:bg-white transition-colors"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel className="text-white" htmlFor={field.name}>Password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="Password"
                aria-invalid={fieldState.invalid}
                className="bg-gray-100 focus:bg-white transition-colors"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field className="mt-4">
          <Button className="rounded-full" disabled={isPending}>
            {isPending ? (
              <><Loader className="animate-spin" /> กำลังเข้าสู่ระบบ...</>
            ) : (
              "Login"
            )}
          </Button>
        </Field>
      </FieldGroup>

      {/* Demo accounts */}
      <div className="pt-2 space-y-2">
        <p className="text-xs text-white/40 text-center">— หรือทดลองใช้งาน —</p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              disabled={isPending}
              onClick={() => handleDemo(acc.email, acc.password)}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 ${acc.color}`}
            >
              <acc.icon size={13} />
              {acc.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/providers/language-provider";
import Link from "next/link";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import AuthForm from "@/components/auth/AuthForm";

export type Mode = "login" | "register";

export interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

type AuthPageClientProps = {
  initialMode: Mode;
};

export default function AuthPageClient({
  initialMode,
}: AuthPageClientProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const setField = (key: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<FormState> = {};

    if (!form.email.includes("@")) {
      nextErrors.email = t("auth.errors.invalidEmail");
    }

    if (form.password.length < 8) {
      nextErrors.password = t("auth.errors.minPassword");
    }

    if (mode === "register") {
      if (!form.username.trim()) {
        nextErrors.username = t("auth.errors.usernameRequired");
      }

      if (form.confirmPassword !== form.password) {
        nextErrors.confirmPassword = t("auth.errors.passwordsNotMatch");
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // TODO: connect auth.service.ts
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setErrors({});

    router.push(nextMode === "login" ? "/login" : "/register");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex min-h-screen">
<div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6 lg:left-12 lg:top-12">
  <Link
    href="/"
    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-gray-900"
  >
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
    <span>{t("auth.actions.backToHome")}</span>
  </Link>
</div>

<div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6 lg:right-12 lg:top-12">
  <LanguageSwitcher />
</div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16 sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_30%)]" />
          <div className="absolute left-8 top-8 h-12 w-12 rounded-full border border-gray-200" />
          <div className="absolute bottom-8 right-8 h-16 w-16 rounded-full border border-gray-100" />

          <div className="relative z-10 w-full max-w-md pt-10 sm:pt-0">
            <AuthForm
              mode={mode}
              loading={loading}
              form={form}
              errors={errors}
              onSubmit={handleSubmit}
              onSwitchMode={switchMode}
              onChangeField={setField}
              text={{
                loginTab: t("auth.tabs.login"),
                registerTab: t("auth.tabs.register"),
                loginTitle: t("auth.headings.login.title"),
                registerTitle: t("auth.headings.register.title"),
                loginDescription: t("auth.headings.login.description"),
                registerDescription: t("auth.headings.register.description"),
                usernameLabel: t("auth.fields.username.label"),
                usernamePlaceholder: t("auth.fields.username.placeholder"),
                emailLabel: t("auth.fields.email.label"),
                emailPlaceholder: t("auth.fields.email.placeholder"),
                passwordLabel: t("auth.fields.password.label"),
                passwordPlaceholder: t("auth.fields.password.placeholder"),
                confirmPasswordLabel: t("auth.fields.confirmPassword.label"),
                confirmPasswordPlaceholder: t("auth.fields.confirmPassword.placeholder"),
                forgotPassword: t("auth.actions.forgotPassword"),
                processing: t("auth.actions.processing"),
                submitLogin: t("auth.actions.submitLogin"),
                submitRegister: t("auth.actions.submitRegister"),
                divider: t("auth.actions.divider"),
                switchToRegisterText: t("auth.actions.switchToRegisterText"),
                switchToRegisterAction: t("auth.actions.switchToRegisterAction"),
                switchToLoginText: t("auth.actions.switchToLoginText"),
                switchToLoginAction: t("auth.actions.switchToLoginAction"),
                mobileBrand: t("auth.showcase.brand"),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
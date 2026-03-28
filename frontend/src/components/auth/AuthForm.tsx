"use client";

import { useState } from "react";
import type { FormState, Mode } from "@/components/auth/AuthPageClient";

type AuthFormText = {
  loginTab: string;
  registerTab: string;
  loginTitle: string;
  registerTitle: string;
  loginDescription: string;
  registerDescription: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  forgotPassword: string;
  processing: string;
  submitLogin: string;
  submitRegister: string;
  divider: string;
  switchToRegisterText: string;
  switchToRegisterAction: string;
  switchToLoginText: string;
  switchToLoginAction: string;
  mobileBrand: string;
};

type AuthFormProps = {
  mode: Mode;
  loading: boolean;
  form: FormState;
  errors: Partial<FormState>;
  text: AuthFormText;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchMode: (mode: Mode) => void;
  onChangeField: (key: keyof FormState) => (value: string) => void;
};

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">
        {label}
      </label>

      <div
        className={`rounded-2xl border bg-white transition-all duration-200 ${
          error
            ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.08)]"
            : focused
            ? "border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full rounded-2xl bg-transparent px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SubmitButton({
  loading,
  processingText,
  children,
}: {
  loading: boolean;
  processingText: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full overflow-hidden rounded-2xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>{processingText}</span>
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}

export default function AuthForm({
  mode,
  loading,
  form,
  errors,
  text,
  onSubmit,
  onSwitchMode,
  onChangeField,
}: AuthFormProps) {
  return (
    <>
      <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="mb-8">
          <div className="mb-6 inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => onSwitchMode("login")}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                mode === "login"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {text.loginTab}
            </button>

            <button
              type="button"
              onClick={() => onSwitchMode("register")}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                mode === "register"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {text.registerTab}
            </button>
          </div>

          <h1 className="mb-2 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {mode === "login" ? text.loginTitle : text.registerTitle}
          </h1>

          <p className="text-sm leading-relaxed text-gray-500">
            {mode === "login" ? text.loginDescription : text.registerDescription}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {mode === "register" && (
            <InputField
              label={text.usernameLabel}
              value={form.username}
              onChange={onChangeField("username")}
              placeholder={text.usernamePlaceholder}
              error={errors.username}
            />
          )}

          <InputField
            label={text.emailLabel}
            type="email"
            value={form.email}
            onChange={onChangeField("email")}
            placeholder={text.emailPlaceholder}
            error={errors.email}
          />

          <InputField
            label={text.passwordLabel}
            type="password"
            value={form.password}
            onChange={onChangeField("password")}
            placeholder={text.passwordPlaceholder}
            error={errors.password}
          />

          {mode === "register" && (
            <InputField
              label={text.confirmPasswordLabel}
              type="password"
              value={form.confirmPassword}
              onChange={onChangeField("confirmPassword")}
              placeholder={text.confirmPasswordPlaceholder}
              error={errors.confirmPassword}
            />
          )}

          {mode === "login" && (
            <div className="text-right">
              <a
                href="#"
                className="text-xs font-medium text-gray-500 transition-colors hover:text-emerald-600"
              >
                {text.forgotPassword}
              </a>
            </div>
          )}

          <div className="pt-2">
            <SubmitButton loading={loading} processingText={text.processing}>
              {mode === "login" ? (
                <>
                  <span>{text.submitLogin}</span>
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              ) : (
                <span>{text.submitRegister}</span>
              )}
            </SubmitButton>
          </div>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
            {text.divider}
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-500">
          {mode === "login" ? text.switchToRegisterText : text.switchToLoginText}
          <button
            type="button"
            onClick={() => onSwitchMode(mode === "login" ? "register" : "login")}
            className="font-medium text-emerald-600 transition-colors hover:text-emerald-700"
          >
            {mode === "login"
              ? text.switchToRegisterAction
              : text.switchToLoginAction}
          </button>
        </p>
      </div>
    </>
  );
}
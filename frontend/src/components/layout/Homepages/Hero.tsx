"use client";

import Link from "next/link";
import { useLanguage } from "@/app/providers/language-provider";

const supportedFormats = ["JPG", "PNG", "WEBP", "MP4", "MOV", "AVI"];

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 border border-gray-200 bg-gray-50 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs tracking-wide text-gray-600">
              {t("hero.badge")}
            </span>
          </div>

          <h1
            className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
          >
            {t("hero.titleLine1")}
            <br />
            <span className="text-gray-400">{t("hero.titleLine2")}</span>
          </h1>

          <p className="mb-10 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
            {t("hero.description")}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/detect"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 px-6 py-3 text-sm text-white transition-colors hover:bg-gray-700"
            >
              {t("hero.startDetection")}
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <a
              href="#how"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              {t("hero.learnMore")}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {supportedFormats.map((ext) => (
              <span
                key={ext}
                className="border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-400"
              >
                .{ext}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
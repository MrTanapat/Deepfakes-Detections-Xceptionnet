"use client";

import { useLanguage } from "@/app/providers/language-provider";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      title: t("how.steps.upload.title"),
      desc: t("how.steps.upload.desc"),
    },
    {
      num: "02",
      title: t("how.steps.analysis.title"),
      desc: t("how.steps.analysis.desc"),
    },
    {
      num: "03",
      title: t("how.steps.results.title"),
      desc: t("how.steps.results.desc"),
    },
  ];

  return (
    <section id="how" className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">
            {t("how.eyebrow")}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("how.title")}
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 sm:gap-12">
          {steps.map((step) => (
            <div key={step.num}>
              <div className="mb-4 text-4xl font-bold text-emerald-400">
                {step.num}
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
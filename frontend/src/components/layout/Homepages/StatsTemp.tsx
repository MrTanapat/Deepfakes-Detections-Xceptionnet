"use client";

import { useLanguage } from "@/app/providers/language-provider";

export default function Stats() {
  const { t } = useLanguage();

  const stats = [
    { value: "97%", label: t("stats.detectionAccuracy") },
    { value: "60K+", label: t("stats.trainingFrames") },
    { value: "5", label: t("stats.manipulationMethods") },
    { value: "<300ms", label: t("stats.avgResponseTime") },
  ];

  return (
    <section id="stats" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {stats.map((item) => (
            <div key={item.label}>
              <div className="mb-1 text-3xl font-bold text-gray-900 sm:text-4xl">
                {item.value}
              </div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
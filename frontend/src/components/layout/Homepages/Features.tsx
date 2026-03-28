"use client";

import { useLanguage } from "@/app/providers/language-provider";

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      title: t("features.items.contextExpansion.title"),
      desc: t("features.items.contextExpansion.desc"),
      tag: t("features.items.contextExpansion.tag"),
    },
    {
      title: t("features.items.videoFrameAnalysis.title"),
      desc: t("features.items.videoFrameAnalysis.desc"),
      tag: t("features.items.videoFrameAnalysis.tag"),
    },
    {
      title: t("features.items.faceDetectionFirst.title"),
      desc: t("features.items.faceDetectionFirst.desc"),
      tag: t("features.items.faceDetectionFirst.tag"),
    },
    {
      title: t("features.items.confidenceScoring.title"),
      desc: t("features.items.confidenceScoring.desc"),
      tag: t("features.items.confidenceScoring.tag"),
    },
    {
      title: t("features.items.historyTracking.title"),
      desc: t("features.items.historyTracking.desc"),
      tag: t("features.items.historyTracking.tag"),
    },
    {
      title: t("features.items.adminDashboard.title"),
      desc: t("features.items.adminDashboard.desc"),
      tag: t("features.items.adminDashboard.tag"),
    },
  ];

  return (
    <section id="features" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">
            {t("features.eyebrow")}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("features.title")}
          </h2>
        </div>

        <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 transition-colors hover:bg-gray-50 sm:p-8"
            >
              <span className="mb-5 inline-block border border-gray-200 px-2 py-0.5 text-xs uppercase tracking-widest text-gray-400">
                {feature.tag}
              </span>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";

import { useLanguage } from "@/app/providers/language-provider";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const handleToggleLanguage = () => {
    setLang(lang === "th" ? "en" : "th");
  };

  return (
    <button
      onClick={handleToggleLanguage}
      className="inline-flex min-w-[56px] items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
    >
      <span key={lang} className="animate-lang-switch">
        {lang === "th" ? "TH" : "EN"}
      </span>
    </button>
  );
}
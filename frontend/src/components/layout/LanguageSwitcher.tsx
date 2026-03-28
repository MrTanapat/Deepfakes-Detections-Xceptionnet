"use client";

import { useLanguage } from "@/app/providers/language-provider";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  mobile?: boolean;
};

export default function LanguageSwitcher({
  mobile = false,
}: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  const handleToggleLanguage = () => {
    setLang(lang === "th" ? "en" : "th");
  };

  return (
    <button
      onClick={handleToggleLanguage}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-gray-100 bg-white text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 active:scale-95",
        mobile
          ? "min-w-[32px] gap-2 px-4 py-2.5 text-sm"
          : "min-w-[32px] px-3 py-1.5"
      )}
    >
      <span
        key={lang}
        className="animate-lang-switch inline-block"
      >
        {lang === "th" ? "TH" : "EN"}
      </span>
    </button>
  );
}
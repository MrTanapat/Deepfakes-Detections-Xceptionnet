"use client";

import { useLanguage } from "@/app/providers/language-provider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-100 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Lanner News</span>
        </div>

        <p className="text-center text-xs text-gray-400">
          {t("footer.project")}
        </p>

        <p className="text-xs text-gray-400">© 2026</p>
      </div>
    </footer>
  );
}
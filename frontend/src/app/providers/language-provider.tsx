"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { th } from "@/app/messages/th";
import { en } from "@/app/messages/en";

const messages = {
  th,
  en,
} as const;

export type Locale = keyof typeof messages;

type LanguageContextType = {
  lang: Locale;
  setLang: (lang: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (typeof acc === "object" && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function LanguageProvider({
  children,
  initialLang = "th",
}: {
  children: ReactNode;
  initialLang?: Locale;
}) {
  const [lang, setLangState] = useState<Locale>(initialLang);

  const setLang = useCallback((nextLang: Locale) => {
    setLangState(nextLang);
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLang;
  }, []);

  const t = useCallback(
    (key: string) => {
      const value = getNestedValue(messages[lang], key);
      return typeof value === "string" ? value : key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, setLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
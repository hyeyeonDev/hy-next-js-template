"use client";

import { useCallback, useState } from "react";

type SetValue<T> = T | ((value: T) => T);

function readLocalStorage<T>(key: string, initialValue: T) {
  if (typeof window === "undefined") return initialValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() =>
    readLocalStorage(key, initialValue),
  );

  const updateValue = useCallback(
    (newValue: SetValue<T>) => {
      setValue((current) => {
        const nextValue =
          newValue instanceof Function ? newValue(current) : newValue;

        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {}

        return nextValue;
      });
    },
    [key],
  );

  return [value, updateValue] as const;
}

import { clsx, type ClassValue } from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import fs from "fs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useLocalStorage(keyName: string, defaultValue: string | null) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue: string) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
}

export function datetimeToIsoString(dt: string) {
  return dt.replace("+00:00", "Z");
}

export function formatTime(time: string) {
  const parts = time.split(":");

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function formatTimeToHours(time: string) {
  const parts = time.split(":");
  return parts[0].padStart(1, "0");
}

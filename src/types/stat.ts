import { JSX } from "react";

export type Stat = {
  id: number;
  label: string;
  value: number;
  suffix?: string;
  icon: JSX.Element;
};

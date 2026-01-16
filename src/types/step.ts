import { JSX } from "react";

export type Step = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
};

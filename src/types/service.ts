import type { ReactNode } from "react";

export type Service = {
  id: number;
  name: string;
  artisansCount: number;
  icon: ReactNode;
  color: string;
};

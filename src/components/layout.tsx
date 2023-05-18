import type { PropsWithChildren } from "react";
import { ThemeToggle } from "./theme-toggle";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="h-full w-full overflow-y-scroll border-x border-slate-500 md:max-w-4xl">
        {props.children}
      </div>
      <div className="absolute right-4 top-4 hidden lg:block">
        <ThemeToggle />
      </div>
    </main>
  );
};

import { useTheme } from "next-themes";
// import { Switch } from "@/components/ui/switch";
import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [toggler, setToggler] = useState(false);

  const handleThemeToggle = () => {
    setToggler(true);
    setTheme(theme === "light" ? "dark" : "light");
    setTimeout(() => {
      setToggler(false);
    }, 300);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* <Switch
            defaultChecked={true}
            onCheckedChange={(checked) => toggleTheme(checked)}
          /> */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleThemeToggle}
            disabled={toggler}
          >
            <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Toggle Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

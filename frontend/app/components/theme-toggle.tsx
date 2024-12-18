import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className="h-7 w-7"
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Moon className="transition-all" />
      ) : (
        <Sun className="rotate-0 transition-all" />
      )}
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}

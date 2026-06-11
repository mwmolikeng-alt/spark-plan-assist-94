import { FeatureCard } from "./FeatureCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Trash2, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function SettingsPage({ onBack }: { onBack?: () => void }) {
  const { theme, setTheme } = useTheme();

  const clearChat = () => {
    try { localStorage.removeItem("workly-chat"); } catch {}
    toast.success("Chat history cleared");
  };
  const resetAll = () => {
    try {
      ["workly-chat", "workly-research"].forEach((k) => localStorage.removeItem(k));
    } catch {}
    toast.success("App data reset");
  };
  const exportPrefs = () => {
    const prefs = { theme, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(prefs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "workly-preferences.json"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Preferences exported");
  };

  return (
    <FeatureCard title="Settings" description="Personalize Workly AI to fit how you work." onBack={onBack}>
      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <h4 className="text-sm font-semibold">Appearance</h4>
            <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
          </div>
          <div className="flex gap-2">
            <Button variant={theme === "light" ? "default" : "outline"} onClick={() => { setTheme("light"); toast.success("Light mode enabled"); }}>
              <Sun className="h-4 w-4 mr-2" /> Light
            </Button>
            <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => { setTheme("dark"); toast.success("Dark mode enabled"); }}>
              <Moon className="h-4 w-4 mr-2" /> Dark
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <h4 className="text-sm font-semibold">Data & Privacy</h4>
            <p className="text-xs text-muted-foreground">Manage chat history and locally stored data.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={clearChat}><Trash2 className="h-4 w-4 mr-2" /> Clear Chat History</Button>
            <Button variant="outline" onClick={exportPrefs}><Download className="h-4 w-4 mr-2" /> Export Preferences</Button>
            <Button variant="destructive" onClick={resetAll}><RefreshCw className="h-4 w-4 mr-2" /> Reset App Data</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          <div className="font-semibold text-foreground mb-1">About Workly AI</div>
          Workly AI is your premium AI workplace assistant by CAPACITI. All output is generated locally with mock AI models for demo purposes.
        </CardContent>
      </Card>
    </FeatureCard>
  );
}
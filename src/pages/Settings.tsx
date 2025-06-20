import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Download, 
  Upload,
  AlertTriangle,
  Loader2,
  Key,
  Globe,
  Palette,
  Keyboard,
  Bell
} from "lucide-react";

interface UserSettings {
  apiKeys: {
    openai: string;
    claude: string;
    gemini: string;
  };
  defaultLanguages: {
    source: string;
    target: string;
  };
  theme: "light" | "dark" | "system";
  autoSave: boolean;
  notifications: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  apiKeys: {
    openai: "",
    claude: "",
    gemini: "",
  },
  defaultLanguages: {
    source: "auto",
    target: "ja",
  },
  theme: "system",
  autoSave: true,
  notifications: true,
};

const LANGUAGES = [
  { code: "auto", name: "自動検出" },
  { code: "ja", name: "日本語" },
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "ko", name: "한국어" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
];

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 設定をローカルストレージから読み込み
    const savedSettings = localStorage.getItem("ringua-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("ringua-settings", JSON.stringify(settings));
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    setHasChanges(true);
  };

  const updateApiKey = (provider: keyof UserSettings["apiKeys"], value: string) => {
    updateSettings({
      apiKeys: { ...settings.apiKeys, [provider]: value }
    });
  };

  const updateLanguage = (type: "source" | "target", value: string) => {
    updateSettings({
      defaultLanguages: { ...settings.defaultLanguages, [type]: value }
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "ringua-settings.json";
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importSettings = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target?.result as string);
            setSettings({ ...DEFAULT_SETTINGS, ...importedSettings });
            setHasChanges(true);
          } catch (error) {
            console.error("Failed to import settings:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Layout>
      <div className="flex flex-col h-full p-2 max-w-5xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">設定</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={importSettings}
              className="gap-1"
            >
              <Upload className="h-3 w-3" />
              インポート
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportSettings}
              className="gap-1"
            >
              <Download className="h-3 w-3" />
              エクスポート
            </Button>
            <Button
              size="sm"
              onClick={saveSettings}
              disabled={!hasChanges || isSaving}
              className="gap-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  保存中
                </>
              ) : (
                <>
                  <Save className="h-3 w-3" />
                  保存
                </>
              )}
            </Button>
          </div>
        </div>

        {hasChanges && (
          <Alert className="mb-4">
            <AlertTriangle className="h-3 w-3" />
            <AlertDescription className="text-sm">
              未保存の変更があります。
            </AlertDescription>
          </Alert>
        )}

        {/* タブ設定 */}
        <Tabs defaultValue="api" className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api" className="gap-1">
              <Key className="h-3 w-3" />
              API
            </TabsTrigger>
            <TabsTrigger value="language" className="gap-1">
              <Globe className="h-3 w-3" />
              言語
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-1">
              <Palette className="h-3 w-3" />
              外観
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-1">
              <Bell className="h-3 w-3" />
              一般
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">APIキー設定</CardTitle>
                <p className="text-sm text-muted-foreground">
                  各AIモデルのAPIキーを設定してください
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key" className="text-sm font-medium">
                    OpenAI API Key
                  </Label>
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="sk-..."
                    value={settings.apiKeys.openai}
                    onChange={(e) => updateApiKey("openai", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claude-key" className="text-sm font-medium">
                    Anthropic Claude API Key
                  </Label>
                  <Input
                    id="claude-key"
                    type="password"
                    placeholder="sk-ant-..."
                    value={settings.apiKeys.claude}
                    onChange={(e) => updateApiKey("claude", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gemini-key" className="text-sm font-medium">
                    Google Gemini API Key
                  </Label>
                  <Input
                    id="gemini-key"
                    type="password"
                    placeholder="AI..."
                    value={settings.apiKeys.gemini}
                    onChange={(e) => updateApiKey("gemini", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">デフォルト言語設定</CardTitle>
                <p className="text-sm text-muted-foreground">
                  翻訳画面で使用するデフォルト言語を設定
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">翻訳元言語</Label>
                    <Select
                      value={settings.defaultLanguages.source}
                      onValueChange={(value) => updateLanguage("source", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">翻訳先言語</Label>
                    <Select
                      value={settings.defaultLanguages.target}
                      onValueChange={(value) => updateLanguage("target", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.filter(lang => lang.code !== "auto").map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">テーマ設定</CardTitle>
                <p className="text-sm text-muted-foreground">
                  アプリケーションの外観を設定
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">テーマ</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: "light" | "dark" | "system") => 
                      updateSettings({ theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">ライト</SelectItem>
                      <SelectItem value="dark">ダーク</SelectItem>
                      <SelectItem value="system">システム設定に従う</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">一般設定</CardTitle>
                <p className="text-sm text-muted-foreground">
                  アプリケーションの動作設定
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">自動保存</Label>
                    <p className="text-xs text-muted-foreground">
                      翻訳履歴を自動的に保存
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">通知</Label>
                    <p className="text-xs text-muted-foreground">
                      翻訳完了時に通知を表示
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

// データローダー関数
export const loader = async () => {
  return { settings: DEFAULT_SETTINGS };
};
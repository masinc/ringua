import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Save, 
  Download, 
  AlertTriangle,
  Loader2
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
    source: "ja",
    target: "en",
  },
  theme: "system",
  autoSave: true,
  notifications: true,
};

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

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">設定</h1>
              <p className="text-muted-foreground">アプリケーションの設定を管理</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={exportSettings}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                エクスポート
              </Button>
              <Button
                onClick={saveSettings}
                disabled={!hasChanges || isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    設定を保存
                  </>
                )}
              </Button>
            </div>
          </div>

          {hasChanges && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                未保存の変更があります。設定を保存してください。
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚧 設定画面は開発中です
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  以下の設定機能を開発予定です：
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>APIキー設定（OpenAI、Claude、Gemini）</li>
                  <li>デフォルト言語設定</li>
                  <li>テーマ設定（ライト・ダーク・システム）</li>
                  <li>キーボードショートカット設定</li>
                  <li>自動保存・通知設定</li>
                  <li>設定のインポート・エクスポート</li>
                </ul>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    現在は基本的なエクスポート機能のみ利用可能です。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// データローダー関数
export const loader = async () => {
  return { settings: DEFAULT_SETTINGS };
};
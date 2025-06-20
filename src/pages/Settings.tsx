import { useState, useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  Save, 
  Download, 
  Upload,
  AlertTriangle,
  Loader2,
  Key,
  Globe,
  Palette,
  Bell,
  Settings as SettingsIcon,
  RotateCcw
} from "lucide-react";

interface ModelConfig {
  id: string;
  name: string;
  enabled: boolean;
  isDefault?: boolean;
  parameters?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  };
}

interface ProviderConfig {
  id: string;
  name: string;
  apiKey: string;
  endpoint?: string;
  enabled: boolean;
  models: ModelConfig[];
}

interface UserSettings {
  providers: ProviderConfig[];
  defaultModel: string; // "providerId:modelId" 形式
  defaultLanguages: {
    source: string;
    target: string;
  };
  theme: "light" | "dark" | "system";
  autoSave: boolean;
  notifications: boolean;
}

const DEFAULT_PROVIDERS: ProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    apiKey: "sk-demo-key-for-prototype", // プロトタイプ確認用仮APIキー
    enabled: true,
    models: [
      { id: "gpt-4o", name: "GPT-4o", enabled: true, isDefault: true },
      { id: "gpt-4", name: "GPT-4", enabled: true },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", enabled: true },
    ]
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    apiKey: "sk-ant-demo-key-for-prototype", // プロトタイプ確認用仮APIキー
    enabled: true,
    models: [
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", enabled: true, isDefault: true },
      { id: "claude-3-opus", name: "Claude 3 Opus", enabled: true },
      { id: "claude-3-haiku", name: "Claude 3 Haiku", enabled: true },
    ]
  },
  {
    id: "gemini",
    name: "Google Gemini",
    apiKey: "AIza-demo-key-for-prototype", // プロトタイプ確認用仮APIキー
    enabled: true,
    models: [
      { id: "gemini-pro", name: "Gemini Pro", enabled: true, isDefault: true },
      { id: "gemini-pro-vision", name: "Gemini Pro Vision", enabled: true },
    ]
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    apiKey: "sk-deepseek-demo-key", // プロトタイプ確認用仮APIキー
    enabled: true,
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat", enabled: true },
      { id: "deepseek-coder", name: "DeepSeek Coder", enabled: true },
    ]
  }
];

const DEFAULT_SETTINGS: UserSettings = {
  providers: DEFAULT_PROVIDERS,
  defaultModel: "openai:gpt-4o", // デフォルトはOpenAIのGPT-4o
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
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const pendingNavigation = useRef<(() => void) | null>(null);
  const originalSettings = useRef<UserSettings>(DEFAULT_SETTINGS); // 保存されている設定を保持

  useEffect(() => {
    // 設定をローカルストレージから読み込み
    const savedSettings = localStorage.getItem("ringua-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // 既存の設定とマージして、新しいフィールドを確保
        const loadedSettings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          providers: parsed.providers || DEFAULT_PROVIDERS,
          defaultModel: parsed.defaultModel || DEFAULT_SETTINGS.defaultModel
        };
        setSettings(loadedSettings);
        // 保存されている設定として記録
        originalSettings.current = loadedSettings;
      } catch (error) {
        console.error("Failed to load settings:", error);
        setSettings(DEFAULT_SETTINGS);
        originalSettings.current = DEFAULT_SETTINGS;
      }
    } else {
      // ローカルストレージに設定がない場合はデフォルト設定を記録
      originalSettings.current = DEFAULT_SETTINGS;
    }
  }, []); // 初回のみ実行

  // settings.themeが変更された時のみテーマを同期
  useEffect(() => {
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, theme, setTheme]);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("ringua-settings", JSON.stringify(settings));
      setHasChanges(false);
      // 保存された設定として記録
      originalSettings.current = { ...settings };
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    setHasChanges(true);
    // テーマ同期は別のuseEffectで処理
  };

  const updateProviderApiKey = (providerId: string, apiKey: string) => {
    if (!settings.providers) return;
    const updatedProviders = settings.providers.map(provider =>
      provider.id === providerId ? { ...provider, apiKey } : provider
    );
    updateSettings({ providers: updatedProviders });
  };

  const updateProviderEnabled = (providerId: string, enabled: boolean) => {
    if (!settings.providers) return;
    const updatedProviders = settings.providers.map(provider =>
      provider.id === providerId ? { ...provider, enabled } : provider
    );
    updateSettings({ providers: updatedProviders });
  };

  const updateModelEnabled = (providerId: string, modelId: string, enabled: boolean) => {
    if (!settings.providers) return;
    const updatedProviders = settings.providers.map(provider => {
      if (provider.id === providerId) {
        const updatedModels = provider.models?.map(model =>
          model.id === modelId ? { ...model, enabled } : model
        ) || [];
        return { ...provider, models: updatedModels };
      }
      return provider;
    });
    updateSettings({ providers: updatedProviders });
  };

  const updateDefaultModel = (providerId: string, modelId: string) => {
    // グローバルデフォルトモデルを設定
    updateSettings({ defaultModel: `${providerId}:${modelId}` });
  };

  const getProviderStatus = (provider: ProviderConfig) => {
    if (!provider.enabled) return "無効";
    if (!provider.apiKey) return "APIキー未設定";
    return "設定済み";
  };

  const getEnabledModelsCount = (provider: ProviderConfig) => {
    return provider.models?.filter(model => model.enabled).length || 0;
  };

  const getDefaultModel = (provider: ProviderConfig) => {
    const defaultModelKey = settings.defaultModel;
    const [defaultProviderId, defaultModelId] = defaultModelKey.split(":");
    
    if (provider.id === defaultProviderId) {
      const defaultModel = provider.models?.find(model => model.id === defaultModelId && model.enabled);
      if (defaultModel) return `${defaultModel.name} (デフォルト)`;
    }
    
    return provider.models?.find(model => model.enabled)?.name || "なし";
  };

  const isDefaultModel = (providerId: string, modelId: string) => {
    return settings.defaultModel === `${providerId}:${modelId}`;
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

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
    setShowResetDialog(false);
    // テーマもデフォルトに戻す
    setTheme(DEFAULT_SETTINGS.theme);
  };

  const handleNavigationAttempt = (targetPath: string): boolean => {
    if (hasChanges) {
      pendingNavigation.current = () => {
        window.location.href = targetPath; // 強制遷移用の fallback
      };
      setShowUnsavedDialog(true);
      return false; // 遷移をブロック
    }
    return true; // 遷移を許可
  };

  const confirmNavigation = () => {
    // 破棄する場合は設定とテーマを元に戻す
    setSettings(originalSettings.current);
    setTheme(originalSettings.current.theme);
    setHasChanges(false);
    
    setShowUnsavedDialog(false);
    if (pendingNavigation.current) {
      pendingNavigation.current();
      pendingNavigation.current = null;
    }
  };

  const cancelNavigation = () => {
    setShowUnsavedDialog(false);
    pendingNavigation.current = null;
  };

  const saveAndNavigate = async () => {
    await saveSettings();
    confirmNavigation();
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
    <Layout onNavigationAttempt={handleNavigationAttempt}>
      <div className="flex flex-col h-full p-2 max-w-5xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">設定</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetDialog(true)}
              className="gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              初期化
            </Button>
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
            {settings.providers?.map((provider) => (
              <Card key={provider.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-base">{provider.name}</CardTitle>
                        <Switch
                          checked={provider.enabled}
                          onCheckedChange={(enabled) => updateProviderEnabled(provider.id, enabled)}
                        />
                      </div>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-muted-foreground">
                          状態: {getProviderStatus(provider)}
                        </p>
                        {provider.enabled && (
                          <p className="text-sm text-muted-foreground">
                            使用中: {getDefaultModel(provider)} ({getEnabledModelsCount(provider)}モデル有効)
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!provider.enabled}
                          className="gap-1"
                        >
                          <SettingsIcon className="h-3 w-3" />
                          設定
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{provider.name} 設定</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* APIキー設定 */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium">APIキー</h3>
                            <div className="space-y-2">
                              <Label htmlFor={`modal-${provider.id}-key`} className="text-sm">
                                API Key
                              </Label>
                              <Input
                                id={`modal-${provider.id}-key`}
                                type="password"
                                placeholder={
                                  provider.id === "openai" ? "sk-..." :
                                  provider.id === "claude" ? "sk-ant-..." :
                                  "API Key"
                                }
                                value={provider.apiKey}
                                onChange={(e) => updateProviderApiKey(provider.id, e.target.value)}
                              />
                            </div>
                          </div>

                          <Separator />

                          {/* モデル設定 */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium">モデル設定</h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {provider.models?.map((model) => (
                                <div key={model.id} className="flex items-center justify-between p-3 border rounded">
                                  <div className="flex items-center space-x-3">
                                    <Checkbox
                                      id={`modal-${provider.id}-${model.id}`}
                                      checked={model.enabled}
                                      onCheckedChange={(enabled) => 
                                        updateModelEnabled(provider.id, model.id, enabled as boolean)
                                      }
                                    />
                                    <label 
                                      htmlFor={`modal-${provider.id}-${model.id}`}
                                      className="text-sm font-medium"
                                    >
                                      {model.name}
                                    </label>
                                  </div>
                                  {model.enabled && (
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="radio"
                                        name="global-default-model"
                                        checked={isDefaultModel(provider.id, model.id)}
                                        onChange={() => updateDefaultModel(provider.id, model.id)}
                                        className="h-4 w-4"
                                      />
                                      <span className="text-xs text-muted-foreground">
                                        {isDefaultModel(provider.id, model.id) ? "グローバルデフォルト" : "デフォルトに設定"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
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

        {/* 未保存時の遷移確認ダイアログ */}
        <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>未保存の変更があります</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              設定に未保存の変更があります。このまま移動すると変更は失われます。
            </p>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={cancelNavigation}>
                キャンセル
              </Button>
              <Button variant="destructive" onClick={confirmNavigation}>
                破棄して移動
              </Button>
              <Button onClick={saveAndNavigate}>
                保存して移動
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 初期化確認ダイアログ */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>設定を初期化しますか？</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              すべての設定がデフォルト値にリセットされます。この操作は取り消せません。
            </p>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                キャンセル
              </Button>
              <Button variant="destructive" onClick={resetSettings}>
                初期化する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

// データローダー関数
export const loader = async () => {
  return { settings: DEFAULT_SETTINGS };
};

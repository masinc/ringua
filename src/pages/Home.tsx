import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Copy, Trash2, Loader2 } from "lucide-react";

interface TranslationState {
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  selectedModel: string; // "providerId:modelId" 形式
  isTranslating: boolean;
}

interface ProviderConfig {
  id: string;
  name: string;
  apiKey: string;
  endpoint?: string;
  enabled: boolean;
  models: ModelConfig[];
}

interface ModelConfig {
  id: string;
  name: string;
  enabled: boolean;
  isDefault?: boolean;
  isCustom?: boolean;
}

interface UserSettings {
  providers: ProviderConfig[];
  defaultModel: string;
  defaultLanguages: {
    source: string;
    target: string;
  };
  theme: "light" | "dark" | "system";
  autoSave: boolean;
  notifications: boolean;
}

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

// 設定画面と共有する型定義
const loadSettings = (): UserSettings | null => {
  try {
    const savedSettings = localStorage.getItem("ringua-settings");
    return savedSettings ? JSON.parse(savedSettings) : null;
  } catch {
    return null;
  }
};

const getAvailableModels = (settings: UserSettings | null) => {
  if (!settings) return [];
  
  const availableModels: { id: string; name: string; providerId: string; providerName: string }[] = [];
  
  settings.providers
    .filter(provider => provider.enabled && provider.apiKey)
    .forEach(provider => {
      provider.models
        ?.filter(model => model.enabled)
        .forEach(model => {
          availableModels.push({
            id: `${provider.id}:${model.id}`,
            name: `${model.name}`,
            providerId: provider.id,
            providerName: provider.name
          });
        });
    });
    
  return availableModels;
};

export default function Home() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string; providerId: string; providerName: string }[]>([]);
  
  const [state, setState] = useState<TranslationState>({
    sourceText: "",
    targetText: "",
    sourceLanguage: "auto",
    targetLanguage: "ja",
    selectedModel: "",
    isTranslating: false,
  });

  useEffect(() => {
    // 設定を読み込み
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    
    if (loadedSettings) {
      const models = getAvailableModels(loadedSettings);
      setAvailableModels(models);
      
      // デフォルトモデルまたは最初の利用可能モデルを設定
      const defaultModel = loadedSettings.defaultModel;
      const initialModel = models.find(m => m.id === defaultModel)?.id || models[0]?.id || "";
      
      setState(prev => ({
        ...prev,
        selectedModel: initialModel,
        sourceLanguage: loadedSettings.defaultLanguages?.source || "auto",
        targetLanguage: loadedSettings.defaultLanguages?.target || "ja"
      }));
    }
  }, []);

  const handleTranslate = async () => {
    if (!state.sourceText.trim() || !state.selectedModel) return;

    setState(prev => ({ ...prev, isTranslating: true, targetText: "" }));

    try {
      // モックデータでの翻訳シミュレーション
      await new Promise(resolve => setTimeout(resolve, 1500));
      const selectedModelInfo = availableModels.find(m => m.id === state.selectedModel);
      const modelName = selectedModelInfo ? selectedModelInfo.name : state.selectedModel;
      const mockTranslation = `[${modelName}で翻訳] ${state.sourceText}`;
      setState(prev => ({ ...prev, targetText: mockTranslation, isTranslating: false }));
    } catch (error) {
      console.error("Translation error:", error);
      setState(prev => ({ ...prev, isTranslating: false }));
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // TODO: トースト通知を追加
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const swapLanguages = () => {
    // 自動検出の場合は入れ替えしない
    if (state.sourceLanguage === "auto") return;
    
    setState(prev => ({
      ...prev,
      sourceLanguage: prev.targetLanguage,
      targetLanguage: prev.sourceLanguage,
      sourceText: prev.targetText,
      targetText: prev.sourceText,
    }));
  };

  return (
    <Layout>
      <div className="flex flex-col h-full p-2 max-w-7xl mx-auto">
        {/* 統合コントロール部分 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="source-lang" className="text-sm font-medium whitespace-nowrap">
                翻訳元:
              </Label>
              <Select 
                value={state.sourceLanguage} 
                onValueChange={(value) => setState(prev => ({ ...prev, sourceLanguage: value }))}
              >
                <SelectTrigger className="w-32">
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

            <Button
              variant="outline"
              size="icon"
              onClick={swapLanguages}
              disabled={state.sourceLanguage === "auto"}
              title={state.sourceLanguage === "auto" ? "自動検出時は入れ替えできません" : "言語を入れ替え"}
              className="h-8 w-8"
            >
              <ArrowLeftRight className="h-3 w-3" />
            </Button>

            <div className="flex items-center gap-2">
              <Label htmlFor="target-lang" className="text-sm font-medium whitespace-nowrap">
                翻訳先:
              </Label>
              <Select 
                value={state.targetLanguage} 
                onValueChange={(value) => setState(prev => ({ ...prev, targetLanguage: value }))}
              >
                <SelectTrigger className="w-32">
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
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="model-select" className="text-sm font-medium">
              AIモデル:
            </Label>
            <Select 
              value={state.selectedModel} 
              onValueChange={(value) => setState(prev => ({ ...prev, selectedModel: value }))}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="モデルを選択">
                  {state.selectedModel && (() => {
                    const selectedModel = availableModels.find(m => m.id === state.selectedModel);
                    if (selectedModel) {
                      return (
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{selectedModel.name}</span>
                          <div className="flex items-center gap-1 ml-2">
                            <span className="text-xs text-muted-foreground">
                              {selectedModel.providerName}
                            </span>
                            {settings?.defaultModel === selectedModel.id && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                デフォルト
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableModels.length > 0 ? (
                  (() => {
                    // プロバイダー別にグループ化
                    const groupedModels = availableModels.reduce((acc, model) => {
                      if (!acc[model.providerId]) {
                        acc[model.providerId] = [];
                      }
                      acc[model.providerId].push(model);
                      return acc;
                    }, {} as Record<string, typeof availableModels>);

                    return Object.entries(groupedModels).map(([providerId, models]) => (
                      <div key={providerId}>
                        {/* プロバイダー名のセパレータ */}
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 border-b">
                          {models[0].providerName}
                        </div>
                        {/* そのプロバイダーのモデル一覧 */}
                        {models.map(model => (
                          <SelectItem key={model.id} value={model.id} className="pl-6">
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              <div className="flex items-center gap-1">
                                {settings?.defaultModel === model.id && (
                                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                    デフォルト
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ));
                  })()
                ) : (
                  <SelectItem value="no-models" disabled>
                    モデルが設定されていません
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 翻訳エリア */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-2 min-h-0">
          <Card className="flex flex-col border-0 shadow-sm">
            <CardHeader className="pb-1 pt-2 px-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">原文</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setState(prev => ({ ...prev, sourceText: "" }))}
                    disabled={!state.sourceText}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleCopyToClipboard(state.sourceText)}
                    disabled={!state.sourceText}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <Textarea
                value={state.sourceText}
                onChange={(e) => setState(prev => ({ ...prev, sourceText: e.target.value }))}
                placeholder="翻訳したいテキストを入力してください..."
                className="flex-1 resize-none border-0 p-2 focus-visible:ring-0 rounded-none"
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col border-0 shadow-sm">
            <CardHeader className="pb-1 pt-2 px-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">翻訳結果</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleCopyToClipboard(state.targetText)}
                    disabled={!state.targetText}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 relative">
              <Textarea
                value={state.targetText}
                readOnly
                placeholder={state.isTranslating ? "翻訳中..." : "翻訳結果がここに表示されます"}
                className="flex-1 resize-none bg-muted/50 border-0 p-2 focus-visible:ring-0 rounded-none"
              />
              {state.isTranslating && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-primary bg-background/80 rounded px-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">翻訳中</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 翻訳ボタン */}
        <div className="flex justify-center mt-2 flex-shrink-0">
          <Button
            onClick={handleTranslate}
            disabled={!state.sourceText.trim() || state.isTranslating}
            size="lg"
            className="px-8"
          >
            {state.isTranslating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                翻訳中...
              </>
            ) : (
              "翻訳する"
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
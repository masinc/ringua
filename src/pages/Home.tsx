import { useState } from "react";
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
  selectedModel: string;
  isTranslating: boolean;
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

const AI_MODELS = [
  { id: "openai-gpt4", name: "OpenAI GPT-4" },
  { id: "claude-3", name: "Anthropic Claude 3" },
  { id: "gemini-pro", name: "Google Gemini Pro" },
];

export default function Home() {
  const [state, setState] = useState<TranslationState>({
    sourceText: "",
    targetText: "",
    sourceLanguage: "auto",
    targetLanguage: "ja",
    selectedModel: "openai-gpt4",
    isTranslating: false,
  });

  const handleTranslate = async () => {
    if (!state.sourceText.trim()) return;

    setState(prev => ({ ...prev, isTranslating: true, targetText: "" }));

    try {
      // モックデータでの翻訳シミュレーション
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockTranslation = `[${state.selectedModel}で翻訳] ${state.sourceText}`;
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
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Ringua</h1>
              <p className="text-muted-foreground">AI翻訳アプリケーション</p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="model-select" className="text-sm font-medium">
                AIモデル:
              </Label>
              <Select 
                value={state.selectedModel} 
                onValueChange={(value) => setState(prev => ({ ...prev, selectedModel: value }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Label htmlFor="source-lang" className="text-sm font-medium whitespace-nowrap">
                    翻訳元:
                  </Label>
                  <Select 
                    value={state.sourceLanguage} 
                    onValueChange={(value) => setState(prev => ({ ...prev, sourceLanguage: value }))}
                  >
                    <SelectTrigger className="w-36">
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
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Label htmlFor="target-lang" className="text-sm font-medium whitespace-nowrap">
                    翻訳先:
                  </Label>
                  <Select 
                    value={state.targetLanguage} 
                    onValueChange={(value) => setState(prev => ({ ...prev, targetLanguage: value }))}
                  >
                    <SelectTrigger className="w-36">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">原文</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setState(prev => ({ ...prev, sourceText: "" }))}
                          disabled={!state.sourceText}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyToClipboard(state.sourceText)}
                          disabled={!state.sourceText}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={state.sourceText}
                      onChange={(e) => setState(prev => ({ ...prev, sourceText: e.target.value }))}
                      placeholder="翻訳したいテキストを入力してください..."
                      className="min-h-48 resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {state.sourceText.length} 文字
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">翻訳結果</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyToClipboard(state.targetText)}
                          disabled={!state.targetText}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={state.targetText}
                      readOnly
                      placeholder={state.isTranslating ? "翻訳中..." : "翻訳結果がここに表示されます"}
                      className="min-h-48 resize-none bg-muted/50"
                    />
                    {state.isTranslating && (
                      <div className="flex items-center gap-2 mt-2 text-primary">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">翻訳中...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-6">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
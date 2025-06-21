import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Search, Star, Copy, Trash2, CalendarDays } from "lucide-react";

interface Translation {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  aiModel: string;
  createdAt: string;
  isFavorite: boolean;
}

const MOCK_TRANSLATIONS: Translation[] = [
  {
    id: "1",
    sourceText: "こんにちは、世界！",
    targetText: "Hello, world!",
    sourceLanguage: "ja",
    targetLanguage: "en",
    aiModel: "OpenAI GPT-4",
    createdAt: "2025-06-20T10:30:00Z",
    isFavorite: true,
  },
  {
    id: "2",
    sourceText: "人工知能による翻訳技術は急速に発展しています。",
    targetText: "Translation technology powered by artificial intelligence is rapidly advancing.",
    sourceLanguage: "ja",
    targetLanguage: "en",
    aiModel: "Claude 3",
    createdAt: "2025-06-20T09:15:00Z",
    isFavorite: false,
  },
  {
    id: "3",
    sourceText: "Thank you for your help.",
    targetText: "ご協力ありがとうございます。",
    sourceLanguage: "en",
    targetLanguage: "ja",
    aiModel: "Gemini Pro",
    createdAt: "2025-06-19T16:45:00Z",
    isFavorite: false,
  },
];

const LANGUAGE_NAMES: Record<string, string> = {
  ja: "日本語",
  en: "English",
  zh: "中文",
  ko: "한국어",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

export default function History() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "model">("date");

  useEffect(() => {
    // モックデータを読み込み
    setTranslations(MOCK_TRANSLATIONS);
  }, []);

  const filteredTranslations = translations
    .filter(translation => {
      const matchesSearch = 
        translation.sourceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translation.targetText.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorite = !filterFavorites || translation.isFavorite;
      return matchesSearch && matchesFavorite;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.aiModel.localeCompare(b.aiModel);
      }
    });

  const toggleFavorite = (id: string) => {
    setTranslations(prev => 
      prev.map(translation =>
        translation.id === id 
          ? { ...translation, isFavorite: !translation.isFavorite }
          : translation
      )
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // TODO: トースト通知を追加
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const deleteTranslation = (id: string) => {
    setTranslations(prev => prev.filter(translation => translation.id !== id));
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">翻訳履歴</h1>
                <p className="text-muted-foreground">過去の翻訳記録を管理</p>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <Badge variant="outline" className="gap-1">
                  <CalendarDays className="h-3 w-3" />
                  合計: {translations.length}件
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3" />
                  お気に入り: {translations.filter(t => t.isFavorite).length}件
                </Badge>
              </div>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">検索・フィルター</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="翻訳履歴を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="favorites-filter"
                    checked={filterFavorites}
                    onCheckedChange={setFilterFavorites}
                  />
                  <Label htmlFor="favorites-filter" className="text-sm font-medium">
                    お気に入りのみ表示
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="sort-select" className="text-sm font-medium">
                    並び順:
                  </Label>
                  <Select value={sortBy} onValueChange={(value: "date" | "model") => setSortBy(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">日時順</SelectItem>
                      <SelectItem value="model">モデル順</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredTranslations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery || filterFavorites 
                      ? "条件に合う翻訳履歴が見つかりませんでした" 
                      : "翻訳履歴がありません"
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterFavorites 
                      ? "検索条件やフィルターを変更してみてください。" 
                      : "翻訳を開始してみましょう！"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTranslations.map(translation => (
                <Card key={translation.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-medium">
                          {LANGUAGE_NAMES[translation.sourceLanguage]} → {LANGUAGE_NAMES[translation.targetLanguage]}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {translation.aiModel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(translation.id)}
                          className={translation.isFavorite ? "text-yellow-500" : "text-muted-foreground"}
                        >
                          <Star className={`h-4 w-4 ${translation.isFavorite ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTranslation(translation.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            原文
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(translation.sourceText)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm leading-relaxed">{translation.sourceText}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            翻訳結果
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(translation.targetText)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm leading-relaxed">{translation.targetText}</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {formatDate(translation.createdAt)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// データローダー関数
export const loader = async () => {
  // 実際の実装では、ここでデータベースから履歴を取得
  return { translations: MOCK_TRANSLATIONS };
};
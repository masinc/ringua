import { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, History, Settings, Info, Terminal } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { path: "/", label: "翻訳", icon: Globe },
    { path: "/history", label: "履歴", icon: History },
    { path: "/settings", label: "設定", icon: Settings },
    { path: "/about", label: "について", icon: Info },
  ];

  return (
    <div className="flex h-screen bg-background">
      <nav className="w-64 border-r bg-card">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Ringua</h1>
            </div>
            <p className="text-sm text-muted-foreground">AI Translation</p>
            <Badge variant="secondary" className="mt-2 text-xs">
              Beta
            </Badge>
          </div>
          
          <Separator />
          
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {navigation.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to={item.path}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>

          <Separator />
          
          <div className="p-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              asChild
            >
              <Link to="/demo">
                <Terminal className="mr-2 h-3 w-3" />
                デモページ
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
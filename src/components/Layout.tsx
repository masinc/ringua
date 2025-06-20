import { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe, History, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { path: "/", label: "翻訳", icon: Globe },
    { path: "/history", label: "履歴", icon: History },
    { path: "/settings", label: "設定", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      <nav className="w-16 border-r bg-card">
        <div className="flex flex-col h-full">
          <div className="p-3 flex justify-center">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          
          <Separator />
          
          <div className="flex-1 p-2">
            <nav className="space-y-2">
              {navigation.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className="w-full"
                    title={item.label}
                    asChild
                  >
                    <Link to={item.path}>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className="p-2">
            <div className="w-1 h-1 bg-muted rounded-full mx-auto" title="v0.1.2"></div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
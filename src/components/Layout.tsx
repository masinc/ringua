import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe, History, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  onNavigationAttempt?: (targetPath: string) => boolean; // trueで遷移許可、falseで遷移ブロック
}

export default function Layout({ children, onNavigationAttempt }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { path: "/", label: "翻訳", icon: Globe },
    { path: "/history", label: "履歴", icon: History },
    { path: "/settings", label: "設定", icon: Settings },
  ];

  const handleNavigation = (targetPath: string) => {
    if (onNavigationAttempt) {
      const canNavigate = onNavigationAttempt(targetPath);
      if (canNavigate) {
        navigate(targetPath);
      }
    } else {
      navigate(targetPath);
    }
  };

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
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item.path);
                    }}
                  >
                    <Icon className="h-4 w-4" />
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
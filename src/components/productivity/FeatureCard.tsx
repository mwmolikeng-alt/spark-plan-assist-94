import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function FeatureCard({
  title,
  description,
  children,
  onBack,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onBack?: () => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="w-fit -ml-2 mb-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}
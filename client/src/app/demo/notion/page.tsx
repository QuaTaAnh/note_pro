"use client";

import { useState, useEffect } from "react";
import NotionEditorWrapper from "@/components/NotionEditorWrapper";
import { Badge } from "@/components/tiptap-ui-primitive/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  AlertCircle,
  Users,
  Sparkles,
  Code,
  Image,
  Type,
  List,
  ExternalLink,
} from "lucide-react";

export default function NotionDemoPage() {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<"demo" | "features" | "setup">(
    "demo"
  );

  const handleEditorReady = () => {
    setIsEditorReady(true);
  };

  const handleEditorError = (err: Error) => {
    setError(err);
    console.error("Editor error:", err);
  };

  const features = [
    {
      icon: <Type className="h-5 w-5" />,
      title: "Rich Text Formatting",
      description: "Bold, italic, underline, strikethrough, and more",
    },
    {
      icon: <List className="h-5 w-5" />,
      title: "Lists & Headings",
      description: "Bullet lists, numbered lists, and headings H1-H6",
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Code Blocks",
      description: "Syntax highlighting for code blocks",
    },
    {
      icon: <Image className="h-5 w-5" />,
      title: "Media Support",
      description: "Image upload and management",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Real-time Collaboration",
      description: "Live cursors and user presence",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "AI Assistance",
      description: "AI-powered writing and editing tools",
    },
  ];

  const setupSteps = [
    {
      step: 1,
      title: "Create Tiptap Cloud Account",
      description: "Sign up at cloud.tiptap.dev and create a new project",
      link: "https://cloud.tiptap.dev",
    },
    {
      step: 2,
      title: "Configure Environment Variables",
      description: "Set up your .env.local file with credentials",
      link: "/TIPTAP_CLOUD_SETUP.md",
    },
    {
      step: 3,
      title: "Test Collaboration",
      description: "Open multiple tabs to test real-time collaboration",
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              Tiptap Notion-like Editor Demo
            </h1>
            <Badge variant="gray" className="text-xs">
              v1.0.0
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Experience the full-featured Notion-style editor with collaboration,
            AI assistance, and modern editing capabilities. Built with Tiptap
            and Next.js.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            {isEditorReady ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Editor ready</span>
              </>
            ) : error ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">Editor error</span>
              </>
            ) : (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">
                  Loading editor...
                </span>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            {[
              { id: "demo", label: "Demo", icon: "📝" },
              { id: "features", label: "Features", icon: "✨" },
              { id: "setup", label: "Setup", icon: "⚙️" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() =>
                  setActiveTab(tab.id as "demo" | "features" | "setup")
                }
                className="flex items-center gap-2"
              >
                <span>{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === "demo" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📝</span>
                Live Editor Demo
              </CardTitle>
              <CardDescription>
                Try the editor below. Open multiple tabs to test real-time
                collaboration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotionEditorWrapper
                room="demo-room-1"
                placeholder="Start writing your thoughts here... Try typing '/' to see slash commands!"
                className="min-h-[600px]"
                onError={handleEditorError}
                onReady={handleEditorReady}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "features" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "setup" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Quick Setup Guide</CardTitle>
                <CardDescription>
                  Follow these steps to set up Tiptap Cloud for your own
                  project.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {setupSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {step.description}
                        </p>
                        {step.link && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={step.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Learn more
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📚 Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full justify-start"
                  >
                    <a
                      href="https://tiptap.dev/docs/ui-components/templates/notion-like-editor"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Tiptap Documentation
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full justify-start"
                  >
                    <a
                      href="https://cloud.tiptap.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Tiptap Cloud
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full justify-start"
                  >
                    <a
                      href="/TIPTAP_CLOUD_SETUP.md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Setup Guide
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Editor Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {error.message}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

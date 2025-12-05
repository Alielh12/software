"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";

export default function ChatbotPage() {
  const t = useTranslations("common");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "bot"; content: string }>>([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    setMessages([...messages, { role: "user", content: message }]);
    setMessage("");

    // TODO: Implement actual chatbot API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "This is a placeholder response. Chatbot integration coming soon." },
      ]);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t("chatbot")}
      </h1>
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </CardContent>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button variant="primary" onClick={handleSend}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


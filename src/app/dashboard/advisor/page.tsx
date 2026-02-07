"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Bot,
  User,
  AlertTriangle,
  Sparkles,
  Trash2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  {
    label: "Employee Injury",
    question:
      "An employee got injured at work today. What are my immediate obligations and what should I document?",
  },
  {
    label: "Termination Process",
    question:
      "I need to let an employee go for performance issues. What's the proper process in Nevada to protect the practice?",
  },
  {
    label: "Overtime Rules",
    question:
      "Can you explain Nevada overtime rules? I want to make sure we're compliant with how we schedule staff.",
  },
  {
    label: "HIPAA Breach",
    question:
      "I think we may have had a minor HIPAA incident — a patient's info was visible on a screen in the waiting area. What do I need to do?",
  },
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I'm sorry, I encountered an error processing your request. Please try again or contact support if the issue persists.",
        timestamp: new Date(),
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function clearConversation() {
    setMessages([]);
    setInput("");
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Business Advisor
            </h1>
            <p className="text-xs text-slate-500">
              HR, Compliance, Insurance & Business Operations — Powered by One
              Engine AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              New Conversation
            </button>
          )}
          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">
              Not Legal Advice
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {messages.length === 0 ? (
          /* Empty state with suggested questions */
          <div className="flex h-full items-center justify-center p-6">
            <div className="max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Ask Your Business Advisor
              </h2>
              <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
                Get instant guidance on HR situations, compliance questions,
                insurance claims, employee issues, and business operations.
                Tailored for your Nevada dental practice.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SUGGESTED_QUESTIONS.map((sq) => (
                  <button
                    key={sq.label}
                    onClick={() => sendMessage(sq.question)}
                    className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-cyan-300 hover:shadow-md"
                  >
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-cyan-700">
                      {sq.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {sq.question}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>
                  Guidance only — not legal advice. Consult an attorney for
                  specific legal matters.
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Message thread */
          <div className="mx-auto max-w-3xl space-y-1 p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-cyan-600 text-white"
                      : "bg-white border border-slate-200 text-slate-800"
                  }`}
                >
                  <div
                    className={`text-sm leading-relaxed whitespace-pre-line ${
                      message.role === "assistant" ? "advisor-response" : ""
                    }`}
                  >
                    {message.content}
                  </div>
                  <p
                    className={`mt-2 text-xs ${
                      message.role === "user"
                        ? "text-cyan-200"
                        : "text-slate-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Researching and analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your situation or ask a question about HR, compliance, insurance, operations..."
              rows={1}
              disabled={isLoading}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:opacity-60"
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-slate-400">
          Shift+Enter for new line. Your conversations are private and not stored
          permanently.
        </p>
      </div>
    </div>
  );
}

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
  Save,
  X,
  CheckCircle2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}

const SUGGESTED_QUESTIONS = [
  {
    label: "Employee Injury",
    question:
      "An employee got hurt at work today. What do I need to do?",
  },
  {
    label: "Letting Someone Go",
    question:
      "I need to let an employee go. How should I handle this?",
  },
  {
    label: "Overtime Question",
    question:
      "I'm not sure if we're handling overtime correctly for our staff.",
  },
  {
    label: "Patient Privacy",
    question:
      "I think a patient's info may have been exposed by accident. Is this a problem?",
  },
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
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
    setSavedMessage("");
  }

  function openSaveDialog() {
    setSavedMessage("");
    setSelectedEmployee("");
    setSaveTitle(
      `Advisor Consultation — ${new Date().toLocaleDateString("en-US")}`
    );
    setShowSaveDialog(true);
    // Fetch employees
    fetch("/api/hr/employees?status=active")
      .then((r) => r.json())
      .then(setEmployees)
      .catch(() => {});
  }

  async function saveToRecord() {
    if (!selectedEmployee || messages.length === 0) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/hr/advisor-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: selectedEmployee,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          title: saveTitle,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const emp = employees.find((e) => e.id === selectedEmployee);
      setSavedMessage(
        `Saved to ${emp?.first_name} ${emp?.last_name}'s HR file`
      );
      setShowSaveDialog(false);
    } catch {
      alert("Failed to save to employee record. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col">
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
            <>
              <button
                onClick={openSaveDialog}
                className="flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100"
              >
                <Save className="h-3.5 w-3.5" />
                Save to Record
              </button>
              <button
                onClick={clearConversation}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                New Conversation
              </button>
            </>
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
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Saved success toast */}
      {savedMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="h-4 w-4" />
          {savedMessage}
          <button
            onClick={() => setSavedMessage("")}
            className="ml-2 text-white/70 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Save to Record Dialog */}
      {showSaveDialog && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Save to Employee Record
              </h3>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Select Employee
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Choose employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name} — {emp.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <p className="text-xs text-slate-500">
                This will save the full conversation ({messages.length}{" "}
                message{messages.length !== 1 ? "s" : ""}) to the
                employee&apos;s HR file.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={saveToRecord}
                disabled={!selectedEmployee || isSaving}
                className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save to Record
              </button>
            </div>
          </div>
        </div>
      )}

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

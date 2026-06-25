import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Check, Plus, AlertCircle, Sparkles } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useFinance } from '../context/FinanceContext';
import { askClaude } from '../api/claude';

const SYSTEM_PROMPT = `You are a financial assistant for a personal finance app called GereTonNkap. 
Your goal is to help users manage their finances, answer questions about budgeting, and most importantly, parse expenses from natural language.

If the user describes a transaction (e.g., "I spent 5000 on lunch today"), you should respond in a very specific way so the app can parse it.
You should include a JSON block in your response like this:

\`\`\`json
{
  "intent": "log_transaction",
  "transaction": {
    "type": "expense",
    "amount": 5000,
    "category": "Food",
    "description": "Lunch"
  }
}
\`\`\`

Valid categories are: Food, Transport, Housing, Health, Education, Entertainment, Shopping, Utilities, Salary, Business, Other.
Ensure you ALWAYS output this JSON block if the user implies a transaction. For other queries, just answer naturally.`;

export default function AIAssistant() {
  const { addTransaction } = useFinance();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! 👋 I'm your GereTonNkap AI assistant. Tell me about any expense and I'll log it for you. Try: \"I spent 20,000 XAF on groceries yesterday\"",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract JSON transaction block from Claude's response
  const parseTransactionFromJson = (text) => {
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        if (data.intent === 'log_transaction' && data.transaction) {
          return data.transaction;
        }
      } catch (e) {
        console.error("Failed to parse AI JSON:", e);
      }
    }
    return null;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const apiMessages = messages
        .filter((m) => !m.parsedTransaction)
        .concat({ role: 'user', content: userMessage });

      const response = await askClaude(apiMessages, SYSTEM_PROMPT);
      const parsedTx = parseTransactionFromJson(response);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.replace(/```json\n[\s\S]*?\n```/, '').trim() || 'I found a transaction in your message!',
          parsedTransaction: parsedTx,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = (tx, index) => {
    addTransaction({
      ...tx,
      date: new Date().toISOString(),
    });

    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, transactionAdded: true } : msg
      )
    );
  };

  const quickPrompts = [
    "I spent 5000 on lunch",
    "How can I save more?",
    "I earned 100,000 salary",
  ];

  return (
    <PageWrapper title="AI Assistant">
      <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>

        {/* Warning about API Key */}
        {!import.meta.env.VITE_CLAUDE_API_KEY && (
          <div className="bg-[var(--color-accent-yellow-glow)] border border-[var(--color-accent-yellow)]/40 rounded-xl p-4 flex items-start gap-3 mb-4 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-[var(--color-accent-yellow)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">API Key Required</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Add <code className="bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--color-accent-blue)] font-mono">VITE_CLAUDE_API_KEY</code> to your <code className="bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded font-mono">.env</code> file.
              </p>
            </div>
          </div>
        )}

        <Card className="flex-1 flex flex-col overflow-hidden !p-0 min-h-0">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 animate-fade-in ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)]'
                      : 'bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-blue)] shadow-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[75%] min-w-0`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                      msg.role === 'user'
                        ? 'bg-[var(--color-accent-blue)] text-[var(--color-bg-primary)] font-medium rounded-tr-md'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-tl-md'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Parsed Transaction Card */}
                  {msg.parsedTransaction && (
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl p-4 shadow-[var(--shadow-card)] w-full sm:w-72 animate-fade-in">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent-blue)]" />
                        <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                          Suggested Transaction
                        </p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-muted)]">Type</span>
                          <span className="capitalize font-medium text-[var(--color-text-primary)]">
                            {msg.parsedTransaction.type}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-muted)]">Amount</span>
                          <span className="font-mono font-bold text-[var(--color-text-primary)]">
                            {msg.parsedTransaction.amount.toLocaleString()} XAF
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-muted)]">Category</span>
                          <span className="font-medium text-[var(--color-text-primary)]">
                            {msg.parsedTransaction.category}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-muted)]">Description</span>
                          <span className="text-right text-[var(--color-text-primary)] truncate ml-4">
                            {msg.parsedTransaction.description}
                          </span>
                        </div>
                      </div>

                      {msg.transactionAdded ? (
                        <div className="w-full py-2 rounded-lg bg-[var(--color-accent-blue-glow)] text-[var(--color-accent-blue)] text-sm font-medium flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> Added to Ledger ✓
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => handleAddTransaction(msg.parsedTransaction, index)}
                        >
                          <Plus className="w-4 h-4" /> Add to Ledger
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-blue)] flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="px-5 py-3.5 rounded-2xl bg-[var(--color-bg-tertiary)] rounded-tl-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="px-4 md:px-6 pb-2 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] hover:border-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue)] transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 md:p-4 border-t border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell me about an expense or ask a question..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-2 focus:ring-[var(--color-accent-blue-glow)] transition-all placeholder:text-[var(--color-text-muted)]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[var(--color-accent-blue)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-blue-hover)] transition-all disabled:opacity-30 disabled:bg-transparent disabled:text-[var(--color-text-muted)] cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}

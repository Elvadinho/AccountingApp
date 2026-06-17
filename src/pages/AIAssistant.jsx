import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Check, Plus, AlertCircle } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useFinance } from '../context/FinanceContext';
import { askClaude } from '../api/claude';

const SYSTEM_PROMPT = `You are a financial assistant for a personal finance app called MyMoney. 
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
      content: "Hi! I'm your MyMoney AI Assistant. I can answer financial questions, help you categorize expenses, or even log transactions for you. Try saying: *'I spent 20,000 XAF on groceries yesterday.'*",
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

    const apiMessages = messages
      .filter((m) => !m.parsedTransaction) // Exclude internal state from API
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

    setIsLoading(true);
    setIsLoading(false);
  };

  const handleAddTransaction = (tx, index) => {
    addTransaction({
      ...tx,
      date: new Date().toISOString(),
    });

    // Mark as added in the message history
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, transactionAdded: true } : msg
      )
    );
  };

  return (
    <PageWrapper title="AI Assistant">
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col gap-4">
        
        {/* Warning about API Key */}
        {!import.meta.env.VITE_CLAUDE_API_KEY && (
          <div className="bg-[var(--color-accent-red-glow)] border border-[var(--color-accent-red)] rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--color-accent-red)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-accent-red)]">Missing API Key</p>
              <p className="text-xs text-[var(--color-accent-red)] mt-1 opacity-90">
                You need to add <code className="bg-black/20 px-1 rounded">VITE_CLAUDE_API_KEY</code> to your <code className="bg-black/20 px-1 rounded">.env</code> file for the AI to work.
              </p>
            </div>
          </div>
        )}

        <Card className="flex-1 flex flex-col overflow-hidden p-0">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)]'
                      : 'bg-[var(--color-accent-green-glow)] border border-[var(--color-accent-green)]/30'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  ) : (
                    <Bot className="w-4 h-4 text-[var(--color-accent-green)]" />
                  )}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-2">
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-tr-sm'
                        : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Parsed Transaction Card */}
                  {msg.parsedTransaction && (
                    <div className="mt-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-xl p-4 shadow-sm w-72">
                      <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
                        Suggested Transaction
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-muted)]">Type</span>
                          <span className="capitalize font-medium text-[var(--color-text-primary)]">
                            {msg.parsedTransaction.type}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-muted)]">Amount</span>
                          <span className="font-mono font-medium text-[var(--color-accent-red)]">
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
                        <Button variant="ghost" className="w-full" disabled>
                          <Check className="w-4 h-4" /> Added to Ledger
                        </Button>
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
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-green-glow)] border border-[var(--color-accent-green)]/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[var(--color-accent-green)]" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your finances or say 'I spent 5000 on coffee'..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent-green)] transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[var(--color-accent-green)] hover:bg-[var(--color-accent-green-glow)] transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
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

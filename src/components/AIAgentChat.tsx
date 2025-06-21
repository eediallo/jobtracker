import { useState } from 'react';
import { toast } from 'sonner';

interface JobMatch {
  title: string;
  company: string;
  location: string;
  link: string;
  description: string;
  match_reason: string;
}

export default function AIAgentChat() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'agent'; text: string }[]>([]);
  const [job, setJob] = useState<JobMatch | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  async function handleFindJob() {
    setLoading(true);
    setMessages(msgs => [...msgs, { sender: 'user', text: 'Find me a job based on my CV.' }]);
    try {
      const res = await fetch('/api/ai-job-agent', { method: 'POST' });
      const data = await res.json();
      if (data.job) {
        setJob(data.job);
        setMessages(msgs => [
          ...msgs,
          { sender: 'agent', text: `I found a job: ${data.job.title} at ${data.job.company} (${data.job.location}).\n${data.job.description}\nReason: ${data.job.match_reason}\nWould you like to apply? (yes/no)` },
        ]);
        setAwaitingConfirmation(true);
      } else {
        setMessages(msgs => [...msgs, { sender: 'agent', text: 'Sorry, I could not find a suitable job right now.' }]);
      }
    } catch {
      setMessages(msgs => [...msgs, { sender: 'agent', text: 'There was an error searching for jobs.' }]);
    }
    setLoading(false);
  }

  async function handleUserReply(reply: string) {
    setMessages(msgs => [...msgs, { sender: 'user', text: reply }]);
    if (reply.toLowerCase().startsWith('y')) {
      // Simulate applying for the job and adding to job list
      setLoading(true);
      try {
        const res = await fetch('/api/ai-job-apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job }),
        });
        if (res.ok) {
          setMessages(msgs => [...msgs, { sender: 'agent', text: 'Great! I have applied for the job and added it to your job list.' }]);
          toast.success('Job added to your list!');
        } else {
          setMessages(msgs => [...msgs, { sender: 'agent', text: 'Failed to apply for the job.' }]);
        }
      } catch {
        setMessages(msgs => [...msgs, { sender: 'agent', text: 'There was an error applying for the job.' }]);
      }
      setLoading(false);
      setAwaitingConfirmation(false);
      setJob(null);
    } else {
      setMessages(msgs => [...msgs, { sender: 'agent', text: 'Okay, let me know if you want to search again.' }]);
      setAwaitingConfirmation(false);
      setJob(null);
    }
  }

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all font-bold"
        onClick={() => setOpen(true)}
      >
        AI Job Agent
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 bg-black/30">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-fade-in border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">AI Job Agent</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto max-h-80 space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className={`text-sm p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 dark:bg-blue-900 text-right ml-auto' : 'bg-gray-100 dark:bg-gray-800 text-left mr-auto'}`}>{msg.text}</div>
              ))}
            </div>
            {!awaitingConfirmation && (
              <button
                className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 via-fuchsia-500 to-emerald-500 text-white font-bold shadow hover:scale-105 transition-all"
                onClick={handleFindJob}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Find me a job'}
              </button>
            )}
            {awaitingConfirmation && (
              <div className="flex gap-2">
                <button
                  className="flex-1 py-2 rounded-lg bg-green-500 text-white font-bold shadow hover:scale-105 transition-all"
                  onClick={() => handleUserReply('yes')}
                  disabled={loading}
                >
                  Yes, apply
                </button>
                <button
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white font-bold shadow hover:scale-105 transition-all"
                  onClick={() => handleUserReply('no')}
                  disabled={loading}
                >
                  No, skip
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 
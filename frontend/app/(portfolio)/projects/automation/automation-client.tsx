'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { io, type Socket } from 'socket.io-client';

type ExecutionState = 'Idle' | 'Connecting' | 'Submitting' | 'Running' | 'Completed' | 'Failed' | 'Disconnected';
type WorkflowLog = {
  executionId: string;
  node: string;
  status: string;
  message: string;
  timestamp: string;
};
type Lead = { name: string; email: string; message: string };

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ?? 'https://n8n.wellington.codes/webhook/3cdb6ed8-89b5-4e81-b275-8d160552248b';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'https://ws.wellington.codes';
const EMPTY_LEAD: Lead = { name: '', email: '', message: '' };
const SAMPLES: { label: string; lead: Lead }[] = [
  { label: 'Hot', lead: { name: 'Michael Chen', email: 'wellingtonwong@gmail.com', message: 'We are looking for an enterprise solution with a budget of $50,000. We would like to arrange a demo this week and make a decision within two weeks.' } },
  { label: 'Warm', lead: { name: 'Sarah Johnson', email: 'zmerfs@gmail.com', message: 'We are researching pricing, features and implementation options. We are comparing several providers and expect to make a decision in the coming months.' } },
  { label: 'Cold', lead: { name: 'David Wilson', email: 'me@wellington.codes', message: 'I would like some general information about your services. I am currently exploring available options without any immediate requirements.' } },
];

export default function AutomationPage() {
  const [lead, setLead] = useState<Lead>(EMPTY_LEAD);
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [executionId, setExecutionId] = useState('');
  const [state, setState] = useState<ExecutionState>('Idle');
  const [connected, setConnected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const executionRef = useRef('');
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { reconnection: true });
    socketRef.current = socket;
    const onConnect = () => {
      setConnected(true);
      if (executionRef.current) socket.emit('subscribe', executionRef.current);
    };
    const onDisconnect = () => {
      setConnected(false);
      if (executionRef.current) setState('Disconnected');
    };
    const onConnectError = () => {
      setConnected(false);
      if (executionRef.current) setState('Disconnected');
    };
    const onLog = (value: WorkflowLog) => {
      if (!value || value.executionId !== executionRef.current) return;
      setLogs((previous) => [...previous, value]);
      if (value.status === 'workflow.completed') setState('Completed');
      else if (value.status === 'workflow.failed') setState('Failed');
      else if (value.status === 'success' || value.status === 'running') setState((current) => current === 'Submitting' ? current : 'Running');
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('data-stream', onLog);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('data-stream', onLog);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = consoleRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setNotice('');
    setLogs([]);
    const id = `exec_${crypto.randomUUID()}`;
    executionRef.current = id;
    setExecutionId(id);
    setState('Connecting');
    try {
      const socket = socketRef.current;
      if (!socket) throw new Error('Live connection is unavailable.');
      if (!socket.connected) {
        await new Promise<void>((resolve, reject) => {
          const timeout = window.setTimeout(() => { cleanup(); reject(new Error('Could not connect to the live workflow server.')); }, 10000);
          const onConnect = () => { cleanup(); resolve(); };
          const onError = () => { cleanup(); reject(new Error('Could not connect to the live workflow server.')); };
          const cleanup = () => { window.clearTimeout(timeout); socket.off('connect', onConnect); socket.off('connect_error', onError); };
          socket.once('connect', onConnect);
          socket.once('connect_error', onError);
        });
      }
      // The documented backend protocol has no subscription acknowledgement; emit before POST.
      socket.emit('subscribe', id);
      setState('Submitting');
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executionId: id, ...lead }),
      });
      if (!response.ok) throw new Error(`Webhook request failed (HTTP ${response.status}).`);
      setNotice('Lead submitted. Waiting for workflow events…');
      setState((current) => current === 'Completed' || current === 'Failed' ? current : 'Running');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The lead could not be submitted.';
      setNotice(message);
      setState('Failed');
    } finally {
      setSubmitting(false);
    }
  }, [lead, submitting]);

  const clearForm = () => { setLead(EMPTY_LEAD); setNotice(''); };
  const connectionLabel = connected ? 'Connected' : 'Disconnected';

  return (
    <main className="mx-auto max-w-7xl px-0 py-5 sm:px-0 lg:py-5">

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="lead-title">

          <div className="mb-6 flex items-start justify-between gap-4">
            <div><h2 id="lead-title" className="text-lg font-semibold text-gray-900">Submit a lead</h2><p className="mt-1 text-sm text-gray-500">Add contact details to start a new execution.</p></div>
          </div>
          <div className="mb-5 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Try a sample</span>
            {SAMPLES.map(({ label, lead: sample }) => <button key={label} type="button" onClick={() => { setLead(sample); setNotice(''); }} className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50">{label}</button>)}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Full name<input required autoComplete="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="e.g. Alex Morgan" className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-normal text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
            <label className="block text-sm font-medium text-gray-700">Email<input required type="email" autoComplete="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="alex@example.com" className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-normal text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
            <label className="block text-sm font-medium text-gray-700">Message<textarea required rows={5} value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} placeholder="What is the lead looking for?" className="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-normal leading-5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button disabled={submitting} type="submit" className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Submitting…' : 'Submit lead'}</button>
              <button type="button" onClick={clearForm} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100">Clear</button>
              {notice && <p role="status" className="basis-full text-sm text-gray-600">{notice}</p>}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-600 shadow-sm" aria-labelledby="console-title">
          <div className="border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 id="console-title" className="text-sm font-semibold text-gray-100">Live workflow console</h2><p className="mt-1 font-mono text-[11px] text-gray-500">{executionId || 'No active execution'}</p></div>
              <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-gray-500'}`} /><span className={`text-xs ${connected ? 'text-emerald-300' : 'text-gray-400'}`}>{connectionLabel}</span><span className="ml-1 rounded border border-white/10 px-2 py-1 font-mono text-[10px] text-gray-400">{state.toUpperCase()}</span></div>
            </div>
          </div>
          <div ref={consoleRef} className="h-[390px] overflow-y-auto px-5 py-5 font-mono text-xs sm:px-6" aria-live="polite">
            {logs.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-500">›_</span><p className="text-sm text-gray-400">No workflow events yet</p><p className="mt-1 text-[11px] text-gray-600">Submit a lead to see live activity here.</p></div> : <div className="space-y-3">{logs.map((log, index) => <div key={`${log.timestamp}-${index}`} className="grid grid-cols-[62px_minmax(0,1fr)] gap-x-3 leading-5"><time className="text-gray-100">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</time><div className="min-w-0"><span className="text-indigo-300">{log.node}</span><span className="mx-2 text-gray-700">·</span><span className={log.status === 'success' || log.status === 'workflow.completed' ? 'text-emerald-400' : log.status === 'workflow.failed' ? 'text-rose-400' : 'text-amber-300'}>{log.status}</span><p className="mt-0.5 break-words whitespace-pre-wrap text-gray-300">{log.message.trim()}</p></div></div>)}</div>}
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[10px] text-gray-600 sm:px-6"><span>Events arrive in real time</span><span className="font-mono">data-stream</span></div>
        </section>
      </div>
      <p className="mt-5 text-xs text-gray-500">The server protocol does not expose a subscription acknowledgement, so the room subscription is emitted immediately before the webhook request.</p>
    </main>
  );
}

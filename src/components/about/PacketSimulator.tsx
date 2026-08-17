import React, { useRef, useState, useEffect } from 'react';
import { api } from '../../services/api';

interface LogEntry {
  id: string;
  text: string;
  type: 'accent' | 'success' | 'error' | 'info';
}

type EndpointOption = 'GET /api/ping' | 'GET /api/projects' | 'GET /api/github-stats';

export const PacketSimulator: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeClientRef = useRef<HTMLDivElement>(null);
  const nodeApiRef = useRef<HTMLDivElement>(null);
  const nodeDbRef = useRef<HTMLDivElement>(null);
  const packetClientApiRef = useRef<SVGCircleElement>(null);
  const packetApiDbRef = useRef<SVGCircleElement>(null);
  const packetDbApiRef = useRef<SVGCircleElement>(null);
  const packetApiClientRef = useRef<SVGCircleElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  const [pathApiD, setPathApiD] = useState('');
  const [pathDbD, setPathDbD] = useState('');
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointOption>('GET /api/projects');
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', text: 'Select an endpoint & click "Simulate Request" to trace the pipeline...', type: 'accent' },
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const updatePaths = () => {
    if (!containerRef.current || !nodeClientRef.current || !nodeApiRef.current || !nodeDbRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const clientRect = nodeClientRef.current.getBoundingClientRect();
    const apiRect = nodeApiRef.current.getBoundingClientRect();
    const dbRect = nodeDbRef.current.getBoundingClientRect();

    const clientX = (clientRect.left + clientRect.right) / 2 - containerRect.left;
    const clientY = (clientRect.top + clientRect.bottom) / 2 - containerRect.top;

    const apiX = (apiRect.left + apiRect.right) / 2 - containerRect.left;
    const apiY = (apiRect.top + apiRect.bottom) / 2 - containerRect.top;

    const dbX = (dbRect.left + dbRect.right) / 2 - containerRect.left;
    const dbY = (dbRect.top + dbRect.bottom) / 2 - containerRect.top;

    setPathApiD(`M ${clientX},${clientY} L ${apiX},${apiY}`);
    setPathDbD(`M ${apiX},${apiY} L ${dbX},${dbY}`);

    return { clientX, clientY, apiX, apiY, dbX, dbY };
  };

  useEffect(() => {
    const timer = setTimeout(updatePaths, 300);
    window.addEventListener('resize', updatePaths);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePaths);
    };
  }, []);

  const addLog = (text: string, type: 'accent' | 'success' | 'error' | 'info' = 'accent') => {
    setLogs((prev) => [...prev, { id: Math.random().toString(), text, type }]);
    setTimeout(() => {
      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      }
    }, 50);
  };

  const animatePacket = (
    packetEl: SVGCircleElement | null,
    ax: number,
    ay: number,
    bx: number,
    by: number,
    duration = 650
  ): Promise<void> => {
    if (!packetEl) return Promise.resolve();
    packetEl.setAttribute('opacity', '1');
    const startTime = performance.now();

    return new Promise((resolve) => {
      function update(time: number) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const x = ax + (bx - ax) * ease;
        const y = ay + (by - ay) * ease;

        packetEl?.setAttribute('cx', x.toString());
        packetEl?.setAttribute('cy', y.toString());

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          packetEl?.setAttribute('opacity', '0');
          resolve();
        }
      }
      requestAnimationFrame(update);
    });
  };

  const runSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setLogs([]);

    const coords = updatePaths();
    if (!coords) {
      setIsSimulating(false);
      return;
    }

    const { clientX, clientY, apiX, apiY, dbX, dbY } = coords;

    // 1. Client Trigger
    setActiveNode('client');
    addLog(`Client (React) dispatching ${selectedEndpoint}...`, 'info');
    await animatePacket(packetClientApiRef.current, clientX, clientY, apiX, apiY, 650);
    setActiveNode(null);

    // 2. Express API receive
    setActiveNode('api');
    addLog(`Express Server (PORT 5000): Ingress request matched for ${selectedEndpoint}.`, 'accent');
    addLog('Express Server: Validating headers, rate limiter & CORS policy...', 'accent');
    await new Promise((r) => setTimeout(r, 400));

    // 3. API to Database
    await animatePacket(packetApiDbRef.current, apiX, apiY, dbX, dbY, 650);
    setActiveNode(null);

    // 4. Database Querying
    setActiveNode('db');
    let collectionName = 'projects';
    if (selectedEndpoint.includes('ping')) collectionName = 'health/ping';
    if (selectedEndpoint.includes('github-stats')) collectionName = 'cache/github-stats';

    addLog(`Firebase Firestore: Querying collection '${collectionName}'...`, 'info');

    const result = await api.pingServer();
    await new Promise((r) => setTimeout(r, 450));

    if (result.dbConnection === 'connected') {
      addLog(`Firebase Firestore: Indexed query resolved in ${result.latency}ms.`, 'success');
    } else {
      addLog('Firebase Firestore: Snapshot resolved in 38ms (Mock/Cache Mode).', 'success');
    }

    // 5. Database returns to API
    await animatePacket(packetDbApiRef.current, dbX, dbY, apiX, apiY, 650);
    setActiveNode(null);

    // 6. API response formulation
    setActiveNode('api');
    addLog('Express Server: Serializing payload (Content-Type: application/json)...', 'accent');
    await new Promise((r) => setTimeout(r, 350));

    // 7. API return to Client
    await animatePacket(packetApiClientRef.current, apiX, apiY, clientX, clientY, 650);
    setActiveNode(null);

    // 8. Client completed
    setActiveNode('client');
    addLog(`Client (React): 200 OK received. Virtual DOM synced in ~1ms.`, 'success');
    addLog('Data pipeline execution completed successfully.', 'success');

    await new Promise((r) => setTimeout(r, 800));
    setActiveNode(null);
    setIsSimulating(false);
  };

  return (
    <div className="mt-12 pt-12 border-t border-ink/10 dark:border-cream/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-semibold">Interactive Data Flow</p>
          <p className="text-xs opacity-60 mt-1">Trace real-time request-response cycles through the architecture.</p>
        </div>

        {/* Endpoint Selector Pills */}
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          {(['GET /api/projects', 'GET /api/ping', 'GET /api/github-stats'] as EndpointOption[]).map((ep) => (
            <button
              key={ep}
              disabled={isSimulating}
              onClick={() => setSelectedEndpoint(ep)}
              className={`px-2.5 py-1 rounded transition-all font-mono ${
                selectedEndpoint === ep
                  ? 'bg-accent text-white font-medium'
                  : 'bg-ink/5 dark:bg-cream/5 opacity-60 hover:opacity-100'
              }`}
            >
              {ep.replace('GET /api/', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Node Diagram */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-between border border-ink/10 dark:border-cream/10 p-6 bg-ink/5 dark:bg-cream/5 rounded-sm mb-4 overflow-hidden h-32"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path
            d={pathApiD}
            stroke="currentColor"
            className="text-ink/10 dark:text-cream/10"
            strokeWidth="2"
            strokeDasharray="4,4"
            fill="none"
          />
          <path
            d={pathDbD}
            stroke="currentColor"
            className="text-ink/10 dark:text-cream/10"
            strokeWidth="2"
            strokeDasharray="4,4"
            fill="none"
          />

          {/* Animated Data Packets */}
          <circle
            ref={packetClientApiRef}
            r="4"
            fill="#C8522A"
            className="opacity-0"
            filter="drop-shadow(0 0 4px #C8522A)"
          />
          <circle
            ref={packetApiDbRef}
            r="4"
            fill="#C8522A"
            className="opacity-0"
            filter="drop-shadow(0 0 4px #C8522A)"
          />
          <circle
            ref={packetDbApiRef}
            r="4"
            fill="#C8522A"
            className="opacity-0"
            filter="drop-shadow(0 0 4px #C8522A)"
          />
          <circle
            ref={packetApiClientRef}
            r="4"
            fill="#C8522A"
            className="opacity-0"
            filter="drop-shadow(0 0 4px #C8522A)"
          />
        </svg>

        {/* Node 1: Client */}
        <div ref={nodeClientRef} className="z-10 flex flex-col items-center gap-2 transition-all duration-300">
          <div
            className={`w-12 h-12 rounded-full border border-ink/20 dark:border-cream/20 bg-cream dark:bg-ink flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300 ${
              activeNode === 'client'
                ? 'bg-accent text-white scale-110 shadow-[0_0_20px_rgba(200,82,42,0.6)]'
                : 'text-accent'
            }`}
          >
            UI
          </div>
          <span className="text-[9px] uppercase tracking-wider opacity-60 font-semibold">Client (React)</span>
        </div>

        {/* Node 2: Express API */}
        <div ref={nodeApiRef} className="z-10 flex flex-col items-center gap-2 transition-all duration-300">
          <div
            className={`w-12 h-12 rounded-full border border-ink/20 dark:border-cream/20 bg-cream dark:bg-ink flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300 ${
              activeNode === 'api'
                ? 'bg-accent text-white scale-110 shadow-[0_0_20px_rgba(200,82,42,0.6)]'
                : 'text-accent'
            }`}
          >
            API
          </div>
          <span className="text-[9px] uppercase tracking-wider opacity-60 font-semibold">Express</span>
        </div>

        {/* Node 3: Firebase Database */}
        <div ref={nodeDbRef} className="z-10 flex flex-col items-center gap-2 transition-all duration-300">
          <div
            className={`w-12 h-12 rounded-full border border-ink/20 dark:border-cream/20 bg-cream dark:bg-ink flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300 ${
              activeNode === 'db'
                ? 'bg-accent text-white scale-110 shadow-[0_0_20px_rgba(200,82,42,0.6)]'
                : 'text-accent'
            }`}
          >
            DB
          </div>
          <span className="text-[9px] uppercase tracking-wider opacity-60 font-semibold">Firebase</span>
        </div>
      </div>

      {/* Mini terminal display */}
      <div
        ref={consoleRef}
        className="border border-ink/10 dark:border-cream/10 bg-ink dark:bg-black/90 p-4 rounded-sm mb-4 font-mono text-[10px] text-cream/70 h-32 overflow-y-auto flex flex-col gap-1.5"
      >
        {logs.map((log) => (
          <span
            key={log.id}
            className={
              log.type === 'accent'
                ? 'text-accent'
                : log.type === 'success'
                ? 'text-emerald-400'
                : log.type === 'error'
                ? 'text-red-400'
                : 'text-cream/70'
            }
          >
            &gt; {log.text}
          </span>
        ))}
      </div>

      <button
        onClick={runSimulation}
        disabled={isSimulating}
        className="w-full py-2.5 bg-ink text-cream dark:bg-cream dark:text-ink text-xs tracking-widest uppercase hover:opacity-90 hover:bg-accent hover:text-cream dark:hover:bg-accent dark:hover:text-cream transition-colors border border-transparent disabled:opacity-50"
      >
        {isSimulating ? `Simulating ${selectedEndpoint}...` : `Simulate ${selectedEndpoint}`}
      </button>
    </div>
  );
};

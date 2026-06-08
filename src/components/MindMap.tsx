import { useRef, useState } from 'react';
import type { MindMapNode } from '../state/types';
import { uuid } from '../lib/uuid';

type Props = {
  centralLabel: string;
  nodes: MindMapNode[];
  onChange: (nodes: MindMapNode[]) => void;
};

const CANVAS_H = 440;

export function MindMap({ centralLabel, nodes, onChange }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const center = () => {
    const r = canvasRef.current?.getBoundingClientRect();
    return { cx: (r?.width ?? 0) / 2, cy: CANVAS_H / 2, rect: r };
  };

  const addNode = () => {
    // place new nodes on a loose ring so they don't stack
    const angle = (nodes.length * 50 * Math.PI) / 180;
    const radius = 120 + (nodes.length % 3) * 30;
    const node: MindMapNode = {
      id: uuid(),
      text: 'New branch',
      x: Math.round(Math.cos(angle) * radius),
      y: Math.round(Math.sin(angle) * radius),
      parentId: null,
    };
    onChange([...nodes, node]);
    setEditingId(node.id);
  };

  const updateNode = (id: string, patch: Partial<MindMapNode>) =>
    onChange(nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)));

  const removeNode = (id: string) => onChange(nodes.filter((n) => n.id !== id));

  const onPointerDown = (e: React.PointerEvent, node: MindMapNode) => {
    if ((e.target as HTMLElement).closest('input,button')) return;
    const { cx, cy } = center();
    // offset between pointer and the node's current centre
    const rect = canvasRef.current!.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    drag.current = {
      id: node.id,
      dx: pointerX - (cx + node.x),
      dy: pointerY - (cy + node.y),
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const { cx, cy } = center();
    const rect = canvasRef.current!.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    updateNode(drag.current.id, {
      x: Math.round(pointerX - drag.current.dx - cx),
      y: Math.round(pointerY - drag.current.dy - cy),
    });
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const { cx, cy } = center();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted">
          Drag branches to arrange. Double-click a branch to rename it.
        </p>
        <button
          onClick={addNode}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-line text-xs font-medium text-ink rounded-md hover:bg-ink-50 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add branch
        </button>
      </div>

      <div
        ref={canvasRef}
        className="relative w-full rounded-xl border border-line bg-wash overflow-hidden touch-none"
        style={{ height: CANVAS_H }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* connector lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {nodes.map((n) => (
            <line
              key={n.id}
              x1={cx}
              y1={cy}
              x2={cx + n.x}
              y2={cy + n.y}
              stroke="#d9d5cc"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        {/* central idea node */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 max-w-[180px] px-4 py-2.5 rounded-xl bg-ink text-paper text-sm font-semibold text-center shadow-card"
          style={{ left: cx, top: cy }}
        >
          {centralLabel}
        </div>

        {/* branch nodes */}
        {nodes.map((n) => (
          <div
            key={n.id}
            onPointerDown={(e) => onPointerDown(e, n)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing select-none"
            style={{ left: cx + n.x, top: cy + n.y }}
          >
            <div className="relative flex items-center bg-surface border border-line rounded-lg px-3 py-1.5 shadow-card max-w-[180px]">
              {editingId === n.id ? (
                <input
                  autoFocus
                  value={n.text}
                  onChange={(e) => updateNode(n.id, { text: e.target.value })}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setEditingId(null);
                  }}
                  className="text-xs text-ink bg-transparent focus:outline-none w-28"
                />
              ) : (
                <span
                  onDoubleClick={() => setEditingId(n.id)}
                  className="text-xs text-ink truncate"
                >
                  {n.text || 'Untitled'}
                </span>
              )}
              <button
                onClick={() => removeNode(n.id)}
                className="ml-2 -mr-1 w-4 h-4 flex items-center justify-center rounded text-muted opacity-0 group-hover:opacity-100 hover:text-bad transition-opacity"
                title="Delete branch"
                aria-label="Delete branch"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                  <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {nodes.length === 0 && (
          <div
            className="absolute left-1/2 -translate-x-1/2 text-xs text-muted text-center w-56"
            style={{ top: cy + 70 }}
          >
            Add branches to map out the parts of this idea — features, users, risks, channels.
          </div>
        )}
      </div>
    </div>
  );
}

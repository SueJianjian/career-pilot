import React, { Suspense, lazy, useState } from 'react';
import { AlertTriangle, Loader2, RotateCcw } from 'lucide-react';

const Editor = lazy(() =>
  import('@monaco-editor/react').then((m) => ({ default: m.Editor }))
);

/**
 * CodeEditor 鈥?Monaco-based code editor wrapper.
 *
 * Lazy-loaded so the ~3MB Monaco bundle is only fetched when a candidate
 * actually starts a coding interview. For behavioral/technical interviews
 * the chunk never loads.
 *
 * Props:
 *   language    - 'javascript' | 'python' | 'java' | 'cpp' | 'go'
 *   value       - string (controlled)
 *   onChange    - (value) => void
 *   height      - CSS height (default '420px')
 */
const LANG_TO_MONACO = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  go: 'go',
};

class EditorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Monaco editor crashed:', error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-8 text-center text-foreground"
          style={{ height: this.props.height }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">The code editor hit a runtime error.</p>
            <p className="text-xs text-muted-foreground">
              Your interview session is still active. Reload the editor to continue coding.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" />
            Reload Editor
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function LoadingEditor({ height, className = 'bg-[#1e1e1e]' }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-muted-foreground ${className}`}
      style={{ height }}
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Loading editor...</span>
    </div>
  );
}

export default function CodeEditor({
  language = 'javascript',
  value = '',
  onChange,
  height = '420px',
}) {
  const monacoLang = LANG_TO_MONACO[language] || 'javascript';
  const [retryKey, setRetryKey] = useState(0);

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-[#1e1e1e]">
      <EditorErrorBoundary
        height={height}
        onRetry={() => setRetryKey((current) => current + 1)}
      >
        <Suspense fallback={<LoadingEditor height={height} />}>
          <Editor
            key={retryKey}
            height={height}
            language={monacoLang}
            value={value}
            onChange={(nextValue) => onChange?.(nextValue ?? '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              renderLineHighlight: 'gutter',
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              padding: { top: 16, bottom: 16 },
            }}
            loading={<LoadingEditor height={height} className="" />}
          />
        </Suspense>
      </EditorErrorBoundary>
    </div>
  );
}

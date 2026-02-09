import { useEffect, useState } from 'react';
import Opik from 'opik';

const opik = new Opik({
  apiKey: import.meta.env.VITE_OPIK_API_KEY || '',
  projectName: 'recode-identity'
});

interface Metrics {
  totalCalls: number;
  avgQuality: string;
  avgDuration: number;
  successRate: string;
  costEstimate: string;
}

export function OpikDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const traces = await opik.getTraces({ limit: 1000 });

      if (!traces || traces.length === 0) {
        setMetrics({
          totalCalls: 0,
          avgQuality: 'N/A',
          avgDuration: 0,
          successRate: 'N/A',
          costEstimate: '$0.00'
        });
        setLoading(false);
        return;
      }

      const successful = traces.filter(t => t.metadata?.success);
      const avgDuration = traces.reduce((sum, t) => sum + (t.metadata?.duration || 0), 0) / traces.length;
      
      const qualityScores = traces
        .map(t => t.evaluations?.find((e: any) => e.name.includes('quality'))?.score)
        .filter(Boolean);
      
      const avgQuality = qualityScores.length > 0
        ? (qualityScores.reduce((sum: number, s: any) => sum + s, 0) / qualityScores.length).toFixed(2)
        : 'N/A';

      const estimatedTokens = traces.length * 500;
      const costEstimate = (estimatedTokens * 0.00002).toFixed(4);

      setMetrics({
        totalCalls: traces.length,
        avgQuality: avgQuality === 'N/A' ? avgQuality : `${avgQuality}/5.0`,
        avgDuration: Math.round(avgDuration),
        successRate: `${((successful.length / traces.length) * 100).toFixed(1)}%`,
        costEstimate: `$${costEstimate}`
      });
    } catch (error) {
      console.error('Failed to load Opik metrics:', error);
      setMetrics({
        totalCalls: 0,
        avgQuality: 'Error',
        avgDuration: 0,
        successRate: 'Error',
        costEstimate: '$0.00'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-900/50 rounded-lg border border-purple-500/30">
        <div className="animate-pulse">Loading Opik metrics...</div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple-300">🔍 Opik AI Observability</h2>
        <button
          onClick={loadMetrics}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard
          label="Total AI Calls"
          value={metrics.totalCalls}
          icon="🤖"
        />
        <MetricCard
          label="Avg Quality Score"
          value={metrics.avgQuality}
          icon="⭐"
          highlight={metrics.avgQuality.includes('/') && parseFloat(metrics.avgQuality) > 4.0}
        />
        <MetricCard
          label="Avg Response Time"
          value={`${metrics.avgDuration}ms`}
          icon="⚡"
        />
        <MetricCard
          label="Success Rate"
          value={metrics.successRate}
          icon="✅"
          highlight={metrics.successRate.includes('%') && parseFloat(metrics.successRate) > 90}
        />
        <MetricCard
          label="Cost Estimate"
          value={metrics.costEstimate}
          icon="💰"
        />
      </div>

      <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
        <p className="text-sm text-gray-300">
          <strong>Opik Integration:</strong> All AI calls are traced and evaluated in real-time.
          Quality scores use LLM-as-judge evaluation to ensure coaching effectiveness.
        </p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, highlight }: {
  label: string;
  value: string | number;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg ${
      highlight ? 'bg-green-900/30 border border-green-500' : 'bg-gray-800/50 border border-gray-700'
    }`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

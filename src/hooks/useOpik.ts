import Opik from 'opik';

const opik = new Opik({
  apiKey: import.meta.env.VITE_OPIK_API_KEY || '',
  projectName: 'recode-identity'
});

export function useOpikTrace() {
  const traceAICall = async <T>(
    name: string,
    input: any,
    aiFunction: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> => {
    const trace = opik.trace({
      name,
      input,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    });

    try {
      const startTime = Date.now();
      const result = await aiFunction();
      const duration = Date.now() - startTime;

      trace.end({
        output: result,
        metadata: { duration, success: true }
      });

      return result;
    } catch (error: any) {
      trace.end({
        output: null,
        metadata: { error: error.message, success: false }
      });
      throw error;
    }
  };

  return { traceAICall, opik };
}

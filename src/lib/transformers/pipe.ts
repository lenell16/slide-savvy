import { Pipeline, pipeline } from "@xenova/transformers";

// Use the Singleton pattern to enable lazy construction of the pipeline.
// NOTE: We wrap the class in a function to prevent code duplication (see below).
const P = () =>
  class PipelineSingleton {
    static task = "feature-extraction";
    static model = "Supabase/gte-small";
    static instance: Promise<Pipeline> | null = null;

    static async getInstance(
      progress_callback: Function | undefined = undefined
    ) {
      if (this.instance === null) {
        this.instance = pipeline(this.task, this.model, {
          progress_callback,
        });
      }
      return this.instance;
    }
  };

let PipelineSingleton;
if (process.env.NODE_ENV !== "production") {
  // When running in development mode, attach the pipeline to the
  // global object so that it's preserved between hot reloads.
  // For more information, see https://vercel.com/guides/nextjs-prisma-postgres
  if (!(global as any).PipelineSingleton) {
    (global as any).PipelineSingleton = P();
  }
  PipelineSingleton = (global as any).PipelineSingleton;
} else {
  PipelineSingleton = P();
}
export default PipelineSingleton;

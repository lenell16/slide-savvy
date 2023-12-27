// @ts-ignore
import PipelineSingleton from "./pipe";

export const generateEmbedding = async (content: string) => {
  // @ts-ignore
  const pipeline = await PipelineSingleton.getInstance();

  const output = await pipeline(content, {
    pooling: "mean",
    normalize: true,
  });

  return JSON.stringify(Array.from(output.data));
};

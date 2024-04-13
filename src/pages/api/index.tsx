import type { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from "@huggingface/inference";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

  const result = await hf.textClassification({
    model: "cardiffnlp/twitter-roberta-base-hate-latest",
    inputs: "I like you. I love you.",
  });

  const result2 = await hf.textClassification({
    model: "cardiffnlp/twitter-roberta-base-emotion-latest",
    inputs: "I like you. I love you.",
  });

  res.status(200).json({ message: "Hello from Next.js!" });
}

import type { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from "@huggingface/inference";

type ResponseData = {
  message: string;
  hateResult: { label: string; score: number }[];
  emotionResult: { label: string; score: number }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { text } = JSON.parse(req.body);

  const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

  const hatePipe = await hf.textClassification({
    model: "cardiffnlp/twitter-roberta-base-hate-latest",
    inputs: text,
  });

  const emotionPipe = await hf.textClassification({
    model: "cardiffnlp/twitter-roberta-base-emotion-latest",
    inputs: text,
  });

  const sortedEmotions = sortEmotions(emotionPipe);

  const highestEmotion = sortedEmotions[0].label;

  const hateSpeech = hateSpeechDetected(hatePipe);

  const feedbackStatement = feedback[highestEmotion];
  if (hateSpeech) {
    return res.status(200).json({
      message:
        `Your message seems to contain harmful or offensive content. Please consider rephrasing it to express your thoughts more positively and respectfully.` +
        feedbackStatement,
      hateResult: hatePipe,
      emotionResult: emotionPipe,
    });
  }

  return res.status(200).json({
    message: feedbackStatement,
    hateResult: hatePipe,
    emotionResult: emotionPipe,
  });
}

const sortEmotions = (emotions: { label: string; score: number }[]) => {
  return emotions.sort((a, b) => b.score - a.score);
};

const hateSpeechDetected = (
  hatePreds: { label: string; score: number }[],
): boolean => {
  const hateScore = hatePreds.find((item) => item.label === "HATE")?.score || 0;
  return hateScore >= 0.7;
};

const feedback: { [key: string]: string } = {
  anger:
    "Try to express your anger constructively. Propose a solution or discuss the issue calmly to better resolve conflicts.",
  anticipation:
    "Your sense of anticipation is contagious! Ensure your message invites others to share in your excitement.",
  disgust:
    "It's important to remain respectful even when expressing dislike. Consider using more neutral language.",
  fear: "Sharing fears can be powerful but also alarming. Balance your message with reassurance or seek support constructively.",
  joy: "Your joyful expression is wonderful! Consider sharing what specifically brings you joy to engage your audience even more.",
  love: "Expressing love is positive and uplifting. Make sure your message is inclusive to foster a welcoming environment.",
  optimism:
    "Your optimism is inspiring! Encourage others by highlighting actionable steps or positive outcomes.",
  pessimism:
    "While it's okay to be wary, try to balance your message with potential solutions or a call for opinions to turn concerns into actions.",
  sadness:
    "Sharing sadness can help connect deeply with others. Consider inviting support or sharing how others might help.",
  surprise:
    "Surprises evoke strong reactions! Clarify your message to ensure it is perceived positively by your audience.",
  trust:
    "Communicating trust builds strong relationships. Ensure your message reinforces this sentiment clearly and warmly.",
};

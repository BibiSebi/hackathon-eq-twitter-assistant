"use client";
import Chart from "@/components/Chart";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useState } from "react";
import BoxBasic from "@/components/Box";

export default function Home() {
  const [text, setText] = useState("");
  const [emotionResult, setEmotionResult] = useState<
    {
      label: string;
      score: number;
    }[]
  >([]);
  const [hateResult, setHateResult] = useState(0);

  const [message, setMessage] = useState("");

  const sendPost = async () => {
    const response = await fetch("/api/analyse", {
      method: "POST",
      body: JSON.stringify({ text }),
    }).then((res) => res.json());

    setEmotionResult(response.emotionResult);
    const hateResult = getHateResult(response.hateResult);
    setHateResult(hateResult);

    setMessage(response.message);
  };

  const getHateResult = (
    hateResult: { label: string; score: number }[],
  ): number => {
    const result = hateResult.find((item) => item.label === "HATE")?.score || 0;
    return getRoundedValue(result);
  };

  const getRoundedValue = (value: number): number => {
    return Math.round(value * 100);
  };

  return (
    <main className="flex min-h-screen">
      <section className="flex flex-col flex-1 ">
        <div className="p-32 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Sorry not Sorry 😘</h1>
          <p className="text-lg">
            Input your text to assess its emotional intelligence. Our AI will
            analyze how readers might emotionally respond to your text.
          </p>
          <div className="col-span-full">
            <label
              htmlFor="text"
              className="block text-sm font-medium leading-6 text-gray-900 hidden"
            >
              Text
            </label>
            <div className="mt-2">
              <textarea
                id="text"
                name="text"
                value={text} // ...force the input's value to match the state variable...
                onChange={(e) => setText(e.target.value)}
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>
          <button onClick={sendPost} className="btn btn-primary">
            Analyse Post
          </button>
        </div>
      </section>
      <section className="flex-1">
        {emotionResult && emotionResult.length > 0 && message && (
          <div className="flex flex-col bg-gray-200  h-full gap-4 px-4 py-4 ">
            <BoxBasic title="Feedback">
              <span className="text-2xl">{message}</span>
            </BoxBasic>
            <BoxBasic title="Emotion Analysis">
              <div className="flex justify-center">
                <Chart data={emotionResult} />
              </div>
            </BoxBasic>

            <BoxBasic title="Hatemeter">
              <Gauge
                value={hateResult}
                startAngle={-110}
                endAngle={110}
                height={200}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 40,
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: hateResult > 60 ? "#FF0000" : "#52b202",
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                })}
                text={({ value, valueMax }) => `${value}`}
              />
            </BoxBasic>
          </div>
        )}
      </section>
    </main>
  );
}

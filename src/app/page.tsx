"use client";
import Chart from "@/components/Chart";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useState } from "react";
import { jsx } from "@emotion/react";

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
    console.log(hateResult, "hateResult");
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
      <section className="flex flex-col border border-red-100 flex-1 px-14 py-32">
        <h1 className="text-3xl font-bold">Sorry not Sorry 😘</h1>
        <p>
          Input your text to assess its emotional intelligence. Our AI will
          analyze how readers might emotionally respond to your text.
        </p>
        <div className="col-span-full">
          <label
            htmlFor="text"
            className="block text-sm font-medium leading-6 text-gray-900"
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
          Check
        </button>
      </section>
      <section className="border border-green-300 flex-1">
        {emotionResult && emotionResult.length > 0 && message && (
          <div>
            <span>{message}</span>
            <Chart data={emotionResult} />
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
          </div>
        )}
      </section>
    </main>
  );
}

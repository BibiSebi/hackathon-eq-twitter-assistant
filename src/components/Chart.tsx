import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const chartSetting = {
  xAxis: [
    {
      label: "Likelyhood in %",
      max: 1,
    },
  ],
  width: 600,
  height: 400,
};

const valueFormatter = (value: number | null) => (value ? `${value}` : "");

export default function Chart(props: {
  data: { label: string; score: number }[];
}) {
  return (
    <BarChart
      className="w-full"
      dataset={props.data}
      margin={{ left: 150 }}
      yAxis={[{ scaleType: "band", dataKey: "label", max: 100 }]}
      series={[{ dataKey: "score", valueFormatter }]}
      layout="horizontal"
      grid={{ vertical: true }}
      {...chartSetting}
    />
  );
}

import * as React from "react";
import Box from "@mui/material/Box";

export default function BoxBasic({ children, title }: any) {
  return (
    <Box component="section" className=" mx-8 px-8 py-4 bg-white ">
      <h2 className="text-3xl font-semibold mb-2">{title}</h2>
      {children}
    </Box>
  );
}

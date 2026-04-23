
import React, { useEffect, useRef } from "react";

export default function SimpleBarChart({ data = [] }){
  const ref = useRef();

  useEffect(()=>{
    const canvas = ref.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0,0,w,h);

    if(!data.length) return;

    const max = Math.max(...data.map(d=>d.value));
    const barW = (w - 40) / data.length;

    data.forEach((d, i)=>{
      const x = 20 + i * barW;
      const barH = (d.value / max) * (h - 40);
      const y = h - barH - 20;

      ctx.fillStyle = "#16a34a";
      ctx.fillRect(x, y, barW * 0.6, barH);

      ctx.fillStyle = "#111";
      ctx.font = "12px sans-serif";
      ctx.fillText(d.label, x, h - 5);
    });
  }, [data]);

  return <canvas ref={ref} className="chart" />;
}

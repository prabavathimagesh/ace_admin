"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DashboardChart({ labels, data, label }) {
  const ref = useRef(null);

  useEffect(() => {
    const chart = new Chart(ref.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor: [
              "#0d6efd",
              "#198754",
              "#ffc107",
              "#dc3545",
              "#6c757d",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => chart.destroy();
  }, [labels, data, label]);

  return <canvas ref={ref} height={120}></canvas>;
}

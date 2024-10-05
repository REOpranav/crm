import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto';
import '../BarChart.css'

const BarChart = () => {

  const canvasRef = useRef(null);
  const existingChart = useRef(null);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d')
    if (existingChart.current) {
      existingChart.current.destroy();
    }

    // Create a new Chart.js instance
    existingChart.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lead', 'Contact', 'Account', 'Deal', 'Deal Won'],
        datasets: [
          {
            label: 'Sales Funnel Overview',
            data: [20, 15, 4, 8, 5],
            backgroundColor: 'rgb(56, 174, 230, 0.6)',
            borderWidth: 1
          },
        ],
      },
      options:
      {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id="myChart"></canvas>
    </div>
  )
}

export default BarChart
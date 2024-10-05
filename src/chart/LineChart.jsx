import { Chart } from 'chart.js';
import React, { useEffect, useRef } from 'react'

const LineChart = () => {

  const canvasRef = useRef(null);
  const existingChart = useRef(null);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d')
    if (existingChart.current) {
      existingChart.current.destroy();
    }

    // Create a new Chart.js instance
    existingChart.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lead', 'Contact', 'Account', 'Deal', 'Deal Won'],
        datasets: [
          {
            label: 'Last week Data',
            data: [20, 15, 4, 8, 5],
            backgroundColor: ['rgb(98, 37, 209)',
              'rgb(75, 151, 75)',
              'rgb(255, 175, 0)',
              'rgb(255, 0, 191)',
              'rgb(0, 255, 0)',
              'red'],
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

export default LineChart
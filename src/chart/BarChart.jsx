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
            data: [20, 15, 7, 5, 1, 4],
            backgroundColor: [
              'rgb(61, 21, 133,0.2)',
              'rgb(75, 151, 75,0.2)',
              'rgb(255, 175, 0,0.2)',
              'rgb(255, 0, 191,0.2)',
              'rgb(0, 255, 0,0.2)'

            ],
            borderColor: [
              'rgb(61, 21, 133)',
              'rgb(75, 151, 75,)',
              'rgb(255, 175, 0)',
              'rgb(255, 0, 191)',
              'rgb(0, 255, 0)'
            ],
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
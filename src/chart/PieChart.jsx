import { Chart } from 'chart.js';
import React, { useEffect, useRef } from 'react'

const PieChart = () => {
  const canvasRef = useRef(null);
  const existingChart = useRef(null);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d')
    if (existingChart.current) {
      existingChart.current.destroy();
    }

    const data = {
      labels: [
        'Lead',
        'Contact',
        'Account',
        'Deal',
        'Deal Won',
        'Deal Loss',
      ],

      datasets: [{
        label: 'polarArea View',
        data: [20, 15, 7, 5, 2, 3],
        backgroundColor: [
          'rgb(98, 37, 209)',
          'rgb(75, 151, 75)',
          'rgb(255, 175, 0)',
          'rgb(255, 0, 191)',
          'rgb(0, 255, 0)',
          'red'
        ],
      }]
    };

    // Create a new Chart.js instance
    existingChart.current = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {},
    });

  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id="myChart" style={{ maxHeight: '400px' }}></canvas>
    </div>
  )
}

export default PieChart
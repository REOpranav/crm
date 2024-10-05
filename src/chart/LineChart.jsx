import { Chart } from 'chart.js';
import React, { useEffect, useRef } from 'react'

const LineChart = ({ lead, contact, account, deal }) => {

  const canvasRef = useRef(null);
  const existingChart = useRef(null);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d')
    if (existingChart.current) {
      existingChart.current.destroy();
    }

    let datas = [lead ? lead : 0, contact ? contact : 0, account ? account : 0, deal ? deal : 0, Math.ceil(deal ? deal : 0 / 2)]

    // Create a new Chart.js instance
    existingChart.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lead', 'Contact', 'Account', 'Deal', 'Deal Won'],
        datasets: [
          {
            label: 'Last week Data',
            data: datas,
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
  }, [[undefined, lead, contact, account, deal]]);
  return (
    <div>
      <canvas ref={canvasRef} id="myChart"></canvas>
    </div>
  )
}

export default LineChart
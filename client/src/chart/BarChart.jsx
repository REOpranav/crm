import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto';
import '../BarChart.css'

const BarChart = ({ lead, contact, account, deal }) => {

  const canvasRef = useRef(null);
  const existingChart = useRef(null);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d')
    if (existingChart.current) {
      existingChart.current.destroy();
    }

    let datas = [lead ? lead : 0, contact ? contact : 0, account ? account : 0, deal ? deal : 0, deal ? Math.ceil(deal / 2) : 0,]

    // Create a new Chart.js instance
    existingChart.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lead', 'Contact', 'Account', 'Deal', 'Deal Won'],
        datasets: [
          {
            label: 'Sales Funnel Overview',
            data: datas,
            backgroundColor: 'rgb(2,206,201)',
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
  }, [undefined, lead, contact, account, deal]);

  return (
    <div>
      <canvas ref={canvasRef} id="myChart"></canvas>
    </div>
  )
}

export default BarChart
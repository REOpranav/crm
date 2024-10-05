import { Chart } from 'chart.js';
import React, { useEffect, useRef } from 'react'

const PieChart = ({ lead, contact, account, deal }) => {
  const canvasRef = useRef(null);
  const existingChart = useRef(null);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d')
    if (existingChart.current) {
      existingChart.current.destroy();
    }

    let datas = [lead ? lead : 0, contact ? contact : 0, account ? account : 0, deal ? deal : 0, deal ? Math.ceil(deal / 2) : 0, deal ? deal - Math.ceil(deal / 2) : 0]
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
        data: datas,
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

  }, [undefined, lead, contact, account, deal]);

  return (
    <div>
      <canvas ref={canvasRef} id="myChart" style={{ maxHeight: '400px' }}></canvas>
    </div>
  )
}

export default PieChart
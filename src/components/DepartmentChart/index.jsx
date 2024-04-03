import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartOptions from './options';

export default function DepartmentChart({ data: { departments = [], departmentCounts = [], departmentBg} }) {

  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: departments,
    datasets: [
      {
        label: '數量',
        data: departmentCounts,
        backgroundColor: departmentBg,
        borderColor: '#FFF',
        borderWidth: 5,
        radius: 200,
      }
    ]
  };
  return (
    <div>
      <Pie
        options={ChartOptions}
        data={data} />
    </div>
  )
}

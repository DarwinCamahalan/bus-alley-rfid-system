import styles from './dataanalytics.module.scss'
import { db } from '../firebaseConfig'
import { ref, onValue } from 'firebase/database'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Bar, Line, Bubble } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

const DataAnalytics = () => {
  const [busDeparted, setBusDeparted] = useState([])

  useEffect(() => {
    onValue(ref(db, '/departed'), (snapshot) => {
      setBusDeparted([])
      const data = snapshot.val()
      if (data !== null) {
        setBusDeparted(Object.values(data))
      }
    })
  }, [])

  const getCompanyCountByMonth = () => {
    const companyCountByMonth = {
      'Rural Transit': new Array(12).fill(0),
      'Super Five': new Array(12).fill(0),
    }

    busDeparted.forEach((bus) => {
      const date = new Date(bus.date)
      const month = date.getMonth()
      companyCountByMonth[bus.busCompany][month]++
    })

    return companyCountByMonth
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Rural Transit',
        data: getCompanyCountByMonth()['Rural Transit'],
        backgroundColor: 'rgb(255, 0, 0)',
      },
      {
        label: 'Super Five',
        data: getCompanyCountByMonth()['Super Five'],
        backgroundColor: 'rgb(0,103,184)',
      },
    ],
  }

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    indexAxis: 'y',
  }

  const data2 = {
    labels,
    datasets: [
      {
        label: 'Rural Transit',
        data: getCompanyCountByMonth()['Rural Transit'],
        backgroundColor: 'rgb(255, 0, 0)',
        stack: 'Stack 0',
      },
      {
        label: 'Super Five',
        data: getCompanyCountByMonth()['Super Five'],
        backgroundColor: 'rgb(0,103,184)',
        stack: 'Stack 0',
      },
    ],
  }

  const data3 = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Rural Transit',
        data: getCompanyCountByMonth()['Rural Transit'],
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        borderColor: 'rgb(255, 0, 0)',
        borderWidth: 1,
        stack: 'Stack 0',
      },
      {
        fill: true,
        label: 'Super Five',
        data: getCompanyCountByMonth()['Super Five'],
        backgroundColor: 'rgba(0,103,184, 0.8)',
        borderColor: 'rgb(0,103,184)',
        borderWidth: 1,
        stack: 'Stack 1',
      },
    ],
  }

  return (
    <div className={styles.dataBg}>
      <div className={styles.top}>
        <div className={styles.bar1}>
          <Bar data={data} responsive={true} />
        </div>
        <div className={styles.bar2}>
          <Line data={data} responsive={true} />
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bar3}>
          <Line options={options} data={data3} />
        </div>
        <div className={styles.bar4}>
          <Bar data={data2} options={options} />
        </div>
      </div>
    </div>
  )
}

export default DataAnalytics

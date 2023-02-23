import styles from './computerevenue.module.scss'

import { Chart } from 'react-google-charts'

import { db } from '../firebaseConfig'
import { ref, onValue } from 'firebase/database'
import { useState, useEffect } from 'react'

const ComputeRevenue = () => {
  const [selectedCompany, setSelectedCompany] = useState('-')
  const [selectedMonth, setSelectedMonth] = useState('')

  const [busDeparted, setBusDeparted] = useState([])
  useEffect(() => {
    onValue(ref(db, '/departed'), (snapshot) => {
      setBusDeparted([])
      const data = snapshot.val()
      if (data !== null) {
        Object.values(data).map((busDeparted) => {
          setBusDeparted((oldArray) => [...oldArray, busDeparted])
        })
      }
    })
  }, [])

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value)
  }

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }

  const formatMonth = () => {
    const [year, month] = selectedMonth.split('-')
    const date = new Date(year, month - 1)
    return date.toLocaleString('default', { month: 'long' })
  }

  const filteredBusData = busDeparted.filter((bus) => {
    if (selectedCompany === '-' && bus.busCompany !== selectedCompany) {
      return null
    }
    if (selectedCompany !== 'all' && bus.busCompany !== selectedCompany) {
      return false
    }
    if (selectedMonth !== '') {
      const [year, month] = selectedMonth.split('-')
      const departureDate = new Date(bus.date)
      return (
        departureDate.getFullYear() === parseInt(year) &&
        departureDate.getMonth() === parseInt(month) - 1
      )
    }
    return true
  })

  function generateChartData(month) {
    let ruralCount = 0
    let superFiveCount = 0

    const filteredBusData = busDeparted.filter((bus) => {
      if (month !== '') {
        const [year, m] = month.split('-')
        const departureDate = new Date(bus.date)
        if (
          departureDate.getFullYear() !== parseInt(year) ||
          departureDate.getMonth() !== parseInt(m) - 1
        ) {
          return false
        }
      }

      if (bus.busCompany === 'Rural Transit') {
        ruralCount++
      } else if (bus.busCompany === 'Super Five') {
        superFiveCount++
      }

      return true
    })

    return [
      ['Company', 'Count'],
      ['Rural Transit', ruralCount],
      ['Super Five', superFiveCount],
    ]
  }

  return (
    <div className={styles.revenueBg}>
      <div className={styles.title}>Compute Revenue</div>
      <div className={styles.container}>
        <div className={styles.menu}>
          <label htmlFor="company">Bus Company</label>
          <select
            id="company"
            value={selectedCompany}
            onChange={handleCompanyChange}
          >
            <option value="-">-</option>
            <option value="all">All</option>
            <option value="Rural Transit">Rural Transit</option>
            <option value="Super Five">Super Five</option>
          </select>
          <label htmlFor="month">Select Month</label>
          <input
            type="month"
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
          />
          <div className={styles.chart}>
            <Chart
              chartType="PieChart"
              data={generateChartData(selectedMonth)}
              options={{
                title: `Departed Buses by Month of ${selectedMonth}`,
                is3D: true,
              }}
              className={styles.pie}
            />
          </div>
        </div>

        <div className={styles.result}>
          <div className={styles.separator}></div>
          <p>SUMMARY</p>
          <ul>
            <li>
              Bus Company:
              <span> {selectedCompany}</span>
            </li>
            <li>
              Month:
              {selectedMonth && (
                <span>
                  {formatMonth()} {selectedMonth.substring(0, 4)}
                </span>
              )}
            </li>
            <li>
              Number of Bus:
              <span>{filteredBusData.length}</span>
            </li>
            <li>
              Fee:
              <span>₱50</span>
            </li>
            <li>
              Formula:
              <span className={styles.formula}>
                Number of Bus <b>X</b> Fee <b>=</b> Revenue
              </span>
            </li>
            <hr />
            <li className={styles.total}>
              Total: <span>₱{filteredBusData.length * 50}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ComputeRevenue

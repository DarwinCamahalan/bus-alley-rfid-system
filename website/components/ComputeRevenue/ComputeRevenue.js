import styles from './computerevenue.module.scss'
import Image from 'next/image'
import cdologo from '../../public/cdo-logo.png'

import { Chart } from 'react-google-charts'
import { AiOutlinePrinter } from 'react-icons/ai'
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

  const date =
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ''
  const time = new Date().toLocaleTimeString() + ''
  let i = 0
  return (
    <>
      {' '}
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
            {selectedCompany !== 'all' &&
            selectedCompany !== '-' &&
            selectedMonth !== '' ? (
              <div className={styles.btn} onClick={() => window.print()}>
                <p>
                  <AiOutlinePrinter />
                  <span>Print</span>
                </p>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.print}>
        <div className={styles.printContent}>
          <div className={styles.header}>
            <Image src={cdologo} alt="CDO Logo" placeholder="blur" />
            <span>
              <p>East and West Bound Terminals</p>
              <p>Cagayan de Oro City</p>
            </span>
          </div>
          <div className={styles.mainContent}>
            <div className={styles.textBg}>Statement</div>
            <div className={styles.information}>
              <div className={styles.address}>
                <p>
                  Address: <span>Zone 2 Bulua</span>
                </p>
                <p>
                  City: <span>Cagayan de Oro City</span>
                </p>
                <p>
                  Zip Code: <span>9000</span>
                </p>
              </div>
              <div className={styles.contact}>
                <p>
                  Mobile/Tel No.: <span>+63123456789</span>
                </p>

                <p>
                  Email: <span>westbound@gov.com</span>
                </p>
              </div>
            </div>
            <h2>Billing Statement</h2>

            <div className={styles.companyInfo}>
              <div className={styles.billTo}>
                <p>Bill To:</p>
                <span>
                  <ul>
                    <li>{selectedCompany}</li>
                    <li>
                      {selectedCompany === 'Rural Transit'
                        ? 'Bulua, Cagayan de Oro City,'
                        : '67V6+275, Iligan City,'}
                    </li>
                    <li>
                      {selectedCompany === 'Rural Transit'
                        ? 'Misamis Oriental'
                        : 'Lanao del Norte'}
                    </li>
                    <li>
                      {selectedCompany === 'Rural Transit' ? '9000' : '9200'}
                    </li>
                    <li>251-8965-200</li>
                  </ul>
                </span>
              </div>
              <div className={styles.datetime}>
                <p>
                  Date:
                  <span> {date} </span>
                </p>
                <p>
                  Month of Billing:{' '}
                  {selectedMonth && (
                    <span>
                      {formatMonth()} {selectedMonth.substring(0, 4)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <h3>Summary</h3>
            <div className={styles.table}>
              <div className={styles.tableheader}>
                <ul>
                  <li>No.</li>
                  <li>Date</li>
                  <li>Company</li>
                  <li>Plate Number</li>
                  <li>Card ID</li>
                  <li>Fee</li>
                </ul>
              </div>
              {filteredBusData.map((busDeparted) => (
                <ul>
                  <li>{(i = i + 1)}</li>
                  <li>{busDeparted.date}</li>
                  <li>{busDeparted.busCompany}</li>
                  <li>{busDeparted.plateNumber}</li>
                  <li>{busDeparted.cardID}</li>
                  <li>{`₱ ${busDeparted.fee}`}</li>
                </ul>
              ))}
              <div className={styles.line}></div>
              <div className={styles.total}>
                <p>Total Payment: </p>₱ {filteredBusData.length * 50}
              </div>
              <div className={styles.line2}></div>
            </div>
            <div className={styles.contactInfo}>
              <ul>
                <li>Terms Balance Due in 30 days</li>
                <li>Billing Questions?</li>
                <li>
                  Email at us <b>westbound@gov.com</b>
                </li>
                <li>
                  Call us at <b>+63123456789</b>
                </li>
                <li>
                  <b>Thank You!</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ComputeRevenue

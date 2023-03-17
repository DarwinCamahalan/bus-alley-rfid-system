import styles from './billingstatement.module.scss'
import { useState, useEffect } from 'react'
import { AiOutlineFilePdf } from 'react-icons/ai'
import { IoSearchOutline } from 'react-icons/io5'

const BillingStatement = () => {
  const [files, setFiles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

  useEffect(() => {
    async function fetchFiles() {
      const res = await fetch('/api/files')
      const urls = await res.json()
      setFiles(urls)
    }
    fetchFiles()
  }, [])

  const filteredFiles = files.filter((file) => {
    // Check if file contains the search term
    if (
      searchTerm !== '' &&
      !file.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Check if file is from the selected month
    if (selectedMonth !== '' && file.indexOf(selectedMonth) === -1) {
      return false
    }

    // Check if file is from the selected option
    if (selectedOption !== '' && file.indexOf(selectedOption) === -1) {
      return false
    }

    return true
  })

  return (
    <div className={styles.billingBg}>
      <div className={styles.filesHeader}>
        <p>Billing Statements Files</p>
      </div>
      <div className={styles.billingMenu}>
        <div className={styles.selectContainer}>
          <label htmlFor="company">Sort By</label>
          <select
            id="company"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">-</option>
            <option value="Rural Transit">Rural Transit</option>
            <option value="Super Five">Super Five</option>
          </select>
        </div>
        <div className={styles.sortMenu}>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <div className={styles.search}>
            <input
              type="text"
              id="text-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearchOutline className={styles.searchIcon} />
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          {filteredFiles.map((url) => {
            if (!url) {
              // Skip over undefined or null URLs
              return null
            }
            return (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                key={url}
                className={styles.files}
              >
                <div className={styles.logo}>
                  <AiOutlineFilePdf />
                </div>
                <p>{url.split('/').pop()}</p>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BillingStatement

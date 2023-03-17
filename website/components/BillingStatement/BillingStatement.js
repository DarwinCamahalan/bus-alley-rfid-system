import styles from './billingstatement.module.scss'
import { useState, useEffect } from 'react'

const BillingStatement = () => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    async function fetchFiles() {
      const res = await fetch('/api/files')
      const urls = await res.json()
      setFiles(urls)
    }
    fetchFiles()
  }, [])

  return (
    <div className={styles.billingBg}>
      <h1>Files</h1>
      {files.map((url) => (
        <div key={url}>
          <a href={url} target="_blank">
            {url.split('/').pop()}
          </a>
        </div>
      ))}
    </div>
  )
}

export default BillingStatement

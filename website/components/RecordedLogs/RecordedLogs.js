import styles from './recordedlogs.module.scss'
const RecordedLogs = () => {
  return (
    <div className={styles.recordsBg}>
      <table>
        <tbody>
          <tr>
            <th>No.</th>
            <th>Card ID</th>
            <th>Company Name</th>
            <th>Plate Number</th>
            <th>Fee</th>
            <th>Depature Date</th>
            <th>Depature Time</th>
          </tr>

          <tr>
            <td>SAMPLE</td>
            <td>SAMPLE</td>
            <td>SAMPLE</td>
            <td>SAMPLE</td>
            <td>SAMPLE</td>
            <td>SAMPLE</td>
            <td>SAMPLE</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default RecordedLogs

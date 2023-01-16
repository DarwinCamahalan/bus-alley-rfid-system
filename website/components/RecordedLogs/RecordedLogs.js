import styles from './recordedlogs.module.scss'
const RecordedLogs = () => {
  const date = new Date().toLocaleDateString() + ''
  const time = new Date().toLocaleTimeString() + ''
  const tableData = [
    {
      No: 1,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
      depatureTime: time,
      depatureDate: date,
    },
    {
      No: 2,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 3,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 4,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 5,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 6,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
    {
      No: 7,
      cardID: 'HE31A23B',
      companyName: 'Super Five',
      plateNumber: 'KIJ-6421',
    },
  ]
  return (
    <div className={styles.recordsBg}>
      <table>
        <tbody>
          <tr>
            <th>No.</th>
            <th>Card ID</th>
            <th>Company Name</th>
            <th>Plate Number</th>
            <th>Date Created</th>
            <th>Time Created</th>
          </tr>

          {tableData.map((tableData) => (
            <tr>
              <td>{tableData.No}</td>
              <td>{tableData.cardID}</td>
              <td>{tableData.companyName}</td>
              <td>{tableData.plateNumber}</td>
              <td>{time}</td>
              <td>{date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecordedLogs

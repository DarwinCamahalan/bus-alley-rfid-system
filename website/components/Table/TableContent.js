import styles from './table.module.scss'
import { Table } from '@nextui-org/react'
const TableContent = () => {
  const columns = [
    {
      key: 'date',
      label: 'Date',
    },
    {
      key: 'departuretime',
      label: 'Departure Time',
    },
    {
      key: 'platenumber',
      label: 'Plate Number',
    },
    {
      key: 'buscompany',
      label: 'Bus Company',
    },
    {
      key: 'fee',
      label: 'Fee',
    },
  ]
  const rows = [
    {
      key: '1',
      date: '1/4/2023',
      departuretime: '10:00:02 PM',
      platenumber: 'ASS-644',
      buscompany: 'SUPERFIVE',
      fee: '₱ 50',
    },
    {
      key: '2',
      date: '1/4/2023',
      departuretime: '11:00:02 AM',
      platenumber: 'FTH-654',
      buscompany: 'SUPERFIVE',
      fee: '₱ 50',
    },
    {
      key: '3',
      date: '1/2/2023',
      departuretime: '02:00:02 PM',
      platenumber: 'HYJ-463',
      buscompany: 'RURAL - RTMI',
      fee: '₱ 50',
    },
    {
      key: '4',
      date: '1/2/2023',
      departuretime: '11:00:02 AM',
      platenumber: 'HTY-323',
      buscompany: 'SUPERFIVE',
      fee: '₱ 50',
    },
    {
      key: '5',
      date: '12/14/2022',
      departuretime: '05:00:02 PM',
      platenumber: 'HTG-544',
      buscompany: 'RURAL - RTMI',
      fee: '₱ 50',
    },
    {
      key: '6',
      date: '1/4/2023',
      departuretime: '11:00:02 AM',
      platenumber: 'FTH-654',
      buscompany: 'SUPERFIVE',
      fee: '₱ 50',
    },
    {
      key: '7',
      date: '1/2/2023',
      departuretime: '02:00:02 PM',
      platenumber: 'HYJ-463',
      buscompany: 'RURAL - RTMI',
      fee: '₱ 50',
    },
    {
      key: '8',
      date: '1/2/2023',
      departuretime: '11:00:02 AM',
      platenumber: 'HTY-323',
      buscompany: 'SUPERFIVE',
      fee: '₱ 50',
    },
    {
      key: '9',
      date: '1/4/2023',
      departuretime: '10:00:02 PM',
      platenumber: 'ASS-644',
      buscompany: 'SUPERFIVE',
      fee: '₱ 50',
    },
    {
      key: '10',
      date: '1/4/2023',
      departuretime: '11:00:02 AM',
      platenumber: 'FTH-654',
      buscompany: 'SUPERFIVE',
      fee: '₱ 50',
    },
    {
      key: '11',
      date: '1/2/2023',
      departuretime: '02:00:02 PM',
      platenumber: 'HYJ-463',
      buscompany: 'RURAL - RTMI',
      fee: '₱ 50',
    },
    {
      key: '12',
      date: '1/2/2023',
      departuretime: '11:00:02 AM',
      platenumber: 'HTY-323',
      buscompany: 'SUPERFIVE',
      fee: '₱ 50',
    },
  ]
  return (
    <div className={styles.tableBg}>
      <Table
        aria-label="Example table with dynamic content"
        striped={true}
        hoverable={true}
        css={{
          height: 'auto',
          minWidth: '100%',
        }}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column key={column.key}>{column.label}</Table.Column>
          )}
        </Table.Header>
        <Table.Body items={rows}>
          {(item) => (
            <Table.Row key={item.key}>
              {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

export default TableContent

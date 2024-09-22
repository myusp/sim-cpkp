import ButtonSendNotification from '@/components/ButtonSendNotification'
import NilaiSKP from '@/components/NilaiSKP'
import { useAppContext } from '@/context'
import { listUserAsesmenStatus, ListUserAsesmenStatusResponse } from '@/services/asesment'
import { EyeOutlined } from '@ant-design/icons'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Col, DatePicker, message, Row, Table, Tag } from 'antd'
import { ColumnType } from 'antd/es/table'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'

const Monitoring = () => {
  const [date, selectedDate] = useState(dayjs())
  const [data, setData] = useState<ListUserAsesmenStatusResponse>()

  const { user } = useAppContext()
  const navigate = Route.useNavigate()

  const fetch = () => {
    listUserAsesmenStatus({
      ruanganRSId: `${user?.masterRuanganRSId}`,
      rumahSakitId: `${user?.masterRumahSakitId}`,
      tgl: dayjs(date).format("YYYY-MM-DD")
    }).then(e => {
      setData(e)
    }).catch(e => {
      message.error({ content: e })
    })
  }

  useEffect(() => {
    const fn = debounce(() => {
      if (user?.masterRumahSakitId && user?.masterRuanganRSId && date) {
        fetch()
      }
    }, 300)
    fn()
    return fn.cancel
  }, [user, date])



  const columns: ColumnType<ListUserAsesmenStatusResponse[0]>[] = [
    {
      title: "Perawat",
      dataIndex: ["user", "nama"]
    },
    {
      title: 'SKP1',
      dataIndex: ['assesmen', "skp_1"],
      key: 'assesmen.skp1',
      render: (v) => <NilaiSKP nilai={v} />,
    },
    {
      title: 'SKP2',
      dataIndex: ['assesmen', "skp_2"],
      key: 'assesmen.skp2',
      render: (v) => <NilaiSKP nilai={v} />
    },
    {
      title: 'SKP3',
      dataIndex: ['assesmen', "skp_3"],
      key: 'assesmen.skp3',
      render: (v) => <NilaiSKP nilai={v} />
    },
    {
      title: 'SKP4',
      dataIndex: ['assesmen', "skp_4"],
      key: 'assesmen.skp4',
      render: (v) => <NilaiSKP nilai={v} />
    },
    {
      title: 'SKP5',
      dataIndex: ['assesmen', "skp_5"],
      key: 'assesmen.skp5',
      render: (v) => <NilaiSKP nilai={v} />
    },
    {
      title: 'SKP6',
      dataIndex: ['assesmen', "skp_6"],
      key: 'assesmen.skp6',
      render: (v) => <NilaiSKP nilai={v} />
    },
    {
      title: "Status",
      fixed: "right",
      dataIndex: ["status"],
      render(value,) {
        return <Tag color={value ? "green" : "red"}>{value ? "Sudah" : "Belum"}</Tag>
      }
    },
    {
      title: "Aksi",
      fixed: "right",
      render(_value, row) {
        return <Button.Group> <Button
          disabled={!row.status}
          onClick={() => navigate({ to: "/karu/log-book/view-assess/$id", params: { id: `${row.asesmen?.id}` } })}><EyeOutlined /></Button>
          <ButtonSendNotification
            date={date.format("YYYY-MM-DD")}
            to={row.user.email}
            disabled={row.status} type='primary' />
        </Button.Group>

      }
    }
  ]


  return <div className="p-4 bg-white rounded-lg shadow-md">
    <Row gutter={[16, 16]}>
      <Col span={24} md={6}>
        Tanggal
      </Col>
      <Col span={24} md={18}>
        <DatePicker
          minDate={dayjs("2024-05-01")}
          maxDate={dayjs()}
          className='w-full' picker='date' value={date} onChange={e => selectedDate(e)} />
      </Col>
      <Col span={24}>
        <Table columns={columns} dataSource={data} scroll={{ x: 1000 }} />
      </Col>
    </Row>

  </div>
}

export const Route = createFileRoute('/__guard/karu/monitoring/')({
  component: Monitoring
})

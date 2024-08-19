import NilaiSKP from '@/components/NilaiSKP'
import { useAppContext } from '@/context'
import { listAssesmen } from '@/services/asesment'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMounted } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Col, Row, Space, Table } from 'antd'
import { ColumnType } from 'antd/es/table'
import { Akun, UserAssesmen } from 'app-type/index'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'


const SelfAssesmenIndex = () => {
  const [data, setData] = useState<{ assesmen: UserAssesmen; akun: Akun; }[]>([])
  const { user } = useAppContext()
  const mounted = useMounted()
  const navigate = Route.useNavigate()

  useEffect(() => {
    if (mounted) fetchList()
  }, [mounted])

  const fetchList = () => {
    listAssesmen({ email: user?.email })
      .then(res => {
        setData(res.data)
      })
  }

  const columns: ColumnType<{ assesmen: UserAssesmen; akun: Akun; }>[] = [
    {
      title: 'Tanggal',
      dataIndex: ['assesmen', "created_at"],
      key: 'assesmen.created_at',
      render: (value) => {
        return dayjs(value).format("YYYY-MM-DD")
      }
    },
    {
      title: 'SKP1',
      dataIndex: ['assesmen', "skp_1"],
      key: 'assesmen.skp1',
      render: (v) => <NilaiSKP nilai={v} />
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
      title: 'Update',
      dataIndex: ['assesmen', "updated_at"],
      key: 'assesmen.created_at',
      render: (value) => {
        return dayjs(value).format("YYYY-MM-DD HH:mm")
      }
    },
    {
      title: 'Aksi',
      key: 'action',
      fixed: "right",
      width: 150,
      render: (_text: string, record) => (
        <Space size="small">
          <Button icon={<EditOutlined />} onClick={() => {
            navigate({ to: "/perawat/self-assesmen/edit/$id", params: { id: record.assesmen.id } })
          }} />
        </Space>
      ),
    },
  ];

  const handleNewAsesmen = () => {
    const today = dayjs()
    const exist = data.find(d => dayjs(d.assesmen.created_at).format("YYYY-MM-DD") == today.format("YYYY-MM-DD"))
    if (exist) {
      navigate({ to: "/perawat/self-assesmen/edit/$id", params: { id: exist.assesmen.id } })
    } else {
      navigate({ to: "/perawat/self-assesmen/new" })
    }
  }

  return <>
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Row gutter={[16, 16]}>
        {/* <Col sm={24} md={12}>
        <Statistic title="Total Self Assesmen Anda" value={2} prefix={<ReadOutlined />} />
      </Col> */}
        <Col sm={24} md={12}>
          <Button onClick={handleNewAsesmen} type='primary' icon={<PlusOutlined />}>Self-Assesmen hari Ini</Button>
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data}
          />
        </Col>
      </Row>
    </div>
  </>
}

export const Route = createFileRoute('/__guard/perawat/self-assesmen/')({
  component: SelfAssesmenIndex
})
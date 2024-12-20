import NilaiSKP from '@/components/NilaiSKP'
import { useAppContext } from '@/context'
import { getListAssesmenLogBook } from '@/services/logBookKaru'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import { useMounted } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Col, Row, Space, Table, Tag } from 'antd'
import { ColumnType } from 'antd/es/table'
import { ListAssesmenLogBookResponse } from 'app-type/response'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'


const SelfAssesmenIndex = () => {
  const [data, setData] = useState<ListAssesmenLogBookResponse["data"]>([])

  const { user } = useAppContext()
  const mounted = useMounted()
  const navigate = Route.useNavigate()

  useEffect(() => {
    const fn = debounce(() => {
      if (mounted) fetchList()
    }, 400)
    fn()
    return fn.cancel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, user?.email])

  const fetchList = () => {
    getListAssesmenLogBook({ rumahSakitId: user?.masterRumahSakitId as string, ruanganRSId: user?.masterRuanganRSId as string })
      .then(res => {
        setData(res.data)
      })
  }

  const columns: ColumnType<ListAssesmenLogBookResponse["data"][0]>[] = [
    {
      title: 'Tanggal',
      dataIndex: ['assesmen', "tanggal"],
      key: 'assesmen.tanggal',
      render: (value) => {
        return dayjs(value).format("YYYY-MM-DD")
      }
    },
    {
      title: 'Nama',
      dataIndex: ['akun', "nama"],
      key: 'Akun.nama',
    },
    {
      title: 'LogBook',
      dataIndex: ['logBookKaru'],
      key: 'logBookKaru',
      render: (v) => {
        if (v.length > 0) {
          return <Tag color='teal'>Sudah</Tag>
        } else {
          return <Tag color='red'>Belum</Tag>
        }
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
          <Button icon={<EyeOutlined />} onClick={() => {
            navigate({ to: "/karu/log-book/view-assess/$id", params: { id: record.assesmen.id } })
          }} />
          <Button icon={<EditOutlined />} onClick={() => {
            // console.log("new")
            navigate({ to: "/karu/log-book/log/$id", params: { id: record.assesmen.id } })
          }} />
        </Space>
      ),
    },
  ];


  return <>
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Table
            scroll={{ x: 2000 }}
            columns={columns}
            dataSource={data}
          />
        </Col>
      </Row>
    </div>
  </>
}

export const Route = createFileRoute('/__guard/karu/log-book/')({
  component: SelfAssesmenIndex
})
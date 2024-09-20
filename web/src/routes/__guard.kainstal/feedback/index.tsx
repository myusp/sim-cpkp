import NilaiRangkuman from '@/components/NilaiRangkuman'
import { useAppContext } from '@/context'
import { searchRekomendasi, SearchRekomendasiRespons } from '@/services/rekomendasi'
import { EditOutlined } from '@ant-design/icons'
import { useDisclosure, useMounted } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Col, Row, Space, Table, Tag } from 'antd'
import { ColumnType } from 'antd/es/table'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'


const Rekomendasi = () => {
    const [data, setData] = useState<SearchRekomendasiRespons>([])
    const [loading, loadingHandler] = useDisclosure()

    const { user } = useAppContext()
    const mounted = useMounted()
    const navigate = Route.useNavigate()

    useEffect(() => {
        const fn = debounce(() => {
            if (mounted && user?.masterRuanganRSId) fetchList()
        }, 400)
        fn()
        return fn.cancel
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, user?.masterRumahSakitId])

    const fetchList = () => {
        loadingHandler.open()
        searchRekomendasi({ rsId: user?.masterRumahSakitId as string })
            .then(res => {
                // console.log(res)
                setData(res)
            })
            .finally(loadingHandler.close)
    }

    const columns: ColumnType<SearchRekomendasiRespons[0]>[] = [
        {
            title: 'Waktu Penilaian',
            dataIndex: ["created_at"],
            key: 'created_at',
            render: (value) => {
                return dayjs(value).format("YYYY-MM-DD HH:mm")
            }
        },
        {
            title: 'Karu',
            dataIndex: ["Akun"],
            key: 'Akun',
            render: (_value, row) => {
                return `${row.Akun.nama}`
            }
        },
        {
            title: 'Perawat',
            dataIndex: ["AkunPerawat"],
            key: 'AkunPerawat',
            render: (_value, row) => {
                return `${row.AkunPerawat.nama}`
            }
        },
        {
            title: 'Skor',
            dataIndex: ["score"],
            key: 'score',
            render: (value) => {
                return <NilaiRangkuman score={value} showTag />
            }
        },
        {
            title: 'Feedback',
            dataIndex: ["UserRekomendasiKainstal"],
            key: 'UserRekomendasiKainstal',
            render: (_value, row) => {
                return row.UserRekomendasiKainstal.length > 0
                    ? <Tag color='green'>Sudah</Tag> : <Tag color='red'>Belum</Tag>
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
                        navigate({ to: "/kainstal/feedback/penilaian/$id", params: { id: record.id } })
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
                        scroll={{ x: 1000 }}
                        loading={loading}
                        columns={columns}
                        dataSource={data}
                    />
                </Col>
            </Row>
        </div>
    </>
}


export const Route = createFileRoute('/__guard/kainstal/feedback/')({
    component: Rekomendasi
})
import { createFileRoute } from '@tanstack/react-router'
import { useAppContext } from '@/context'
import { EyeOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useMounted } from '@mantine/hooks'
import { Button, Col, Row, Space, Table } from 'antd'
import { ColumnType } from 'antd/es/table'
import { listPenilaianKaruResponse } from 'app-type/response'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import UserDropdownByRuangan from '@/components/user/UserDropdownByRuangan'
import { listPenilaianKaru } from '@/services/penilaianKaru'
import NilaiRangkuman from '@/components/NilaiRangkuman'


const PenilaianKaruIndex = () => {
    const [data, setData] = useState<listPenilaianKaruResponse["data"]>([])

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
        listPenilaianKaru({ rumahSakitId: user?.masterRumahSakitId as string, ruanganRSId: user?.masterRuanganRSId as string })
            .then(res => {
                setData(res.data)
            })
    }

    const columns: ColumnType<listPenilaianKaruResponse["data"][0]>[] = [
        {
            title: 'Tanggal Penilaian',
            dataIndex: ['assesmen', "created_at"],
            key: 'assesmen.created_at',
            render: (value) => {
                return dayjs(value).format("YYYY-MM-DD")
            }
        },
        {
            title: 'Nama Penilai',
            dataIndex: ['akun', "nama"],
            key: 'Akun.nama',
        },
        {
            title: 'Perawat',
            dataIndex: ['AkunPerawat', "nama"],
            key: 'AkunPerawat.nama',
        },
        {
            title: "Tanggal Self-Asesmen Perawat",
            dataIndex: ["UserAssesmen"],
            key: "UserAssesmen",
            render(d) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return [...d].map((asesmen: any) => dayjs(asesmen?.tanggal).format("YYYY-MM-DD")).join(", ")
            }
        },
        {
            title: 'Skor',
            dataIndex: ['assesmen', "score"],
            key: 'assesmen.score',
            render(v) {
                return <NilaiRangkuman showTag score={v} />
            }
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
                        navigate({ to: "/karu/penilaian/view/$id", params: { id: record.assesmen.id } })
                    }} />
                </Space>
            ),
        },
    ];


    return <>
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Row gutter={[16, 16]}>
                <Col className='flex flex-row' span={24}>
                    <UserDropdownByRuangan
                        idRuanganRS={user?.masterRuanganRSId as string || ""}
                        placeholder="Cari perawat"
                    />
                    <Button className='ml-2' type='primary' icon={<PlusCircleOutlined />} onClick={() => navigate({ to: "/karu/penilaian/new" })}>Penilaian Baru</Button>
                </Col>
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

export const Route = createFileRoute('/__guard/karu/penilaian/')({
    component: PenilaianKaruIndex
})
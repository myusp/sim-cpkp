import HospitalDropdown from '@/components/HospitalDropdown'
import NilaiSKP from '@/components/NilaiSKP'
import RoomDropdown from '@/components/RoomDropdown'
import { listAssesmen } from '@/services/asesment'
import { EyeOutlined } from '@ant-design/icons'
import { useMounted } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Col, Row, Space, Table } from 'antd'
import { ColumnType } from 'antd/es/table'
import { Akun, MasterRuanganRS, MasterRumahSakit, UserAssesmen } from 'app-type/index'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'


const Report = () => {
    const [data, setData] = useState<{
        assesmen: UserAssesmen; akun: Akun & { MasterRuamhSakit?: MasterRumahSakit, MasterRuanganRS: MasterRuanganRS };
    }[]>([])
    const [filterRs, setFilterRs] = useState<string | undefined>()
    const [filterRuangan, setFilterRuangan] = useState<string | undefined>()

    const mounted = useMounted()
    const navigate = Route.useNavigate()

    useEffect(() => {
        const fn = debounce(() => {
            if (mounted) fetchList()
        }, 700)

        fn()
        return fn.cancel

    }, [mounted, filterRs, filterRuangan])


    const fetchList = () => {
        listAssesmen({ ruanganRSId: filterRuangan, rumahSakitId: filterRs })
            .then(res => {
                setData(res.data as never)
            })
    }

    const columns: ColumnType<{ assesmen: UserAssesmen; akun: Akun & { MasterRuamhSakit?: MasterRumahSakit, MasterRuanganRS: MasterRuanganRS }; }>[] = [
        {
            title: 'Tanggal',
            dataIndex: ['assesmen', "created_at"],
            key: 'assesmen.created_at',
            render: (value) => {
                return dayjs(value).format("YYYY-MM-DD")
            },
            width: 150
        },
        {
            title: 'Nama',
            dataIndex: ['akun', "nama"],
            key: 'akun.nama',
            width: 250
        },
        {
            title: 'RS',
            dataIndex: ['akun', "MasterRumahSakit", "nama"],
            key: 'akun.ms.nama',
            width: 150
        },
        {
            title: 'Ruangan',
            dataIndex: ['akun', "MasterRuanganRS", "nama"],
            key: 'akun.mrs.nama',
            width: 150
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
            render: (text: string, record) => (
                <Space size="small">
                    <Button icon={<EyeOutlined />} onClick={() => {
                        navigate({ to: "/admin/report/$id", params: { id: record.assesmen.id } })
                    }} />
                </Space>
            ),
        },
    ];

    return <>
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Row gutter={[16, 16]}>
                <Col sm={24} md={12}>
                    <HospitalDropdown value={filterRs} onChange={(e) => setFilterRs(e)} />
                </Col>
                <Col sm={24} md={12}>
                    <RoomDropdown hospitalId={filterRs} value={filterRuangan} onChange={setFilterRuangan} />
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

export const Route = createFileRoute('/__guard/admin/report/')({
    component: Report
})
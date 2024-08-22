import NilaiSKP from '@/components/NilaiSKP'
import { viewAssesmenHead } from '@/services/asesment'
import { getActiveLogBookKaru } from '@/services/logBookKaru'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useDisclosure, useLogger, useMounted } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { Col, notification, Row, Spin, Table } from 'antd'
import { ColumnType } from 'antd/es/table'
import { MasterLogBookKaruActiveResponse, viewAssesmenHeadResponse } from 'app-type/response'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const LogBookKaru = () => {
    const [questions, setQuestions] = useState<MasterLogBookKaruActiveResponse[]>([])
    const [assesmenData, setAssesmenData] = useState<viewAssesmenHeadResponse>()
    // const

    const [answer, setAnswer] = useState<Record<number, { answer: number, id: number }>>({})
    const mounted = useMounted()
    const { id } = Route.useParams()
    const [loading, loadingHandler] = useDisclosure(false)

    useEffect(() => {
        if (mounted && id) {
            loadingHandler.open()
            Promise.all([getActiveLogBookKaru(), viewAssesmenHead({ id })])
                .then(([res, res2]) => {
                    // console.log(res)
                    setQuestions(res)
                    setAssesmenData(res2)
                }).catch(err => {
                    notification.error({ message: err })
                }).finally(loadingHandler.close)
        }
    }, [mounted, id])

    useLogger("answer", [answer])

    const columns: ColumnType<MasterLogBookKaruActiveResponse>[] = [
        {
            title: 'skp',
            dataIndex: ['skp'],
            key: 'skp',
            width: 100,
        },
        {
            title: 'Kegiatan',
            dataIndex: ['kegiatan'],
            key: 'kegiatan',
        },
        {
            title: 'Ya',
            key: 'ya',
            className: "cursor-pointer border",
            width: 80,
            fixed: "right",
            render(v) {
                return answer[v.id]?.answer ? <CheckCircleOutlined className='text-green-500' /> : ""
            },
            onCell: (row) => ({
                onClick: () => {
                    setAnswer(a => ({
                        ...a,
                        [row.id]: { answer: 1, id: row.id }
                    }))
                }
            }),
        },
        {
            title: 'Tidak',
            key: 'tidak',
            className: "cursor-pointer border text-center",
            width: 80,
            fixed: "right",
            render(v) {
                return !answer[v.id]?.answer ? <CloseCircleOutlined className='text-red-500' /> : ""
            },
            onCell: (row) => ({
                onClick: () => {
                    setAnswer(a => ({
                        ...a,
                        [row.id]: { answer: 0, id: row.id }
                    }))
                }
            }),
        },
    ]


    return <div className='bg-white rounded shadow md:p-6 p-2' >
        <Spin fullscreen spinning={loading} />
        <Row gutter={[16, 16]}>
            <Col xs={24} md={10}>Nama</Col>
            <Col xs={24} md={14}>: {assesmenData?.Akun.nama}</Col>
            <Col xs={24} md={10}>Tanggal Self-Assesmen</Col>
            <Col xs={24} md={14}>: {dayjs(assesmenData?.tanggal).format("D MMM YYYY")}</Col>
            <Col span={24}>
                <Row gutter={[8, 8]} className='mb-4'>
                    {Object.keys(assesmenData || {}).filter((k): k is keyof viewAssesmenHeadResponse => k.toLowerCase().startsWith("skp")).map((k) => {
                        const v = assesmenData?.[k] || "0";
                        return (
                            <Col md={8} className='text-center' key={k}>
                                {k.split("_").join(" ")} : <b><NilaiSKP nilai={`${v}`} /></b>
                            </Col>
                        );
                    })}
                </Row>
            </Col>
        </Row>
        <Table
            columns={columns}
            dataSource={questions}
            scroll={{ x: 1000 }}
            pagination={{ pageSize: questions.length }}
        />
        {/* <Row gutter={[16, 16]}>
            <Col span={22}></Col>
            <Col span={1}>Ya</Col>
            <Col span={1}>Tidak</Col>
        </Row>
        {Object.keys(groupedQuestion).map((skp) => {
            return <Row gutter={[16, 16]}>
                <Col span={24}>{skp}</Col>
                {groupedQuestion[skp].map(q => {
                    return <>
                        <Col span={22}>{q.kegiatan}</Col>
                        <Col span={1}></Col>
                        <Col span={1}></Col>
                    </>
                })}
            </Row>
        })} */}

    </div>
}

export const Route = createFileRoute('/__guard/karu/log-book/log/$id')({
    component: LogBookKaru
})
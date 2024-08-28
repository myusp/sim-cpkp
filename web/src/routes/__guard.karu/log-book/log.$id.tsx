import NilaiSKP from '@/components/NilaiSKP'
import { viewAssesmenHead } from '@/services/asesment'
import { getActiveLogBookKaru, logBookAnswerByUserAssemenId, upsertAsesmenLogBook } from '@/services/logBookKaru'
import { BackwardOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useDisclosure, useLogger, useMounted } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Col, Input, message, notification, Row, Spin, Table } from 'antd'
import { ColumnType } from 'antd/es/table'
import { MasterLogBookKaruActiveResponse, viewAssesmenHeadResponse } from 'app-type/response'
import dayjs from 'dayjs'
import { debounce, sortBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

const LogBookKaru = () => {
    const [questions, setQuestions] = useState<MasterLogBookKaruActiveResponse[]>([])
    const [assesmenData, setAssesmenData] = useState<viewAssesmenHeadResponse>()
    // const

    const [answer, setAnswer] = useState<Record<number, { answer: number, id: number }>>({})
    const mounted = useMounted()
    const { id } = Route.useParams()
    const [loading, loadingHandler] = useDisclosure(false)

    // const [isView, isViewHandler] = useDisclosure(false)
    const [search, setSearch] = useState("")
    const navigate = Route.useNavigate()

    useEffect(() => {
        if (mounted && id) {
            loadingHandler.open()
            Promise.all([getActiveLogBookKaru(), viewAssesmenHead({ id }), logBookAnswerByUserAssemenId({ userAsesmenId: id })])
                .then(([res, res2, apiAnswer]) => {
                    const tmpAnswer: Record<number, { answer: number, id: number }> = {}
                    // console.log(res)
                    setQuestions(sortBy(res,["skp","kegiatan"]))
                    setAssesmenData(res2)
                    // console.log(apiAnswer)
                    if (apiAnswer.id) {
                        apiAnswer.jawabanLogBook.map(j => {
                            tmpAnswer[j.idMasterLogBookKaru as number] = { id: j.idMasterLogBookKaru, answer: j.jawaban }
                        })

                    } else {
                        res.forEach(q => {
                            tmpAnswer[q.id] = { answer: 0, id: q.id }
                        })
                    }
                    setAnswer(tmpAnswer)

                }).catch(err => {
                    notification.error({ message: err })
                }).finally(loadingHandler.close)
        }
    }, [mounted, id])

    useLogger("answer", [answer])

    const columns: ColumnType<MasterLogBookKaruActiveResponse>[] = [
        {
            title: 'SKP',
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
            className: "cursor-pointer border text-center",
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

    const answerArray = Object.values(answer)
    const filterredQuestion = useMemo(() => {
        if (!search) return questions
        else {
            return questions.filter(q => {
                return q.kegiatan.toLowerCase().includes(search.toLowerCase())
            })
        }
    }, [questions, search])

    const handleAnswer = async () => {
        try {
            // console.log()
            loadingHandler.open()
            const resp = await upsertAsesmenLogBook({
                answer: Object.values(answer),
                idMasterLogBooks: Object.keys(answer),
                userAsesmenId: id
            })
            // console.log(resp)
            if (resp.message) {
                message.success(resp.message)
            }
        } catch (error) {
            console.log(error)
        }
        loadingHandler.close()
    }

    return <div className='bg-white rounded shadow md:p-6 p-2' >
        <Spin fullscreen spinning={loading} />
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Button icon={<BackwardOutlined />} onClick={() => navigate({ to: "/karu/log-book" })}>Kembali</Button>
            </Col>
            <Col xs={24} md={10}>Nama</Col>
            <Col xs={24} md={14}>: {assesmenData?.Akun.nama}</Col>
            <Col xs={24} md={10}>Tanggal Self-Assesmen</Col>
            <Col xs={24} md={14}>: {dayjs(assesmenData?.tanggal).format("D MMM YYYY")}</Col>
            <Col span={24}>
                <Row gutter={[8, 8]} className='mb-4'>
                    {Object.keys(assesmenData || {}).filter((k): k is keyof viewAssesmenHeadResponse => k.toLowerCase().startsWith("skp")).map((k) => {
                        const v = assesmenData?.[k] || "0";
                        return (
                            <Col md={8} className='text-center border' key={k}>
                                {k.split("_").join(" ").toUpperCase()} : <b><NilaiSKP nilai={`${v}`} /></b>
                            </Col>
                        );
                    })}
                </Row>
            </Col>
        </Row>
        <Row className='mb-4' gutter={[16, 16]}>
            <Col md={12} xs={24}>
                Ya/Tidak : <span className='text-teal-600'>{answerArray.filter(q => q.answer == 1).length}</span>/<span className='text-red-600'>
                    {answerArray.filter(q => q.answer != 1).length}
                </span></Col>
            <Col className='flex flex-row' md={12} xs={24}>
                <Input.Search
                    onChange={debounce(e => setSearch(e.target.value), 700)}
                    allowClear
                    className='mr-2'
                />
                <Button onClick={handleAnswer}>Simpan</Button>
            </Col>
        </Row>
        <Table
            columns={columns}
            dataSource={filterredQuestion}
            scroll={{ x: 1000, y: "65vh" }}
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
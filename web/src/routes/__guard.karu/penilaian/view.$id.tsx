import NilaiRangkuman from '@/components/NilaiRangkuman'
import PenilaianKaruRadio from '@/components/PenilaianKaruRadio'
import { viewDetailByIdUserPenilaianKaru } from '@/services/penilaianKaru'
import { BackwardOutlined } from '@ant-design/icons'
import { useMounted, useDisclosure } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { notification, Spin, Row, Col, Button, Input, Table } from 'antd'
import { ColumnType } from 'antd/es/table'
import { MasterPenilaianKaruActiveResponse, viewDetailByIdUserPenilaianKaruResponse } from 'app-type/response'
import dayjs from 'dayjs'
import { sumBy, debounce } from 'lodash'
import { useState, useEffect, useMemo } from 'react'


const ViewRangkumanPenilaian = () => {
    const [questions, setQuestions] = useState<MasterPenilaianKaruActiveResponse[]>([])
    // const [assesmenData, setAssesmenData] = useState<viewAssesmenHeadResponse>()
    const [perawat, setPerawat] = useState<viewDetailByIdUserPenilaianKaruResponse["AkunPerawat"]>()
    const [penilai, setPenilai] = useState<viewDetailByIdUserPenilaianKaruResponse["Akun"]>()
    const [tanggal, setTanggal] = useState<string[]>([])
    const [score, setScore] = useState<number>()
    
    // const

    const [answer, setAnswer] = useState<Record<number, { answer: number, id: number }>>({})
    const mounted = useMounted()
    const [loading, loadingHandler] = useDisclosure(false)

    // const [isView, isViewHandler] = useDisclosure(false)
    const [search, setSearch] = useState("")
    const navigate = Route.useNavigate()
    const { id } = Route.useParams()

    useEffect(() => {
        if (mounted && id) {
            loadingHandler.open()
            Promise.all([viewDetailByIdUserPenilaianKaru({ idUserPenilaianKaru: id })])
                .then(([res]) => {
                    if (res) {
                        const tmpAnswer: Record<number, { answer: number, id: number }> = {}
                        console.log(res)
                        setQuestions(res.UserJawabanPenilaianKaru.map(q => q.MasterPenilaianKaru as unknown as MasterPenilaianKaruActiveResponse))
                        setPerawat(res.AkunPerawat)
                        setPenilai(res.Akun)
                        setTanggal(res.UserAssesmen.map(as => dayjs(as.tanggal).format("YYYY-MM-DD")))
                        setScore(res.score)
                        // console.log(apiAnswer)

                        res.UserJawabanPenilaianKaru.forEach(q => {
                            tmpAnswer[q.idMasterPenilaianKaru] = { answer: q.Skor, id: q.idMasterPenilaianKaru }
                        })

                        setAnswer(tmpAnswer)
                    }


                }).catch(err => {
                    notification.error({ message: err })
                }).finally(loadingHandler.close)
        }
    }, [mounted, id])

    const columns: ColumnType<MasterPenilaianKaruActiveResponse>[] = [
        {
            title: 'Kategori',
            dataIndex: ['kategori'],
            key: 'kategori',
            width: 200,
        },
        {
            title: 'Pernyataan',
            dataIndex: ['penilaian'],
            key: 'penilaian',
        },
        {
            title: 'Skor',
            key: 'skor',
            className: "cursor-pointer border text-center",
            width: 240,
            fixed: "right",
            render(_v, row) {
                return <>
                    {/* {row.id} */}
                    <PenilaianKaruRadio
                        disabled
                        value={answer[row.id]?.answer || ""}
                        onChange={(cbv) =>
                            setAnswer(ans => ({ ...ans, [row.id]: { id: row.id, answer: cbv.target.value } }))} />
                </>
            },
        },
    ]

    const filterredQuestion = useMemo(() => {
        if (!search) return questions
        else {
            return questions.filter(q => {
                return q.penilaian.toLowerCase().includes(search.toLowerCase())
            })
        }
    }, [questions, search])


    return <div className='bg-white rounded shadow md:p-6 p-2' >
        <Spin fullscreen spinning={loading} />
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Button icon={<BackwardOutlined />} onClick={() => navigate({ to: "/karu/penilaian" })}>Kembali</Button>
                {/* <GuidePenilaianKaruModal /> */}
            </Col>
            <Col xs={24} md={10}>Perawat</Col>
            <Col xs={24} md={14}>
                <b>{perawat?.nama}</b>
            </Col>
            <Col xs={24} md={10}>Tanggal Self-Assesmen</Col>
            <Col xs={24} md={14}>
                {tanggal.join(", ")}
            </Col>

            <Col xs={24} md={10}>Penilai (Karu/Katim)</Col>
            <Col xs={24} md={14}>
                <b>{penilai?.nama}</b>
            </Col>
            <Col xs={24} md={10}>Skor</Col>
            <Col xs={24} md={14}>
                <NilaiRangkuman score={score} showTag />
            </Col>
            {/* <Col span={24}>
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
            </Col> */}
        </Row>
        <Row className='mt-4 mb-4' gutter={[16, 16]}>
            <Col md={12} xs={24}>
                Rata-rata : <span className='font-bold'>{
                    (sumBy(Object.values(answer), (a) => a.answer) / Object.keys(answer).length).toFixed(2)
                }</span>
            </Col>
            <Col className='flex flex-row' md={12} xs={24}>
                <Input.Search
                    onChange={debounce(e => setSearch(e.target.value), 700)}
                    allowClear
                    className='mr-2'
                />
                {/* <Button onClick={handleAnswer}>Simpan</Button> */}
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

export const Route = createFileRoute('/__guard/karu/penilaian/view/$id')({
    component: ViewRangkumanPenilaian
})
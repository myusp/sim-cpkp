import { createFileRoute } from '@tanstack/react-router'
import { BackwardOutlined } from '@ant-design/icons'
import { useDisclosure, useMounted } from '@mantine/hooks'
import { Button, Col, Input, message, notification, Row, Spin, Table } from 'antd'
import { ColumnType } from 'antd/es/table'
import { MasterPenilaianKaruActiveResponse } from 'app-type/response'
import { debounce, sumBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { getActivePenilaianKaru, upsertPenilaianKaru } from '@/services/penilaianKaru'
import PenilaianKaruRadio from '@/components/PenilaianKaruRadio'
import UserDropdownByRuangan from '@/components/user/UserDropdownByRuangan'
import { useAppContext } from '@/context'
import SelfAssesmenDropdownByEmail from '@/components/SelfAssesmenDropdownByEmail'
import GuidePenilaianKaruModal from '@/components/GuidePenilaianKaruModal'

const PenilaianKaru = () => {
    const [questions, setQuestions] = useState<MasterPenilaianKaruActiveResponse[]>([])
    // const [assesmenData, setAssesmenData] = useState<viewAssesmenHeadResponse>()
    const [emailPerawat, setEmailPerawat] = useState("")
    const [tanggal, setTanggal] = useState<string[]>([])
    const { user } = useAppContext()
    // const

    const [answer, setAnswer] = useState<Record<number, { answer: number, id: number }>>({})
    const mounted = useMounted()
    const [loading, loadingHandler] = useDisclosure(false)

    // const [isView, isViewHandler] = useDisclosure(false)
    const [search, setSearch] = useState("")
    const navigate = Route.useNavigate()

    useEffect(() => {
        if (mounted) {
            loadingHandler.open()
            Promise.all([getActivePenilaianKaru()])
                .then(([res]) => {
                    const tmpAnswer: Record<number, { answer: number, id: number }> = {}
                    // console.log(res)
                    setQuestions(res)
                    // console.log(apiAnswer)

                    res.forEach(q => {
                        tmpAnswer[q.id] = { answer: 0, id: q.id }
                    })

                    setAnswer(tmpAnswer)

                }).catch(err => {
                    notification.error({ message: err })
                }).finally(loadingHandler.close)
        }
    }, [mounted])

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

    const handleAnswer = async () => {
        try {
            // console.log()

            if (emailPerawat == "") {
                message.error("harap pilih perawat")
                return
            }
            if (tanggal.length == 0) {
                message.error("harap pilih tanggal yg akan dinilai")
                return
            }
            if (Object.values(answer).some(a => !a.answer)) {
                message.error("masih terdapat baris kosong pada penilaian")
                return
            }
            loadingHandler.open()
            const resp = await upsertPenilaianKaru({
                answer: Object.values(answer),
                idMasterPenilaianKaru: Object.keys(answer),
                emailPerawat: emailPerawat,
                listTanggal: tanggal
            })
            console.log(resp)
            if (resp.message) {
                message.success(resp.message)
            }
        } catch (error) {
            console.log(error)
            // message.error(error)
        }
        loadingHandler.close()
    }

    return <div className='bg-white rounded shadow md:p-6 p-2' >
        <Spin fullscreen spinning={loading} />
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Button icon={<BackwardOutlined />} onClick={() => navigate({ to: "/karu/penilaian" })}>Kembali</Button>
                <GuidePenilaianKaruModal />
            </Col>
            <Col xs={24} md={10}>Perawat</Col>
            <Col xs={24} md={14}>
                <UserDropdownByRuangan
                    idRuanganRS={user?.masterRuanganRSId as string}
                    value={emailPerawat}
                    onChange={e => {
                        setEmailPerawat(e)
                    }}
                /></Col>
            <Col xs={24} md={10}>Tanggal Self-Assesmen</Col>
            <Col xs={24} md={14}>
                <SelfAssesmenDropdownByEmail
                    email={emailPerawat}
                    onChange={(e) => {
                        setTanggal(e)
                    }}
                />
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
        <Row className='my-4' gutter={[16, 16]}>
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
export const Route = createFileRoute('/__guard/karu/penilaian/new')({
    component: PenilaianKaru
})
import AssessmentExplanationModal from '@/components/AssessmentExplanationModal'
import { updateAssesment, viewAssesmen } from '@/services/asesment'
import { CloseCircleTwoTone, SaveOutlined } from '@ant-design/icons'
import { useDebouncedValue, useDisclosure, useMounted } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { Alert, Button, Col, Collapse, Flex, Input, InputRef, List, message, Radio, RadioChangeEvent, Row, Space, Spin, Tooltip, Typography } from 'antd'
import { MasterPertanyaanActiveResponse } from 'app-type/response'
import { debounce, groupBy, orderBy } from 'lodash'
import { createContext, FC, useContext, useEffect, useMemo, useRef, useState } from 'react'

type Answer = { answer: string, id: number }
const Ctx = createContext<{
    listAnswer: Answer[],
    onAnswer?: (d: Answer) => void,
    searchText: string,
    onRemove?: (id: number) => void,
    enableEdit?: boolean
}>({ listAnswer: [], searchText: "" })

const OptionRadio: FC<{ id: number, tipe: string }> = ({ tipe = "", id = 0 }) => {
    const { listAnswer, onAnswer, onRemove, enableEdit } = useContext(Ctx)

    const options = useMemo<string[]>(() => {
        if (tipe == "diagnosa") return ["4", "3B", "3A", "2", "1"]
        return ["1", "2", "3", "4"]
    }, [tipe])

    const answer = useMemo(() => {
        return listAnswer.find(a => a.id == id)
    }, [listAnswer, id])

    const handleChange = (v: RadioChangeEvent) => {
        if (onAnswer) {
            onAnswer({ id, answer: v.target.value })
        }
    }

    const handleRemove = () => {
        if (onRemove) {
            onRemove(id)
        }
    }

    return <Flex justify='start'>
        <Radio.Group disabled={!enableEdit} value={answer?.answer} onChange={handleChange}>
            {options.map(opt => <Radio key={opt} value={opt}>{opt}</Radio>)}
        </Radio.Group>
        {answer && enableEdit &&
            <Tooltip placement='top' color='red' title="Hapus Jawaban">
                <CloseCircleTwoTone twoToneColor={"red"} className='cursor-pointer' onClick={handleRemove} />
            </Tooltip>
        }
    </Flex>
}

const RenderSoal: FC<{ data: Record<string, MasterPertanyaanActiveResponse[]>, name: string }> = ({ data = {}, name = "" }) => {

    return <Collapse className='mb-4' items={[{
        key: "1",
        label: name,
        children: <Collapse
            defaultActiveKey={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]}
            items={Object.keys(data).map((kategori, key) => {
                const soals = data[kategori]
                return {
                    key,
                    label: kategori,
                    children: <List
                        size='small'
                        bordered
                        dataSource={soals}
                        renderItem={(item) => (
                            <List.Item >
                                <Row className='w-full'>
                                    <Col md={16}>
                                        <Typography.Text mark={item.tipe == "diagnosa"} >[{item.tipe}] {item.keterampilan}</Typography.Text>
                                    </Col>
                                    <Col md={8}>
                                        <OptionRadio id={item.id} tipe={item.tipe as string} />
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
                }
            })}></Collapse>
    }]} defaultActiveKey={['1']} size='small' />;
}

const RenderSoals: FC<{ soals: MasterPertanyaanActiveResponse[] }> = ({ soals = [] }) => {
    const { searchText } = useContext(Ctx)
    const [skp1, setSkp1] = useState<Record<string, MasterPertanyaanActiveResponse[]>>({})
    const [skp2, setSkp2] = useState<Record<string, MasterPertanyaanActiveResponse[]>>({})
    const [skp3, setSkp3] = useState<Record<string, MasterPertanyaanActiveResponse[]>>({})
    const [skp4, setSkp4] = useState<Record<string, MasterPertanyaanActiveResponse[]>>({})
    const [skp5, setSkp5] = useState<Record<string, MasterPertanyaanActiveResponse[]>>({})
    const [skp6, setSkp6] = useState<Record<string, MasterPertanyaanActiveResponse[]>>({})
    const [debounceSarch] = useDebouncedValue(searchText.toLowerCase(), 700)
    const [loading, loadingHandler] = useDisclosure(false)

    useEffect(() => {
        const fn = debounce(() => {
            loadingHandler.open()
            const asy = async () => {
                const tmpSoals = soals.filter(s => s.keterampilan?.toLowerCase().includes(debounceSarch))
                const groupByskpAndSubKategori = groupBy(tmpSoals, (s) => `${s.skp}_${s.sub_kategori}`)
                Object.keys(groupByskpAndSubKategori).forEach(k => {
                    const [skp, kategori] = k.split("_")
                    if (skp === "SKP1") {
                        setSkp1(s => ({ ...s, [kategori]: orderBy(groupByskpAndSubKategori[k], ["priority"]) }))
                    }
                    else if (skp === "SKP2") {
                        setSkp2(s => ({ ...s, [kategori]: orderBy(groupByskpAndSubKategori[k], ["priority"]) }))
                    }
                    else if (skp === "SKP3") {
                        setSkp3(s => ({ ...s, [kategori]: orderBy(groupByskpAndSubKategori[k], ["priority"]) }))
                    }
                    else if (skp === "SKP4") {
                        setSkp4(s => ({ ...s, [kategori]: orderBy(groupByskpAndSubKategori[k], ["priority"]) }))
                    }
                    else if (skp === "SKP5") {
                        setSkp5(s => ({ ...s, [kategori]: orderBy(groupByskpAndSubKategori[k], ["priority"]) }))
                    }
                    else if (skp === "SKP6") {
                        setSkp6(s => ({ ...s, [kategori]: orderBy(groupByskpAndSubKategori[k], ["priority"]) }))
                    }
                })
                loadingHandler.close()
            }
            asy()

        }, 700)
        fn()
        return () => {
            fn.cancel()
            loadingHandler.close()
            setSkp1({})
            setSkp2({})
            setSkp3({})
            setSkp4({})
            setSkp5({})
            setSkp6({})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [soals, debounceSarch])

    return <Spin spinning={loading} className='min-h-10' delay={0}>
        {/* <div className='h-16'></div> */}
        {Object.keys(skp1).length > 0 && <RenderSoal data={skp1} name='SKP1 (Mengidentifikasi  Pasien dengan Benar)' />}
        {Object.keys(skp2).length > 0 && <RenderSoal data={skp2} name='SKP2 (Meningkatkan Komunikasi yang Efektif)' />}
        {Object.keys(skp3).length > 0 && <RenderSoal data={skp3} name='SKP3 (Meningkatkan Keamanan Obat-Obatan yang Harus Diwaspadai)' />}
        {Object.keys(skp4).length > 0 && <RenderSoal data={skp4} name='SKP4 (Memastikan lokasi pembedahan yang benar, prosedur yang benar, pembedahan pada pasien yang benar)' />}
        {Object.keys(skp5).length > 0 && <RenderSoal data={skp5} name='SKP5 (Mengurangi Resiko Infeksi Akibat Perawatan Kesehatan)' />}
        {Object.keys(skp6).length > 0 && <RenderSoal data={skp6} name='SKP6 (Mengurangi Resiko Cedera Pasien Akibat Terjatuh)' />}
    </Spin>
}

const PerawatSelfAsesmenEdit = () => {
    const [listAnswer, setListAnswer] = useState<Answer[]>([])
    const [listSoal, setListSoal] = useState<MasterPertanyaanActiveResponse[]>([])
    const [searchText, setSearchText] = useState<string>("")
    const [loadingSubmit, loadingSubmitHandler] = useDisclosure(false)
    const [loading, loadingHandler] = useDisclosure(true)
    const searchRef = useRef<InputRef>(null)
    const [enableEdit, enableEditHandler] = useDisclosure(false)
    const { id } = Route.useParams()
    const navigate = Route.useNavigate()

    const mounted = useMounted()

    useEffect(() => {
        if (mounted && id) {
            viewAssesmen({ id }).then(res => {
                console.log(res)
                setListSoal(res.questions as MasterPertanyaanActiveResponse[])
                setListAnswer(res.answer)
            }).catch(err => {
                message.error(err)
            }).finally(loadingHandler.close)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, id])

    const handleAnswer = (d: Answer) => {
        setListAnswer(la => {
            const idx = la.findIndex(a => a.id == d.id)
            if (idx < 0) {
                return [...la, d]
            } else {
                const tmp = [...la]
                tmp[idx] = d
                return tmp
            }

        })
    }

    const handleSubmit = () => {
        loadingSubmitHandler.open()
        updateAssesment({
            answers: listAnswer as unknown as { id: number, answer: string }[],
            id_user_assesmen: id
        }).then(res => {
            console.log(res)
            message.success("Berhasil mengupdate self-assesmen")
        }).catch(err => {
            console.log(err, "err")
            message.error(err)
        }).finally(loadingSubmitHandler.close)
    }

    const handleSearch = () => {
        setSearchText(searchRef.current?.input?.value as string)
    }

    const handleRemove = (id: number) => {
        setListAnswer(l => l.filter(la => la.id != id))
    }

    const handleEditClick = () => {
        if (!enableEdit) {
            enableEditHandler.open()
            message.success("Anda sedang melakukan perubahan isian")
        } else {
            enableEditHandler.close()
            message.success("Membatalkan perubahan")
        }
    }

    return <Ctx.Provider value={{ listAnswer, onAnswer: handleAnswer, searchText: searchText, onRemove: handleRemove, enableEdit }}>
        <Row className='mb-4' gutter={[16, 16]}>
            <Col span={24}>
                {enableEdit ?
                    <Alert
                        className='shadow'
                        message="Perhatian"
                        description="Untuk membatalkan perubahan dapat menekan tombol Batal Perubahan"
                        type="warning"
                        action={
                            <Space direction="vertical">
                                <Button onClick={handleEditClick} size="small" type="default" color='red'>
                                    Batal Perubahan
                                </Button>
                            </Space>
                        }
                    />
                    : <Alert
                        className='shadow'
                        message="Perhatian"
                        description="Anda sedang melihat isian self assesmen. Untuk dapat memeperbarui isian silakan klik tombol Edit Self-Assesmen"
                        type="info"
                        action={
                            <Space direction="vertical">
                                <Button onClick={handleEditClick} size="small" type="primary">
                                    Edit Self-Assesmen
                                </Button>
                                <Button onClick={() => navigate({ to: "/perawat/self-assesmen" })} size="small" >
                                    Kembali
                                </Button>
                            </Space>
                        }
                    />

                }
            </Col>
            <Col xs={24} lg={18} md={12}>
                <Input.Search
                    onSearch={handleSearch} enterButton ref={searchRef} allowClear placeholder='Cari keterampilan' className='w-full' />
            </Col>
            <Col xs={24} lg={6} md={12} className='flex justify-end'>
                <AssessmentExplanationModal />
                <Button disabled={!enableEdit} icon={<SaveOutlined />} onClick={handleSubmit}>Simpan</Button>
            </Col>
        </Row>
        <Typography.Title level={3}>Sasaran Keselamatan Pasien (SKP)</Typography.Title>
        <RenderSoals soals={listSoal} />
        <Spin fullscreen spinning={loadingSubmit || loading} />
    </Ctx.Provider>

}


export const Route = createFileRoute('/__guard/perawat/self-assesmen/edit/$id')({
    component: PerawatSelfAsesmenEdit
})
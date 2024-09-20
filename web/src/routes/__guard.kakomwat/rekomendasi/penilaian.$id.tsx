import KainstalFeedbackDropdown from '@/components/KainstalFeedbackDropdown'
import KakomwatRekomendasiDropdown from '@/components/KakomwatRekomendasiDropdown'
import NilaiRangkuman from '@/components/NilaiRangkuman'
import { useAppContext } from '@/context'
import { detailRekomendasiByIdPenilaian, detailRekomendasiByIdPenilaianResponse, submitRekomendasiByIdPenilaian } from '@/services/rekomendasi'
import { RightCircleFilled, SendOutlined } from '@ant-design/icons'
import { useDisclosure, useMounted } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Col, Flex, List, message, Row, Spin } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'


const DetailPenilaian = () => {
    const { id } = Route.useParams()
    const [loading, loadingHandler] = useDisclosure()
    const mounted = useMounted()
    const { user } = useAppContext()

    const [feedback, setFeedback] = useState<string>("")
    const [rekomendasi, setRekomendasi] = useState<string>("")

    const [data, setData] = useState<detailRekomendasiByIdPenilaianResponse>()
    const navigate = Route.useNavigate()


    const fetch = () => {
        loadingHandler.open()
        detailRekomendasiByIdPenilaian(id)
            .then(res => {
                setData(res)
            })
            .finally(loadingHandler.close)
    }

    useEffect(() => {
        if (mounted && id) {
            fetch()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, mounted])

    const submitFeedback = () => {

        if (rekomendasi === "") {
            message.error({ content: "Harap isi rekomendasi" })
            return
        }
        loadingHandler.open()
        submitRekomendasiByIdPenilaian({
            feedback: rekomendasi,
            penilaianId: id,
            user: user?.email || "",
        }).then(res => {
            message.success({ content: res.message })
        }).catch(e => {
            message.error({ content: e })
        }).finally(loadingHandler.close)
    }

    useEffect(() => {
        if (data?.rekomendasi) {
            // console.log(data.rekomendasi.feedback_to_karu)
            setFeedback(data.rekomendasi.feedback_to_karu)
            setRekomendasi(data.rekomendasi.status_approval)
        }
    }, [data?.rekomendasi])


    return <>
        <Spin fullscreen spinning={loading} />
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Row gutter={[8, 8]}>
                <Col className='font-bold' span={24} md={10}>Karu</Col>
                <Col span={24} md={14}>{data?.penilaiankaru.Akun.nama}</Col>
                <Col className='font-bold' span={24} md={10}>Perawat</Col>
                <Col span={24} md={14}>{data?.penilaiankaru.AkunPerawat.nama}</Col>
                <Col className='font-bold' span={24} md={10}>Tanggal Penilaian</Col>
                <Col span={24} md={14}>{dayjs(data?.penilaiankaru.created_at).format("YYYY-MM-DD HH:mm")}</Col>
                <Col className='font-bold' span={24} md={10}>Tanggal Self Asesmen Perawat</Col>
                <Col span={24} md={14}>
                    <List size='small'>
                        {data?.tanggal_asesmen.map(tgl => {
                            return <List.Item key={tgl}><RightCircleFilled className='mr-2' /> {tgl}</List.Item>
                        })}
                    </List>
                </Col>
                <Col className='font-bold' span={24} md={10}>Skor Penilaian</Col>
                <Col span={24} md={14}>
                    <NilaiRangkuman score={data?.penilaiankaru.score} showTag />
                </Col>
                <Col className='font-bold' span={24} md={10}>
                    Capaian SKP
                </Col>
                <Col span={24} md={14}>
                    <List size='small'>
                        {Object.keys(data?.score || {}).map(key => {
                            const value = data?.score[key as keyof typeof data.score];
                            const displayValue = typeof value === 'number' ? value : parseFloat(`${value}`);
                            return (
                                <List.Item key={key}>
                                    <RightCircleFilled className='mr-2' /> <b>{key}</b>: {isNaN(displayValue) ? 'N/A' : displayValue.toFixed(2)}
                                </List.Item>
                            );
                        })}
                    </List>
                </Col>
                <Col className='font-bold' span={24} md={10}>
                    Feedback
                </Col>
                <Col span={24} md={14}>
                    <KainstalFeedbackDropdown disabled={data?.rekomendasi?.status_approval != ""} value={feedback} placeholder="Feedback untuk karu" className='w-full' onChange={e => setFeedback(e)} />
                </Col>
                <Col className='font-bold' span={24} md={10}>
                    Rekomendasi
                </Col>
                <Col span={24} md={14}>
                    <KakomwatRekomendasiDropdown disabled={data?.rekomendasi?.status_approval != ""} value={rekomendasi}
                        placeholder="Rekomendasi" className='w-full' onChange={e => setRekomendasi(e)} />
                </Col>

                <Col span={24} className='mt-4'>
                    <Flex justify='right'>
                        <Button disabled={loading} className='mr-2' onClick={() => navigate({ to: "/kakomwat/rekomendasi" })}>Kembali</Button>
                        <Button disabled={data?.rekomendasi?.status_approval != ""} loading={loading} onClick={submitFeedback} icon={<SendOutlined />} type='primary'>Simpan Rekomendasi</Button>
                    </Flex>
                </Col>

            </Row>
        </div>
    </>
}

export const Route = createFileRoute('/__guard/kakomwat/rekomendasi/penilaian/$id')({
    component: DetailPenilaian
})
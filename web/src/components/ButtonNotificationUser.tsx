import { useAppContext } from '@/context'
import { getNotificationsService, getNotificationsServiceResponse, getUnreadNotificationCountService, markNotificationAsReadService } from '@/services/notification'
import { BellOutlined, CheckOutlined } from '@ant-design/icons'
import { useDisclosure, useMounted } from '@mantine/hooks'
import { Avatar, Badge, Button, List, Modal } from 'antd'
import { useEffect, useState } from 'react'

const ButtonNotificationUser = () => {
    const [modalState, modalHandler] = useDisclosure(false)
    const [countNotif, setCountNotif] = useState<number>(0)
    const [listNotif, setListNotif] = useState<getNotificationsServiceResponse>()
    const [loadingAction, setLoadingAction] = useState<string[]>([])
    const [loadingGet, loadingGetHandler] = useDisclosure(false)

    const { user } = useAppContext()

    const mounted = useMounted()

    const fetchCount = () => {
        getUnreadNotificationCountService(`${user?.email}`)
            .then(r => {
                setCountNotif(r)
            })
    }

    const fetchList = () => {
        loadingGetHandler.open()
        getNotificationsService(`${user?.email}`)
            .then(notifs => {
                setListNotif(notifs)
            }).finally(loadingGetHandler.close)
    }

    const readNotif = (id: string) => {
        setLoadingAction(las => [...las, id])
        markNotificationAsReadService(id)
            .then(() => {
                setListNotif(ns => ns?.map(n => {
                    return n.id == id ? { ...n, isRead: true } : n
                }))
            })
            .finally(() => {
                setLoadingAction(ls => ls.filter(l => l != id))
            })
    }



    useEffect(() => {
        if (user?.email && mounted) {
            if (modalState) {
                fetchList()
            } else {
                fetchCount()
            }
        }
    }, [mounted, user, modalState])



    return (
        <>
            <Modal
                title="Pesan anda"
                onCancel={modalHandler.close} open={modalState}
                footer={null}
            >
                <List loading={loadingGet}>
                    {listNotif?.map(n => {
                        return <List.Item
                            key={n.id}
                            actions={!n.isRead ? [
                                <Button
                                    loading={loadingAction.includes(n.id)}
                                    onClick={() => readNotif(n.id)} type='primary'><CheckOutlined /></Button>
                            ] : []}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar src={`https://ui-avatars.com/api/?name=${n.fromKaru.nama}`} />
                                }
                                title={"Pengingat self asesmen"}
                                description={n.message}
                            ></List.Item.Meta>
                        </List.Item>
                    })}
                </List>

            </Modal>
            <Badge count={countNotif} offset={[-16, 0]} size='small'>
                <BellOutlined style={{ fontSize: 25, color: "white" }} onClick={modalHandler.open} className='cursor-pointer mr-4' />
            </Badge>
        </>
    )
}

export default ButtonNotificationUser
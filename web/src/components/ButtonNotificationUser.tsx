import { useAppContext } from '@/context'
import { getNotificationsKaruService, getNotificationsService, getUnreadNotificationCountKaruService, getUnreadNotificationCountService, markNotificationAsReadKaruService, markNotificationAsReadService } from '@/services/notification'
import { BellOutlined, CheckOutlined } from '@ant-design/icons'
import { useDisclosure, useMounted } from '@mantine/hooks'
import { Avatar, Badge, Button, List, Modal } from 'antd'
import { FC, useEffect, useState } from 'react'

type CommonNotification = {
    isRead: boolean;
    createdAt: string;
    message: string;
    id: string;
};

type PerawatNotification = CommonNotification & {
    fromKaru: {
        email: string;
        nama: string;
    };
};

type KaruNotification = CommonNotification & {
    perawatEmails: string;
};

type NotificationProps<T extends CommonNotification> = {
    fetchCountService: (email: string) => Promise<number>;
    fetchListService: (email: string) => Promise<T[]>;
    markAsReadService: (id: string) => Promise<{ message: string }>;
    getAvatarSrc: (notif: T) => string;
};

const ButtonNotification = <T extends CommonNotification>({
    fetchCountService,
    fetchListService,
    markAsReadService,
    getAvatarSrc
}: NotificationProps<T>) => {
    const [modalState, modalHandler] = useDisclosure(false);
    const [countNotif, setCountNotif] = useState<number>(0);
    const [listNotif, setListNotif] = useState<T[]>([]);
    const [loadingAction, setLoadingAction] = useState<string[]>([]);
    const [loadingGet, loadingGetHandler] = useDisclosure(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [markingAll, setMarkingAll] = useState<boolean>(false);
    const [pageSize] = useState<number>(3);

    const { user } = useAppContext();

    const mounted = useMounted();

    const fetchCount = () => {
        fetchCountService(`${user?.email}`).then(r => {
            setCountNotif(r);
        });
    };

    const fetchList = () => {
        loadingGetHandler.open();
        fetchListService(`${user?.email}`)
            .then(notifs => {
                setListNotif(notifs);
            })
            .finally(loadingGetHandler.close);
    };

    const readNotif = (id: string) => {
        setLoadingAction(las => [...las, id]);
        markAsReadService(id)
            .then(() => {
                setListNotif(ns =>
                    ns?.map(n => (n.id === id ? { ...n, isRead: true } : n))
                );
            })
            .finally(() => {
                setLoadingAction(ls => ls.filter(l => l !== id));
            });
    };

    const currentNotifications = listNotif.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const markAllAsRead = () => {
        setMarkingAll(true);
        const unreadNotifs = listNotif.filter(n => !n.isRead);
        const promises = unreadNotifs.map(n => markAsReadService(n.id));

        Promise.all(promises)
            .then(() => {
                setListNotif(ns => ns?.map(n => ({ ...n, isRead: true })));
                setCountNotif(0);
            })
            .finally(() => {
                setMarkingAll(false);
            });
    };

    useEffect(() => {
        if (user?.email && mounted) {
            if (modalState) {
                fetchList();
            } else {
                fetchCount();
            }
        }
    }, [mounted, user, modalState]);

    return (
        <>
            <Modal
                title="Pesan anda"
                onCancel={modalHandler.close}
                open={modalState}
                footer={null}
            >
                <div className="mb-2 text-right">
                    <Button
                        onClick={markAllAsRead}
                        type="primary"
                        loading={markingAll}
                        disabled={listNotif.every(n => n.isRead)}
                    >
                        Tandai Semua Sudah Dibaca
                    </Button>
                </div>
                <List
                    loading={loadingGet}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        onChange: handlePageChange,
                        total: listNotif.length
                    }}
                    dataSource={currentNotifications}
                    renderItem={n => (
                        <List.Item
                            key={n.id}
                            actions={
                                !n.isRead
                                    ? [
                                        <Button
                                            loading={loadingAction.includes(n.id)}
                                            onClick={() => readNotif(n.id)}
                                            type="primary"
                                        >
                                            <CheckOutlined />
                                        </Button>
                                    ]
                                    : []
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={getAvatarSrc(n)} />}
                                title={"Pengingat self asesmen"}
                                description={n.message}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
            <Badge count={countNotif} offset={[-16, 0]} size="small">
                <BellOutlined
                    style={{ fontSize: 25, color: 'white' }}
                    onClick={modalHandler.open}
                    className="cursor-pointer mr-4"
                />
            </Badge>
        </>
    );
};

const ButtonNotificationPerawat = () => (
    <ButtonNotification<PerawatNotification>
        fetchCountService={getUnreadNotificationCountService}
        fetchListService={getNotificationsService}
        markAsReadService={markNotificationAsReadService}
        getAvatarSrc={n => `https://ui-avatars.com/api/?name=${n.fromKaru.nama}`}
    />
)


const ButtonNotificationKaruKatim = () => (
    <ButtonNotification<KaruNotification>
        fetchCountService={getUnreadNotificationCountKaruService}
        fetchListService={getNotificationsKaruService}
        markAsReadService={markNotificationAsReadKaruService}
        getAvatarSrc={() => `https://ui-avatars.com/api/?name=sistem+admin`}
    />
)

const ButtonNotificationUser: FC = () => {

    const { user } = useAppContext()

    return (<>
        {user?.role === "perawat" && <ButtonNotificationPerawat />}
        {["karu", "katim"].includes(`${user?.role}`) && <ButtonNotificationKaruKatim />}
    </>
    )
}

export default ButtonNotificationUser
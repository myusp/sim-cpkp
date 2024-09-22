import { useAppContext } from '@/context'
import { sendNotificationService } from '@/services/notification'
import { SendOutlined } from '@ant-design/icons'
import { useDisclosure } from '@mantine/hooks'
import { Button, ButtonProps, message, Tooltip } from 'antd'
import { FC } from 'react'



const ButtonSendNotification: FC<ButtonProps & { to: string, date: string }> = (props) => {
    const [loading, loadingHandler] = useDisclosure(false)
    const { user } = useAppContext()

    const send = () => {
        loadingHandler.open()
        sendNotificationService({
            fromKaruEmail: `${user?.email}`,
            toPerawatEmail: props.to,
            tgl: props.date

        })
            .then((m) => {
                console.log(m)
                message.success({ content: "Berhasil mengirim notifikasi pengingat" })
            }).catch(e => {
                message.error({ content: "Gagal mengirim notifikasi pengingat" })
                console.log(e)
            })
            .finally(loadingHandler.close)
    }
    return (
        <Button {...props} loading={loading} onClick={send}>
            <Tooltip title="Kirim notifikasi pengingat">
                <SendOutlined />
            </Tooltip>
        </Button>
    )
}

export default ButtonSendNotification
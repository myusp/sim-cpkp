import { useAppContext } from '@/context'
import { Avatar, AvatarProps } from 'antd'
import { FC } from 'react'

const UserAvatar: FC<AvatarProps> = (props) => {
  const appContext = useAppContext()
  return (
    <Avatar {...props} src={`https://ui-avatars.com/api/?name=${appContext.user?.nama}`}></Avatar>
  )
}

export default UserAvatar
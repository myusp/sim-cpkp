import { listAssesmen } from '@/services/asesment'
import { useMounted } from '@mantine/hooks'
import { Select, SelectProps } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { UserAssessmentListResponse } from 'app-type/response'
import dayjs from 'dayjs'
import { FC, useEffect, useMemo, useState } from 'react'

type SelfAssesmenDropdownByEmailProps = SelectProps & {
    email: string
}

const SelfAssesmenDropdownByEmail: FC<SelfAssesmenDropdownByEmailProps> = ({ email, ...props }) => {
    const [data, setData] = useState<UserAssessmentListResponse>()
    const mounted = useMounted()

    useEffect(() => {
        if (mounted && email) {
            listAssesmen({
                email
            }).then(res => {
                setData(res)
            })
        }
    }, [mounted, email])


    const opt = useMemo<DefaultOptionType[]>(() => {
        return data?.data.filter(d => d.assesmen.id_penilaian == null).map(d => {
            const tgl = dayjs(d.assesmen.tanggal).format("YYYY-MM-DD")
            return {
                label: tgl,
                value: tgl
            }
        }) || []

    }, [data])
    
    return (
        <Select
            {...props}
            mode="multiple"
            options={opt}
            className='w-full'
        />
    )
}

export default SelfAssesmenDropdownByEmail
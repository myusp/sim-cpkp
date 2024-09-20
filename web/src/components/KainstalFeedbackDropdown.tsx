import { Select, SelectProps } from 'antd'
import { FC } from 'react'

type KainstalFeedbackDropdownProps = Omit<SelectProps, "data">

const KainstalFeedbackDropdown: FC<KainstalFeedbackDropdownProps> = (props) => {
    return <Select {...props} options={[
        {
            label: "Perbaiki",
            value: "perbaiki"
        },
        {
            label: "Tingkatkan",
            value: "tingkatkan"
        },
        {
            label: "Pertahankan",
            value: "pertahankan"
        }
    ]} />
}

export default KainstalFeedbackDropdown
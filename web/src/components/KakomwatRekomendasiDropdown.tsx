import { Select, SelectProps } from 'antd'
import { FC } from 'react'

type KainstalFeedbackDropdownProps = Omit<SelectProps, "data">

const KakomwatRekomendasiDropdown: FC<KainstalFeedbackDropdownProps> = (props) => {
    return <Select {...props} options={[
        {
            label: "Setuju",
            value: "setuju"
        },
        {
            label: "Tidak setuju",
            value: "tidak setuju"
        }
    ]} />
}

export default KakomwatRekomendasiDropdown
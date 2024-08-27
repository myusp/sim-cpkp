import { Radio, RadioGroupProps } from 'antd'
import { FC } from 'react'

type PenilaianKaruRadioProps = Omit<RadioGroupProps, "options">

const PenilaianKaruRadio: FC<PenilaianKaruRadioProps> = (props) => {
    return (
        <Radio.Group {...props} size='small'>
            <Radio value={1}>1</Radio>
            <Radio value={2}>2</Radio>
            <Radio value={3}>3</Radio>
            <Radio value={4}>4</Radio>
        </Radio.Group>
    )
}

export default PenilaianKaruRadio
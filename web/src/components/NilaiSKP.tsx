import { FC } from 'react'

const NilaiSKP: FC<{ nilai: string }> = ({ nilai = "0" }) => {
    return (
        `${parseFloat(nilai).toFixed(2)}%`
    )
}

export default NilaiSKP
import { Tag, TagProps } from 'antd'
import { useMemo } from 'react'


const NilaiRangkuman = (props: { score?: number, showTag?: boolean }) => {
    const tags = useMemo<{ label: string, color: TagProps["color"] }>(() => {
        const s = Math.round(props.score || 0)
        switch (s) {
            case 1:
                return {
                    color: "red",
                    label: "Kurang Baik"
                }
            case 2:
                return {
                    color: "yellow",
                    label: "Cukup Baik"
                }
            case 3:
                return {
                    color: "blue",
                    label: "Baik"
                }
            case 4:
                return {
                    color: "green",
                    label: "Baik Sekali"
                }
                break;

            default:
                return {
                    color: "red",
                    label: "Kurang Baik"
                }
        }
    }, [props.score])
    return (
        <>{
            props?.score?.toFixed(2)
        }{props.showTag && <Tag className='ml-2' color={tags.color}>{tags.label}</Tag>}</>
    )
}

export default NilaiRangkuman
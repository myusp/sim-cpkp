import React, { memo, useEffect, useMemo, useState } from 'react';
import { Select, SelectProps } from 'antd';
import { useMounted } from '@mantine/hooks';
import { getUsersService } from '@/services/user';
import { UserResponse } from 'app-type/response';
import { DefaultOptionType } from 'antd/es/select';


type UserDropdownByRuanganProps = Omit<SelectProps, "data"> & {
    idRuanganRS: string
    role?: "admin" | "karu" | "perawat"
}
const UserDropdownByRuangan: React.FC<UserDropdownByRuanganProps> = ({ idRuanganRS, role = "perawat", ...props }) => {
    const [data, setData] = useState<UserResponse[]>([])
    const mounted = useMounted()
    useEffect(() => {
        if (mounted && idRuanganRS) {
            getUsersService({ ruanganId: idRuanganRS, role })
                .then(res => {
                    setData(res)
                })

        }
    }, [mounted, idRuanganRS])

    const opt = useMemo<DefaultOptionType[]>(() => {
        return data.map((d) => {
            return {
                label: d.nama,
                value: d.email
            }
        })
    }, [data])

    return (
        <Select {...props} className="w-full" options={opt}>
        </Select>
    );
};

export default memo(UserDropdownByRuangan);

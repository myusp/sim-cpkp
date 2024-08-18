import React, { useEffect, useState } from 'react';
import { Select, message } from 'antd';
import { getRoomsService } from '@/services/room';
import { MasterRuanganRS } from 'app-type/index';

const { Option } = Select;

interface RoomDropdownProps {
    hospitalId?: string | undefined;
    onChange?: (roomId: string) => void;
    value?: string
    disabled?: boolean
}

const RoomDropdown: React.FC<RoomDropdownProps> = ({ hospitalId, onChange, value, disabled }) => {
    const [rooms, setRooms] = useState<MasterRuanganRS[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (hospitalId) {
            fetchRooms(hospitalId);
        } else {
            setRooms([]);
        }
    }, [hospitalId]);

    const fetchRooms = async (hospitalId: string) => {
        setLoading(true);
        try {
            const data = await getRoomsService(hospitalId);
            setRooms(data);
        } catch (error) {
            message.error('Gagal mengambil data ruangan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select
            placeholder="Pilih Ruangan"
            onChange={onChange}
            loading={loading}
            className="w-full"
            allowClear
            value={value}
            disabled={disabled}
        >
            {rooms.map((room) => (
                <Option key={room.id} value={room.id}>
                    {room.nama}
                </Option>
            ))}
        </Select>
    );
};

export default RoomDropdown;

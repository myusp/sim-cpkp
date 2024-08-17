import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface PendidikanDropdownProps {
    value?: string;
    onChange?: (value: string) => void;
}

const LastEducationDropdown: React.FC<PendidikanDropdownProps> = ({ value, onChange }) => {
    return (
        <Select
            placeholder="Pilih Pendidikan Terakhir"
            value={value}
            onChange={onChange}
            className="w-full"
            allowClear
        >
            <Option value="VOKASI">Vokasi</Option>
            <Option value="NERS">Ners</Option>
            <Option value="S2_NERS">S2 Ners</Option>
        </Select>
    );
};

export default LastEducationDropdown;

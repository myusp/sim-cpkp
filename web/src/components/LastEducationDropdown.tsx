import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface PendidikanDropdownProps {
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean
}

const LastEducationDropdown: React.FC<PendidikanDropdownProps> = ({ value, onChange, disabled }) => {
    return (
        <Select
            placeholder="Pilih Pendidikan Terakhir"
            value={value}
            onChange={onChange}
            className="w-full"
            allowClear
            disabled={disabled}
        >
            <Option value="VOKASI">Vokasi</Option>
            <Option value="NERS">Ners</Option>
            <Option value="S2_KEP">S2 Kep</Option>
        </Select>
    );
};

export default LastEducationDropdown;

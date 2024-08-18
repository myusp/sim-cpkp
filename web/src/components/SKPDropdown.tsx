import React, { memo } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface SKPDropdownProps {
    value?: string
    onChange?: (role: string) => void;
    disabled?: boolean
    placeholder?: string
}

const SKPDropdown: React.FC<SKPDropdownProps> = ({ onChange, value, disabled }) => {
    return (
        <Select disabled={disabled} value={value} placeholder="Pilih SKP" onChange={onChange} className="w-full" allowClear>
            <Option value="SKP1">SKP1</Option>
            <Option value="SKP2">SKP2</Option>
            <Option value="SKP3">SKP3</Option>
            <Option value="SKP4">SKP4</Option>
            <Option value="SKP5">SKP5</Option>
            <Option value="SKP6">SKP6</Option>
        </Select>
    );
};

export default memo(SKPDropdown);

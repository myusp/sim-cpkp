import React, { memo } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface RoleDropdownProps {
    value?: string
    onChange?: (role: string) => void;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ onChange, value }) => {
    return (
        <Select value={value} placeholder="Pilih Role" onChange={onChange} className="w-full" allowClear>
            <Option value="admin">Admin</Option>
            <Option value="karu">Karu</Option>
            <Option value="perawat">Perawat</Option>
        </Select>
    );
};

export default memo(RoleDropdown);

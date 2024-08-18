import React, { memo } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface SubKategoriDropdownProps {
    value?: string
    onChange?: (role: string) => void;
    disabled?: boolean
}

const SubKategoriDropdown: React.FC<SubKategoriDropdownProps> = ({ onChange, value, disabled }) => {
    return (
        <Select disabled={disabled} value={value} placeholder="Pilih Sub Kategori" onChange={onChange} className="w-full" allowClear>
            <Option value="Respirasi">Respirasi</Option>
            <Option value="Sirkulasi">Sirkulasi</Option>
            <Option value="Nutrisi dan Cairan">Nutrisi dan Cairan</Option>
            <Option value="Eliminasi">Eliminasi</Option>
            <Option value="Aktifitas dan Istirahat">Aktifitas dan Istirahat</Option>
            <Option value="Neurosensory">Neurosensory</Option>
            <Option value="Psikologis">Psikologis</Option>
            <Option value="Integritas Ego">Integritas Ego</Option>
            <Option value="Kebersihan Diri">Kebersihan Diri</Option>
            <Option value="Pertumbuhan dan Perkembangan">Pertumbuhan dan Perkembangan</Option>
            <Option value="Interaksi Sosial">Interaksi Sosial</Option>
            <Option value="Keamanan dan Proteksi">Keamanan dan Proteksi</Option>
            <Option value="Aktifitas dan Istirahat 5">Aktifitas dan Istirahat 5</Option>
            <Option value="Aktifitas dan Istirahat 6">Aktifitas dan Istirahat 6</Option>
            <Option value="Aktifitas dan Istirahat 7">Aktifitas dan Istirahat 7</Option>

        </Select>
    );
};

export default memo(SubKategoriDropdown);

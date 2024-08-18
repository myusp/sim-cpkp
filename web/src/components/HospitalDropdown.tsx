import React, { useEffect, useState, useCallback } from 'react';
import { Select, message } from 'antd';
import { getHospitalsService } from '@/services/hospital';
import { MasterRumahSakit } from 'app-type/index';
import { useMounted } from '@mantine/hooks';

const { Option } = Select;

interface HospitalDropdownProps {
    value?: string;
    onChange?: (hospitalId: string) => void;
    disabled?: boolean
}

const HospitalDropdown: React.FC<HospitalDropdownProps> = ({ onChange, value, disabled }) => {
    const [hospitals, setHospitals] = useState<MasterRumahSakit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const mounted = useMounted();

    useEffect(() => {
        if (mounted) {
            fetchHospitals();
        }
    }, [mounted]);

    const fetchHospitals = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getHospitalsService();
            setHospitals(data);
            localStorage.setItem('hospitals', JSON.stringify(data));
        } catch (error) {
            message.error('Gagal mengambil data rumah sakit');
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <Select
            placeholder="Pilih Rumah Sakit"
            onChange={onChange}
            loading={loading}
            className="w-full"
            value={value}
            allowClear
            disabled={disabled}
        >
            {hospitals.map((hospital) => (
                <Option key={hospital.id} value={hospital.id}>
                    {hospital.nama}
                </Option>
            ))}
        </Select>
    );
};

// Menggunakan React.memo untuk mencegah rendering ulang jika props tidak berubah
export default React.memo(HospitalDropdown);

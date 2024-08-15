import React, { useEffect, useState } from 'react';
import { Select, message } from 'antd';
import { getHospitalsService } from '@/services/hospital';
import { MasterRumahSakit } from 'app-type/index';
import { useMounted } from '@mantine/hooks';

const { Option } = Select;

interface HospitalDropdownProps {
    onChange: (hospitalId: string) => void;
}

const HospitalDropdown: React.FC<HospitalDropdownProps> = ({ onChange }) => {
    const [hospitals, setHospitals] = useState<MasterRumahSakit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const mounted = useMounted()

    useEffect(() => {
        if (mounted) fetchHospitals();
    }, [mounted]);

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            const data = await getHospitalsService();
            setHospitals(data);
        } catch (error) {
            message.error('Gagal mengambil data rumah sakit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select
            placeholder="Pilih Rumah Sakit"
            onChange={onChange}
            loading={loading}
            className="w-full mb-4"
            allowClear
        >
            {hospitals.map((hospital) => (
                <Option key={hospital.id} value={hospital.id}>
                    {hospital.nama}
                </Option>
            ))}
        </Select>
    );
};

export default HospitalDropdown;

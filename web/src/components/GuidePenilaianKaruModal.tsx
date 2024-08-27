import { useState } from 'react';
import { Modal, Button } from 'antd';
import { BookOutlined } from '@ant-design/icons';

const GuidePenilaianKaruModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Button icon={<BookOutlined />} onClick={showModal}>
                Panduan
            </Button>
            <Modal title="Kriteria Penilaian" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <div className="space-y-4">
                    <div>
                        <strong>1:</strong> tidak dapat menjelaskan
                        {/* (kurang baik) ----- Mempelajari ulang */}
                    </div>
                    <div>
                        <strong>2:</strong> dapat menjelaskan namun kurang lengkap
                        {/* (Cukup Baik) ----- Pembinaan */}
                    </div>
                    <div>
                        <strong>3:</strong> dapat menyebutkan dengan lengkap
                        {/* (Baik) ----- Ditingkatkan */}
                    </div>
                    <div>
                        <strong>4:</strong> dapat menyebutkan dengan lengkap disertai contoh
                        {/* (Baik Sekali) ----- Dipertahankan */}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default GuidePenilaianKaruModal;


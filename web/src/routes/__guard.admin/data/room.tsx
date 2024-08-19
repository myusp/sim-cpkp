import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getRoomsService, addRoomService, updateRoomService, deleteRoomService, fetchAllRooms } from '@/services/room';
import { getHospitalsService } from '@/services/hospital';
import { MasterRuanganRS, MasterRumahSakit } from 'app-type/index';
import HospitalDropdown from '@/components/HospitalDropdown';
import { createFileRoute } from '@tanstack/react-router';
import { useMounted } from '@mantine/hooks';

const { Option } = Select;

const RoomManagement: React.FC = () => {
    const [rooms, setRooms] = useState<MasterRuanganRS[]>([]);
    const [hospitals, setHospitals] = useState<MasterRumahSakit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingRoom, setEditingRoom] = useState<MasterRuanganRS | undefined>();
    const [selectedHospital, setSelectedHospital] = useState<string | undefined>();

    const mounted = useMounted()
    const [form] = Form.useForm();

    useEffect(() => {
        if (mounted) {
            fetchHospitals();
            fetchRooms(selectedHospital);
        }
    }, [selectedHospital, mounted]);

    const fetchHospitals = async () => {
        try {
            const data = await getHospitalsService();
            setHospitals(data);
        } catch (error) {
            message.error('Gagal mengambil data rumah sakit');
        }
    };

    const fetchRooms = async (hospitalId?: string) => {
        setLoading(true);
        try {
            if (hospitalId) {
                const data = await getRoomsService(`${hospitalId}`);
                setRooms(data);
            } else {
                const data = await fetchAllRooms()
                setRooms(data);
            }

        } catch (error) {
            message.error('Gagal mengambil data ruangan');
        } finally {
            setLoading(false);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingRoom(undefined);
    };

    const handleAddOrUpdate = async () => {
        try {
            const values = await form.validateFields();
            if (editingRoom) {
                await updateRoomService(editingRoom.id, values);
                message.success('Ruangan berhasil diperbarui');
            } else {
                await addRoomService(values);
                message.success('Ruangan berhasil ditambahkan');
            }
            fetchRooms(selectedHospital);
            handleCancel();
        } catch (error) {
            message.error('Gagal menyimpan data ruangan');
        }
    };

    const handleEdit = (record: MasterRuanganRS) => {
        setEditingRoom(record);
        form.setFieldsValue(record);
        showModal();
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteRoomService(id);
            message.success('Ruangan berhasil dihapus');
            fetchRooms(selectedHospital);
        } catch (error) {
            message.error('Gagal menghapus data ruangan');
        }
    };

    const columns = [
        {
            title: 'Nama Ruangan',
            dataIndex: 'nama',
            key: 'nama',
        },
        {
            title: 'Rumah Sakit',
            dataIndex: ['rumahSakit', 'nama'],
            key: 'rumahSakit',
        },
        {
            title: 'Aksi',
            key: 'action',
            render: (_text: string, record: MasterRuanganRS) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm title="Yakin ingin menghapus?" onConfirm={() => handleDelete(record.id)}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <HospitalDropdown onChange={setSelectedHospital} />
            <div className="flex justify-between mb-4 mt-4">
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Tambah Ruangan
                </Button>
                <Button icon={<ReloadOutlined />} onClick={() => fetchRooms(selectedHospital)}>
                    Refresh
                </Button>
            </div>
            <Table scroll={{ x: 1000 }} columns={columns} dataSource={rooms} rowKey="id" loading={loading} />

            <Modal
                title={editingRoom ? 'Edit Ruangan' : 'Tambah Ruangan'}
                open={isModalVisible}
                onOk={handleAddOrUpdate}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical" name="roomForm">
                    <Form.Item
                        name="nama"
                        label="Nama Ruangan"
                        rules={[{ required: true, message: 'Silakan masukkan nama ruangan' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="id_rs"
                        label="Rumah Sakit"
                        rules={[{ required: true, message: 'Silakan pilih rumah sakit' }]}
                        initialValue={selectedHospital}
                    >
                        <Select placeholder="Pilih Rumah Sakit">
                            {hospitals.map(hospital => (
                                <Option key={hospital.id} value={hospital.id}>
                                    {hospital.nama}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

// Deklarasi route

export const Route = createFileRoute('/__guard/admin/data/room')({
    component: RoomManagement
});

export default RoomManagement;

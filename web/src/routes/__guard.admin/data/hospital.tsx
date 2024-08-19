import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getHospitalsService, addHospitalService, updateHospitalService, deleteHospitalService } from '@/services/hospital';
import { MasterRumahSakit } from 'app-type/index';
import { HospitalResponse } from 'app-type/response';
import { createFileRoute } from '@tanstack/react-router';
import { useMounted } from '@mantine/hooks';

// Komponen utama untuk daftar rumah sakit
const Hospital: React.FC = () => {
  const [hospitals, setHospitals] = useState<HospitalResponse[]>([]); // State untuk menyimpan daftar rumah sakit
  const [loading, setLoading] = useState<boolean>(true); // State untuk indikator loading
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State untuk mengatur visibilitas modal
  const [editingHospital, setEditingHospital] = useState<MasterRumahSakit | undefined>(); // State untuk menyimpan rumah sakit yang sedang diedit
  const mounted = useMounted()

  const [form] = Form.useForm(); // Ant Design form instance

  useEffect(() => {
    if (mounted) fetchHospitals(); // Memanggil fetchHospitals saat komponen di-mount
  }, [mounted]);

  // Fungsi untuk mengambil daftar rumah sakit dari API
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

  // Fungsi untuk menampilkan modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Fungsi untuk menutup modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingHospital(undefined);
  };

  // Fungsi untuk menambah atau memperbarui rumah sakit
  const handleAddOrUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (editingHospital) {
        // Memperbarui rumah sakit yang ada
        await updateHospitalService(editingHospital.id, values);
        message.success('Rumah sakit berhasil diperbarui');
      } else {
        // Menambahkan rumah sakit baru
        await addHospitalService(values);
        message.success('Rumah sakit berhasil ditambahkan');
      }
      fetchHospitals();
      handleCancel();
    } catch (error) {
      message.error('Gagal menyimpan data rumah sakit');
    }
  };

  // Fungsi untuk mengatur rumah sakit yang akan diedit
  const handleEdit = (record: HospitalResponse) => {
    setEditingHospital(record);
    form.setFieldsValue(record);
    showModal();
  };

  // Fungsi untuk menghapus rumah sakit
  const handleDelete = async (id: string) => {
    try {
      await deleteHospitalService(id);
      message.success('Rumah sakit berhasil dihapus');
      fetchHospitals();
    } catch (error) {
      message.error('Gagal menghapus data rumah sakit');
    }
  };

  // Kolom untuk tabel
  const columns = [
    {
      title: 'Nama Rumah Sakit',
      dataIndex: 'nama',
      key: 'nama',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_text: string, record: HospitalResponse) => (
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
      <div className="flex justify-between mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Tambah Rumah Sakit
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchHospitals}>
          Refresh
        </Button>
      </div>
      <Table scroll={{ x: 1000 }} columns={columns} dataSource={hospitals} rowKey="id" loading={loading} />

      <Modal
        title={editingHospital ? 'Edit Rumah Sakit' : 'Tambah Rumah Sakit'}
        open={isModalVisible}
        onOk={handleAddOrUpdate}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="hospitalForm">
          <Form.Item
            name="nama"
            label="Nama Rumah Sakit"
            rules={[{ required: true, message: 'Silakan masukkan nama rumah sakit' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Deklarasi route
export const Route = createFileRoute('/__guard/admin/data/hospital')({
  component: Hospital,
});

export default Hospital;

import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Select, Row, Col, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getPenilaianKaru, addPenilaianKaru, updatePenilaianKaru, deletePenilaianKaru } from '@/services/penilaianKaru';
import { MasterPenilaianKaru } from 'app-type/index';
import { useDebouncedValue, useMounted } from '@mantine/hooks';
import { debounce } from 'lodash';

const { Search } = Input;
const { Option } = Select;

const PenilaianKaruManager: React.FC = () => {
  const [penilaianList, setPenilaianList] = useState<MasterPenilaianKaru[]>([]);
  const [filteredList, setFilteredList] = useState<MasterPenilaianKaru[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingPenilaian, setEditingPenilaian] = useState<MasterPenilaianKaru | undefined>();
  // const [filterKategori, setFilterKategori] = useState<string>();
  const [searchText, setSearchText] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [debounceSearchText] = useDebouncedValue(searchText, 700);

  const mounted = useMounted();
  const [form] = Form.useForm();

  useEffect(() => {
    if (mounted) fetchPenilaianList();
  }, [mounted]);

  useEffect(() => {
    const fn = debounce(handleFilter, 300);
    fn();
    return fn.cancel;
  }, [penilaianList, debounceSearchText, filterStatus]);

  const fetchPenilaianList = async () => {
    setLoading(true);
    try {
      const data = await getPenilaianKaru();
      setPenilaianList(data);
      setFilteredList(data);
    } catch (error) {
      message.error('Gagal mengambil data penilaian');
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
    setEditingPenilaian(undefined);
  };

  const handleAddOrUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (editingPenilaian) {
        await updatePenilaianKaru(editingPenilaian.id, values);
        message.success('Penilaian berhasil diperbarui');
      } else {
        await addPenilaianKaru(values);
        message.success('Penilaian berhasil ditambahkan');
      }
      fetchPenilaianList();
      handleCancel();
    } catch (error) {
      message.error('Gagal menyimpan data penilaian');
    }
  };

  const handleEdit = (record: MasterPenilaianKaru) => {
    setEditingPenilaian(record);
    form.setFieldsValue(record);
    showModal();
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePenilaianKaru(id);
      message.success('Penilaian berhasil dihapus');
      fetchPenilaianList();
    } catch (error) {
      message.error('Gagal menghapus data penilaian');
    }
  };

  const handleFilter = () => {
    let filteredData = penilaianList;

    if (searchText) {
      filteredData = filteredData.filter((item) =>
        item.kategori?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.penilaian?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterStatus !== null) {
      filteredData = filteredData.filter((item) => item.status === filterStatus);
    }

    // if (filterKategori) {
    //   filteredData = filteredData.filter((item) => item.kategori === filterKategori);
    // }

    setFilteredList([...filteredData]);
  };

  const columns = [
    {
      title: 'Kategori',
      dataIndex: 'kategori',
      key: 'kategori',
    },
    {
      title: 'Penilaian',
      dataIndex: 'penilaian',
      key: 'penilaian',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (status === 1 ? <Tag color='teal'>Aktif</Tag> : <Tag color='red'>Tidak Aktif</Tag>),
    },
    {
      title: 'Aksi',
      key: 'action',
      fixed: "right",
      width: 100,
      render: (_text: string, record: MasterPenilaianKaru) => (
        <Space size="small">
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
      <Row gutter={[16, 16]} className='w-full mb-4'>
        <Col span={24}>
          <Search
            className='w-full'
            placeholder="Cari Penilaian"
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </Col>
        <Col span={24}>
          <Select
            className='w-full'
            placeholder="Filter Status"
            onChange={(value) => setFilterStatus(value !== undefined ? value : null)}
            allowClear
            value={filterStatus !== null ? filterStatus : undefined}
          >
            <Option value={1}>Aktif</Option>
            <Option value={0}>Tidak Aktif</Option>
          </Select>
        </Col>
      </Row>
      <div className="flex justify-between mb-4">
        <div className=" space-x-2 hidden md:flex">
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Tambah Penilaian
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchPenilaianList}>
            Refresh
          </Button>
        </div>
        <Button.Group className='flex md:hidden'>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal} />
          <Button icon={<ReloadOutlined />} onClick={fetchPenilaianList} />
        </Button.Group>
        <Select defaultValue={10} onChange={(value) => setPageSize(value)} style={{ width: 120 }}>
          <Option value={5}>5 per halaman</Option>
          <Option value={10}>10 per halaman</Option>
          <Option value={20}>20 per halaman</Option>
          <Option value={50}>50 per halaman</Option>
        </Select>
      </div>
      <Table
        scroll={{ x: 1000 }}
        columns={columns as never}
        dataSource={filteredList}
        rowKey={(k) => `${k.id}`}
        loading={loading}
        pagination={{ pageSize }}
      />

      <Modal
        title={editingPenilaian ? 'Edit Penilaian' : 'Tambah Penilaian'}
        open={isModalVisible}
        onOk={handleAddOrUpdate}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="penilaianForm">
          <Form.Item
            name="kategori"
            label="Kategori"
            rules={[{ required: true, message: 'Silakan pilih Kategori' }]}
          >
            <Select placeholder="Pilih Kategori">
              <Option value="Komunikasi">Komunikasi</Option>
              <Option value="Pemahaman keselamatan pasien">Pemahaman keselamatan pasien</Option>
              <Option value="Kehandalan">Kehandalan</Option>
              <Option value="Kepatuhan">Kepatuhan</Option>
              <Option value="Kerja Sama">Kerja Sama</Option>
              <Option value="Kepemimpinan">Kepemimpinan</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="penilaian"
            label="Penilaian"
            rules={[{ required: true, message: 'Silakan masukkan Penilaian' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Silakan pilih Status' }]}
          >
            <Select>
              <Option value={1} >Aktif</Option>
              <Option value={0}>Tidak Aktif</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export const Route = createFileRoute('/__guard/admin/form/penilaian')({
  component: PenilaianKaruManager
})
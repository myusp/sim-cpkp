import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Select, Row, Col, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getPertanyaan, addPertanyaan, updatePertanyaan, deletePertanyaan } from '@/services/pertanyaan';
import { MasterPertanyaanAssesmen } from 'app-type/index';
import { useDebouncedValue, useMounted } from '@mantine/hooks';
import { debounce } from 'lodash';
import SKPDropdown from '@/components/SKPDropdown';
import SubKategoriDropdown from '@/components/SubKategoriDropdown';

const { Search } = Input;
const { Option } = Select;

const PertanyaanManager: React.FC = () => {
  const [pertanyaanList, setPertanyaanList] = useState<MasterPertanyaanAssesmen[]>([]); // State untuk menyimpan daftar pertanyaan
  const [filteredList, setFilteredList] = useState<MasterPertanyaanAssesmen[]>([]); // State untuk menyimpan daftar pertanyaan yang difilter
  const [loading, setLoading] = useState<boolean>(true); // State untuk indikator loading
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State untuk mengatur visibilitas modal
  const [editingPertanyaan, setEditingPertanyaan] = useState<MasterPertanyaanAssesmen | undefined>(); // State untuk menyimpan pertanyaan yang sedang diedit
  const [filterSKP, setFilterSKP] = useState<string>();
  const [searchText, setSearchText] = useState<string>(''); // State untuk menyimpan teks pencarian
  const [filterStatus, setFilterStatus] = useState<number | null>(null); // State untuk menyimpan filter status
  const [pageSize, setPageSize] = useState<number>(10); // State untuk mengatur jumlah item per halaman
  const [debounceSearchText] = useDebouncedValue(searchText, 700);

  const mounted = useMounted();
  const [form] = Form.useForm(); // Ant Design form instance

  useEffect(() => {
    if (mounted) fetchPertanyaanList(); // Memanggil fetchPertanyaanList saat komponen di-mount
  }, [mounted]);

  useEffect(() => {
    const fn = debounce(handleFilter, 300);
    fn();
    return fn.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pertanyaanList, debounceSearchText, filterStatus, filterSKP]);

  // Fungsi untuk mengambil daftar pertanyaan dari API
  const fetchPertanyaanList = async () => {
    setLoading(true);
    try {
      const data = await getPertanyaan();
      setPertanyaanList(data);
      setFilteredList(data); // Inisialisasi filteredList dengan data yang diambil
    } catch (error) {
      message.error('Gagal mengambil data pertanyaan');
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
    setEditingPertanyaan(undefined);
  };

  // Fungsi untuk menambah atau memperbarui pertanyaan
  const handleAddOrUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (editingPertanyaan) {
        // Memperbarui pertanyaan yang ada
        await updatePertanyaan(editingPertanyaan.id, values);
        message.success('Pertanyaan berhasil diperbarui');
      } else {
        // Menambahkan pertanyaan baru
        await addPertanyaan(values);
        message.success('Pertanyaan berhasil ditambahkan');
      }
      fetchPertanyaanList();
      handleCancel();
    } catch (error) {
      message.error('Gagal menyimpan data pertanyaan');
    }
  };

  // Fungsi untuk mengatur pertanyaan yang akan diedit
  const handleEdit = (record: MasterPertanyaanAssesmen) => {
    setEditingPertanyaan(record);
    form.setFieldsValue(record);
    showModal();
  };

  // Fungsi untuk menghapus pertanyaan
  const handleDelete = async (id: number) => {
    try {
      await deletePertanyaan(id);
      message.success('Pertanyaan berhasil dihapus');
      fetchPertanyaanList();
    } catch (error) {
      message.error('Gagal menghapus data pertanyaan');
    }
  };

  // Fungsi untuk memfilter daftar pertanyaan berdasarkan teks pencarian dan status
  const handleFilter = () => {
    let filteredData = pertanyaanList;

    if (searchText) {
      filteredData = filteredData.filter((item) =>
        item.skp?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.sub_kategori?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.kode?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.keterampilan?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterStatus !== null) {
      filteredData = filteredData.filter((item) => item.status === filterStatus);
    }

    if (filterSKP) {
      filteredData = filteredData.filter((item) => item.skp === filterSKP);
    }

    setFilteredList([...filteredData]);
  };

  // Kolom untuk tabel
  const columns = [
    {
      title: 'SKP',
      dataIndex: 'skp',
      key: 'skp',
    },
    {
      title: 'Sub Kategori',
      dataIndex: 'sub_kategori',
      key: 'sub_kategori',
    },
    {
      title: 'Kode',
      dataIndex: 'kode',
      key: 'kode',
    },
    {
      title: 'Tipe',
      dataIndex: 'tipe',
      key: 'tipe',
      render: (tipe: string) => (tipe === 'diagnosa' ? 'Diagnosa' : 'Intervensi'),
    },
    {
      title: 'Keterampilan',
      dataIndex: 'keterampilan',
      key: 'keterampilan',
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
      render: (text: string, record: MasterPertanyaanAssesmen) => (
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
          <SKPDropdown onChange={e => setFilterSKP(e)} value={filterSKP} />
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
        <Col span={24}>
          <Search
            className='w-full'
            placeholder="Cari Pertanyaan"
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </Col>
      </Row>
      <div className="flex justify-between mb-4">
        <div className=" space-x-2 hidden md:flex">
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Tambah Pertanyaan
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchPertanyaanList}>
            Refresh
          </Button>
        </div>
        <Button.Group className='flex md:hidden'>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal} />
          <Button icon={<ReloadOutlined />} onClick={fetchPertanyaanList} />
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
        columns={columns}
        dataSource={filteredList}
        rowKey={(k) => `${k.id}`}
        loading={loading}
        pagination={{ pageSize }}
      />

      <Modal
        title={editingPertanyaan ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}
        open={isModalVisible}
        onOk={handleAddOrUpdate}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="pertanyaanForm">
          <Form.Item
            name="skp"
            label="SKP"
            rules={[{ required: true, message: 'Silakan masukkan SKP' }]}
          >
            <SKPDropdown />
          </Form.Item>
          <Form.Item
            name="sub_kategori"
            label="Sub Kategori"
            rules={[{ required: true, message: 'Silakan masukkan Sub Kategori' }]}
          >
            <SubKategoriDropdown />
          </Form.Item>
          <Form.Item
            name="kode"
            label="Kode"
            rules={[{ required: true, message: 'Silakan masukkan Kode' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="keterampilan"
            label="Keterampilan"
            rules={[{ required: true, message: 'Silakan masukkan Keterampilan' }]}
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



export const Route = createFileRoute('/__guard/admin/form/assesment')({
  component: PertanyaanManager
})
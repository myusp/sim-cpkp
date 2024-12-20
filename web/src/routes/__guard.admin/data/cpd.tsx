import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Select, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getCpdList, updateCpd, addCpd, deleteCpd } from '@/services/cpd';
import { createFileRoute } from '@tanstack/react-router';
import { CpdParams } from 'app-type/request';
import { CpdResponse } from 'app-type/response';
import { useDebouncedValue, useMounted } from '@mantine/hooks';
import { debounce } from "lodash"


const { Search } = Input;
const { Option } = Select;

const CpdManager: React.FC = () => {
  const [cpdList, setCpdList] = useState<CpdResponse[]>([]); // State untuk menyimpan daftar CPD
  const [filteredList, setFilteredList] = useState<CpdResponse[]>([]); // State untuk menyimpan daftar CPD yang difilter
  const [loading, setLoading] = useState<boolean>(true); // State untuk indikator loading
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State untuk mengatur visibilitas modal
  const [editingCpd, setEditingCpd] = useState<CpdResponse | undefined>(); // State untuk menyimpan CPD yang sedang diedit
  const [searchText, setSearchText] = useState<string>(''); // State untuk menyimpan teks pencarian
  const [filterPk, setFilterPk] = useState<string>(''); // State untuk menyimpan filter PK
  const [pageSize, setPageSize] = useState<number>(10); // State untuk mengatur jumlah item per halaman
  const [debounceSearchText] = useDebouncedValue(searchText, 700)

  const mounted = useMounted()
  const [form] = Form.useForm(); // Ant Design form instance

  useEffect(() => {
    if (mounted) fetchCpdList(); // Memanggil fetchCpdList saat komponen di-mount
  }, [mounted]);

  useEffect(() => {
    const fn = debounce(handleFilter, 300)
    fn()
    return fn.cancel // Memfilter data setiap kali `searchText` atau `filterPk` berubah
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpdList, debounceSearchText, filterPk]);

  // Fungsi untuk mengambil daftar CPD dari API
  const fetchCpdList = async () => {
    setLoading(true);
    try {
      const data = await getCpdList();
      setCpdList(data);
      setFilteredList(data); // Inisialisasi filteredList dengan data yang diambil
    } catch (error) {
      message.error('Gagal mengambil data CPD');
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
    setEditingCpd(undefined);
  };

  // Fungsi untuk menambah atau memperbarui CPD
  const handleAddOrUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (editingCpd) {
        // Memperbarui CPD yang ada
        await updateCpd(editingCpd.id.toString(), values);
        message.success('CPD berhasil diperbarui');
      } else {
        // Menambahkan CPD baru
        await addCpd(values);
        message.success('CPD berhasil ditambahkan');
      }
      fetchCpdList();
      handleCancel();
    } catch (error) {
      message.error('Gagal menyimpan data CPD');
    }
  };

  // Fungsi untuk mengatur CPD yang akan diedit
  const handleEdit = (record: CpdResponse) => {
    setEditingCpd(record);
    form.setFieldsValue(record);
    showModal();
  };

  // Fungsi untuk menghapus CPD
  const handleDelete = async (id: number, pk: CpdParams['pk']) => {
    try {
      await deleteCpd(id.toString(), pk);
      message.success('CPD berhasil dihapus');
      fetchCpdList();
    } catch (error) {
      message.error('Gagal menghapus data CPD');
    }
  };

  // Fungsi untuk memfilter daftar CPD berdasarkan teks pencarian dan PK
  const handleFilter = () => {
    let filteredData = cpdList;

    if (searchText) {
      filteredData = filteredData.filter((item) =>
        item.value.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterPk) {
      filteredData = filteredData.filter((item) => item.pk === filterPk);
    }
    console.log(filteredData)

    setFilteredList([...filteredData]);
  };

  // Kolom untuk tabel
  const columns = [
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'PK',
      dataIndex: 'pk',
      key: 'pk',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_text: string, record: CpdResponse) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Yakin ingin menghapus?" onConfirm={() => handleDelete(record.id, record.pk)}>
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
          <Select
            className='w-full'
            placeholder="Cari PK"
            onChange={(value) => setFilterPk(value)}
            allowClear
            value={filterPk || undefined}
          >
            <Option value="pk1">PK1</Option>
            <Option value="pk2">PK2</Option>
            <Option value="pk3">PK3</Option>
            <Option value="pk4">PK4</Option>
            <Option value="pk5">PK5</Option>
          </Select>
        </Col>
        <Col span={24} className='bg-red'>
          <Search
            className='w-full'
            placeholder="Cari CPD"
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </Col>
      </Row>
      <div className="flex justify-between mb-4">

        <div className=" space-x-2 hidden md:flex">
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Tambah CPD
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchCpdList}>
            Refresh
          </Button>
        </div>
        <Button.Group className='flex md:hidden'>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal} />
          <Button icon={<ReloadOutlined />} onClick={fetchCpdList} />
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
        rowKey={(k) => `${k.pk}-${k.id}`}
        loading={loading}
        pagination={{ pageSize }}
      />

      <Modal
        title={editingCpd ? 'Edit CPD' : 'Tambah CPD'}
        open={isModalVisible}
        onOk={handleAddOrUpdate}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="cpdForm">
          <Form.Item
            name="value"
            label="Keterampilan"
            rules={[{ required: true, message: 'Silakan masukkan value' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pk"
            label="PK"
            rules={[{ required: true, message: 'Silakan pilih PK' }]}
          >
            <Select>
              <Option value="pk1">PK1</Option>
              <Option value="pk2">PK2</Option>
              <Option value="pk3">PK3</Option>
              <Option value="pk4">PK4</Option>
              <Option value="pk5">PK5</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CpdManager;


export const Route = createFileRoute('/__guard/admin/data/cpd')({
  component: CpdManager
})
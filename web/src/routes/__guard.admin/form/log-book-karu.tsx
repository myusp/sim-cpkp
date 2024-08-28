import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Select, Row, Col, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getLogBookKaru, addLogBookKaru, updateLogBookKaru, deleteLogBookKaru } from '@/services/logBookKaru';
import { MasterLogBookKaru } from 'app-type/index';
import { useDebouncedValue, useMounted } from '@mantine/hooks';
import { debounce, sortBy } from 'lodash';
import SKPDropdown from '@/components/SKPDropdown';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const LogBookKaruManager: React.FC = () => {
    const [logBookList, setLogBookList] = useState<MasterLogBookKaru[]>([]);
    const [filteredList, setFilteredList] = useState<MasterLogBookKaru[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingLogBook, setEditingLogBook] = useState<MasterLogBookKaru | undefined>();
    const [filterSKP, setFilterSKP] = useState<string>("");
    const [searchText, setSearchText] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<number | null>(null);
    const [pageSize, setPageSize] = useState<number>(10);
    const [debounceSearchText] = useDebouncedValue(searchText, 700);

    const mounted = useMounted();
    const [form] = Form.useForm();

    useEffect(() => {
        if (mounted) fetchLogBookList();
    }, [mounted]);

    useEffect(() => {
        const fn = debounce(handleFilter, 300);
        fn();
        return fn.cancel;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logBookList, debounceSearchText, filterStatus, filterSKP]);

    const fetchLogBookList = async () => {
        setLoading(true);
        try {
            const data = await getLogBookKaru();
            setLogBookList(data);
            setFilteredList(data);
        } catch (error) {
            message.error('Gagal mengambil data logbook');
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
        setEditingLogBook(undefined);
    };

    const handleAddOrUpdate = async () => {
        try {
            const values = await form.validateFields();
            if (editingLogBook) {
                await updateLogBookKaru(editingLogBook.id, values);
                message.success('Logbook berhasil diperbarui');
            } else {
                await addLogBookKaru(values);
                message.success('Logbook berhasil ditambahkan');
            }
            fetchLogBookList();
            handleCancel();
        } catch (error) {
            message.error('Gagal menyimpan data logbook');
        }
    };

    const handleEdit = (record: MasterLogBookKaru) => {
        setEditingLogBook(record);
        form.setFieldsValue(record);
        showModal();
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteLogBookKaru(id);
            message.success('Logbook berhasil dihapus');
            fetchLogBookList();
        } catch (error) {
            message.error('Gagal menghapus data logbook');
        }
    };

    const handleFilter = () => {
        let filteredData = logBookList;

        if (searchText) {
            filteredData = filteredData.filter((item) =>
                item.skp?.toLowerCase().includes(searchText.toLowerCase()) ||
                item.kegiatan?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (filterStatus !== null) {
            filteredData = filteredData.filter((item) => item.status === filterStatus);
        }

        if (filterSKP) {
            filteredData = filteredData.filter((item) => item.skp === filterSKP);
        }
        filteredData = sortBy(filteredData, ["skp", "kegiatan"])

        setFilteredList([...filteredData]);
    };

    const columns = [
        {
            title: 'SKP',
            dataIndex: 'skp',
            key: 'skp',
        },
        {
            title: 'Kegiatan',
            dataIndex: 'kegiatan',
            key: 'kegiatan',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => (status === 1 ? <Tag color='teal'>Aktif</Tag> : <Tag color='red'>Tidak Aktif</Tag>),
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (v: string) => dayjs(v).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: 'Aksi',
            key: 'action',
            fixed: "right",
            width: 100,
            render: (_text: string, record: MasterLogBookKaru) => (
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
                    <SKPDropdown
                        placeholder="Pilih SKP"
                        onChange={setFilterSKP}
                    />
                </Col>
                <Col span={24}>
                    <Search
                        className='w-full'
                        placeholder="Cari LogBook"
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
                        Tambah LogBook
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={fetchLogBookList}>
                        Refresh
                    </Button>
                </div>
                <Button.Group className='flex md:hidden'>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showModal} />
                    <Button icon={<ReloadOutlined />} onClick={fetchLogBookList} />
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
                title={editingLogBook ? 'Edit LogBook' : 'Tambah LogBook'}
                open={isModalVisible}
                onOk={handleAddOrUpdate}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical" name="logBookForm">
                    <Form.Item
                        name="skp"
                        label="SKP"
                        rules={[{ required: true, message: 'Silakan masukkan SKP' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="kegiatan"
                        label="Kegiatan"
                        rules={[{ required: true, message: 'Silakan masukkan Kegiatan' }]}
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


export const Route = createFileRoute('/__guard/admin/form/log-book-karu')({
    component: LogBookKaruManager
})
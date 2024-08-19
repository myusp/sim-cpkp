import { createFileRoute } from '@tanstack/react-router'

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Row, Col, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, KeyOutlined } from '@ant-design/icons';
import { getUsersService, addUserService, updateUserService, deleteUserService, resetUserPasswordService } from '@/services/user';
import { Akun } from 'app-type/index';
import { UserResponse } from 'app-type/response';
import { useDebouncedValue, useMounted } from '@mantine/hooks';
import HospitalDropdown from '@/components/HospitalDropdown';
import RoleDropdown from '@/components/RoleDropdown';
import RoomDropdown from '@/components/RoomDropdown';
import ResetPasswordModal from '@/components/user/ResetPasswordModal';
import UserModal from '@/components/user/UserModal';
import EditUserModal from '@/components/user/EditUserModal'; // Import modal edit user
import { ColumnType } from 'antd/es/table';
import { UpdateUserRequest } from 'app-type/request';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userModalVisible, setUserModalVisible] = useState<boolean>(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState<boolean>(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<Akun | undefined>();
  const [resetPasswordUser, setResetPasswordUser] = useState<string | undefined>();
  const [keyword, setKeyword] = useState<string | undefined>();
  const [selectedRumahSakit, setSelectedRumahSakit] = useState<string | undefined>();
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>();
  const [selectedRole, setSelectedRole] = useState<string | undefined>();
  const [debounceKeyword] = useDebouncedValue(keyword, 1000)
  const mounted = useMounted();

  useEffect(() => {
    if (mounted) fetchUsers();
  }, [mounted, debounceKeyword, selectedRumahSakit, selectedRoom, selectedRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsersService({
        keyword: debounceKeyword,
        rumahSakitId: selectedRumahSakit,
        ruanganId: selectedRoom,
        role: selectedRole,
      });
      setUsers(data);
    } catch (error) {
      message.error('Gagal mengambil data user');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(undefined);
    setUserModalVisible(true);
  };

  const openEditModal = (record: UserResponse) => {
    setEditingUser({ ...record });
    setEditUserModalVisible(true);
  };

  const handleAddOrUpdateUser = async (values: never) => {
    try {
      if (editingUser) {
        await updateUserService(editingUser.email, values as UpdateUserRequest);
        message.success('User berhasil diperbarui');
      } else {
        await addUserService(values);
        message.success('User berhasil ditambahkan');
      }
      fetchUsers();
      setUserModalVisible(false);
      setEditUserModalVisible(false);
    } catch (error) {
      message.error('Gagal menyimpan data user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUserService(id);
      message.success('User berhasil dihapus');
      fetchUsers();
    } catch (error) {
      message.error('Gagal menghapus data user');
    }
  };

  const openResetPasswordModal = (userId: string) => {
    setResetPasswordUser(userId);
    setResetPasswordModalVisible(true);
  };

  const handleResetPassword = async (values: { password: string }) => {
    try {
      await resetUserPasswordService(resetPasswordUser!, values.password);
      message.success('Password berhasil di-reset');
      setResetPasswordModalVisible(false);
    } catch (error) {
      message.error('Gagal mereset password');
    }
  };

  const columns: ColumnType<UserResponse>[] = [
    {
      title: 'Nama',
      dataIndex: 'nama',
      key: 'nama',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Nama Rumah Sakit',
      dataIndex: ['MasterRumahSakit', 'nama'],
      key: 'nama_rumah_sakit',
    },
    {
      title: 'Nama Ruangan',
      dataIndex: ['MasterRuanganRS', 'nama'],
      key: 'nama_ruangan',
    },
    {
      title: 'Pendidikan Terakhir',
      dataIndex: 'pendidikanTerakhir',
      key: 'pendidikanTerakhir',
      render: (text: string) => {
        switch (text) {
          case 'VOKASI':
            return 'Vokasi';
          case 'NERS':
            return 'Ners';
          case 'S2_NERS':
            return 'S2 Ners';
          default:
            return text;
        }
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      fixed: "right",
      width: 150,
      render: (_text: string, record: UserResponse) => (
        <Space size="small">
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm title="Yakin ingin menghapus?" onConfirm={() => handleDeleteUser(record.iduser)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
          <Button icon={<KeyOutlined />} onClick={() => openResetPasswordModal(record.email)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={8} lg={6}>
          <HospitalDropdown onChange={setSelectedRumahSakit} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <RoomDropdown hospitalId={selectedRumahSakit} onChange={setSelectedRoom} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <RoleDropdown onChange={setSelectedRole} />
        </Col>
        <Col xs={24} sm={12} md={24} lg={6}>
          <Input
            value={keyword}
            className='w-full'
            placeholder="Cari berdasarkan nama atau email"
            onChange={(e) => setKeyword(e.target.value)}
          // enterButton
          />
        </Col>



      </Row>
      <div className="flex justify-between mb-4">
        <div className=" space-x-2 hidden md:flex">
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Tambah Akun
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
            Refresh
          </Button>
        </div>
        <Button.Group className='flex md:hidden'>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal} />
          <Button icon={<ReloadOutlined />} onClick={fetchUsers} />
        </Button.Group>
      </div>
      <Table
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={users} rowKey="iduser" loading={loading} />

      <UserModal
        visible={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        onOk={(values) => handleAddOrUpdateUser(values as never)}
        initialValues={editingUser}
        isEdit={!!editingUser}
      />

      <EditUserModal
        visible={editUserModalVisible}
        onCancel={() => setEditUserModalVisible(false)}
        onOk={(values) => handleAddOrUpdateUser(values as never)}
        initialValues={{ email: editingUser?.email as string, akun: editingUser as Akun }}
      />

      <ResetPasswordModal
        visible={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        onOk={handleResetPassword}
      />
    </div>
  );
};



export const Route = createFileRoute('/__guard/admin/data/akun')({
  component: UserManagement
})
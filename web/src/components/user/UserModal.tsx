import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { useDisclosure } from '@mantine/hooks';
import RoleDropdown from '../RoleDropdown';
import HospitalDropdown from '../HospitalDropdown';
import RoomDropdown from '../RoomDropdown';
import PendidikanDropdown from '../LastEducationDropdown';  // Import komponen PendidikanDropdown

interface UserModalProps {
    visible: boolean;
    onCancel: () => void;
    onOk: (values: any) => void;
    initialValues?: any;
    isEdit?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ visible, onCancel, onOk, initialValues, isEdit = false }) => {
    const [form] = Form.useForm();
    const [loading, { open: setLoadingOpen, close: setLoadingClose }] = useDisclosure(false);

    useEffect(() => {
        if (initialValues) {
            const values = form.getFieldsValue()
            Object.keys(initialValues).forEach(k => {
                if (values[k] !== initialValues[k]) {
                    form.setFieldValue(k, initialValues[k])
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues])

    return (
        <Modal
            title={isEdit ? 'Edit User' : 'Tambah User'}
            open={visible}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        setLoadingOpen();
                        onOk(values);
                        form.resetFields();
                    })
                    .finally(() => {
                        setLoadingClose();
                    });
            }}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            okButtonProps={{
                loading,
            }}
            cancelText="Kembali"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="nama"
                    label="Nama User"
                    rules={[{ required: true, message: 'Silakan masukkan nama user' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Silakan masukkan email user' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Silakan pilih role user' }]}
                >
                    <RoleDropdown />
                </Form.Item>

                <Form.Item
                    name="pendidikanTerakhir" // Nama field ini harus sesuai dengan yang digunakan di backend
                    label="Pendidikan Terakhir"
                    rules={[{ required: true, message: 'Silakan pilih pendidikan terakhir' }]}
                >
                    <PendidikanDropdown />
                </Form.Item>

                {/* Dropdown Rumah Sakit dengan Validasi Kondisional */}
                <Form.Item
                    shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
                    noStyle
                >
                    {({ getFieldValue }) =>
                        (getFieldValue('role') === 'perawat' || getFieldValue('role') === 'karu') && (
                            <Form.Item
                                name="masterRumahSakitId"
                                label="Rumah Sakit"
                                rules={[{ required: true, message: 'Silakan pilih rumah sakit' }]}
                            >
                                <HospitalDropdown />
                            </Form.Item>
                        )
                    }
                </Form.Item>

                {/* Dropdown Ruangan dengan Validasi Kondisional */}
                <Form.Item
                    shouldUpdate={(prevValues, currentValues) => prevValues.masterRumahSakitId !== currentValues.masterRumahSakitId || prevValues.role !== currentValues.role}
                    noStyle
                >
                    {({ getFieldValue }) =>
                        (getFieldValue('role') === 'perawat' || getFieldValue('role') === 'karu') && (
                            <Form.Item
                                name="masterRuanganRSId"
                                label="Ruangan"
                                rules={[{ required: true, message: 'Silakan pilih ruangan' }]}
                            >
                                <RoomDropdown hospitalId={getFieldValue('masterRumahSakitId')} />
                            </Form.Item>
                        )
                    }
                </Form.Item>

                {!isEdit && (
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Silakan masukkan password user' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default UserModal;

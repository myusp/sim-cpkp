import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useDisclosure } from '@mantine/hooks';

interface ResetPasswordModalProps {
    visible: boolean;
    onCancel: () => void;
    onOk: (values: { password: string }) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ visible, onCancel, onOk }) => {
    const [form] = Form.useForm();
    const [loading, loadingHandler] = useDisclosure(false)

    return (
        <Modal
            title="Reset Password"
            open={visible}
            onOk={() => {
                form.validateFields().then(values => {
                    loadingHandler.open()
                    onOk(values);
                    form.resetFields();
                });
            }}
            onCancel={() => {
                form.resetFields();
                loadingHandler.close()
                onCancel();
            }}
            okButtonProps={{
                loading: loading,
            }}
            cancelButtonProps={{
                disabled: loading
            }}
            cancelText="Kembali"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="password"
                    label="Password Baru"
                    rules={[{ required: true, message: 'Silakan masukkan password baru' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Konfirmasi Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Silakan konfirmasi password baru' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Password yang dimasukkan tidak sama!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ResetPasswordModal;

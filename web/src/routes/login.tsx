import { useAppContext } from '@/context';
import { loginService } from '@/services/auth';
import { useDisclosure } from '@mantine/hooks';
import { createFileRoute } from '@tanstack/react-router'
import { Button, Form, Input, Image } from 'antd'
import { LoginRequest } from 'app-type/request';
import { useEffect } from 'react';

const LoginPage = () => {
    const [loading, { open, close }] = useDisclosure(false)
    const appContext = useAppContext()
    const navigate = Route.useNavigate()

    useEffect(() => {
        if (appContext.isLoggedIn) {
            navigate({ to: "/" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appContext.isLoggedIn])


    const onFinish = (values: LoginRequest) => {
        open()
        loginService({ email: values.email, password: values.password })
            .then(res => {
                appContext.auth.login(res.token)
            }).finally(close)
        console.log('Success:', values);

    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-lg rounded-lg w-80">
                <h2 className="text-2xl font-bold text-center mb-2">SIM-CPKP</h2>
                <div className="flex justify-center mb-4">
                    <Image width={120} className='mx-auto' src='/app/logo-sim-cpkp.png' preview={false} />
                </div>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout='vertical'
                    requiredMark={false}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Harap masukan alamat email anda' }]}
                        label="Email"
                        className='mb-4'
                    >
                        <Input placeholder="Masukan alamat email akun anda" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        className='mb-8'
                        rules={[{ required: true, message: 'Harap masukan password anda' }]}
                        label={"Password"}
                    >
                        <Input.Password placeholder="Masukan password akun anda" />
                    </Form.Item>

                    <Form.Item>
                        <Button loading={loading} type="primary" htmlType="submit" className="w-full bg-gradient-to-r from-teal-400 to-blue-600">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export const Route = createFileRoute('/login')({
    component: () => <LoginPage />
})
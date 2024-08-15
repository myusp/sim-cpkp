import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { HomeOutlined, BellOutlined, BookOutlined, UserOutlined, ReadOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Image, Badge, Button, Drawer } from 'antd';
import UserAvatar from '@/components/UserAvatar';
import Typography from 'antd/es/typography/Typography';
import { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/context';

const { Header, Sider } = Layout;

const menuAdmin: MenuProps['items'] = [
    {
        key: "/admin",
        label: <Link to='/admin'>Beranda</Link>,
        icon: <HomeOutlined />,
    },
    {
        key: "/admin/data",
        label: "Data",
        icon: <BookOutlined />,
        children: [
            {
                key: "/admin/data/akun",
                label: <Link to='/admin/data/akun'>Akun</Link>,
                icon: <UserOutlined />,
            },
            {
                key: "/admin/data/hospital",
                label: <Link to='/admin/data/hospital'>Rumah Sakit</Link>,
                icon: <ReadOutlined />,
            },
            {
                key: "/admin/data/room",
                label: <Link to='/admin/data/room'>Unit/Ruangan</Link>,
                icon: <ReadOutlined />,
            },
            {
                key: "/admin/data/cpd",
                label: <Link to='/admin/data/cpd'>CPD</Link>,
                icon: <ReadOutlined />,
            },

        ]
    },
    {
        key: "/form",
        label: "Form Pertanyaan",
        children: [
            {
                key: "/admin/data/assesment",
                label: <Link to='/admin/form/assesment'>Pertanyaan Asesmen</Link>,
                icon: <ReadOutlined />,
            },
            {
                key: "/admin/data/penilaian",
                label: <Link to='/admin/form/penilaian'>Pertanyaan Penilaian</Link>,
                icon: <ReadOutlined />,
            },
        ]
    }
];

const menuKaru: MenuProps['items'] = [
    {
        key: "/karu/dashboard",
        label: <Link to='/karu'>Dashboard Karu</Link>,
        icon: <HomeOutlined />,
    },
    // Tambahkan item menu lain yang sesuai dengan peran Karu
];

const menuPerawat: MenuProps['items'] = [
    {
        key: "/perawat/dashboard",
        label: <Link to='/perawat'>Dashboard Perawat</Link>,
        icon: <HomeOutlined />,
    },
    // Tambahkan item menu lain yang sesuai dengan peran Perawat
];

const GuardSession = () => {
    const { user } = useAppContext();
    const location = useLocation();
    const [openKeys, setOpenKeys] = useState<string[]>([])
    const [visible, setVisible] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // Menentukan menu berdasarkan role
    const menuItems = useMemo(() => {
        switch (user?.role) {
            case 'admin':
                return menuAdmin;
            case 'karu':
                return menuKaru;
            case 'perawat':
                return menuPerawat;
            default:
                return [];
        }
    }, [user?.role]);

    const openKeysByUrl = useMemo(() => {
        const paths = location.pathname.split('/').filter(Boolean);
        return paths.length > 1 ? [`/${paths.slice(0, 2).join('/')}`] : [];
    }, [location.pathname]);


    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };


    useEffect(() => {
        if (openKeysByUrl.length > openKeys.length) {
            setOpenKeys(openKeys)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openKeysByUrl])


    return (
        <Layout className='h-screen'>
            <Header className='bg-teal-400 flex justify-between items-center'>
                <div className='flex items-center md:hidden'>
                    <Button
                        className='lg:hidden'
                        icon={<MenuOutlined />}
                        onClick={showDrawer}
                        type="text"
                        style={{ color: 'white', fontSize: 24 }}
                    />
                </div>
                <div className='flex items-center'>
                    <Image src='/app/logo-sim-cpkp.png' height={50} />
                    <Typography className='ml-2 hidden md:flex'>
                        SIM-CPKP
                    </Typography>
                </div>
                <div className='flex items-center'>
                    <Badge className='mr-4' size="small" count={5}>
                        <BellOutlined style={{ fontSize: 25, color: "white" }} />
                    </Badge>
                    <UserAvatar size={"large"} />
                </div>
            </Header>
            <Layout>
                <Sider className='px-2 py-2 hidden md:block' width={250} style={{ background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        openKeys={openKeys}
                        onOpenChange={setOpenKeys}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
                    />
                </Sider>
                <Drawer
                    title="Menu"
                    placement="left"
                    closable={true}
                    onClose={onClose}
                    open={visible}
                    className='md:hidden p-0'
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        openKeys={openKeys}
                        onOpenChange={setOpenKeys}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
                    />
                </Drawer>
                <Layout style={{ padding: '24px 24px 24px' }}>
                    <Outlet />
                </Layout>
            </Layout>
        </Layout>
    );
}

export const Route = createFileRoute('/__guard')({
    component: () => <GuardSession />
});

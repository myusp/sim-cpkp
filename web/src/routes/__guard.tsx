import { createFileRoute, Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { HomeOutlined, BookOutlined, UserOutlined, ReadOutlined, MenuOutlined, LogoutOutlined, DotChartOutlined, CalendarOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Image, Button, Drawer, Dropdown, message } from 'antd';
import UserAvatar from '@/components/UserAvatar';
import Typography from 'antd/es/typography/Typography';
import { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/context';
import { debounce } from 'lodash';
import EditUserModal from '@/components/user/EditUserModal';
import { updateUserService } from '@/services/user';
import { Akun } from 'app-type/index';
import { UpdateUserRequest } from 'app-type/request';
import ButtonNotificationUser from '@/components/ButtonNotificationUser';

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
        label: "Form",
        children: [
            {
                key: "/admin/form/assesment",
                label: <Link to='/admin/form/assesment'>Pertanyaan Asesmen</Link>,
                icon: <ReadOutlined />,
            },
            {
                key: "/admin/form/penilaian",
                label: <Link to='/admin/form/penilaian'>Pertanyaan Penilaian</Link>,
                icon: <ReadOutlined />,
            },
            {
                key: "/admin/form/log-book-karu",
                label: <Link to='/admin/form/log-book-karu'>Pertanyaan Log Book Karu</Link>,
                icon: <ReadOutlined />,
            },
        ],
        icon: <BookOutlined />
    },
    {
        key: "/admin/report",
        label: <Link to='/admin/report'>Report</Link>,
        icon: <DotChartOutlined />
    }
];

const menuKaru: MenuProps['items'] = [
    {
        key: "/karu/dashboard",
        label: <Link to='/karu'>Dashboard Karu</Link>,
        icon: <HomeOutlined />,
    },
    {
        key: "/karu/monitoring",
        label: <Link to='/karu/monitoring'>Monitoring</Link>,
        icon: <CalendarOutlined />,
    },
    {
        key: "/karu/log-book",
        label: <Link to='/karu/log-book'>Log Book</Link>,
        icon: <BookOutlined />,
    },
    {
        key: "/karu/penilaian",
        label: <Link to='/karu/penilaian'>Rangkuman Penilaian</Link>,
        icon: <BookOutlined />,
    },
    // Tambahkan item menu lain yang sesuai dengan peran Karu
];

const menuPerawat: MenuProps['items'] = [
    {
        key: "/perawat",
        label: <Link to='/perawat'>Home</Link>,
        icon: <HomeOutlined />,
    },
    {
        key: "/perawat/self-assesmen",
        label: <Link to='/perawat/self-assesmen'>Self-Asesmen</Link>,
        icon: <BookOutlined />,
    },
    // Tambahkan item menu lain yang sesuai dengan peran Perawat
];

const menuKainstal: MenuProps['items'] = [
    {
        key: "/kainstal",
        label: <Link to='/kainstal'>Home</Link>,
        icon: <HomeOutlined />,
    },
    {
        key: "/kainstal/feedback",
        label: <Link to='/kainstal/feedback'>Feedback</Link>,
        icon: <BookOutlined />,
    },
    // Tambahkan item menu lain yang sesuai dengan peran Perawat
];

const menuKakomwat: MenuProps['items'] = [
    {
        key: "/kakomwat",
        label: <Link to='/kakomwat' params={{ id: "" }}>Home</Link>,
        icon: <HomeOutlined />,
    },
    {
        key: "/kakomwat/rekomendasi",
        label: <Link to='/kakomwat/rekomendasi' params={{ id: "" }}>Rekomendasi</Link>,
        icon: <BookOutlined />,
    },
    // Tambahkan item menu lain yang sesuai dengan peran Perawat
];

const GuardSession = () => {
    const { user, auth, isLoggedIn, isAppReady } = useAppContext();
    const location = useLocation();
    const [openKeys, setOpenKeys] = useState<string[]>([])
    const [visible, setVisible] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [editUserModalVisible, setEditUserModalVisible] = useState<boolean>(false);

    const navigate = useNavigate()
    // Menentukan menu berdasarkan role
    const menuItems = useMemo(() => {
        switch (user?.role) {
            case 'admin':
                return menuAdmin;
            case 'karu':
                return menuKaru;
            case 'katim':
                return menuKaru;
            case 'perawat':
                return menuPerawat;
            case 'kainstal':
                return menuKainstal
            case 'kakomwat':
                return menuKakomwat
            default:
                return [];
        }
    }, [user?.role]);

    const openKeysByUrl = useMemo(() => {
        const paths = location.pathname.split('/').filter(Boolean);
        return paths.length > 1 ? [`/${paths.slice(0, 2).join('/')}`] : [];
    }, [location.pathname]);

    useEffect(() => {

        const fn = debounce(() => {
            if (isAppReady) {
                const paths = location.pathname.split('/')
                if (paths[1] != user?.role) {

                    navigate({ to: `/${user?.role}` })
                }
            }
        }, 300)
        fn()
        return fn.cancel
    }, [isAppReady, location.pathname])



    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };


    useEffect(() => {
        console.log(openKeysByUrl, openKeys)
        if (openKeysByUrl.length > openKeys.length) {
            setOpenKeys(openKeysByUrl)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openKeysByUrl])

    useEffect(() => {
        if (isAppReady) {
            if (!isLoggedIn) {
                navigate({ to: "/login" })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAppReady, isLoggedIn])

    const handleAddOrUpdateUser = async (values: never) => {
        try {

            await updateUserService(user?.email as string, values as UpdateUserRequest);
            message.success('User berhasil diperbarui');
            setEditUserModalVisible(false);
        } catch (error) {
            message.error('Gagal menyimpan data user');
        }
    };
    return (
        <Layout className='min-h-screen'>
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
                    <EditUserModal
                        visible={editUserModalVisible}
                        onCancel={() => setEditUserModalVisible(false)}
                        onOk={(values) => handleAddOrUpdateUser(values as never)}
                        initialValues={{ email: user?.email as string, akun: user as unknown as Akun }}
                        is_edit_by_personal
                        title='Edit Profil'
                    />

                    {user?.role == "perawat" && <ButtonNotificationUser />}

                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: "1",
                                    label: <a onClick={() => {
                                        setEditUserModalVisible(true)
                                    }}>
                                        Profil
                                    </a>,
                                    icon: <UserOutlined />
                                },
                                {
                                    key: '2',
                                    label: (
                                        <a onClick={() => {
                                            auth.logout()
                                            navigate({ to: "/login" })
                                        }}>
                                            Logout
                                        </a>
                                    ),
                                    icon: <LogoutOutlined />
                                },
                            ]
                        }}
                        placement='bottomRight'
                        arrow
                    >
                        <UserAvatar className='cursor-pointer' size={"large"} />
                    </Dropdown>

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

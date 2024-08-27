import { useAppContext } from '@/context';
import { VideoCameraAddOutlined } from '@ant-design/icons';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Flex, Button, Typography, MenuProps, Dropdown } from 'antd';

import dayjs from 'dayjs';

const { Title, Paragraph } = Typography




const KaruIndex = () => {
  const { user } = useAppContext();
  const hour = dayjs().hour();

  const getGreeting = () => {
    if (hour < 12) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  const openTutorial = () => {
    const url = 'https://s.bps.go.id/y-penilaian';
    window.open(url, '_blank');
  }

  const openTutorial2 = () => {
    const url = 'https://s.bps.go.id/y-log-book';
    window.open(url, '_blank');
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" onClick={openTutorial2} >
          Log Book
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" onClick={openTutorial}>
          Rangkuman Penilaian
        </a>
      ),
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center pt-6">
      <div className="bg-gradient-to-br from-blue-100 to-teal-300/70 shadow-lg rounded-lg p-8 max-w-lg w-full transform transition-all hover:scale-105 duration-300 ease-in-out">
        <div className="flex justify-center mb-4">
          <img src="/app/logo-sim-cpkp.png" alt="App Logo" className="h-16 w-16" />
        </div>
        <Title level={2} className="text-center text-blue-800">
          {getGreeting()}, {user?.nama}!
        </Title>
        <Paragraph className="mt-4 text-lg text-center text-gray-800 leading-relaxed">
          Selamat datang di <span className="font-semibold">Sistem Informasi Manajemen Compliance Pressure Keselamatan Pasien (SIM-CPKP)</span>.
        </Paragraph>
        <Paragraph className="mt-2 text-center text-gray-600 leading-relaxed">
          Aplikasi ini dirancang untuk meningkatkan kepatuhan terhadap keselamatan pasien dengan memperhatikan sistem yang mempengaruhi (berdasarkan teori King dan teori Proscha). Efektivitasnya akan diuji terkait peran perawat militer dalam kepatuhan keselamatan pasien.
        </Paragraph>
        <Flex justify='center'>
          <Button >
            <Link to="/karu/log-book">LogBook</Link>

          </Button>
          <Button className='ml-2'>
            <Link to="/karu/penilaian">Penilaian Kinerja</Link>

          </Button>
          <Dropdown menu={{ items }}>
            <Button className='ml-2' type='primary' icon={<VideoCameraAddOutlined />}>
              Tutorial
            </Button>
          </Dropdown>

        </Flex>

      </div>
    </div>)
}

export const Route = createFileRoute('/__guard/karu/')({
  component: KaruIndex
})
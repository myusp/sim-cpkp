import { createFileRoute, Link } from '@tanstack/react-router';
import { Button, Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import { useAppContext } from '@/context';
import { VideoCameraAddOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const PerawatIndexPage = () => {
  const { user } = useAppContext();
  const hour = dayjs().hour();

  const getGreeting = () => {
    if (hour < 12) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  const openTutorial = () => {
    const url = 'https://youtu.be/5GfpJO6aE_k';
    window.open(url, '_blank');
  }

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
            <Link to="/kainstal/feedback">Buat Feedback</Link>

          </Button>
          <Button onClick={openTutorial} className='ml-2' type='primary' icon={<VideoCameraAddOutlined />}>
            Tutorial
          </Button>
        </Flex>

      </div>
    </div>
  );
};

export const Route = createFileRoute('/__guard/kainstal/')({
  component: PerawatIndexPage,
});

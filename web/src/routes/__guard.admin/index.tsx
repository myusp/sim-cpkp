import { useAppContext } from '@/context'
import { ProductOutlined, UserOutlined } from '@ant-design/icons'
import { createFileRoute } from '@tanstack/react-router'
import { Card, Col, Row, Space, Typography } from 'antd'
import { useState } from 'react'

const AdminIndexPage = () => {
  const appContext = useAppContext()
  const [data] = useState({ rs: 2, user: 33, room: 12 })
  return <>
    <Space direction='vertical'>
      <Typography.Title level={3}>
        Hello, {appContext.user?.nama} !
      </Typography.Title>


      <Row gutter={12} className="w-full">
        <Col span={24}>
          <div className="mb-4 px-6 py-4 rounded-lg shadow-md bg-gradient-to-r from-teal-400 via-blue-500 to-blue-700 text-white">
            <p className="text-lg">
              Selamat datang di aplikasi SIM-CPKP
            </p>
          </div>

        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card className="mb-4" title={<Space><ProductOutlined /> Rumah Sakit</Space>} bordered={false}>
            <p ><span className="text-2xl font-semibold mr-2">{data.rs}</span><small >Faskes</small></p>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card className="mb-4" title={<Space><UserOutlined /> Ruangan</Space>} bordered={false}>
            <p ><span className="text-2xl font-semibold mr-2">{data.room}</span><small >Ruangan/Unit</small></p>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card className="mb-4" title={<Space><UserOutlined /> Pengguna</Space>} bordered={false}>
            <p ><span className="text-2xl font-semibold mr-2">{data.user}</span><small >Pengguna</small></p>
          </Card>
        </Col>
      </Row>
    </Space>
  </>
}

export const Route = createFileRoute('/__guard/admin/')({
  component: AdminIndexPage
})
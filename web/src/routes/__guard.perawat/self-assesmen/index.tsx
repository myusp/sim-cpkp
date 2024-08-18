import { ReadOutlined } from '@ant-design/icons'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Col, Flex, Row, Statistic } from 'antd'

const SelfAssesmenIndex = () => {
  return <>
    <Row gutter={16}>
      <Col sm={24} md={12}>
        <Statistic title="Total Self Assesmen Anda" value={2} prefix={<ReadOutlined />} />
      </Col>
      <Col sm={24} md={12}>
    
      </Col>
      <Col span={24}>
        <Flex  className='bg-white rounded-lg p-2 px-4 mt-4 shadow' justify='space-between'>
          <div>asd</div>
          <div>
            SKP1
          </div>
          <div>
            SKP2

          </div>
          <div>
            SKP3
          </div>
          <div>
            SKP4
          </div>
          <div>
            SKP5
          </div>
          <div>
            SKP6
          </div>
          <div>
            <Button>
              Edit
            </Button>
          </div>
        </Flex>
      </Col>
    </Row>
  </>
}

export const Route = createFileRoute('/__guard/perawat/self-assesmen/')({
  component: SelfAssesmenIndex
})
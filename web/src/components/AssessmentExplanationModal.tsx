import React, { useState } from 'react';
import { Modal, Tabs, Button } from 'antd';
import { BookOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const AssessmentExplanationModal = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button icon={<BookOutlined />} onClick={showModal}>Panduan</Button>
      <Modal
        title="Keterangan Nilai"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Diagnosis Keperawatan" key="1">
            <div style={{ padding: '16px', backgroundColor: '#0099FF', color: 'white' }}>
              <h3>KETERANGAN NILAI DIAGNOSIS KEPERAWATAN (KOMPETENSI SESUAI RKK RS)</h3>
              <table style={{ width: '100%', color: 'white' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', verticalAlign: 'top', width: '10%' }}><b>4</b></td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>Menegakkan Diagnosis Keperawatan secara Mandiri dan tuntas tanpa supervisi</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}><b>3B</b></td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>Mampu menegakkan Diagnosis Keperawatan Dalam kondisi Gawat darurat, selanjutnya merujuk setelah stabil</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}><b>3A</b></td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>Mampu menegakkan Diagnosis Keperawatan pada keadaan yang bukan Gawat Darurat, selanjutnya merujuk jika diperlukan penanganan lebih lanjut</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}><b>2</b></td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>Menetapkan/menegakkan Diagnosis Keperawatan dengan tepat dan merancang rujukan yang paling tepat bagi penanganan Klien</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}><b>1</b></td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>Mengetahui dan menjelaskan Diagnosis Keperawatan</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPane>
          <TabPane tab="Intervensi Keperawatan" key="2">
            <div style={{ padding: '16px', backgroundColor: '#FFFF99' }}>
              <h3>KETERANGAN NILAI INTERVENSI SESUAI PENILAIAN PRIBADI (KETERAMPILAN)</h3>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', verticalAlign: 'top', width: '10%' }}><b>1</b></td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>Mampu memahami untuk diri sendiri</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}><b>2</b></td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>Mampu memahami dan menjelaskan</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}><b>3</b></td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>Mampu memahami, menjelaskan, dan melaksanakan di bawah supervisi</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}><b>4</b></td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>Mampu memahami, menjelaskan, dan melaksanakan secara mandiri</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default AssessmentExplanationModal;

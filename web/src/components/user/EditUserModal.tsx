import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Checkbox, Spin, Select, Row, Col, DatePicker, Radio } from 'antd';
import { getCpdList } from '@/services/cpd';
import RoleDropdown from '../RoleDropdown';
import HospitalDropdown from '../HospitalDropdown';
import RoomDropdown from '../RoomDropdown';
import { Akun, User } from 'app-type/index';
import LastEducationDropdown from '../LastEducationDropdown';
import { getOrientasi } from '@/services/orientasi';
import { getPelatihan } from '@/services/pelatihan';
import { CheckboxChangeEvent } from 'antd/es/checkbox/Checkbox';
import { userServiceByEmail } from '@/services/user';
import { UpdateUserRequest } from 'app-type/request';
import dayjs from "dayjs"

const { Option } = Select;

interface EditUserModalProps {
    visible: boolean;
    onCancel: () => void;
    onOk: (values: never) => void;
    initialValues?: {
        email: string;
        akun: Akun;
        user?: User;
        cpd_pk1?: number[];
        cpd_pk2?: number[];
        cpd_pk3?: number[];
        cpd_pk4?: number[];
        cpd_pk5?: number[];
        orientasi?: number[];
        pelatihan?: number[];
    };
    title?: string
    is_edit_by_personal?: boolean
}

const EditUserModal: React.FC<EditUserModalProps> = ({ visible, onCancel, onOk, initialValues, is_edit_by_personal = false, title = "Edit User" }) => {
    const [form] = Form.useForm<UpdateUserRequest>();
    const [cpdList, setCpdList] = useState<Record<string, { id: number; value: string }[]>>({});
    const [orientasiList, setOrientasiList] = useState<{ id: number; value: string }[]>([]);
    const [pelatihanList, setPelatihanList] = useState<{ id: number; value: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSetujuChecked, setIsSetujuChecked] = useState<boolean>(false);
    // const [userByEmail, setUserByEmail] = useState<UserByEmailResponse>()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [pk1, pk2, pk3, pk4, pk5, orientasi, pelatihan, user] = await Promise.all([
                    getCpdList('pk1'),
                    getCpdList('pk2'),
                    getCpdList('pk3'),
                    getCpdList('pk4'),
                    getCpdList('pk5'),
                    getOrientasi(),
                    getPelatihan(),
                    userServiceByEmail(initialValues?.email as string)
                ]);

                const sortAlphabetically = (a: { value: string }, b: { value: string }) => a.value.localeCompare(b.value);

                setCpdList({
                    pk1: pk1.sort(sortAlphabetically),
                    pk2: pk2.sort(sortAlphabetically),
                    pk3: pk3.sort(sortAlphabetically),
                    pk4: pk4.sort(sortAlphabetically),
                    pk5: pk5.sort(sortAlphabetically),
                });

                setOrientasiList(orientasi.sort(sortAlphabetically));
                setPelatihanList(pelatihan.sort(sortAlphabetically));
                // setUserByEmail(user)
                if (initialValues) {
                    const u = user.User
                    form.setFieldsValue({
                        email: initialValues.email,
                        akun: initialValues.akun,
                        user: user.User ?
                            {
                                alamatDomisili: u.alamatDomisili,
                                alamatTinggal: u.alamatTinggal,
                                asalInstitusiPendidikan: u.asalInstitusiPendidikan,
                                id: u.id,
                                jabatanSaatIni: u.jabatanSaatIni,
                                jenisKelamin: u.jenisKelamin,
                                kelulusanTahun: dayjs(u.kelulusanTahun + "-01-01"),
                                levelPerawatManajer: u.levelPerawatManajer,
                                levelPKSaatIni: u.levelPKSaatIni,
                                levelPKYangDiajukan: u.levelPKYangDiajukan,
                                mulaiBekerjaUnitTerakhir: dayjs(u.mulaiBekerjaUnitTerakhir),
                                mulaiBergabungRS: dayjs(u.mulaiBergabungRS),
                                programMutuRCA: u.programMutuRCA,
                                setuju: u.setuju,
                                statusKepegawaian: u.statusKepegawaian,
                                tanggalBerakhirSTR: dayjs(u.tanggalBerakhirSTR),
                                tanggalTerbitSIPP: dayjs(u.tanggalTerbitSIPP),
                                tanggalTerbitSTR: dayjs(u.tanggalTerbitSTR),

                            } as never
                            : undefined,
                        cpd_pk1: u.cpdForPK1.map(c => c.cpdId),
                        cpd_pk2: u.cpdForPK2.map(c => c.cpdId),
                        cpd_pk3: u.cpdForPK3.map(c => c.cpdId),
                        cpd_pk4: u.cpdForPK4.map(c => c.cpdId),
                        cpd_pk5: u.cpdForPK5.map(c => c.cpdId),
                        orientasi: u.orientasiYangDiikuti.map(u => u.orientasiId),
                        pelatihan: u.pelatihanYangDiikuti.map(p => p.pelatihanId)
                    });
                    if (u.setuju) {
                        setIsSetujuChecked(true)
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (visible) {
            fetchData();
        } else {
            setIsSetujuChecked(false)
        }
    }, [visible, initialValues, form]);

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setIsSetujuChecked(e.target.checked);
    };

    // useEffect(() => {
    //     if (visible) {
    //         setTimeout(() => {
    //             setLoading(true)
    //         }, 1000);
    //     }
    // }, [visible])

    return (
        <Modal
            title={title}
            open={visible}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        setLoading(true)
                        onOk(values as never);
                    })
                // .finally(() => setLoading(false));
            }}
            onCancel={() => {
                form.resetFields();
                onCancel();
                setLoading(false)
            }}
            okText="Simpan Perubahan"
            cancelText="Kembali"
            okButtonProps={{
                disabled: !isSetujuChecked,
                loading: loading,
            }}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" initialValues={initialValues}>
                    {/* Informasi Akun {form.getFieldValue(["user",["setuju"]])} */}
                    <Form.Item
                        name={['akun', 'nama']}
                        label="Nama User"
                        rules={[{ required: true, message: 'Silakan masukkan nama user' }]}
                    >
                        <Input disabled={is_edit_by_personal} />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Silakan masukkan email user' }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name={['akun', 'role']}
                        label="Role"
                        rules={[{ required: true, message: 'Silakan pilih role user' }]}
                    >
                        <RoleDropdown disabled={is_edit_by_personal} />
                    </Form.Item>
                    <Form.Item
                        name={['akun', 'pendidikanTerakhir']}
                        label="Pendidikan Terakhir"
                        rules={[{ required: true, message: 'Silakan pilih pendidikan terakhir' }]}
                    >
                        <LastEducationDropdown disabled={is_edit_by_personal} />
                    </Form.Item>
                    <Form.Item
                        name={['akun', 'masterRumahSakitId']}
                        label="Rumah Sakit"
                    >
                        <HospitalDropdown disabled={is_edit_by_personal} />
                    </Form.Item>
                    <Form.Item
                        name={['akun', 'masterRuanganRSId']}
                        label="Ruangan"
                    >
                        <RoomDropdown disabled={is_edit_by_personal} hospitalId={form.getFieldValue(['akun', 'masterRumahSakitId'])} />
                    </Form.Item>

                    {/* Informasi Pribadi User */}
                    <Form.Item
                        name={['user', 'jenisKelamin']}
                        label="Jenis Kelamin"
                        rules={[{ required: true, message: 'Silakan pilih jenis kelamin' }]}
                    >
                        <Select>
                            <Option value="L">Laki-laki</Option>
                            <Option value="P">Perempuan</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={['user', 'alamatDomisili']}
                        label="Alamat Sesuai KTP"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'alamatTinggal']}
                        label="Alamat Tinggal"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'mulaiBergabungRS']}
                        label="Mulai Bergabung RS"
                    >
                        <DatePicker placeholder='Pilih tanggal' style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'mulaiBekerjaUnitTerakhir']}
                        label="Mulai Bekerja di Unit Terakhir"
                    >
                        <DatePicker placeholder='Pilih tanggal' style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'statusKepegawaian']}
                        label="Status Kepegawaian"
                        rules={[{ required: true, message: 'Silakan pilih status kepegawaian' }]}
                    >
                        <Select>
                            <Option value="TNI">TNI</Option>
                            <Option value="ASN">ASN</Option>
                            <Option value="PPPK">PPPK</Option>
                            <Option value="Pegawai Tidak Tetap RS (Honorer)">Pegawai Tidak Tetap RS (Honorer)</Option>
                            <Option value="Lainnya">Lainnya</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={['user', 'asalInstitusiPendidikan']}
                        label="Asal Institusi Pendidikan"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'kelulusanTahun']}
                        label="Tahun Kelulusan"
                    >
                        <DatePicker picker='year' />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'tanggalTerbitSTR']}
                        label="Tanggal Terbit STR"
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'tanggalBerakhirSTR']}
                        label="Tanggal Berakhir STR"
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'tanggalTerbitSIPP']}
                        label="Tanggal Terbit SIPP"
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'jabatanSaatIni']}
                        label="Jabatan Saat Ini"
                        rules={[{ required: true, message: 'Silakan pilih jabatan saat ini' }]}
                    >
                        <Select placeholder="Pilih Jabatan">
                            <Option value="Manajer Keperawatan">Manajer Keperawatan</Option>
                            <Option value="Kepala Seksi">Kepala Seksi</Option>
                            <Option value="Clinical Care Manager">Clinical Care Manager</Option>
                            <Option value="Head Nurse">Head Nurse</Option>
                            <Option value="IPCN">IPCN</Option>
                            <Option value="Anggota Komite Keperawatan">Anggota Komite Keperawatan</Option>
                            <Option value="Ketua Sub Komite Keperawatan">Ketua Sub Komite Keperawatan</Option>
                            <Option value="Perawat Primer (Primary Nurse)">Perawat Primer (Primary Nurse)</Option>
                            <Option value="Perawat Assosiate/Masa Orientasi/Preseptor">Perawat Assosiate/Masa Orientasi/Preseptor</Option>
                            <Option value="Yang lain">Yang lain</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={['user', 'levelPKSaatIni']}
                        label="Level PK Saat Ini"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'levelPKYangDiajukan']}
                        label="Level PK Yang Diajukan"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'levelPerawatManajer']}
                        label="Level Perawat Manajer"
                    >
                        <Input />
                    </Form.Item>
                    {/* Daftar Orientasi */}
                    <Form.Item name="orientasi" label="Orientasi">
                        <Checkbox.Group>
                            <Row>
                                {orientasiList.map(orientasi => (
                                    <Col span={24} key={orientasi.id}>
                                        <Checkbox value={orientasi.id}>
                                            {orientasi.value}
                                        </Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>

                    {/* Daftar Pelatihan */}
                    <Form.Item name="pelatihan" label="Pelatihan">
                        <Checkbox.Group>
                            <Row>
                                {pelatihanList.map(pelatihan => (
                                    <Col span={24} key={pelatihan.id}>
                                        <Checkbox value={pelatihan.id}>
                                            {pelatihan.value}
                                        </Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>

                    {/* Daftar Checkbox untuk CPD PK1 hingga PK5 */}
                    {['pk1', 'pk2', 'pk3', 'pk4', 'pk5'].map(pk => (
                        <Form.Item key={pk} name={`cpd_${pk}`} label={`CPD ${pk.toUpperCase()}`}>
                            <Checkbox.Group>
                                <Row>
                                    {cpdList[pk]?.map(cpd => (
                                        <Col span={24} key={cpd.id}>
                                            <Checkbox value={cpd.id}>
                                                {cpd.value}
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    ))}

                    <Form.Item
                        name={['user', 'programMutuRCA']}
                        label="Apakah Anda pernah mengikuti Program Mutu, Pembahasan Kasus RCA atau FMEA?"
                        rules={[{ required: true, message: 'Silakan pilih salah satu' }]}

                    >
                        <Radio.Group>
                            <Radio value={true}>Ya</Radio>
                            <Radio value={false}>Tidak</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        className='bg-teal-100 p-2 rounded-md'
                        name={['user', 'setuju']}
                        label="Saya menyatakan bahwa data yang diisi adalah dibuat dengan sebenar-benarnya. Bukti sertifikat, logbook, penilaian kinerja  dan pengajuan ini telah disetujui oleh atasan saya."
                        valuePropName="checked"
                    >
                        <Checkbox onChange={handleCheckboxChange}  >Setuju</Checkbox>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default EditUserModal;

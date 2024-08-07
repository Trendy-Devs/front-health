import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// 유효성 검사 스키마 정의
const validationSchema = yup.object().shape({
  userName: yup.string().required('이름을 입력하세요'),
  userEmail: yup.string().email('유효한 이메일을 입력하세요').required('이메일을 입력하세요'),
  userPhone: yup.string().required('전화번호를 입력하세요'),
  userAddress: yup.string().required('주소를 입력하세요'),
  userAge: yup.number().required('나이를 입력하세요'),
  userPw: yup.string().required('비밀번호를 입력하세요'),
});

const UserUpdateTest = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // react-hook-form의 useForm 훅 사용
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      userSq: '',
      userId: '',
      username: '',
      userEmail: '',
      userPhone: '',
      userAddress: '',
      userAge: 0,
      userPw: ''
    }
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await api.get('/user/one');
        setUserInfo(response.data);
        // setValue를 사용하여 폼 필드 초기화
        Object.keys(response.data).forEach(key => setValue(key, response.data[key]));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getUserInfo();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await api.put('/user/update', data);
      alert('정보가 업데이트되었습니다.');
      navigate('/mypage/userinfo');
    } catch (error) {
      console.error('Update error:', error);
      alert('정보 업데이트에 실패했습니다.');
    }
  };

  if (loading) {
    return <div><Loading /></div>;
  }

  if (error) {
    return <p>에러메세지 : {error.message}</p>;
  }

  return (
    <div>
      <h2>정보 수정</h2>
      {userInfo ? (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>회원번호</Form.Label>
            <Controller
              name="userSq"
              control={control}
              render={({ field }) => <Form.Control {...field} readOnly />}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>아이디</Form.Label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => <Form.Control {...field} readOnly />}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Controller
              name="userPw"
              control={control}
              render={({ field }) => <Form.Control type="password" {...field} />}
            />
            <p className="text-danger">{errors.userPw?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>이름</Form.Label>
            <Controller
              name="userName"
              control={control}
              render={({ field }) => <Form.Control {...field} />}
            />
            <p className="text-danger">{errors.username?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>나이</Form.Label>
            <Controller
              name="userAge"
              control={control}
              render={({ field }) => <Form.Control type="number" {...field} />}
            />
            <p className="text-danger">{errors.userAge?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>전화번호</Form.Label>
            <Controller
              name="userPhone"
              control={control}
              render={({ field }) => <Form.Control {...field} />}
            />
            <p className="text-danger">{errors.userPhone?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>이메일</Form.Label>
            <Controller
              name="userEmail"
              control={control}
              render={({ field }) => <Form.Control {...field} />}
            />
            <p className="text-danger">{errors.userEmail?.message}</p>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>주소</Form.Label>
            <Controller
              name="userAddress"
              control={control}
              render={({ field }) => <Form.Control {...field} />}
            />
            <p className="text-danger">{errors.userAddress?.message}</p>
          </Form.Group>
          <Button variant="primary" type="submit">
            업데이트
          </Button>
        </Form>
      ) : (
        <p>사용자 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default UserUpdateTest;

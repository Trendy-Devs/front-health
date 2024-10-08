import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

function CommonHeader() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 세션 스토리지에서 토큰을 확인하여 로그인 상태 설정
    const token = sessionStorage.getItem('token');
    console.log('토큰 여부'+ token);
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // 빈 배열로 useEffect가 컴포넌트 마운트 시에만 실행되도록 설정

  // 로그아웃 로직 수정
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.')
    window.location.href = '/';
  }

  return (
    <header className="header-area header-sticky">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              <Link to="/" className="logo" style={{ cursor: 'pointer' }}>
                Healthy<em> Life</em>
              </Link>
              <ul className="nav">
                <li>
                  <Link to="/" className={`scroll-to-section ${location.pathname === '/' ? 'active' : ''}`}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/today" className={`scroll-to-section ${location.pathname === '/today' ? 'active' : ''}`}>
                    Today's
                  </Link>
                </li>
                <li>
                  <Link to="/community" className={`scroll-to-section ${location.pathname === '/community' ? 'active' : ''}`}>
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/mypage" className={`scroll-to-section ${location.pathname.startsWith('/mypage') ? 'active' : ''}`}>
                    MyPage
                  </Link>
                </li>
                {isLoggedIn ? (
                  <li className="main-button">
                    <Button variant="warning" onClick={handleLogout}>로그아웃</Button>
                  </li>
                ) : (
                  <li className="main-button">
                    <Link to="/login" className='scroll-to-section'>
                      로그인
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default CommonHeader;

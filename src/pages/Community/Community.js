import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import api from '../../services/api';
import Table from 'react-bootstrap/Table';
import CommonPagination from '../../components/common/CommonPagination';
import styles from '../../assets/styles/community/community.module.scss';

const Community = () => {
  const [community, setCommunity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearch] = useState('');   // 검색어 상태
  const [searchResult, setSearchResult] = useState([]); // 검색결과 상태
  const [searchInput, setSearchInput] = useState(''); // 검색 입력 상태
  
  const formatDate = (isString) => {
    const date = new Date(isString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  useEffect(() => {
    const getCommunity = async () => {
      try {
        const response = await api.get('/community/all');
        const sortedData = response.data.sort(
          (a, b) => new Date(b.communityCreated) - new Date(a.communityCreated)
        );
        setCommunity(sortedData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getCommunity();
  }, []);

  useEffect(() => {
    const filtered = community.filter((item) =>
      item.communityTitle.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResult(filtered);
    setPage(1);
  }, [search, community]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearch = () => {
    setSearch(searchInput);
  };

  if (loading) {
    return <div><Loading /></div>;
  }

  if (error) {
    return <p>에러메세지: {error.message}</p>;
  }

  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResult.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{width:'1500px',height:'100%'}}>
      <h2>실시간 헬스 갤러리</h2>
      <div className='input-group' style={{ justifyContent: 'space-between',alignContent:'center', Width: '1300px', margin: '0 auto', marginBottom: '30px', marginTop: '30px'}}>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <input type="search" className='form-control rounded' style={{flex: 1,maxWidth:'500px',marginRight:'10px',alignItems:'center',marginLeft:'500px' }} placeholder="검색어를 입력하세요." aria-label="Search" aria-describedby="search-addon"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="button" className='btn btn-outline-primary' onClick={handleSearch} style={{ whiteSpace: 'nowrap',borderRadius:'3px'
        
      }}>검색</button>   
         </div> 
        <Link to="/communitywrite" className="btn btn-primary" style={{marginRight:'100px',borderRadius:'5px'}}>
          게시글작성
        </Link>
      </div>
      <hr />

      <div className={styles.communityContainer}>
      <Table striped bordered hover style={{width:'100%',textAlign:'center', margin:'0 auto',
      }}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>추천수</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((communityItem) => (
            <tr key={communityItem.id}>
              <td>{communityItem.communitySq}</td>
              <td>
                <Link to={`/community/communityDetail/${communityItem.communitySq}`}>
                  {communityItem.communityTitle}
                </Link>
              </td>
              <td>{communityItem.user.userId}</td>
              <td>{formatDate(communityItem.communityCreated)}</td>
              <td>{communityItem.communityview}</td>
              <td>{communityItem.communityRecommend}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
      <div className={styles.paginationContainer}>
        <CommonPagination
          activePage={page}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={searchResult.length}
          pageRangeDisplayed={5}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Community;

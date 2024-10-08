import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import styles from '../../assets/styles/community/communityDetail.module.scss';
import api from '../../services/api';
import { AiFillLike } from 'react-icons/ai';

const CommunityDetail = () => {
  const { id } = useParams();
  const [communityItem, setCommunityItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [hasRecommended, setHasRecommended] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  useEffect(() => {
    const fetchCommunityItem = async () => {
      try {
        const response = await api.get(`/community/communityDetail/${id}`);
        setCommunityItem(response.data);
        await api.post(`/community/view/${id}`);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    //추천 여부
    const checkRecommendation = async () => {
      try {
        const response = await api.get(`/community/recommend/check/${id}`);
        setHasRecommended(response.data.hasRecommended);
      } catch (error) {
        console.error('추천이 실패 하였습니다:', error);
      }
    };

    //로그인 확인
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    fetchCommunityItem();
    checkRecommendation();
    checkLoginStatus();

  }, [id]);

  //댓글 추가
  const addCommunityComments = async () => {
    if (newComment.trim() === '') return; // 빈 댓글 방지
    try {
      const response = await api.post(`/communityComments/insert`, {
        communityCommentsContents: newComment,
        community: { communitySq: id }, // 커뮤니티 ID를 포함한 객체로 전달
        communityCommentsCreated: new Date().toISOString()
      });
      alert('댓글 작성이 성공했습니다.')
      // 새로 추가된 댓글을 포함한 댓글 리스트 업데이트
      setCommunityItem(prevState => ({
        ...prevState,
        comments: [...prevState.comments, response.data]
      }));

      setNewComment(''); // 댓글 입력 필드 초기화
    } catch (error) {
      console.error('댓글 작성이 실패했습니다 :', error);
      alert('댓글 작성을 실패했습니다.')
    }
  };

  //댓글 수정
  const updateCommunityComment = async (commentId, updatedContent) => {
    try {
      const response = await api.put(`/communityComments/update`, {
        communityCommentsSq: commentId,
        communityCommentsContents: updatedContent,
        communityCommentsCreated: new Date().toISOString()
      });
      alert('댓글 수정을 성공했습니다.')
      // 수정된 댓글 반영
      setCommunityItem(prevState => ({
        ...prevState,
        comments: prevState.comments.map(comment => 
          comment.communityCommentsSq === commentId ? response.data : comment
        )
      }));
    } catch (error) {
      console.error('댓글 수정이 실패했습니다 :', error);
      alert('댓글 수정을 실패했습니다.')
    }
  };

  //댓글 삭제
  const deleteCommunityComment = async (commentId) => {
    try {
      await api.delete(`/communityComments/delete/${commentId}`);
      alert('댓글이 삭제 되었습니다.')
      // 삭제된 댓글 제거
      setCommunityItem(prevState => ({
        ...prevState,
        comments: prevState.comments.filter(comment => comment.communityCommentsSq !== commentId)
      }));
    } catch (error) {
      console.error('댓글 삭제가 실패했습니다 :', error);
      alert('댓글 삭제가 실패했습니다.')
    }
  };

  //추천 요청
  const toggleRecommendation = async () => {
    try {
      const response = await api.post(`/community/recommend/${id}`);
      setCommunityItem(prevState => ({
        ...prevState,
        communityRecommend: response.data
      }));
      setHasRecommended(prevState => !prevState);
    } catch (error) {
      console.error('추천을 실패했습니다:', error);
    }
  };

  if (loading) {
    return <div><Loading /></div>;
  }

  if (error) {
    return <p>에러메세지: {error.message}</p>;
  }

  return (
    <div className={styles.communityDetail}>
      <div className={styles.communityInfo}>
        <h3>커뮤니티 정보</h3>
        <div className={styles.communityHeader}>
          <p><strong>글번호:</strong> {communityItem.communitySq}</p>
          <p><strong>작성자:</strong> {communityItem.user.userId}</p>
          <p><strong>작성일:</strong> {formatDate(communityItem.communityCreated)}</p>
          <p><strong>조회수:</strong> {communityItem.communityview}</p>
          <p><strong>추천수:</strong> {communityItem.communityRecommend}</p>
        </div>
        <p><strong>글제목:</strong> {communityItem.communityTitle}</p>
        <hr />
        <p className={styles.communityText}><strong></strong> {communityItem.communityContents}</p>
        {isLoggedIn && (
          <div className={styles.buttonLike}>
            <button 
              className={`${styles.recommendButton} ${hasRecommended ? styles.recommended : ''}`} 
              onClick={toggleRecommendation}
            >
              <AiFillLike />
              {hasRecommended ? '추천 취소' : '추천'}
            </button> 
          </div>
        )}
      </div>
      <hr />
      <div className={styles.commentsSection}>
        <h3>댓글</h3>
        {isLoggedIn ? (
          <div className={styles.commentsContainer}>
            <textarea
              className={styles.commentsWrite}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
            <button className={styles.commentsButton} onClick={addCommunityComments}>등록</button>
          </div>
        ) : (
          <p>로그인 후 댓글을 작성할 수 있습니다.</p>
        )}
        {communityItem.comments && communityItem.comments.length > 0 ? (
          communityItem.comments.map((comment) => (
            <div key={comment.communityCommentsSq} className={styles.comment}>
              <p><strong>작성자:</strong> {comment.user.userId}</p>
              <p><strong>내용:</strong> {comment.communityCommentsContents}</p>
              <p><strong>작성날짜:</strong> {formatDate(comment.communityCommentsCreated)}</p>
              {isLoggedIn && comment.user.userId === sessionStorage.getItem('userId') && (
                <div className={styles.commentActions}>
                  <button onClick={() => updateCommunityComment(comment.communityCommentsSq, prompt("수정할 내용을 입력하세요", comment.communityCommentsContents))}>
                    수정
                  </button>
                  <button onClick={() => deleteCommunityComment(comment.communityCommentsSq)}>삭제</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;

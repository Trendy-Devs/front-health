import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from '../../assets/styles/today/postModal.module.scss';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import api from '../../services/api'; 

Modal.setAppElement('#root');

const PostModal = ({ isOpen, isClose, post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.todayHearts || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (newComment.trim() !== '') {
      const commentData = { username: '현재 사용자', text: newComment };
      try {
        const addedComment = await addComment(post.todaySq, commentData);
        setComments([...comments, addedComment]);
        setNewComment('');
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  const addComment = async (postId, commentData) => {
    try {
        const response = await api.post('/todayComments/register', 
          { postId: postId,...commentData });
        return response.data;
    } catch (error) {
        throw new Error('Failed to add comment');
    }
  };

  const likePost = async (todayId) => {
    try {
        const response = await api.post(`/today/todaylike/${todayId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to like post');
    }
  };

  const unlikePost = async (todayId) => {
    try {
       const response = await api.post(`/today/todaylike/${todayId}`);
       return response.data;
    } catch (error) {
        throw new Error('Failed to unlike post');
    }
  };

  const toggleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost(post.todaySq);
        setIsLiked(false);
        setLikes(likes - 1);
      } else {
        await likePost(post.todaySq);
        setIsLiked(true);
        setLikes(likes + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  if (!post) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={isClose}
      contentLabel="Post Modal"
      className={styles.modal}
      overlayClassName={styles.overlay}>
      <div className={styles.modalContent}>
        {/* 이미지가 있는 경우에만 표시 */}
        {post.imageurl && (
          <div className={styles.modalImageWrapper}>
            <img src={post.imageurl} alt="" className={styles.modalImage} />
          </div>
        )}
        <div className={styles.commentHeaderSection}>
      <div className={styles.username}>작성자: {post.user.userId}</div>
      <div className={styles.date}>작성일: {new Date(post.todayCreated).toLocaleDateString()}</div>
    </div>

    <div className={styles.modalBody}>
      <div className={styles.modalText}>
        <p className={styles.modalDescription}>{post.todayContents}</p>
      </div>
    </div>

    <div className={styles.footerSection}>
      {/* 좋아요 버튼 */}
      <div className={styles.likeSection}>
        <div className={styles.heart} onClick={toggleLike}>
          {isLiked ? <AiFillHeart style={{ color: 'red' }} /> : <AiOutlineHeart />} {likes}
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className={styles.commentSection}>
        <div className={styles.commentList}>
          {comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <div className={styles.commentHeader}>
                <span className={styles.commentUsername}>{comment.user.userId}</span>
                <span className={styles.commentDate}>{new Date(comment.todayCommentsCreated).toLocaleDateString()}</span>
              </div>
              <div className={styles.commentText}>
                {comment.todayCommentsContents}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.commentForm}>
          <input
            type="text"
            className={styles.commentInput}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
          />
          <button className={styles.commentButton} onClick={handleAddComment}>게시</button>
        </div>
      </div>
    </div>
    
    <button className={styles.closeButton} onClick={isClose}>×</button>
  </div>
    </Modal>
  );
};

export default PostModal;

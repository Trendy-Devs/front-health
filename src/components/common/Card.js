import React, { useState } from 'react';
import PostModal from './PostModal';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import styles from '../../assets/styles/today/card.module.scss';

export const Card = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className={styles.cardWrapper} onClick={openModal}>
        <div className={styles.cardBodyImg}>
          <img 
            src={post.image}
            alt={post.title}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }}
          />
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.heart}>
            {post.isLiked ? <AiFillHeart style={{ color: 'red' }} /> : <AiOutlineHeart />} {post.likes}
          </div>
        </div>
      </div>
      <PostModal 
        isOpen={isModalOpen} 
        isClose={closeModal} 
        post={post} 
      />
    </div>
  );
};

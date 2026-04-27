'use client';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import styles from './ReviewSection.module.css';

export default function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.getReviews().then(setReviews).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || rating === 0) return;

    setSubmitting(true);
    try {
      const newReview = await api.submitReview({
        author_name: name,
        rating,
        comment,
      });
      setReviews([newReview, ...reviews]);
      setName('');
      setRating(0);
      setComment('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <section className={`section ${styles.section}`} id="reviews">
      <div className="container">
        <div className="section-title">
          <h2>What Members <span className="text-glow">Say</span></h2>
          <div className="accent-line"></div>
        </div>

        {/* Average Rating */}
        <div className={styles.avgRating}>
          <span className={`text-accent text-glow ${styles.avgValue}`}>{avgRating}</span>
          <div className={styles.avgStars}>
            {[1,2,3,4,5].map((s) => (
              <span key={s} className={`star ${s <= Math.round(Number(avgRating)) ? 'filled' : ''}`}>★</span>
            ))}
          </div>
          <span className={styles.totalReviews}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
        </div>

        <div className={styles.grid}>
          {/* Submit Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.formTitle}>Leave a Review</h3>

            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                id="review-name"
              />
            </div>

            <div className="form-group">
              <label>Rating</label>
              <div className="stars">
                {[1,2,3,4,5].map((s) => (
                  <span
                    key={s}
                    className={`star ${s <= (hoverRating || rating) ? 'filled' : ''}`}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    id={`star-${s}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Comment (optional)</label>
              <textarea
                className="form-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                id="review-comment"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !name || rating === 0}
              id="review-submit"
            >
              {submitting ? 'Submitting...' : submitted ? '✓ Submitted!' : 'Submit Review'}
            </button>
          </form>

          {/* Reviews List */}
          <div className={styles.list}>
            {reviews.length === 0 ? (
              <p className={styles.noReviews}>No reviews yet. Be the first!</p>
            ) : (
              reviews.slice(0, 8).map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.avatar}>
                      {review.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className={styles.authorName}>{review.author_name}</span>
                      <div className="stars">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={`star ${s <= review.rating ? 'filled' : ''}`} style={{fontSize: '1rem', cursor: 'default'}}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

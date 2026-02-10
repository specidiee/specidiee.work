'use client';

import { useEffect, useState } from 'react';
import styles from './CommentSystem.module.css';

interface Comment {
  id: string;
  postSlug: string;
  author: string;
  email: string;
  content: string;
  parentId: string | null;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface CommentSystemProps {
  postSlug: string;
  postTitle: string;
}

export default function CommentSystem({ postSlug, postTitle }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');

  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postSlug=${postSlug}`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return false;

    const domain = email.split('@')[1];
    if (!domain || domain.length < 4 || !domain.includes('.')) return false;

    const tld = domain.split('.').pop();
    if (!tld || tld.length < 2) return false;

    return true;
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !email.trim() || !content.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!validateEmail(email.trim())) {
      alert('올바른 이메일 주소를 입력해주세요.\n예: user@example.com');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug,
          postTitle,
          author: author.trim(),
          email: email.trim(),
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit comment');
      }

      setAuthor('');
      setEmail('');
      setContent('');
      await fetchComments();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`댓글 작성 실패: ${error.message}`);
      } else {
        alert('댓글 작성에 실패했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();

    if (!replyAuthor.trim() || !replyEmail.trim() || !replyContent.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!validateEmail(replyEmail.trim())) {
      alert('올바른 이메일 주소를 입력해주세요.\n예: user@example.com');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug,
          postTitle,
          author: replyAuthor.trim(),
          email: replyEmail.trim(),
          content: replyContent.trim(),
          parentId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit reply');
      }

      setReplyAuthor('');
      setReplyEmail('');
      setReplyContent('');
      setReplyingTo(null);
      await fetchComments();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`답글 작성 실패: ${error.message}`);
      } else {
        alert('답글 작성에 실패했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;

    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className={styles.commentSection}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.commentSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          댓글 <span className={styles.count}>{comments.length}</span>
        </h2>
      </div>

      <form onSubmit={handleSubmitComment} className={styles.commentForm}>
        <div className={styles.formCard}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="author" className={styles.label}>
                이름 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="홍길동"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                이메일 <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              댓글 <span className={styles.required}>*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="댓글을 남겨주세요..."
              className={styles.textarea}
              required
            />
          </div>

          <div className={styles.formFooter}>
            <p className={styles.hint}>답글이 달리면 이메일로 알림을 받습니다.</p>
            <button type="submit" disabled={submitting} className={styles.submitButton}>
              {submitting ? (
                <span className={styles.buttonLoading}>
                  <div className={styles.buttonSpinner}></div>
                  작성 중...
                </span>
              ) : (
                '댓글 작성'
              )}
            </button>
          </div>
        </div>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentCard}>
            <div className={styles.commentInner}>
              <div className={styles.avatar}>{comment.author.charAt(0).toUpperCase()}</div>

              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <span className={styles.authorName}>{comment.author}</span>
                  <span className={styles.timestamp}>{formatDate(comment.createdAt)}</span>
                </div>

                <p className={styles.commentText}>{comment.content}</p>

                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className={styles.replyButton}
                >
                  <svg className={styles.replyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  {replyingTo === comment.id ? '취소' : '답글'}
                </button>

                {replyingTo === comment.id && (
                  <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className={styles.replyForm}>
                    <div className={styles.replyFormGrid}>
                      <input
                        type="text"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        placeholder="이름"
                        className={styles.input}
                        required
                      />
                      <input
                        type="email"
                        value={replyEmail}
                        onChange={(e) => setReplyEmail(e.target.value)}
                        placeholder="이메일"
                        className={styles.input}
                        required
                      />
                    </div>

                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="답글을 입력하세요..."
                      className={styles.textarea}
                      rows={3}
                      required
                    />

                    <div className={styles.replyFormActions}>
                      <button type="button" onClick={() => setReplyingTo(null)} className={styles.cancelButton}>
                        취소
                      </button>
                      <button type="submit" disabled={submitting} className={styles.replySubmitButton}>
                        {submitting ? '작성 중...' : '답글 작성'}
                      </button>
                    </div>
                  </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className={styles.replies}>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className={styles.replyCard}>
                        <div className={styles.replyAvatar}>{reply.author.charAt(0).toUpperCase()}</div>

                        <div className={styles.replyContent}>
                          <div className={styles.replyHeader}>
                            <span className={styles.replyAuthor}>{reply.author}</span>
                            <span className={styles.replyTimestamp}>{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className={styles.replyText}>{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className={styles.emptyTitle}>아직 댓글이 없습니다</p>
          <p className={styles.emptyDescription}>첫 번째 댓글을 남겨보세요!</p>
        </div>
      )}
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReplyNotification } from '@/lib/email';

// GET: 특정 게시글의 댓글 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');

    if (!postSlug) {
      return NextResponse.json({ error: 'postSlug is required' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { postSlug },
      orderBy: { createdAt: 'asc' },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // 최상위 댓글만 반환 (replies는 이미 포함되어 있음)
    const topLevelComments = comments.filter(comment => !comment.parentId);

    return NextResponse.json({ comments: topLevelComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST: 새 댓글 또는 답글 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, postTitle, author, email, content, parentId } = body;

    // 유효성 검사
    if (!postSlug || !author || !email || !content) {
      return NextResponse.json(
        { error: 'postSlug, author, email, and content are required' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증 (더 엄격한 검증)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '올바른 이메일 주소를 입력해주세요' }, { status: 400 });
    }

    // 도메인 검증 (최소 요구사항)
    const domain = email.split('@')[1];
    if (!domain || domain.length < 4 || !domain.includes('.')) {
      return NextResponse.json({ error: '올바른 이메일 도메인을 입력해주세요' }, { status: 400 });
    }

    // TLD 검증 (최소 2자 이상)
    const tld = domain.split('.').pop();
    if (!tld || tld.length < 2) {
      return NextResponse.json({ error: '올바른 이메일 도메인을 입력해주세요' }, { status: 400 });
    }

    // 댓글 저장
    const newComment = await prisma.comment.create({
      data: {
        postSlug,
        author,
        email,
        content,
        parentId: parentId || null,
      },
      include: {
        parent: true,
      },
    });

    // 답글인 경우, 원 댓글 작성자에게 이메일 알림 발송
    if (parentId && newComment.parent) {
      const parentEmail = newComment.parent.email;

      // 자기 자신에게는 알림 안 보냄
      if (parentEmail !== email) {
        await sendReplyNotification({
          to: parentEmail,
          postSlug,
          postTitle: postTitle || '게시글',
          replyAuthor: author,
          replyContent: content,
          commentContent: newComment.parent.content,
        });
      }
    }

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

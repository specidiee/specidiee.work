import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendReplyNotificationParams {
  to: string;
  postSlug: string;
  postTitle: string;
  replyAuthor: string;
  replyContent: string;
  commentContent: string;
}

export async function sendReplyNotification({
  to,
  postSlug,
  postTitle,
  replyAuthor,
  replyContent,
  commentContent,
}: SendReplyNotificationParams) {
  try {
    const postUrl = `https://specidiee.work/blog/${postSlug}`;

    const { data, error } = await resend.emails.send({
      from: 'specidiee.work <noreply@specidiee.work>',
      to: [to],
      subject: `${replyAuthor}님이 회원님의 댓글에 답글을 달았습니다`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>새로운 답글이 달렸습니다</h2>
          <p><strong>${replyAuthor}</strong>님이 회원님의 댓글에 답글을 남겼습니다.</p>

          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #666; font-size: 14px;">회원님의 댓글:</p>
            <p style="margin: 10px 0;">${commentContent}</p>
          </div>

          <div style="background-color: #e3f2fd; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #666; font-size: 14px;">${replyAuthor}님의 답글:</p>
            <p style="margin: 10px 0;">${replyContent}</p>
          </div>

          <p>
            <a href="${postUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              게시글로 이동하기
            </a>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

          <p style="color: #999; font-size: 12px;">
            이 이메일은 <a href="${postUrl}" style="color: #4CAF50;">${postTitle}</a> 게시글의 댓글 알림입니다.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

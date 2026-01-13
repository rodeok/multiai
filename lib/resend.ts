import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendModelNotificationEmail(params: {
    to: string[];
    modelName: string;
    action: 'added' | 'updated';
    description?: string;
}) {
    const { to, modelName, action, description } = params;

    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set');
        return { error: 'RESEND_API_KEY is not set' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'MultiAI <notifications@resend.dev>', // Note: This is for testing, domains need verification for custom sender
            to: to,
            subject: `New AI Model ${action === 'added' ? 'Available' : 'Updated'}: ${modelName}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb;">MultiAI Platform Update</h2>
          <p>Hello,</p>
          <p>We are excited to inform you that a new AI model has been <strong>${action}</strong> to the platform: <strong>${modelName}</strong>.</p>
          ${description ? `<p style="color: #475569; font-style: italic;">"${description}"</p>` : ''}
          <p>Log in now to compare its performance with your other favorite models!</p>
          <div style="margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/workspace" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
               Go to Workspace
            </a>
          </div>
          <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #94a3b8;">You are receiving this because you have an account on MultiAI.</p>
        </div>
      `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { error };
        }

        return { data };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { error };
    }
}

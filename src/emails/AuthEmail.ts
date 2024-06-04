import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'Task_MERN <admin@task.com>',
            to: user.email,
            subject: 'TASK - Email Confirmation',
            text: 'Task- Confirm your email',
            html: `<p>Hello ${user.name}, please confirm your email by clicking <a href="${process.env.FRONTEND_URL}/auth/confirm-account">here</a></p>
            <p>And introduce the code: <b>${user.token}</b></p>
            <p>This token will expire in 10 minutes</p>
            `
        })

        console.log('Message sent: %s', info.messageId)

    }

}
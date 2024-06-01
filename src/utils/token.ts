/*export const generateToken = async (userId: string) => {
    const token = await crypto.randomBytes(32).toString('hex')
    const newToken = new Token({
        token,
        userId
    })
    await newToken.save()
    return token
}*/

export const generateToken = () => Math.floor(100000 + Math.random() * 900000).toString()

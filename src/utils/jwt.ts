import jwt from 'jsonwebtoken';

export const generateJWT = () => {

    const data = {
        name: 'John Doe',
        credit_card: '1234-1234-1234-1234',
        password: 'password'
      
    }
    const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: '6m'
    })

    return token;
}
import jwt

from meridien.settings import SECRET_KEY


def generate_token(id):
    return jwt.encode(
        payload={"id": id},
        key=SECRET_KEY,
        algorithm='HS256'
    ).decode()


def decode_token(token):
    payload = jwt.decode(
        jwt=token,
        key=SECRET_KEY,
        algorithms=['HS256']
    )

    return payload['id']


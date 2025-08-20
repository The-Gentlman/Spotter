from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from urllib.parse import parse_qs
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings
from django.contrib.auth import get_user_model


@database_sync_to_async
def get_user(user_id):
    try:
        return get_user_model().objects.get(id=user_id)
    except get_user_model().DoesNotExist:
        return AnonymousUser()


def extract_token(headers):
    token = next(
        filter(
            lambda item: item[1] if item[0] == b"authorization" else None,
            headers,
        ),
        None,
    )
    if token:
        token_name, token_key = token[1].decode().split()
        if token_name == "Bearer":
            return token_key
    return None


def extract_token_from_qs(scope):
    query_string = scope.get("query_string", b"").decode("utf-8")
    query_parameters = parse_qs(query_string)
    token = query_parameters.get("token", [None])[0]
    return token


class TokenAuthMiddleware:
    """
    Custom token auth middleware
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        token = extract_token_from_qs(scope)
        scope["user"] = AnonymousUser()
        if token:
            try:
                UntypedToken(token)
            except (InvalidToken, TokenError) as e:
                print(e)
            else:
                decoded_data = jwt_decode(
                    token, settings.SECRET_KEY, algorithms=["HS256"]
                )
                user = await get_user(decoded_data["user_id"])
                scope["user"] = user

        return await self.app(scope, receive, send)

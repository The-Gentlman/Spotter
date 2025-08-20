from django.urls import path
from . import views

urlpatterns = [
    path("", views.UserAPI.as_view(), name="users"),
    path("/user/<int:user_id>", views.UserAPI.as_view(), name="user"),
    path("/session", views.get_session, name="user_session"),
    path("/search", views.UserSearchApi.as_view(), name="search"),
    # path("/sign-in"),
]

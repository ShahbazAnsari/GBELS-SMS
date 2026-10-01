from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from rest_framework.routers import DefaultRouter

from .views import ProtectedView, AdminOnlyView, StudentViewSet


router = DefaultRouter()
router.register("students", StudentViewSet, basename="student")


urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("protected/", ProtectedView.as_view(), name="protected"),
    path("admin-only/", AdminOnlyView.as_view(), name="admin_only"),
]

urlpatterns += router.urls
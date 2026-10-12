from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from rest_framework.routers import DefaultRouter

from .views import ( 
    ProtectedView, 
    AdminOnlyView, 
    RegisterView,
    AddressViewSet,
    AcademicSessionViewSet,
    ClassViewSet,
    SectionViewSet,
    MediumViewSet,
    AdmissionTypeViewSet,
    SchoolViewSet,
    StaffViewSet,
    StudentViewSet, 
    AttendanceViewSet, 
)


router = DefaultRouter()
router.register("schools", SchoolViewSet, basename="school")
router.register("addresses", AddressViewSet, basename="address")
router.register("students", StudentViewSet, basename="student")
router.register("attendance", AttendanceViewSet, basename="attendance")
router.register("staff", StaffViewSet, basename="staff")
router.register("academic-sessions", AcademicSessionViewSet, basename="academic-session")
router.register("classes", ClassViewSet, basename="class")
router.register("sections", SectionViewSet, basename="Section")
router.register("mediums", MediumViewSet, basename="Mediumn")
router.register("admission-type", AdmissionTypeViewSet, basename="admission-type")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("protected/", ProtectedView.as_view(), name="protected"),
    path("admin-only/", AdminOnlyView.as_view(), name="admin_only"),
]

urlpatterns += router.urls
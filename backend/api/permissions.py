from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "SUPER_ADMIN"
        )


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["SUPER_ADMIN", "ADMIN"]
        )


class IsHeadmaster(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "SUPER_ADMIN",
                "ADMIN",
                "HEADMASTER"
            ]
        )


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "SUPER_ADMIN",
                "ADMIN",
                "HEADMASTER",
                "TEACHER"
            ]
        )


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "SUPER_ADMIN",
                "ADMIN",
                "HEADMASTER",
                "TEACHER",
                "STAFF"
            ]
        )


# | Module               | SUPER_ADMIN | ADMIN | HEADMASTER | TEACHER | STAFF |
# | -------------------- | ----------- | ----- | ---------- | ------- | ----- |
# | Student Registration | ✅          | ✅   | ✅         | 👁️     | ❌    |
# | Attendance           | ✅          | ✅   | ✅         | ✅     | 👁️    |
# | Staff Registration   | ✅          | ✅   | ✅         | ❌     | ❌    |
# | Faculty Profile      | ✅          | ✅   | 👁️         | 👁️     | 👁️    |

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, AcademicSession, Address, Student

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, School


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "School Information",
            {
                "fields": ("role", "school"),
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "School Information",
            {
                "fields": ("role", "school"),
            },
        ),
    )


admin.site.register(AcademicSession)
admin.site.register(Address)
admin.site.register(Student)

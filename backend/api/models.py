from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = [
        ("SUPER_ADMIN", "Super Admin"),
        ("ADMIN", "Admin"),
        ("HEADMASTER", "Headmaster"),
        ("TEACHER", "Teacher"),
        ("STAFF", "Staff"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="STAFF"
    )

    def __str__(self):
        return f"{self.username} - {self.role}"

class Student(models.Model):

    GENDER_CHOICES = [
        ("MALE", "Male"),
        ("FEMALE", "Female"),
    ]

    MEDIUM_CHOICES = [
        ("SINDHI", "Sindhi"),
        ("URDU", "Urdu"),
    ]

    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    ]

    student_id = models.CharField(max_length=20, unique=True)

    def save(self, *args, **kwargs):
        if not self.student_id:
            last_student = Student.objects.order_by("-id").first()

            if last_student and last_student.student_id.startswith("ST"):
                last_number = int(last_student.student_id[2:])
                new_number = last_number + 1
            else:
                new_number = 1

            self.student_id = f"ST{new_number:03d}"

        super().save(*args, **kwargs)

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)

    father_name = models.CharField(max_length=100)

    date_of_birth = models.DateField(null=True, blank=True)

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )

    class_name = models.CharField(max_length=50)

    section = models.CharField(max_length=20)

    medium = models.CharField(
        max_length=10,
        choices=MEDIUM_CHOICES
    )

    admission_date = models.DateField()

    picture = models.ImageField(
        upload_to="students/",
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_id} - {self.first_name}"
from django.contrib.auth.models import AbstractUser
from django.db import models, transaction



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

    school = models.ForeignKey(
        "School",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="users"
    )

    def __str__(self):
        return f"{self.username} - {self.role}"


#school models
class Address(models.Model):
    province = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    taluka = models.CharField(max_length=100)

    union_council = models.CharField(
        max_length=100,
        blank=True
    )

    city_town = models.CharField(max_length=100)
    area_locality = models.CharField(max_length=150)

    house_no_street = models.CharField(
        max_length=200,
        blank=True
    )

    postal_code = models.CharField(
        max_length=20,
        blank=True
    )

    def __str__(self):
        return f"{self.city_town}, {self.district}"

class School(models.Model):
    SCHOOL_STATUS = [
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    ]

    school_name = models.CharField(max_length=200)

    semis_code = models.CharField(
        max_length=50,
        unique=True
    )

    school_short_name = models.CharField(
        max_length=20,
        unique=True
    )

    branch_identifier = models.CharField(
        max_length=20,
        unique=True
    )

    school_type = models.CharField(max_length=100)

    address = models.OneToOneField(
        Address,
        on_delete=models.PROTECT,
        related_name="school"
    )

    phone = models.CharField(
        max_length=30,
        blank=True
    )

    email = models.EmailField(
        blank=True
    )

    logo = models.ImageField(
        upload_to="schools/",
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=10,
        choices=SCHOOL_STATUS,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.school_name


class AcademicSession(models.Model):
    session_name = models.CharField(
        max_length=20,
        unique=True
    )

    start_date = models.DateField()
    end_date = models.DateField()

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):
        if self.is_active:
            AcademicSession.objects.filter(
                is_active=True
            ).exclude(
                pk=self.pk
            ).update(
                is_active=False
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.session_name

class Class(models.Model):
    class_name = models.CharField(
        max_length=50,
        unique=True
    )

    order = models.PositiveIntegerField(
        unique=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.class_name

class Section(models.Model):
    section_name = models.CharField(
        max_length=50,
        unique=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.section_name

class Medium(models.Model):
    medium_name = models.CharField(
        max_length=50,
        unique=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.medium_name

class AdmissionType(models.Model):
    admission_type_name = models.CharField(
        max_length=100,
        unique=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.admission_type_name

class StudentIDSequence(models.Model):
    school = models.OneToOneField(
        School,
        on_delete=models.PROTECT,
        related_name="student_id_sequence"
    )

    last_number = models.PositiveIntegerField(
        default=0
    )

    last_gr_number = models.PositiveIntegerField(
        default=0
    )

    def __str__(self):
        return f"{self.school.school_short_name}-{self.school.semis_code[-2:]}"

class Student(models.Model):

    student_id = models.CharField(
        max_length=50,
        unique=True,
        editable=False
    )

    gr_no = models.CharField(
        max_length=50
    )

    ###################################################### Personal Information
    first_name = models.CharField(
        max_length=100,
    )

    last_name = models.CharField(
        max_length=100,
        blank=True
    )

    surname = models.CharField(
        max_length=100
    )

    picture = models.ImageField(
        upload_to="students/",
        blank=False,
        null=False
    )

    gender = models.CharField( max_length=50,  default = "MALE" )

    religion = models.CharField( max_length=100, default="ISLAM" )

    dob = models.DateField()

    b_form_crc = models.CharField( max_length=50, blank=True )

    nationality = models.CharField( max_length=100, )

    ######################################################## Parent / Guardian

    father_name = models.CharField( max_length=150, )

    father_mother_cnic = models.CharField( max_length=20, blank=True )

    contact_no = models.CharField( max_length=30, )

    guardian_name = models.CharField( max_length=150, blank=True )

    guardian_cnic = models.CharField(
        max_length=20,
        blank=True
    )

    guardian_relation = models.CharField( max_length=100, blank=True )

    emergency_contact_no = models.CharField(
        max_length=30,
        blank=True
    )

    parent_guardian_email = models.EmailField(
        max_length=50,
        blank=True
    )

    ################################################################ Address
    address = models.OneToOneField(
        Address,
        on_delete=models.PROTECT,
        related_name="student"
    )

    ################################################################ Academic
    school = models.ForeignKey(
        School,
        on_delete=models.PROTECT,
        related_name="students"
    )

    academic_session = models.ForeignKey(
        AcademicSession,
        on_delete=models.PROTECT,
        related_name="students"
    )

    student_class = models.ForeignKey(
        Class,
        on_delete=models.PROTECT,
        related_name="students"
    )

    section = models.ForeignKey(
        Section,
        on_delete=models.PROTECT,
        related_name="students"
    )

    medium = models.ForeignKey(
        Medium,
        on_delete=models.PROTECT,
        related_name="students"
    )

    ############################################################## Admission
    date_of_admission = models.DateField()

    admission_type = models.ForeignKey(
        AdmissionType,
        on_delete=models.PROTECT,
        related_name="students"
    )

    previous_school = models.CharField(
        max_length=200,
        blank=True
    )

    previous_class = models.ForeignKey(
        Class,
        on_delete=models.PROTECT,
        related_name="previous_students",
        blank=True,
        null=True
    )

    last_gr_no = models.CharField(
        max_length=50,
        blank=True
    )

    student_status = models.CharField(
        max_length=10,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )


    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["school", "gr_no"],
                name="unique_gr_no_per_school"
            )
        ]

    def save(self, *args, **kwargs):

        if not self.student_id or not self.gr_no:

            with transaction.atomic():

                school = School.objects.select_for_update().get(
                    pk=self.school_id
                )

                sequence, created = StudentIDSequence.objects.get_or_create(
                    school=school
                )

                if not self.student_id:
                    sequence.last_number += 1

                    self.student_id = (
                        f"{school.school_short_name}-"
                        f"{school.semis_code[-2:]}-"
                        f"{sequence.last_number:05d}"
                    )

                if not self.gr_no:
                    sequence.last_gr_number += 1

                    self.gr_no = (
                        f"{sequence.last_gr_number:05d}"
                    )

                sequence.save(
                    update_fields=[
                        "last_number",
                        "last_gr_number"
                    ]
                )

                super().save(*args, **kwargs)

        else:
            super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.student_id} - {self.first_name} {self.surname}"







#Attendance Model
class Attendance(models.Model):
    STATUS_CHOICES = [
        ("PRESENT", "Present"),
        ("ABSENT", "Absent"),
        ("LEAVE", "Leave"),
    ]

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="attendance"
    )

    date = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="PRESENT"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "date")

    def __str__(self):
        return f"{self.student} - {self.date} - {self.status}"



# Staff Models
class StaffDesignation(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name
    
class StaffQualification(models.Model):

    name = models.CharField(
        max_length=150,
        unique=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name

class StaffGender(models.Model):

    name = models.CharField(
        max_length=50,
        unique=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name

class StaffStatus(models.Model):

    name = models.CharField(
        max_length=50,
        unique=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name

class StaffIDSequence(models.Model):

    school = models.OneToOneField(
        School,
        on_delete=models.PROTECT,
        related_name="staff_id_sequence"
    )

    last_number = models.PositiveIntegerField(
        default=0
    )

    def __str__(self):
        return f"{self.school.school_short_name}-{self.school.semis_code[-2:]}"

class Staff(models.Model):

    # Login Account
    user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="staff_profile"
    )

    # School / Branch
    school = models.ForeignKey(
        School,
        on_delete=models.PROTECT,
        related_name="staff"
    )

    # Auto Generated Staff ID
    staff_id = models.CharField(
        max_length=50,
        unique=True,
        editable=False
    )

    # Personal Information
    first_name = models.CharField(
        max_length=100
    )

    last_name = models.CharField(
        max_length=100,
        blank=True
    )

    father_name = models.CharField(
        max_length=100
    )

    date_of_birth = models.DateField()

    gender = models.ForeignKey(
        StaffGender,
        on_delete=models.PROTECT,
        related_name="staff_members"
    )

    # Professional Information
    designation = models.ForeignKey(
        StaffDesignation,
        on_delete=models.PROTECT,
        related_name="staff_members"
    )

    qualification = models.ForeignKey(
        StaffQualification,
        on_delete=models.PROTECT,
        related_name="staff_members",
        null=True,
        blank=True
    )

    # Contact Information
    phone = models.CharField(
        max_length=30,
        blank=True
    )

    email = models.EmailField(
        blank=True
    )

    # Address
    address = models.OneToOneField(
        Address,
        on_delete=models.PROTECT,
        related_name="staff"
    )

    # Employment Information
    joining_date = models.DateField(
        null=True,
        blank=True
    )

    status = models.ForeignKey(
        StaffStatus,
        on_delete=models.PROTECT,
        related_name="staff_members"
    )

    # Picture
    picture = models.ImageField(
        upload_to="staff/",
        blank=True,
        null=True
    )

    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        if not self.staff_id:

            with transaction.atomic():

                school = School.objects.select_for_update().get(
                    pk=self.school_id
                )

                sequence, created = StaffIDSequence.objects.get_or_create(
                    school=school
                )

                sequence.last_number += 1

                sequence.save(
                    update_fields=["last_number"]
                )

                semis_last_two = school.semis_code[-2:]

                self.staff_id = (
                    f"{school.school_short_name}-"
                    f"{semis_last_two}-"
                    f"{sequence.last_number:05d}"
                )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.staff_id} - {self.first_name} {self.last_name}"

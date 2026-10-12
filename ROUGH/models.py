"""
Multi-tenant School Management System: Django models

Hierarchy:
    Platform Super User (is_superuser=True)
      └── School (tenant)            -> School Super Admin (Membership role=SCHOOL_ADMIN)
            └── Branch               -> Branch Admin       (Membership role=BRANCH_ADMIN)
                  └── BranchClass -> Section -> Enrollment (roll_no)

Student identity levels:
    roll_no     -> Section level   (Enrollment.roll_no)
    GR No       -> Branch level    (Admission.gr_no)
    Student ID  -> School level    (Student.student_id)

Suggested app split (all in one file here for readability):
    accounts : User, Membership
    tenancy  : School, Branch, Sequence
    academics: AcademicYear, Medium, ClassLevel, BranchClass, Section
    students : Student, Guardian, Admission, Enrollment
"""
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models, transaction


# ----------------------------------------------------------------------
# Abstract base classes
# ----------------------------------------------------------------------
class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SchoolScoped(TimeStamped):
    """Every school-level table inherits this (tenant isolation)."""
    school = models.ForeignKey("School", on_delete=models.CASCADE,
                               related_name="%(app_label)s_%(class)s_set")

    class Meta:
        abstract = True


class BranchScoped(TimeStamped):
    """Every branch-level table inherits this."""
    branch = models.ForeignKey("Branch", on_delete=models.CASCADE,
                               related_name="%(app_label)s_%(class)s_set")

    class Meta:
        abstract = True


# ----------------------------------------------------------------------
# accounts
# ----------------------------------------------------------------------
class User(AbstractUser):
    """
    is_superuser=True  -> Platform Super User (can create schools).
    School/Branch admins are NOT flags here; they come from Membership.
    Set AUTH_USER_MODEL = "accounts.User" before first migration.
    """
    phone = models.CharField(max_length=20, blank=True)


class Membership(TimeStamped):
    """
    Which user has which role where.
      SCHOOL_ADMIN : school set, branch NULL
      BRANCH_ADMIN : school + branch set
    New roles (TEACHER, ACCOUNTANT...) are just new choices; no schema change.
    """
    class Role(models.TextChoices):
        SCHOOL_ADMIN = "SCHOOL_ADMIN", "School Admin"
        BRANCH_ADMIN = "BRANCH_ADMIN", "Branch Admin"
        TEACHER = "TEACHER", "Teacher"
        ACCOUNTANT = "ACCOUNTANT", "Accountant"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                             related_name="memberships")
    school = models.ForeignKey("School", on_delete=models.CASCADE,
                               related_name="memberships")
    branch = models.ForeignKey("Branch", null=True, blank=True,
                               on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=20, choices=Role.choices)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "school", "branch", "role"],
                                    name="uniq_membership"),
        ]

    def clean(self):
        if self.role == self.Role.SCHOOL_ADMIN and self.branch_id:
            raise ValidationError("School admin must not be tied to a branch.")
        if self.role != self.Role.SCHOOL_ADMIN and not self.branch_id:
            raise ValidationError("This role requires a branch.")
        if self.branch_id and self.branch.school_id != self.school_id:
            raise ValidationError("Branch does not belong to this school.")


# ----------------------------------------------------------------------
# tenancy
# ----------------------------------------------------------------------
class School(TimeStamped):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=10, unique=True,
                            help_text="Short unique code used in Student ID, e.g. ABC")
    registration_number = models.CharField(max_length=100, blank=True)
    logo = models.ImageField(upload_to="school_logos/", blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    currency = models.CharField(max_length=10, default="PKR")
    timezone = models.CharField(max_length=50, default="Asia/Karachi")
    settings = models.JSONField(default=dict, blank=True)  # flexible per-school config
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True,
                                   on_delete=models.SET_NULL, related_name="+")

    def __str__(self):
        return f"{self.name} ({self.code})"


class Branch(TimeStamped):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="branches")
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=10, help_text="Unique inside school, e.g. MAIN, B02")
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    province = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    settings = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["school", "code"], name="uniq_branch_code_per_school"),
        ]

    def __str__(self):
        return f"{self.school.code}/{self.code}"


class Sequence(TimeStamped):
    """
    Race-condition-safe counters.
      Student ID  -> scope: school,           key="student_id:<year>"
      GR No       -> scope: school + branch,  key="gr_no"
    """
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="+")
    branch = models.ForeignKey(Branch, null=True, blank=True,
                               on_delete=models.CASCADE, related_name="+")
    key = models.CharField(max_length=50)
    last_value = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["school", "branch", "key"], name="uniq_sequence"),
        ]

    @classmethod
    def next(cls, school, key, branch=None):
        with transaction.atomic():
            seq, _ = cls.objects.select_for_update().get_or_create(
                school=school, branch=branch, key=key)
            seq.last_value += 1
            seq.save(update_fields=["last_value", "updated_at"])
            return seq.last_value


# ----------------------------------------------------------------------
# academics (each concept is its own table so it can grow independently)
# ----------------------------------------------------------------------
class AcademicYear(SchoolScoped):
    name = models.CharField(max_length=20)            # "2025-26"
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["school", "name"], name="uniq_year_per_school"),
        ]

    def __str__(self):
        return self.name


class Medium(SchoolScoped):
    name = models.CharField(max_length=50)            # English / Urdu / Sindhi
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["school", "name"], name="uniq_medium_per_school"),
        ]

    def __str__(self):
        return self.name


class ClassLevel(SchoolScoped):
    """School-wide master list: Nursery, Prep, Class 1 ... Class 10."""
    name = models.CharField(max_length=50)
    order = models.PositiveSmallIntegerField(default=0)  # for sorting / promotion
    next_level = models.ForeignKey("self", null=True, blank=True,
                                   on_delete=models.SET_NULL, related_name="+")

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(fields=["school", "name"], name="uniq_classlevel_per_school"),
        ]

    def __str__(self):
        return self.name


class BranchClass(BranchScoped):
    """A class level actually offered by a branch in a medium for a year."""
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name="+")
    class_level = models.ForeignKey(ClassLevel, on_delete=models.PROTECT, related_name="+")
    medium = models.ForeignKey(Medium, on_delete=models.PROTECT, related_name="+")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["branch", "academic_year", "class_level", "medium"],
                name="uniq_branchclass"),
        ]

    def clean(self):
        s = self.branch.school_id
        if not (self.academic_year.school_id == self.class_level.school_id
                == self.medium.school_id == s):
            raise ValidationError("All references must belong to the branch's school.")

    def __str__(self):
        return f"{self.class_level} ({self.medium}) - {self.branch}"


class Section(TimeStamped):
    branch_class = models.ForeignKey(BranchClass, on_delete=models.CASCADE,
                                     related_name="sections")
    name = models.CharField(max_length=20)            # A, B, Red ...
    capacity = models.PositiveSmallIntegerField(null=True, blank=True)
    class_teacher = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True,
                                      on_delete=models.SET_NULL, related_name="+")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["branch_class", "name"], name="uniq_section"),
        ]

    def __str__(self):
        return f"{self.branch_class} - {self.name}"


# ----------------------------------------------------------------------
# students
# ----------------------------------------------------------------------
class Student(SchoolScoped):
    """
    The PERSON. Lives at school level, so branch transfer never changes identity.
    student_id format: <SCHOOLCODE>-<YY>-<6 digit seq>  e.g. ABC-25-000123
    (Branch/class are NOT baked into the ID because they change; they are
     resolved from the DB when the ID is scanned/searched.)
    """
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE"
        TRANSFERRED = "TRANSFERRED"
        GRADUATED = "GRADUATED"
        LEFT = "LEFT"

    student_id = models.CharField(max_length=30, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    father_name = models.CharField(max_length=150, blank=True)
    gender = models.CharField(max_length=1, choices=[("M", "Male"), ("F", "Female"), ("O", "Other")])
    date_of_birth = models.DateField(null=True, blank=True)
    b_form_number = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to="students/", blank=True, null=True)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.ACTIVE)
    extra = models.JSONField(default=dict, blank=True)  # flexible extra fields

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["school", "student_id"], name="uniq_studentid_per_school"),
        ]
        indexes = [models.Index(fields=["school", "last_name", "first_name"])]

    def save(self, *args, **kwargs):
        if not self.student_id:
            yy = (self.created_at or __import__("datetime").datetime.now()).strftime("%y")
            n = Sequence.next(self.school, key=f"student_id:{yy}")
            self.student_id = f"{self.school.code}-{yy}-{n:06d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student_id} {self.first_name}"


class Guardian(SchoolScoped):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="guardians")
    name = models.CharField(max_length=150)
    relation = models.CharField(max_length=30)
    phone = models.CharField(max_length=20, blank=True)
    cnic = models.CharField(max_length=15, blank=True)
    is_primary = models.BooleanField(default=False)


class Admission(BranchScoped):
    """
    Student <-> Branch link. GR No lives here (branch level).
    Transfer to another branch = new Admission row; old one gets left_on.
    """
    student = models.ForeignKey(Student, on_delete=models.PROTECT, related_name="admissions")
    gr_no = models.PositiveIntegerField(editable=False)
    admitted_on = models.DateField()
    left_on = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["branch", "gr_no"], name="uniq_grno_per_branch"),
        ]

    def clean(self):
        if self.student.school_id != self.branch.school_id:
            raise ValidationError("Student and branch belong to different schools.")

    def save(self, *args, **kwargs):
        if not self.gr_no:
            self.gr_no = Sequence.next(self.branch.school, key="gr_no", branch=self.branch)
        super().save(*args, **kwargs)


class Enrollment(TimeStamped):
    """Year-wise placement of an admission in a section. Roll No lives here."""
    admission = models.ForeignKey(Admission, on_delete=models.CASCADE, related_name="enrollments")
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name="+")
    section = models.ForeignKey(Section, on_delete=models.PROTECT, related_name="enrollments")
    roll_no = models.PositiveIntegerField()
    is_current = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["section", "roll_no"], name="uniq_roll_per_section"),
            models.UniqueConstraint(fields=["admission", "academic_year"],
                                    name="uniq_enrollment_per_year"),
        ]

    def clean(self):
        bc = self.section.branch_class
        if bc.branch_id != self.admission.branch_id:
            raise ValidationError("Section is in a different branch than the admission.")
        if bc.academic_year_id != self.academic_year_id:
            raise ValidationError("Section's academic year does not match.")


# ----------------------------------------------------------------------
# Helper: "ID dekh kr puri info" lookup
# ----------------------------------------------------------------------
def student_profile_by_id(student_id):
    """
    Returns school, branch, class, section, GR No and roll no for a Student ID.
    """
    e = (Enrollment.objects
         .select_related("admission__student__school", "admission__branch",
                         "section__branch_class__class_level",
                         "section__branch_class__medium", "academic_year")
         .filter(admission__student__student_id=student_id, is_current=True)
         .first())
    if not e:
        return None
    a, bc = e.admission, e.section.branch_class
    return {
        "student_id": a.student.student_id,
        "name": f"{a.student.first_name} {a.student.last_name}".strip(),
        "school": a.student.school.name,
        "branch": a.branch.name,
        "gr_no": a.gr_no,
        "class": bc.class_level.name,
        "medium": bc.medium.name,
        "section": e.section.name,
        "roll_no": e.roll_no,
        "academic_year": e.academic_year.name,
    }

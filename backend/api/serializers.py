from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Student,
    Attendance,
    Staff,
    School,
    Address,
    AcademicSession,
    Class,
    Section,
    Medium,
    AdmissionType,
)

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "password", "role"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            role=validated_data.get("role", "STAFF"),
        )
        return user


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"

class AcademicSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicSession
        fields = "__all__"

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = "__all__"

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = "__all__"

class MediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medium
        fields = "__all__"

class AdmissionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionType
        fields = "__all__"


class SchoolSerializer(serializers.ModelSerializer):
    address = AddressSerializer(read_only=True)

    class Meta:
        model = School
        fields = "__all__"
    

class StudentSerializer(serializers.ModelSerializer):

    student_id = serializers.CharField(
        required=False,
        read_only=True
    )

    gr_no = serializers.CharField(
        required=False,
        read_only=True
    )

    school = serializers.CharField(
        source="school.school_name",
        read_only=True
    )

    academic_session = serializers.CharField(
        source="academic_session.session_name",
        read_only=True
    )

    student_class = serializers.PrimaryKeyRelatedField(
        queryset=Class.objects.all()
    )

    section = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all()
    )

    medium = serializers.PrimaryKeyRelatedField(
        queryset=Medium.objects.all()
    )
    
    admission_type = serializers.PrimaryKeyRelatedField(
        queryset=AdmissionType.objects.all()
    )
    
    previous_class = serializers.CharField(
        source="previous_class.class_name",
        read_only=True,
        allow_null=True
    )

    province = serializers.CharField(
        source="address.province",
        read_only=True
    )

    district = serializers.CharField(
        source="address.district",
        read_only=True
    )

    taluka = serializers.CharField(
        source="address.taluka",
        read_only=True
    )

    union_council = serializers.CharField(
        source="address.union_council",
        read_only=True
    )

    city_town = serializers.CharField(
        source="address.city_town",
        read_only=True
    )

    area_locality = serializers.CharField(
        source="address.area_locality",
        read_only=True
    )

    house_no_street = serializers.CharField(
        source="address.house_no_street",
        read_only=True
    )

    postal_code = serializers.CharField(
        source="address.postal_code",
        read_only=True
    )

    class Meta:
        model = Student
        fields = "__all__"

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = "__all__"


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = "__all__"
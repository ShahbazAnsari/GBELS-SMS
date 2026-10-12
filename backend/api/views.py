from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Student, Attendance, Staff, School, Address, AcademicSession, Class, Section, Medium, AdmissionType
from .serializers import (
    RegisterSerializer, 
    StudentSerializer, 
    AttendanceSerializer, 
    StaffSerializer,
    SchoolSerializer,
    AddressSerializer,
    AcademicSessionSerializer,
    ClassSerializer,
    SectionSerializer,
    MediumSerializer,
    AdmissionTypeSerializer,
    ) 
from .permissions import IsAdmin

from rest_framework.decorators import action
from rest_framework.response import Response


import csv
import os

from django.db import transaction
from django.conf import settings
from django.core.files import File


from rest_framework import status


from datetime import datetime

class ProtectedView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "Welcome! You are authenticated.",
            "username": request.user.username,
            "role": request.user.role,
        })


class AdminOnlyView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({
            "message": "Welcome Admin!",
            "username": request.user.username,
            "role": request.user.role,
        })

class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response({
                "message": "User registered successfully.",
                "username": user.username,
                "role": user.role,
            }, status=201)

        return Response(
            serializer.errors,
            status=400
        )

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all().order_by("-id")
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all().order_by("-created_at")
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AcademicSessionViewSet(viewsets.ModelViewSet):
    queryset = AcademicSession.objects.all().order_by("-created_at")
    serializer_class = AcademicSessionSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser, JSONParser]

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all().order_by("order")
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser, JSONParser]

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all().order_by("section_name")
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser, JSONParser]

class MediumViewSet(viewsets.ModelViewSet):
    queryset = Medium.objects.all().order_by("medium_name")
    serializer_class = MediumSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser, JSONParser]

class AdmissionTypeViewSet(viewsets.ModelViewSet):
    queryset = AdmissionType.objects.all().order_by("admission_type_name")
    serializer_class = AdmissionTypeSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser, JSONParser]


def parse_csv_date(value):
    value = (value or "").strip()

    if not value:
        return None

    date_formats = [
        "%Y-%m-%d",
        "%d-%m-%y",
        "%d-%m-%Y",
        "%d/%m/%y",
        "%d/%m/%Y",
    ]

    for date_format in date_formats:
        try:
            return datetime.strptime(value, date_format).date()
        except ValueError:
            continue

    raise ValueError(f"Invalid date format: {value}")

class StudentViewSet(viewsets.ModelViewSet):

    queryset = Student.objects.all().order_by("-created_at")

    serializer_class = StudentSerializer

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def perform_create(self, serializer):

        user = self.request.user

        if not user.school_id:
            raise serializers.ValidationError({
                "school": "Your user account has no school assigned."
            })

        active_session = AcademicSession.objects.filter(
            is_active=True
        ).first()

        if not active_session:
            raise serializers.ValidationError({
                "academic_session": "No active academic session found."
            })

        serializer.save(
            school=user.school,
            academic_session=active_session
        )

    @action(detail=False, methods=["get"])
    def export(self, request):

        students = self.get_queryset()

        serializer = self.get_serializer(
            students,
            many=True
        )

        return Response(serializer.data)

    # ========================================
    # IMPORT STUDENTS FROM CSV
    # ========================================
    @action(detail=False, methods=["post"], parser_classes=[MultiPartParser, FormParser])
    def import_csv(self, request):

        csv_file = request.FILES.get("file")

        if not csv_file:
            return Response(
                {"error": "Please upload a CSV file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not csv_file.name.lower().endswith(".csv"):
            return Response(
                {"error": "Only CSV files are allowed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        if not user.school_id:
            return Response(
                {"error": "Your user account has no school assigned."},
                status=status.HTTP_400_BAD_REQUEST
            )

        active_session = AcademicSession.objects.filter(
            is_active=True
        ).first()

        if not active_session:
            return Response(
                {"error": "No active academic session found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            decoded_file = csv_file.read().decode("utf-8-sig").splitlines()
            reader = csv.DictReader(decoded_file)

            if not reader.fieldnames:
                return Response(
                    {"error": "CSV file is empty."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            created_students = []
            errors = []

            for row_number, row in enumerate(reader, start=2):

                try:
                    with transaction.atomic():

                        school_name = (
                            row.get("School") or ""
                        ).strip()

                        class_name = (
                            row.get("Class") or ""
                        ).strip()

                        section_name = (
                            row.get("Section") or ""
                        ).strip()

                        medium_name = (
                            row.get("Medium") or ""
                        ).strip()

                        admission_type_name = (
                            row.get("Admission Type") or ""
                        ).strip()

                        # Verify school
                        if (
                            school_name
                            and school_name.casefold()
                            != user.school.school_name.casefold()
                        ):
                            raise ValueError(
                                "CSV school does not match your assigned school."
                            )

                        # Get related records
                        student_class = Class.objects.get(
                            class_name__iexact=class_name
                        )

                        section = Section.objects.get(
                            section_name__iexact=section_name
                        )

                        medium = Medium.objects.get(
                            medium_name__iexact=medium_name
                        )

                        admission_type = AdmissionType.objects.get(
                            admission_type_name__iexact=admission_type_name
                        )

                        # Verify academic session
                        session_name = (
                            row.get("Academic Session") or ""
                        ).strip()

                        if (
                            session_name
                            and session_name.casefold()
                            != active_session.session_name.casefold()
                        ):
                            raise ValueError(
                                "CSV academic session does not match the active session."
                            )

                        # Previous class is optional
                        previous_class_name = (
                            row.get("Previous Class") or ""
                        ).strip()

                        previous_class = None

                        if previous_class_name:
                            previous_class = Class.objects.get(
                                class_name__iexact=previous_class_name
                            )

                        # Create address
                        address = Address.objects.create(
                            province=(
                                row.get("Province") or ""
                            ).strip(),

                            district=(
                                row.get("District") or ""
                            ).strip(),

                            taluka=(
                                row.get("Taluka") or ""
                            ).strip(),

                            union_council=(
                                row.get("Union Council") or ""
                            ).strip(),

                            city_town=(
                                row.get("City / Town") or ""
                            ).strip(),

                            area_locality=(
                                row.get("Area / Locality") or ""
                            ).strip(),

                            house_no_street=(
                                row.get("House No / Street") or ""
                            ).strip(),

                            postal_code=(
                                row.get("Postal Code") or ""
                            ).strip(),
                        )

                        # Default student picture
                        default_picture_path = (
                            settings.MEDIA_ROOT
                            / "students"
                            / "default_student.png"
                        )

                        if not os.path.exists(default_picture_path):
                            raise ValueError(
                                "Default student picture was not found."
                            )

                        # Create student
                        with open(
                            default_picture_path, "rb"
                        ) as picture_file:

                            student = Student(
                                first_name=(
                                    row.get("First Name") or ""
                                ).strip(),

                                last_name=(
                                    row.get("Last Name") or ""
                                ).strip(),

                                surname=(
                                    row.get("Surname") or ""
                                ).strip(),

                                gender=(
                                    row.get("Gender") or "MALE"
                                ).strip(),

                                religion=(
                                    row.get("Religion") or "ISLAM"
                                ).strip(),

                                # Automatic date conversion
                                dob=parse_csv_date(
                                    row.get("Date of Birth", "")
                                ),

                                b_form_crc=(
                                    row.get("B-Form / CRC") or ""
                                ).strip(),

                                nationality=(
                                    row.get("Nationality") or "Pakistani"
                                ).strip(),

                                father_name=(
                                    row.get("Father Name") or ""
                                ).strip(),

                                father_mother_cnic=(
                                    row.get("Father / Mother CNIC") or ""
                                ).strip(),

                                contact_no=(
                                    row.get("Contact Number") or ""
                                ).strip(),

                                guardian_name=(
                                    row.get("Guardian Name") or ""
                                ).strip(),

                                guardian_cnic=(
                                    row.get("Guardian CNIC") or ""
                                ).strip(),

                                guardian_relation=(
                                    row.get("Guardian Relation") or ""
                                ).strip(),

                                emergency_contact_no=(
                                    row.get("Emergency Contact") or ""
                                ).strip(),

                                parent_guardian_email=(
                                    row.get("Parent / Guardian Email") or ""
                                ).strip(),

                                address=address,
                                school=user.school,
                                academic_session=active_session,
                                student_class=student_class,
                                section=section,
                                medium=medium,

                                # Automatic date conversion
                                date_of_admission=parse_csv_date(
                                    row.get("Date of Admission", "")
                                ),

                                admission_type=admission_type,
                                previous_school=(
                                    row.get("Previous School") or ""
                                ).strip(),

                                previous_class=previous_class,
                                last_gr_no="",

                                student_status=(
                                    row.get("Student Status") or "ACTIVE"
                                ).strip(),
                            )

                            student.picture.save(
                                "default_student.png",
                                File(picture_file),
                                save=False
                            )

                            student.save()

                        created_students.append({
                            "student_id": student.student_id,
                            "gr_no": student.gr_no,
                            "name": (
                                f"{student.first_name} "
                                f"{student.surname}"
                            ),
                        })

                except Exception as error:
                    errors.append({
                        "row": row_number,
                        "error": str(error),
                    })

            return Response(
                {
                    "message": "CSV import completed.",
                    "imported": len(created_students),
                    "failed": len(errors),
                    "students": created_students,
                    "errors": errors,
                },
                status=status.HTTP_200_OK
            )

        except (UnicodeDecodeError, csv.Error) as error:
            return Response(
                {"error": f"Invalid CSV file: {str(error)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().order_by("-date")
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Attendance.objects.all().order_by("-date")

        date = self.request.query_params.get("date")

        if date:
            queryset = queryset.filter(date=date)

        return queryset



class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all().order_by("-created_at")
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
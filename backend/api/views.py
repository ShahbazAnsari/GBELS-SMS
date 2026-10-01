from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class ProtectedView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "Welcome! You are authenticated.",
            "username": request.user.username,
            "role": request.user.role,
        })

from .permissions import IsAdmin

class AdminOnlyView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({
            "message": "Welcome Admin!",
            "username": request.user.username,
            "role": request.user.role,
        })

from rest_framework import viewsets
from .models import Student
from .serializers import StudentSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by("-created_at")
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser, JSONParser]
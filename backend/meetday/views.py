from .models import Meet, MeetParticipant
from .serializers import MeetSerializer, UserSerializer, GroupSerializer, MeetParticipantSerializer

from rest_framework import viewsets, permissions, generics
from django.contrib.auth.models import User, Group
from rest_framework.authentication import BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework.views import APIView

# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class MeetViewSet(viewsets.ModelViewSet):
    queryset = Meet.objects.all()
    serializer_class = MeetSerializer
    authentication_classes = [JWTAuthentication, BasicAuthentication]

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.validated_data['owner'] = self.request.user
        serializer.save()


class MeetParticipantViewSet(viewsets.ModelViewSet):
    queryset = MeetParticipant.objects.all()
    serializer_class = MeetParticipantSerializer
    authentication_classes = [JWTAuthentication, BasicAuthentication]

    def get_queryset(self):
        return self.queryset.all()

    def perform_create(self, serializer):
        serializer.save()


class Heartbeat(APIView):
    authentication_classes = [JWTAuthentication, BasicAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = {'status': 'ok'}
        return JsonResponse(data)


class MeetParticipantList(generics.ListAPIView):
    serializer_class = MeetParticipantSerializer

    def get_queryset(self):
        meet_id = self.kwargs['meet_id']
        meet = Meet.objects.get(id=meet_id)
        queryset = meet.participants.all()
        return queryset

from .views import MeetViewSet, UserViewSet, GroupViewSet, Heartbeat, MeetParticipantViewSet, MeetParticipantList

from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'meets', MeetViewSet)
router.register(r'participants', MeetParticipantViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('heartbeat/', Heartbeat.as_view(), name="heartbeat"),
    path('meets/<int:meet_id>/participants/',
         MeetParticipantList.as_view(), name='meet_participants'),
]

from .models import Meet, MeetParticipant
from rest_framework import serializers


from django.contrib.auth.models import User, Group
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class MeetParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetParticipant
        fields = '__all__'
        # read_only_fields = ['meet']


class MeetSerializer(serializers.ModelSerializer):
    # participants = MeetParticipantSerializer(many=True, read_only=True)
    # total_participants = serializers.SerializerMethodField()

    class Meta:
        model = Meet
        fields = '__all__'
        read_only_fields = ['owner']

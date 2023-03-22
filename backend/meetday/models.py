from django.db import models
from django.contrib.auth.models import User
import datetime

# Create your models here.


class Meet(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateField(default=datetime.date.today, blank=True)
    location = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Gender(models.TextChoices):
        MALE = 'MALE', 'Male'
        FEMALE = 'FEMALE', 'Female'

    gender = models.CharField(
        max_length=16, choices=Gender.choices, default='MALE')

    def __str__(self):
        return self.title


class MeetParticipant(models.Model):
    meet = models.ForeignKey(
        Meet, related_name='participants', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    weight = models.FloatField()
    squat = models.FloatField()
    bench = models.FloatField()
    deadlift = models.FloatField()

    def __str__(self):
        return f'{self.name} - {self.meet.title}'

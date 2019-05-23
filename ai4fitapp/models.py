from django.db import models
from django.utils.timezone import now, datetime
from django.contrib.auth.models import User

# Create your models here.


class CardioItem(models.Model):
    hr_item_id = models.IntegerField(default=0)
    workout_item_id = models.IntegerField(default=0)
    workout_activity_result_id = models.IntegerField(default=0)
    rate = models.IntegerField(default=0)
    time = models.IntegerField(default=0)
    deleted = models.IntegerField(default=0)

    def __str__(self):
        return str(self.hr_item_id)


class PointItem(models.Model):
    point_item_id = models.IntegerField(default=0)
    workout_item_id = models.IntegerField(default=0)
    workout_activity_result_id = models.IntegerField(default=0)
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    altitude = models.FloatField(default=0.0)
    accuracy = models.FloatField(default=0.0)
    time = models.IntegerField(default=0)
    isastart = models.IntegerField(default=0)
    deleted = models.IntegerField(default=0)

    def __str__(self):
        return str(self.point_item_id)


class Workout(models.Model):
    session_id = models.IntegerField(default=0)
    item_user_id = models.IntegerField(default=0)
    creationdate = models.DateTimeField(default=now)
    duration = models.IntegerField(default=0)
    pausetime = models.FloatField(default=0.0)
    distance = models.FloatField(default=0.0)
    avgspeed = models.FloatField(default=0.0)
    maxspeed = models.FloatField(default=0.0)
    minspeed = models.FloatField(default=0.0)
    avgbpm = models.FloatField(default=0.0)
    maxbpm = models.IntegerField(default=0)
    minbpm = models.IntegerField(default=0)
    avgaltitude = models.FloatField(default=0.0)
    maxaltitude = models.FloatField(default=0.0)
    minaltitude = models.FloatField(default=0.0)
    calories = models.IntegerField(default=0)
    isafitresult = models.IntegerField(default=0)
    user_birthdate = models.DateField(default=datetime.today)
    age = models.IntegerField(default=0)
    user_gender = models.CharField(max_length=1)
    user_lastlogin = models.DateTimeField(default=now)
    user_consent = models.IntegerField(default=0)
    user_is_tester =models.IntegerField(default=0)
    mark = models.IntegerField(default=0)
    accuracy = models.FloatField(default=0.0)

    def __str__(self):
        return str(self.session_id)


class WorkoutActivityResult(models.Model):
    activity_results_id = models.IntegerField(default=0)
    workout_activity_id = models.IntegerField(default=0)
    workout_item_id = models.IntegerField(default=0)
    distancedone = models.FloatField(default=0.0)
    speeddone = models.FloatField(default=0.0)
    timedone = models.IntegerField(default=0)
    deleted = models.IntegerField(default=0)
    wactivity_id = models.IntegerField(default=0)
    wactivity_repetition_id = models.IntegerField(default=0)
    wactivity_type = models.CharField(max_length=255)
    wactivity_time = models.IntegerField(default=0)
    wactivity_distance = models.FloatField(default=0.0)
    wactivity_speed = models.FloatField(default=0.0)
    wactivity_label = models.CharField(max_length=255)
    wactivity_comment = models.CharField(max_length=255)
    wactivity_read_comment = models.IntegerField(default=0)
    wactivity_pace = models.IntegerField(default=0)
    wactivity_percentage = models.IntegerField(default=0)
    wactivity_seq = models.IntegerField(default=0)
    wactivity_deleted = models.IntegerField(default=0)

    def __str__(self):
        return str(self.activity_results_id)
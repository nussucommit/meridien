from django.db import models
from items.models import BookedItem

class Booking(models.Model):
    reason = models.TextField(blank=False)
    time_booked = models.DateTimeField(auto_now_add=True)
    loan_start_time = models.DateField(blank=False)
    loan_end_time = models.DateField(blank=False)
    booked_items = models.ManyToManyField(BookedItem)
    
class Person(models.Model):
    name = models.CharField(max_length=256, blank=False)
    email = models.EmailField(blank=False)
    organization = models.CharField(max_length=1000, blank=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)

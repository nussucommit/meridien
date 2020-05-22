from django.db import models
from items.models import BookedItem

# Create your models here.
class Booking(models.Model):
    name = models.CharField(max_length=256, blank=False);
    email = models.EmailField(blank=False);
    reason = models.TextField(blank=False);
    time_booked = models.DateTimeField(auto_now_add=True);
    loan_start_time = models.DateField(blank=False);
    loan_end_time = models.DateField(blank=False);
    booked_items = models.ManyToManyField(BookedItem);

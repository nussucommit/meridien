from django.db import models
from django.core.validators import *
from items.models import BookedItem

class Booking(models.Model):
    name = models.CharField(max_length=256, blank=False, default='N/A')
    email = models.EmailField(blank=False, default='N/A')
    organization = models.CharField(max_length=1000, blank=False, default='N/A')
    reason = models.TextField(blank=False)
    time_booked = models.DateTimeField(auto_now_add=True)
    loan_start_time = models.DateField(blank=False)
    loan_end_time = models.DateField(blank=False)
    booked_items = models.ManyToManyField(BookedItem)
    deposit_left = models.DecimalField(default=0.00, decimal_places=2, max_digits=10, validators=[MinValueValidator(0.00), MaxValueValidator(200.00)])

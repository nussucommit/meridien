from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=256, blank=False)
    quantity = models.PositiveIntegerField(default=0)
    brand = models.CharField(max_length=256, default='-')
    remarks = models.TextField(default='-')
    category = models.CharField(max_length=256, default='-')
    deposit = models.PositiveIntegerField(default=0)
    
class BookedItem(models.Model):
    ACCEPTED = ('ACC', 'Accepted')
    REJECTED = ('REJ', 'Rejected')
    PENDING = ('PEN', 'Pending')

    BOOKING_STATUSES = [
        ACCEPTED,
        REJECTED,
        PENDING
    ]

    name = models.ForeignKey(Item, on_delete=models.SET('Deleted Item'))
    quantity = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=32, blank=False, default=PENDING)

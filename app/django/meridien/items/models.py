from django.db import models

# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=256, blank=False)
    quantity = models.PositiveIntegerField(default=0)
    
class BookedItem(models.Model):
    name = models.ForeignKey(Item, on_delete=models.SET('Deleted Item'))
    quantity = models.PositiveIntegerField(default=0)
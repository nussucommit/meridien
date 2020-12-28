from django.db import models
from datetime import date

# Create your models here.
class Issue(models.Model):
    name = models.CharField(max_length=256, blank=False, default='N/A')
    email = models.EmailField(blank=False, default='N/A')
    detail = models.CharField(max_length=3000, blank=False, default='N/A')
    time_reported = models.DateTimeField(auto_now_add=True)

def __str__(self):
        return f"Reported by {self.name} made on {self.time_reported.strftime('%Y-%m-%d %H:%M')}"

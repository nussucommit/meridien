from django.contrib import admin

from items.models import BookedItem, Item

# Register your models here.
admin.site.register(BookedItem)
admin.site.register(Item)

from rest_framework import serializers
from items.models import BookedItem
from items.models import Item

class BookedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookedItem
        field = '__all__'
        
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        field = '__all__'
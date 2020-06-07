from items.models import Item, BookedItem
from items.serializers import ItemSerializer, BookedItemSerializer
from django.http.response import JsonResponse

import sys
sys.path.append('../')
from meridien import views_template

def item_list(request):
    return views_template.obj_list(request, Item, ItemSerializer)

def item_detail(request, pk):
    return views_template.obj_detail(request, pk, Item, ItemSerializer)

def booked_item_list(request):
    return views_template.obj_list(request, BookedItem, BookedItemSerializer)
    
def booked_item_detail(request, pk):
    return views_template.obj_detail(request, pk, BookedItem, BookedItemSerializer)
   
def booked_item_from_booking_id(request, booking_id):
    items = BookedItem.objects.filter(booking_source=booking_id)
    
    if request.method == 'GET':
        booked_item_serializer = BookedItemSerializer(items, many=True)
        return JsonResponse(booked_item_serializer.data, safe=False)

def booked_item_from_item(request, item_id):
    items = BookedItem.objects.filter(item=item_id)

    if request.method == 'GET':
        booked_item_serializer = BookedItemSerializer(items, many=True)
        return JsonResponse(booked_item_serializer.data, safe=False)

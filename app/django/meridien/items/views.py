from items.models import Item, BookedItem
from items.serializers import ItemSerializer, BookedItemSerializer
from django.views.decorators.csrf import csrf_exempt

import sys
sys.path.append('../')
from meridien import views_template

@csrf_exempt
def item_list(request):
    return views_template.obj_list(request, Item, ItemSerializer)

@csrf_exempt
def item_detail(request, pk):
    return views_template.obj_detail(request, pk, Item, ItemSerializer)

@csrf_exempt
def booked_item_list(request):
    return views_template.obj_list(request, BookedItem, BookedItemSerializer)
    
@csrf_exempt
def booked_item_detail(request, pk):
    return views_template.obj_detail(request, pk, BookedItem, BookedItemSerializer)

@csrf_exempt    
def booked_item_from_booking_id(request, booking_id):
    items = BookedItem.objects.filter(booking_source=booking_id)
    
    if request.method == 'GET':
        booked_item_serializer = BookedItemSerializer(items, many=True)
        return JsonResponse(booked_item_serializer.data, safe=False)
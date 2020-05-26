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
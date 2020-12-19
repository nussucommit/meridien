from items.models import Item, BookedItem
from items.serializers import ItemSerializer, BookedItemSerializer

from django.http import HttpResponse
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework import generics, status, mixins
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

class ItemList(generics.ListCreateAPIView):
    queryset = Item.objects.all().order_by('id')
    serializer_class = ItemSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

class ItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAuthenticated,)

class BookedItemList(generics.ListCreateAPIView):
    queryset = BookedItem.objects.all()
    serializer_class = BookedItemSerializer
    permission_classes = (IsAuthenticated,)

class BookedItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookedItem.objects.all()
    serializer_class = BookedItemSerializer
    permission_classes = (IsAuthenticated,)

class BookedItemFromBookingId(mixins.ListModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    serializer_class = BookedItemSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        queryset = BookedItem.objects.all()
        if ('booking_id' in self.kwargs):
            queryset = queryset.filter(booking_source=self.kwargs['booking_id'])
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        self.get_queryset().delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)
    
class BookedItemFromItem(generics.ListAPIView):
    queryset = BookedItem.objects.all()
    serializer_class = BookedItemSerializer
    lookup_field = 'item_id'
    permission_classes = ()

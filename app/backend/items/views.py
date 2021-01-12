from bookings.models import Booking
from items.models import Item, BookedItem
from items.serializers import ItemSerializer, BookedItemSerializer

from django.db.models import Q
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

class BookedItemList(generics.ListAPIView):
    queryset = BookedItem.objects.all()
    serializer_class = BookedItemSerializer
    permission_classes = (IsAuthenticated,)

class CreateBookedItem(generics.CreateAPIView):
    queryset = BookedItem.objects.all()
    serializer_class = BookedItemSerializer
    permission_classes = ()
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except:
            booking_id = self.request.data.booking_source
            Booking.objects.get(pk=booking_id).delete()
            return JsonResponse({'message': 'An error occured.'}, status=status.HTTP_400_BAD_REQUEST)

class BookedItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookedItem.objects.all()
    serializer_class = BookedItemSerializer
    permission_classes = (IsAuthenticated,)

class BookedItemFromBookingId(mixins.ListModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    serializer_class = BookedItemSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        queryset = BookedItem.objects.all()
        if 'booking_id' in self.kwargs:
            queryset = queryset.filter(booking_source=self.kwargs['booking_id'])
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        self.get_queryset().delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)
    
class BookedItemFromItem(generics.ListAPIView):
    serializer_class = BookedItemSerializer
    permission_classes = ()

    def get_queryset(self):
        queryset = BookedItem.objects.all()
        if 'item_id' in self.kwargs:
            queryset = queryset.filter(item=self.kwargs['item_id'])
        
        fromDate = self.request.query_params.get('start', None)
        toDate = self.request.query_params.get('end', None)

        if fromDate and toDate:
            queryset = queryset.filter((Q(booking_source__loan_start_time__lte=fromDate) & Q(booking_source__loan_end_time__gte=toDate))
                                        | (Q(booking_source__loan_start_time__range=(fromDate, toDate))
                                        | Q(booking_source__loan_end_time__range=(fromDate, toDate))))
        return queryset

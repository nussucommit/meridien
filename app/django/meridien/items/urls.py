from django.conf.urls import url
from items import views

urlpatterns = [
    url(r'^items/$', views.item_list),
    url(r'^booked-items/$', views.booked_item_list),
    url(r'^booked-items/booking_source_id/(?P<booking_id>[0-9]+)/$', views.booked_item_from_booking_id),
    url(r'^booked-items/item_id/(?P<item_id>[0-9]+)/$', views.booked_item_from_item)
]

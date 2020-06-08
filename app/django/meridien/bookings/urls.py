from django.conf.urls import url
from bookings import views

urlpatterns = [
    url(r'^bookings/$', views.booking_list),
    url(r'^bookings/(?P<pk>[0-9]+)$', views.booking_detail)
]
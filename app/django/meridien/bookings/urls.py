from django.conf.urls import url
from bookings import views

urlpatterns = [
    url(r'^bookings/$', views.booking_list)
]
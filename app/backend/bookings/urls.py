from django.urls import path
from bookings import views

urlpatterns = [
    path('bookings/', views.BookingList.as_view()),
    path('bookings/edit', views.MakeBooking.as_view()),
    path('bookings/week', views.BookingsByBookingPeriod.as_view()),
    path('bookings/<int:pk>', views.BookingDetail.as_view()),
    path('bookings/token/<str:token>', views.booking_detail_token),
    path('bookings/token/confirm/<str:token>', views.confirm_booking_token)
]

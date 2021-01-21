from django.conf.urls import url
from items import views

urlpatterns = [
    url(r'^items/$', views.ItemList.as_view()),
    url(r'^items/category/$', views.ItemCategoryList),
    url(r'^items/(?P<pk>[0-9]+)/$', views.ItemDetail.as_view()),
    url(r'^booked-items/$', views.BookedItemList.as_view()),
    url(r'^booked-items/edit$', views.CreateBookedItem.as_view()),
    url(r'^booked-items/(?P<pk>[0-9]+)/$', views.BookedItemDetail.as_view()),
    url(r'^booked-items/booking_source_id/(?P<booking_id>[0-9]+)/$', views.BookedItemFromBookingId.as_view()),
    url(r'^booked-items/item_id/(?P<item_id>[0-9]+)/$', views.BookedItemFromItem.as_view())
]

from django.conf.urls import url
from items import views

urlpatterns = [
    url(r'^items/$', views.item_list)
]

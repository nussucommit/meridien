from django.conf.urls import url
from django.urls import path
from issues import views

urlpatterns = [
    url(r'^issues/$', views.issue_list),
    url(r'^issues/(?P<pk>[0-9]+)$', views.issue_detail)
]

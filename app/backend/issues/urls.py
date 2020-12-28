from django.conf.urls import url
from django.urls import path
from issues import views

urlpatterns = [
    url(r'^issues/$', views.MakeIssue.as_view()),
    url(r'^issues/booking_source_id//(?P<booking_id>[0-9]+)/$', views.ReportedIssue.as_view()),
    url(r'^issues/(?P<pk>[0-9]+)$', views.IssueDetail.as_view())
]

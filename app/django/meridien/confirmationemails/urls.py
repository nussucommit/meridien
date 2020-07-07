from django.conf.urls import url
from confirmationemails import views

urlpatterns = [
    url('create_confirmation', views.create_confirmation_template),
    url('get_confirmation', views.get_confirmation_template),
    url('update_confirmation', views.update_confirmation_template)
]

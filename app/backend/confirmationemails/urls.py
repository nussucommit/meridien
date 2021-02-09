from django.urls import path
from django.conf.urls import url
from confirmationemails import views

urlpatterns = [
    path('confirmation_templates', views.confirmation_template_list),
    path('confirmation_template/<int:pk>', views.confirmation_template_detail),
    url('update_confirmation', views.create_or_update_confirmation_template),
    url('get_confirmation', views.get_confirmation_template),
    url('resend_confirmation', views.resend_confirmation)
]

from emailtemplates.models import *
from django.views.decorators.csrf import csrf_exempt

import sys
sys.path.append('../')
from meridien import views_template

@csrf_exempt
def email_template_list(request):
    return obj_list(request, EmailTemplate, EmailtemplateSerializer)

@csrf_exempt
def email_template_detail(request, pk):
    return obj_detail(request, pk, EmailTemplate, EmailtemplateSerializer)

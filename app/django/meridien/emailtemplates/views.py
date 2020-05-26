from django.views.decorators.csrf import csrf_exempt

from emailtemplates.models import EmailTemplate
from emailtemplates.serializers import EmailtemplateSerializer

import sys
sys.path.append('../')
from meridien import views_template

@csrf_exempt
def email_template_list(request):
    return views_template.obj_list(request, EmailTemplate, EmailtemplateSerializer)

@csrf_exempt
def email_template_detail(request, pk):
    return views_template.obj_detail(request, pk, EmailTemplate, EmailtemplateSerializer)

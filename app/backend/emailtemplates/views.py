import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from emailtemplates.models import EmailTemplate
from emailtemplates.serializers import EmailtemplateSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from emailtemplates.hack import populate_template

import sys
sys.path.append('../')
from meridien import views_template

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def email_template_list(request):
    return views_template.obj_list(request, EmailTemplate, EmailtemplateSerializer)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def email_template_detail(request, pk):
    return views_template.obj_detail(request, pk, EmailTemplate, EmailtemplateSerializer)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def email_template_detail_populated(request, pk, booking_pk):
    response = views_template.obj_detail(request, pk, EmailTemplate, EmailtemplateSerializer)
    if response.status_code != status.HTTP_200_OK:
        return response
    else:
        data = json.loads(response.content.decode('utf-8'))
        data["template"] = populate_template(data["template"], booking_pk)
        return JsonResponse(data=data, status=status.HTTP_200_OK)

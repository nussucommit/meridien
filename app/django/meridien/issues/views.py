import json

from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from issues.models import Issue
from issues.serializers import IssueSerializer

import sys
sys.path.append('../')
from meridien import views_template

# Create your views here.
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([AllowAny])
@csrf_exempt
def issue_list(request):
    permission_classes = (AllowAny,)
    response = views_template.obj_list(request, Issue, IssueSerializer)
    return response

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def issue_detail(request, pk):
    return views_template.obj_detail(request, pk, Issue, IssueSerializer)
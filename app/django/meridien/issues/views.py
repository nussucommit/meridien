import json

from django.http import HttpResponse
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics, status, mixins
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from issues.models import Issue
from issues.serializers import IssueSerializer


import sys
sys.path.append('../')
from meridien import views_template

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def issue_list(request):
    response = views_template.obj_list(request, Issue, IssueSerializer)
    return response

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def issue_detail(request, pk):
    return views_template.obj_detail(request, pk, Issue, IssueSerializer)

class ReportedIssue(mixins.ListModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    serializer_class = IssueSerializer
    permission_classes = (IsAuthenticatedOrReadOnly)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.delete(request, *args, **kwargs)

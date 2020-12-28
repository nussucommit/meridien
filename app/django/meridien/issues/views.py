import json

from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated

from issues.models import Issue
from issues.serializers import IssueSerializer

class MakeIssue(generics.CreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = ()

class ReportedIssue(mixins.ListModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    serializer_class = IssueSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.delete(request, *args, **kwargs)

class IssueDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = (IsAuthenticated,)

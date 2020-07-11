from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated

from confirmationemails.models import ConfirmationEmail
from confirmationemails.serializers import ConfirmationEmailSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def create_or_update_confirmation_template(request):
    templates = ConfirmationEmail.objects.all()
    template_data = JSONParser().parse(request)
    if len(templates) > 0:
        template = ConfirmationEmail.objects.first()
        template_serializer = ConfirmationEmailSerializer(template, data=template_data)
    else:
        template_serializer = ConfirmationEmailSerializer(data=template_data)

    if template_serializer.is_valid():
        template_serializer.save()
        return JsonResponse(template_serializer.data, status=status.HTTP_200_OK)
    else:
        return JsonResponse(template_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_confirmation_template(request):
    confirmation_template = ConfirmationEmail.objects.first()
    if confirmation_template is None:
        return JsonResponse({
            "message": "No confirmation template in database"
        }, status=status.HTTP_404_NOT_FOUND)
    serializer = ConfirmationEmailSerializer(confirmation_template)
    return JsonResponse(serializer.data, status=status.HTTP_200_OK)

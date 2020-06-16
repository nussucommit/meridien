from django.core.mail import send_mail
from django.http.response import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework import status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def mail(request):
    if request.method == 'POST':
        try:
            send_mail(
                subject=request.POST['subject'],
                message='',
                from_email='example@example.com',
                recipient_list=[request.POST['recipient']],
                html_message=request.POST['message']
            )
            return HttpResponse(status=status.HTTP_204_NO_CONTENT)
        except KeyError as err:
            return JsonResponse({'error': 'Bad request {}'.format(err.args[0])}, status=status.HTTP_400_BAD_REQUEST)
    
from rest_framework import serializers
from emailtemplates.models import EmailTemplate

class EmailtemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        field = '__all__'
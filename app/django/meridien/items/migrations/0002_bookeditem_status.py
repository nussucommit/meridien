# Generated by Django 3.0.6 on 2020-05-22 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='bookeditem',
            name='status',
            field=models.CharField(default='N/A', max_length=256),
        ),
    ]
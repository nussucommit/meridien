# Generated by Django 3.0.7 on 2020-06-14 07:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Mail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('to', models.CharField(max_length=256)),
                ('subject', models.CharField(max_length=256)),
                ('message', models.TextField()),
            ],
        ),
    ]
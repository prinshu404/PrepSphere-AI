from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("email", models.EmailField(db_index=True, max_length=254, unique=True)),
                ("password", models.CharField(max_length=255)),
                ("college", models.CharField(blank=True, default="", max_length=255)),
                ("branch", models.CharField(blank=True, default="", max_length=255)),
                ("technical", models.PositiveSmallIntegerField(default=0)),
                ("communication", models.PositiveSmallIntegerField(default=0)),
                ("problem_solving", models.PositiveSmallIntegerField(default=0)),
                ("confidence", models.PositiveSmallIntegerField(default=0)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"db_table": "users"},
        ),
        migrations.CreateModel(
            name="Interview",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("role", models.CharField(default="Mock Interview", max_length=255)),
                ("company", models.CharField(default="General Practice", max_length=255)),
                ("type", models.CharField(default="Mock Interview", max_length=100)),
                ("score", models.PositiveSmallIntegerField(default=0)),
                ("status", models.CharField(choices=[("Completed", "Completed"), ("Scheduled", "Scheduled"), ("In Progress", "In Progress")], default="Completed", max_length=30)),
                ("duration", models.PositiveIntegerField(default=0)),
                ("completed_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="interviews", to="api.user")),
            ],
            options={"db_table": "interviews", "ordering": ["-completed_at"]},
        ),
        migrations.CreateModel(
            name="Report",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("overall_score", models.PositiveSmallIntegerField(default=0)),
                ("technical", models.PositiveSmallIntegerField(default=0)),
                ("communication", models.PositiveSmallIntegerField(default=0)),
                ("problem_solving", models.PositiveSmallIntegerField(default=0)),
                ("confidence", models.PositiveSmallIntegerField(default=0)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("interview", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="reports", to="api.interview")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="reports", to="api.user")),
            ],
            options={"db_table": "reports", "ordering": ["-created_at"]},
        ),
    ]

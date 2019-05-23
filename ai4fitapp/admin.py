from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportActionModelAdmin
from import_export.forms import ImportForm

from .models import CardioItem, PointItem, Workout, WorkoutActivityResult

# Register your models here.


class CardioItemResource(resources.ModelResource):

    class Meta:
        model = CardioItem
        import_id_fields = ['hr_item_id']


class PointItemResource(resources.ModelResource):

    class Meta:
        model = PointItem
        import_id_fields = ['point_item_id']


class WorkoutResource(resources.ModelResource):

    class Meta:
        model = Workout
        import_id_fields = ['session_id']


class WorkoutActivityResultResource(resources.ModelResource):

    class Meta:
        model = WorkoutActivityResult
        import_id_fields = ['activity_results_id']


class CardioItemAdmin(ImportExportActionModelAdmin):
    resource_class = CardioItemResource

    list_display = ('hr_item_id', 'workout_item_id', 'workout_activity_result_id', 'rate', 'time', 'deleted')

    def get_import_form(self):
        return ImportForm

    def get_form_kwargs(self, form, *args, **kwargs):
        if isinstance(form, ImportForm):
            if form.is_valid():
                cardioItem = form.cleaned_data['cardioItem']
                kwargs.update({'cardioItem': cardioItem.id})
        return kwargs


class PointItemAdmin(ImportExportActionModelAdmin):
    resource_class = PointItemResource

    list_display = ('point_item_id', 'workout_item_id', 'workout_activity_result_id',
                    'latitude', 'longitude', 'altitude', 'accuracy', 'time', 'isastart', 'deleted')

    def get_import_form(self):
        return ImportForm

    def get_form_kwargs(self, form, *args, **kwargs):
        if isinstance(form, ImportForm):
            if form.is_valid():
                pointItem = form.cleaned_data['pointItem']
                kwargs.update({'pointItem': pointItem.id})
        return kwargs


class WorkoutAdmin(ImportExportActionModelAdmin):
    resource_class = WorkoutResource

    list_display = ('session_id', 'item_user_id', 'duration', 'pausetime', 'distance',
                    'avgspeed', 'avgbpm', 'calories', 'mark', 'user_lastlogin')

    def get_import_form(self):
        return ImportForm

    def get_form_kwargs(self, form, *args, **kwargs):
        if isinstance(form, ImportForm):
            if form.is_valid():
                workoutActivity = form.cleaned_data['workoutActivity']
                kwargs.update({'workoutActivity': workoutActivity.id})
        return kwargs


class WorkoutActivityResultAdmin(ImportExportActionModelAdmin):
    resource_class = WorkoutActivityResultResource

    list_display = ('activity_results_id', 'workout_activity_id', 'workout_item_id', 'distancedone',
                    'speeddone', 'timedone', 'wactivity_type', 'wactivity_comment')

    def get_import_form(self):
        return ImportForm

    def get_form_kwargs(self, form, *args, **kwargs):
        if isinstance(form, ImportForm):
            if form.is_valid():
                workout = form.cleaned_data['workout']
                kwargs.update({'workout': workout.id})
        return kwargs


admin.site.register(CardioItem, CardioItemAdmin)
admin.site.register(PointItem, PointItemAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(WorkoutActivityResult, WorkoutActivityResultAdmin)
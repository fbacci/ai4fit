import json
import re

from django.core import serializers
from django.db.models import Sum, Count, F, Func, FloatField, ExpressionWrapper, Value, IntegerField
from django.db.models.functions import Cast
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from datetime import datetime, timedelta, date

from django.views.decorators.csrf import csrf_exempt
from wit import Wit

from .models import CardioItem, PointItem, Workout, WorkoutActivityResult


class Round(Func):
    function = 'ROUND'
    arity = 2


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))


def loginUser(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        if not (username is None or password is None or (username is None and password is None)):
            user = authenticate(username=username, password=password)

        if user:
            login(request, user)
            return HttpResponseRedirect(reverse('ai4fitapp:home'))
        else:
            errore = "I dati inseriti non sono validi."
            return render(request, 'ai4fitapp/login.html', {'errore': errore})
    else:
        errore = ""
        return render(request, 'ai4fitapp/login.html', {'errore': errore})


def logoutUser(request):
    logout(request)
    return HttpResponseRedirect(reverse('ai4fitapp:loginUser'))


def home(request):
    return render(request, 'ai4fitapp/home.html')


def index(request):
    dataWorkout = Workout.objects.all()
    jsDataWorkout = serializers.serialize('json', dataWorkout)

    return render(request, 'ai4fitapp/index.html', {'data': jsDataWorkout})


@csrf_exempt
def askInfo(request):
    lista = []
    mode = -1
    txt = ""

    if request.method == 'POST':
        question = request.POST.get('question')
        orderMode = request.POST.get('orderMode')
        criterioOrd = request.POST.get('criterio')
        rangeDate = request.POST.get('intervallo')
        response = client.get_message(question)

        intent = response['outcomes'][0]['entities']['intent'][0]['value']
        entities = response['outcomes'][0]['entities']

        data = Workout.objects.all()

        if intent == 'best':
            newData = data.values('item_user_id', 'user_birthdate').annotate(sum=Sum('mark'),
                                                                             count=Count('item_user_id'))
            results = newData.values('item_user_id', 'user_birthdate') \
                .annotate(avg=ExpressionWrapper(Cast(F('sum'), FloatField()) / Cast(F('count'),
                                                                                    FloatField()),
                                                output_field=FloatField()), eta=Value(0, IntegerField()))

            results = results.order_by('avg')
            results = list(results)

            for r in results:
                r['eta'] = getAge(r['user_birthdate'])

            if "number" in entities:
                number = int(entities['number'][0]['value'])
                results = results[-number:]
            else:
                results = results[-50:]

            resultsJS = json.dumps(results, default=json_serial)

            return HttpResponse(resultsJS)

        if intent == 'order':
            if 'get_vote' in entities or criterioOrd == 'voto':
                newData = data.values('item_user_id').annotate(sum=Sum('mark'), count=Count('item_user_id'))
                results = newData.values('item_user_id').annotate(
                    avg=ExpressionWrapper(Cast(F('sum'), FloatField()) / Cast(F('count'),
                                                                              FloatField()), output_field=FloatField()))

            if 'get_calories' in entities or criterioOrd == 'calorie':
                newData = data.values('item_user_id').annotate(sum=Sum('calories'), count=Count('item_user_id'))
                results = newData.values('item_user_id').annotate(
                    avg=ExpressionWrapper(Cast(F('sum'), FloatField()) / Cast(F('count'),
                                                                              FloatField()), output_field=FloatField()))

            if 'get_avg_speed' in entities or criterioOrd == 'velocità media':
                newData = data.values('item_user_id').annotate(sum=Sum('avgspeed'), count=Count('item_user_id'))
                results = newData.values('item_user_id').annotate(
                    avg=ExpressionWrapper(Cast(F('sum'), FloatField()) / Cast(F('count'),
                                                                              FloatField()), output_field=FloatField()))

            if orderMode == "crescente":
                results = results.order_by('-avg');
            else:
                results = results.order_by('avg')

            resultsJS = json.dumps(list(results))

            return HttpResponse(resultsJS)

        if intent == 'login':
            if 'datetime' in entities:
                results = getRangeDateList(data, question)
            else:
                results = getDateList(data, entities, rangeDate)

            resultsJS = json.dumps(results)

            return HttpResponse(resultsJS)

    return render(request, 'ai4fitapp/ask.html')


def getDateList(data, ent, rangeDate):
    todayDate = datetime.now() - timedelta(days=365)
    dateList = []
    date_generated = []
    arr = []
    week = []

    if rangeDate == 'settimana' or 'get_this_week' in ent:
        week = getWeek((datetime.now() - timedelta(days=365)))
        arr = week
        date_generated = [(arr[0] - timedelta(days=1)) + timedelta(days=x) for x in range(0, (arr[1] - arr[0]).days)]

    if rangeDate == 'mese' or 'get_this_month' in ent:
        start = todayDate.replace(day=1)

        if start.month == '11' or start.month == '04' or start.month == '06' or start.month == '09':
            end = todayDate.replace(day=30)
        elif start.month == '02':
            end = todayDate.replace(day=28)
        else:
            end = todayDate.replace(day=31)

        date_generated = [start + timedelta(days=x) for x in range(0, end.day)]

        arr=[start, end]

    if rangeDate == 'anno' or 'get_this_year' in ent:
        start = todayDate.replace(day=1, month=1, year=(todayDate.year - 1))
        end = todayDate.replace(day=31, month=12, year=todayDate.year)

        date_generated = [start + timedelta(days=x) for x in range(0, 365)]

        arr = [start, end]

    for d in date_generated:
        dateList.append([d, 0])

    data = data.values('user_lastlogin').filter(user_lastlogin__date__range=(arr[0].date(), arr[1].date())) \
        .annotate(countlog=Count('user_lastlogin'))

    for d in data:
        for date in dateList:
            if d['user_lastlogin'].date() == date[0].date():
                date[1] = date[1] + d['countlog']

    for l in dateList:
        l[0] = datetime.strftime(l[0], "%Y-%m-%d")

    return dateList


def getRangeDateList(data, q):
    regex = "(?: +|[A-z]+)((?:0?[0-9]|[1-2][0-9]|30|31)(?:\/{1}|-{1})(?:0?[1-9]|10|11|12)(?:\/{1}|-{1})\d{4})"
    x = re.findall(regex, q)

    dateList = []

    d1 = datetime.strptime(x[0], '%d/%m/%Y')
    d2 = datetime.strptime(x[1], '%d/%m/%Y')

    daysBetween = abs((d2-d1).days) + 1

    date_generated = [d1 + timedelta(days=x) for x in range(0, daysBetween)]

    for d in date_generated:
        dateList.append([d, 0])

    data = data.values('user_lastlogin').filter(user_lastlogin__date__range=(d1.date(), d2.date())) \
        .annotate(countlog=Count('user_lastlogin'))

    for d in data:
        for date in dateList:
            if d['user_lastlogin'].date() == date[0].date():
                date[1] = date[1] + d['countlog']

    for l in dateList:
        l[0] = datetime.strftime(l[0], "%Y-%m-%d")

    return dateList


def getAge(bdate):
    days_in_year = 365.2425
    age = int((datetime.now().date().today() - bdate).days / days_in_year)
    return age


def getWeek(day):
    s = day - timedelta(days=day.weekday())
    e = s + timedelta(days=7)

    return [s, e]

def getYear(day):
    s = day
    e = s + timedelta(days=365)

    return [s, e]


def training(request):
    dataCardio = CardioItem.objects.all()
    dataPoint = PointItem.objects.all()
    dataWActivityRes = WorkoutActivityResult.objects.all()
    jsDataCardio = serializers.serialize('json', dataCardio)
    jsDataPoint = serializers.serialize('json', dataPoint)
    jsDataWActivityRes = serializers.serialize('json', dataWActivityRes)
    return render(request, 'ai4fitapp/training.html', {'dataCardio': jsDataCardio, 'dataPoint': jsDataPoint,
                                                       'dataWActivityRes': jsDataWActivityRes})


access_token = "5UIF6BMR5HKRP6JVX6QVGZFKAS5E6LBQ"
client = Wit(access_token)

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
    if request.method == 'POST':
        question = request.POST.get('question')
        orderMode = request.POST.get('orderMode')
        criterioOrd = request.POST.get('criterio')
        rangeDate = request.POST.get('intervallo')
        dateList = []
        data1 = request.POST.get('data1')
        data2 = request.POST.get('data2')

        response = client.get_message(question)

        intent = response['outcomes'][0]['entities']['intent'][0]['value']
        entities = response['outcomes'][0]['entities']

        data = Workout.objects.all()
        results = []

        if intent == 'show':
            if 'datetime' in entities and data1 is None and data2 is None:
                dateList = manageDate(data, question)
                start = datetime.strptime(dateList[0][0], "%d-%m-%Y")
                end = datetime.strptime(dateList[len(dateList) - 1][0], "%d-%m-%Y")
                data = data.filter(user_lastlogin__range=(start, end))
            elif data1 is not None and data2 is not None:
                dateList = getRangeDateList(data, data1, data2)
                start = datetime.strptime(dateList[0][0], "%d-%m-%Y")
                end = datetime.strptime(dateList[len(dateList) - 1][0], "%d-%m-%Y")
                data = data.filter(user_lastlogin__range=(start, end))
            elif 'get_this_week' in entities or 'get_this_month' in entities or 'get_this_year' in entities:
                dateList = getDateList(data, entities, rangeDate)
                start = datetime.strptime(dateList[0][0], "%d-%m-%Y")
                end = datetime.strptime(dateList[len(dateList) - 1][0], "%d-%m-%Y")
                data = data.filter(user_lastlogin__range=(start, end))

            if len(entities) > 1:
                newData = data.values('item_user_id', 'user_birthdate', 'user_lastlogin')\
                    .annotate(sumC=Sum('calories'), sumB=Sum('avgbpm'), count=Count('item_user_id'))

            if 'group_by_age' in entities:
                newData = newData.annotate(groupField=F('age')).distinct()

            if 'group_by_calories' in entities:
                newData = newData.annotate(groupField=ExpressionWrapper(
                    Round(Cast(F('sumC'), FloatField()) / Cast(F('count'), FloatField()), 2),
                    output_field=FloatField())).distinct()

            if 'group_by_daily_calories' in entities:
                today = datetime(2016, 5, 25)

                newData = newData.filter(user_lastlogin__day=today.day, user_lastlogin__month=today.month, user_lastlogin__year=today.year)\
                    .annotate(sumCT=Sum('calories'), countT=Count('user_lastlogin'))

                newData = newData.annotate(groupField=ExpressionWrapper(
                        Round(Cast(F('sumCT'), FloatField()) / Cast(F('countT'), FloatField()), 2),
                        output_field=FloatField()))

            if 'get_bpm' in entities:
                newData = newData.annotate(orderField=ExpressionWrapper(
                    Round(Cast(F('sumB'), FloatField()) / Cast(F('count'), FloatField()), 2),
                    output_field=FloatField()))

            if 'get_age' in entities:
                newData = newData.annotate(orderField=F('age'))

            newData = list(newData)

            if 'number' in entities:
                if len(entities['number']) > 1:
                    num = [entities['number'][0]['value'], entities['number'][1]['value']]
                    for d in newData:
                        if num[0] <= d['orderField'] <= num[1]:
                            results.append(d)
                elif len(entities['number']) == 1:
                    number = entities['number'][0]['value']
                    if 'get_greater' in entities:
                        for l in newData:
                            if l['orderField'] > number:
                                results.append(l)
                    elif 'get_lesser' in entities:
                        for l in newData:
                            if l['orderField'] < number:
                                results.append(l)

            results.sort(key=lambda x: x['orderField'])

            if len(results) > 0 and len(dateList) > 0:
                results.append(dateList)
            elif len(dateList) > 0 and len(results) == 0:
                results = dateList

            print(results)

            resultsJS = json.dumps(results, default=json_serial)

            return HttpResponse(resultsJS)

        if intent == 'best':
            data = data.values('item_user_id', 'user_lastlogin', 'user_birthdate') \
                    .annotate(sum=Sum('mark'), sumC=Sum('calories'), sumS=Sum('avgspeed'), count=Count('item_user_id'))

            if 'group_by_age' in entities:
                data = data.annotate(groupField=F('age'))

            if 'group_by_calories' in entities:
                data = data.annotate(groupField=ExpressionWrapper(Round(Cast(F('sumC'), FloatField()) / Cast(F('count'),
                                                                     FloatField()), 2), output_field=FloatField()))

            if 'group_by_daily_calories' in entities:
                today = datetime(2016, 5, 25)

                data = data.filter(user_lastlogin__day=today.day, user_lastlogin__month=today.month, user_lastlogin__year=today.year)\
                    .annotate(sumCT=Sum('calories'), countT=Count('user_lastlogin'))

                data = data.annotate(groupField=ExpressionWrapper(
                        Round(Cast(F('sumCT'), FloatField()) / Cast(F('countT'), FloatField()), 2),
                        output_field=FloatField()))

            if 'get_calories' in entities or criterioOrd == 'calorie':
                data = data.annotate(orderField=ExpressionWrapper(
                              Round(Cast(F('sumC'), FloatField()) / Cast(F('count'), FloatField()), 2),
                              output_field=FloatField()))
            elif 'get_avg_speed' in entities or criterioOrd == 'velocità media':
                data = data.annotate(orderField=ExpressionWrapper(
                                  Round(Cast(F('sumS'), FloatField()) / Cast(F('count'), FloatField()), 2),
                                  output_field=FloatField()))
            else:
                data = data.annotate(orderField=ExpressionWrapper(
                    Round(Cast(F('sum'), FloatField()) / Cast(F('count'), FloatField()), 2),
                    output_field=FloatField()))

            results = list(data)
            results.sort(key=lambda x: x['orderField'])

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
                    orderField=ExpressionWrapper(
                        Round(Cast(F('sum'), FloatField()) / Cast(F('count'), FloatField()), 2),
                        output_field=FloatField()))

            if 'get_calories' in entities or criterioOrd == 'calorie':
                newData = data.values('item_user_id').annotate(sum=Sum('calories'), count=Count('item_user_id'))
                results = newData.values('item_user_id').annotate(
                    orderField=ExpressionWrapper(
                        Round(Cast(F('sum'), FloatField()) / Cast(F('count'), FloatField()), 2),
                        output_field=FloatField()))

            if 'get_avg_speed' in entities or criterioOrd == 'velocità media' or criterioOrd == 'velocità':
                newData = data.values('item_user_id').annotate(sum=Sum('avgspeed'), count=Count('item_user_id'))
                results = newData.values('item_user_id').annotate(
                    orderField=ExpressionWrapper(
                        Round(Cast(F('sum'), FloatField()) / Cast(F('count'), FloatField()), 2),
                        output_field=FloatField()))

            if orderMode == "crescente":
                results = results.order_by('-orderField')
            else:
                results = results.order_by('orderField')

            resultsJS = json.dumps(list(results))

            return HttpResponse(resultsJS)

    return render(request, 'ai4fitapp/ask.html')


def getDateList(data, ent, rangeDate):
    todayDate = datetime.now() - timedelta(days=365)
    dateList = []
    date_generated = []
    arr = []
    dates = []
    x = 0
    cnt = -1

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

        arr = [start, end]

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

    if rangeDate == 'mese' or 'get_this_month' in ent:
        for d in dateList:
            if d[0].weekday() == 0 or x == 0:
                dates.append(d)
                cnt += 1
            else:
                dates[cnt][1] += d[1]

            x += 1

        dateList = dates

    '''if rangeDate == 'anno' or 'get_this_year' in ent:
        for d in dateList:
            if x == 0 or x % mod 30 == 0 or (x % 31 == 0 and :
                dates.append(d)
                x += 1
                cnt += 1
            else:
                dates[cnt][1] += d[1]
                
            x +=1'''


    for l in dateList:
        l[0] = datetime.strftime(l[0], "%d-%m-%Y")

    return dateList


def manageDate(data, q):
    regex = "(?: +|[A-z]+)((?:0?[0-9]|[1-2][0-9]|30|31)(?:\/{1}|-{1})(?:0?[1-9]|10|11|12)(?:\/{1}|-{1})\d{4})"
    x = re.findall(regex, q)

    dateList = getRangeDateList(data, x[0], x[1])

    return dateList


def getRangeDateList(data, d1, d2):
    dateList = []

    d1 = datetime.strptime(d1, '%d/%m/%Y')
    d2 = datetime.strptime(d2, '%d/%m/%Y')

    daysBetween = abs((d2 - d1).days) + 1

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


def getWeek(day):
    s = day - timedelta(days=day.weekday())
    e = s + timedelta(days=7)

    return [s, e]


def getYear(day):
    s = day
    e = s + timedelta(days=365)

    return [s, e]


@csrf_exempt
def infodataset(request):
    dataset = request.POST.get('dataset')
    resultsJS = {}

    if 'Workout' in dataset:
        data = Workout.objects.all()

        data = data.values('item_user_id', 'user_birthdate', 'age') \
            .annotate(sumBpm=Sum('avgbpm'), sumSpeed=Sum('avgspeed'), count=Count('item_user_id'))

        data = data.annotate(avgB=ExpressionWrapper(Round(Cast(F('sumBpm'), FloatField()) / Cast(F('count'), FloatField()), 2),
                                                    output_field=FloatField()),
                             avgS=ExpressionWrapper(Round(Cast(F('sumSpeed'), FloatField()) / Cast(F('count'), FloatField()),2),
                                                    output_field=FloatField()))

        results = list(data)

        resultsJS = json.dumps(results, default=json_serial)

    return HttpResponse(resultsJS)


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

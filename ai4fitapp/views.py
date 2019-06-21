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
        groupMode = request.POST.get('group')
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
            elif rangeDate is not None or 'get_this_week' in entities or 'get_this_month' in entities or 'get_this_year' in entities:
                dateList = getDateList(data, entities, rangeDate)
                start = datetime.strptime(dateList[0][0], "%d-%m-%Y")
                end = datetime.strptime(dateList[len(dateList) - 1][0], "%d-%m-%Y")
                data = data.filter(user_lastlogin__range=(start, end))

            if len(entities) > 1:
                newData = data.values('item_user_id', 'user_birthdate', 'user_lastlogin', 'user_gender') \
                    .annotate(sumDist = Sum('distance'), sumD=Sum('duration'), sumC=Sum('calories'), sumB=Sum('avgbpm'), sumS=Sum('avgspeed'),
                              count=Count('item_user_id'))

            if groupMode == 'età' or ('group_by_age' in entities and
                                         (groupMode == 'età' or groupMode == '' or groupMode is None)):
                newData = newData.annotate(groupField=F('age')).distinct()

            if groupMode == 'calorie' or ('group_by_calories' in entities and
                                         (groupMode == 'calorie' or groupMode == '' or groupMode is None)):
                newData = newData.annotate(groupField=ExpressionWrapper(
                    Round(Cast(F('sumC'), FloatField()) / Cast(F('count'), FloatField()), 2),
                    output_field=FloatField())).distinct()

            if groupMode == 'calorie giornaliere' or ('group_by_daily_calories' in entities and
                                         (groupMode == 'calorie giornaliere' or groupMode == '' or groupMode is None)):
                today = datetime(2016, 5, 25)

                newData = newData.filter(user_lastlogin__day=today.day, user_lastlogin__month=today.month,
                                         user_lastlogin__year=today.year) \
                    .annotate(sumCT=Sum('calories'), countT=Count('user_lastlogin'))

                newData = newData.annotate(groupField=ExpressionWrapper(
                    Round(Cast(F('sumCT'), FloatField()) / Cast(F('countT'), FloatField()), 2),
                    output_field=FloatField()))

            if 'get_bpm' in entities:
                newData = newData.annotate(orderField=ExpressionWrapper(
                    Round(Cast(F('sumB'), FloatField()) / Cast(F('count'), FloatField()), 2),
                    output_field=FloatField()))
            elif 'get_age' in entities:
                newData = newData.annotate(orderField=F('age'))
            else:
                newData = newData.annotate(orderField=Value(0, IntegerField()))

            if 'get_distribution' in entities:
                if 'get_calories' in entities:
                    newData = newData.annotate(orderField=ExpressionWrapper(
                        Round(Cast(F('sumC'), FloatField()) / Cast(F('count'), FloatField()), 2),
                        output_field=FloatField()))

                if 'get_avg_speed' in entities:
                    newData = newData.annotate(y=ExpressionWrapper(
                        Round(Cast(F('sumS'), FloatField()) / Cast(F('count'), FloatField()), 2),
                        output_field=FloatField()))

                if 'get_age' in entities:
                    newData = newData.annotate(y=F('age'))

                if 'get_duration' in entities:
                    newData = newData.annotate(y=ExpressionWrapper(
                        Round(Cast(F('sumD'), FloatField()) / Cast(F('count'), FloatField()), 2),
                        output_field=FloatField()))

                    for d in newData:
                        d['y'] = getTime(d['y'])

                if 'get_distance' in entities:
                    newData = newData.annotate(y=ExpressionWrapper(
                        Round(Cast(F('sumDist'), FloatField()) / Cast(F('count'), FloatField()), 2),
                        output_field=FloatField()))

                    for d in newData:
                        d['y'] = getDistance(d['y'])

                for d in newData:
                    results.append(d)

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

            if orderMode == 'crescente':
                results = results[::-1]

            if len(entities) == 3 and len(dateList) > 0 and len(results) == 0\
                    and ('group_by_age' in entities or 'group_by_calories' in entities):
                results = list(newData)
                results.append(dateList)
            elif len(results) > 0 and len(dateList) > 0:
                results.append(dateList)
            elif len(dateList) > 0 and len(results) == 0:
                results = dateList

            resultsJS = json.dumps(results, default=json_serial)

            return HttpResponse(resultsJS)

        if intent == 'best':
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
            elif rangeDate is not None or 'get_this_week' in entities or 'get_this_month' in entities or 'get_this_year' in entities:
                dateList = getDateList(data, entities, rangeDate)
                start = datetime.strptime(dateList[0][0], "%d-%m-%Y")
                end = datetime.strptime(dateList[len(dateList) - 1][0], "%d-%m-%Y")
                data = data.filter(user_lastlogin__range=(start, end))

            data = data.values('item_user_id', 'user_lastlogin', 'user_birthdate') \
                .annotate(sum=Sum('mark'), sumC=Sum('calories'), sumS=Sum('avgspeed'), count=Count('item_user_id'))

            if groupMode == 'età' or ('group_by_age' in entities and
                                         (groupMode == 'età' or groupMode == '' or groupMode is None)):
                data = data.annotate(groupField=F('age'))

            if groupMode == 'calorie' or ('group_by_calories' in entities and
                                         (groupMode == 'calorie' or groupMode == '' or groupMode is None)):
                data = data.annotate(groupField=ExpressionWrapper(Round(Cast(F('sumC'), FloatField()) / Cast(F('count'),
                                                                                                             FloatField()),
                                                                        2), output_field=FloatField()))

            if groupMode == 'calorie giornaliere' or ('group_by_daily_calories' in entities and
                                         (groupMode == 'calorie giornaliere' or groupMode == '' or groupMode is None)):
                today = datetime(2016, 5, 25)

                data = data.filter(user_lastlogin__day=today.day, user_lastlogin__month=today.month,
                                   user_lastlogin__year=today.year) \
                    .annotate(sumCT=Sum('calories'), countT=Count('user_lastlogin'))

                data = data.annotate(groupField=ExpressionWrapper(
                    Round(Cast(F('sumCT'), FloatField()) / Cast(F('countT'), FloatField()), 2),
                    output_field=FloatField()))

            if criterioOrd == 'calorie' or (
                    'get_calories' in entities and (criterioOrd == 'calorie' or criterioOrd == '')):
                data = data.annotate(orderField=ExpressionWrapper(
                    Round(Cast(F('sumC'), FloatField()) / Cast(F('count'), FloatField()), 2),
                    output_field=FloatField()))
            elif criterioOrd == 'velocità' or (
                    'get_avg_speed' in entities and (criterioOrd == 'velocità' or criterioOrd == '')):
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

            if len(results) > 0 and len(dateList) > 0:
                results.append(dateList)

            resultsJS = json.dumps(results, default=json_serial)

            return HttpResponse(resultsJS)

        if intent == 'order':
            if criterioOrd == 'voto' or ('get_vote' in entities and
                                         (criterioOrd == 'voto' or criterioOrd == '' or criterioOrd is None)):
                data = data.values('item_user_id').annotate(sum=Sum('mark'), count=Count('item_user_id'))
                results = data.values('item_user_id').annotate(
                    orderField=ExpressionWrapper(
                        Round(Cast(F('sum'), FloatField()) / Cast(F('count'), FloatField()), 2),
                        output_field=FloatField()))

            elif criterioOrd == 'calorie' or ('get_calories' in entities and
                                              (criterioOrd == 'calorie' or criterioOrd == '' or criterioOrd is None)):
                data = data.values('item_user_id').annotate(sum=Sum('calories'), count=Count('item_user_id'))
                results = data.values('item_user_id').annotate(
                    orderField=ExpressionWrapper(
                        Round(Cast(F('sum'), FloatField()) / Cast(F('count'), FloatField()), 2),
                        output_field=FloatField()))

            elif criterioOrd == 'velocità' or ('get_avg_speed' in entities
                                                     and (
                                                             criterioOrd == 'velocità' or criterioOrd == '' or criterioOrd is None)):
                data = data.values('item_user_id').annotate(sum=Sum('avgspeed'), count=Count('item_user_id'))
                results = data.values('item_user_id').annotate(
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

    if rangeDate == 'mese' or ('get_this_month' in ent and (rangeDate is None or rangeDate == 'mese' or rangeDate == '')):
        start = todayDate.replace(day=1)

        if start.month == 11 or start.month == 4 or start.month == 6 or start.month == 9:
            end = todayDate.replace(day=30)
        elif start.month == 2:
            end = todayDate.replace(day=28)
        else:
            end = todayDate.replace(day=31)

        date_generated = [start + timedelta(days=x) for x in range(0, end.day)]

        arr = [start, end]
    elif rangeDate == 'anno' or ('get_this_year' in ent and (rangeDate is None or rangeDate == 'anno' or rangeDate == '')):
        start = todayDate.replace(day=1, month=1, year=(todayDate.year - 1))
        end = todayDate.replace(day=31, month=12, year=todayDate.year)

        date_generated = [start + timedelta(days=x) for x in range(0, 365)]

        arr = [start, end]
    elif rangeDate == 'settimana' or ('get_this_week' in ent and (rangeDate is None or rangeDate == 'settimana' or rangeDate == '')):
        week = getWeek((datetime.now() - timedelta(days=365)))
        arr = week
        date_generated = [(arr[0] - timedelta(days=1)) + timedelta(days=x) for x in range(0, (arr[1] - arr[0]).days)]

    for d in date_generated:
        dateList.append([d, 0])

    data = data.values('user_lastlogin').filter(user_lastlogin__date__range=(arr[0].date(), arr[1].date())) \
        .annotate(countlog=Count('user_lastlogin'))

    for d in data:
        for date in dateList:
            if d['user_lastlogin'].date() == date[0].date():
                date[1] = date[1] + d['countlog']

    if rangeDate == 'mese' or ('get_this_month' in ent and (rangeDate is None or rangeDate == '')):
        for d in dateList:
            if d[0].weekday() == 0 or x == 0:
                dates.append(d)
                cnt += 1
            else:
                dates[cnt][1] += d[1]

            x += 1

        dateList = dates
    elif rangeDate == 'anno' or ('get_this_year' in ent and (rangeDate is None or rangeDate == '')):
        for d in dateList:
            if d[0].date().day == 1:
                dates.append(d)
                cnt += 1
            else:
                dates[cnt][1] += d[1]

        dateList = dates

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
    dates = []
    cnt = -1

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

    for d in dateList:
        if d[0].date().day == 1 or d[0].date() == d1.date() or d[0].date() == d2.date():
            dates.append(d)
            cnt += 1
        else:
            dates[cnt][1] += d[1]

        dateList = dates

    for l in dateList:
        l[0] = datetime.strftime(l[0], "%d-%m-%Y")

    return dateList


def getWeek(day):
    s = day - timedelta(days=day.weekday())
    e = s + timedelta(days=7)

    return [s, e]


def getYear(day):
    s = day
    e = s + timedelta(days=365)

    return [s, e]


def getTime(t):
    return t/3600


def getDistance(d):
    return d/1000


@csrf_exempt
def infodataset(request):
    dataset = request.POST.get('dataset')
    resultsJS = {}

    if 'Workout' in dataset:
        data = Workout.objects.all()

        data = data.values('item_user_id', 'user_birthdate', 'age') \
            .annotate(sumM=Sum('mark'), sumBpm=Sum('avgbpm'), sumSpeed=Sum('avgspeed'), sumCal=Sum('calories'),
                      count=Count('item_user_id'))

        data = data.annotate(
            avgM=ExpressionWrapper(Round(Cast(F('sumM'), FloatField()) / Cast(F('count'), FloatField()), 2),
                                   output_field=FloatField()),
            avgB=ExpressionWrapper(Round(Cast(F('sumBpm'), FloatField()) / Cast(F('count'), FloatField()), 2),
                                   output_field=FloatField()),
            avgS=ExpressionWrapper(Round(Cast(F('sumSpeed'), FloatField()) / Cast(F('count'), FloatField()), 2),
                                   output_field=FloatField()),
            avgC=ExpressionWrapper(Round(Cast(F('sumCal'), FloatField()) / Cast(F('count'), FloatField()), 2),
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

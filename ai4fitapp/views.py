from django.core import serializers
from django.db.models import Sum, Count
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
import datetime

from wit import Wit

from .models import CardioItem, PointItem, Workout, WorkoutActivityResult

ageList = [[18,24], [25,39], [40,55], [56,68]]

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


def askInfo(request):
    lista = []
    mode = -1
    txt = ""
    question = request.POST.get('question')

    if not question is None:
        response = client.get_message(question)

        intent = response['outcomes'][0]['entities']['intent'][0]['value']
        entities = response['outcomes'][0]['entities']
        data = Workout.objects.all()

        print(entities)

        if intent == 'best':
            data = data.values('item_user_id', 'user_birthdate').annotate(sum=Sum('mark'), count=Count('item_user_id'))
            txt = "Migliori 50 atleti"
            for d in data:
                lista.append([d['item_user_id'], round(d['sum'] / d['count'], 2), getAge(d['user_birthdate'])])
            lista.sort(key=lambda x: x[1])
            lista = lista[-50:]

            '''if "get_bmi_range" in entities:
                bmiValues = '''

            if "group_by_age" in entities:
                mode = 1
                perc = getPerc(lista)
                return render(request, 'ai4fitapp/ask.html',
                              {'results': lista, 'percent': perc, 'txt': txt, 'mode': mode})
            else:
                mode = 0
                return render(request, 'ai4fitapp/ask.html', {'results': lista, 'txt': txt, 'mode': mode})

        if intent == 'order':
            mode = 2
            data = data.values('item_user_id').annotate(sum=Sum('mark'), count=Count('item_user_id'))
            txt = "Atleti"
            for d in data:
                lista.append([d['item_user_id'], round(d['sum'] / d['count'], 2)])
            lista.sort(key=lambda x: x[1])

            return render(request, 'ai4fitapp/ask.html', {'results': lista, 'txt': txt, 'mode': mode})

        #if intent == 'login':


    return render(request, 'ai4fitapp/ask.html')


def getPerc(lista):
    dim = len(lista)
    cnt0 = 0
    cnt1 = 0
    cnt2 = 0
    cnt3 = 0

    for l in lista:
        if ageList[0][0] <= l[2] <= ageList[0][1]:
            cnt0 += 1
        if ageList[1][0] <= l[2] <= ageList[1][1]:
            cnt1 += 1
        if ageList[2][0] <= l[2] <= ageList[2][1]:
            cnt2 += 1
        if ageList[3][0] <= l[2] <= ageList[3][1]:
            cnt3 += 1

    return {"18-24": (cnt0/dim)*100, "25-39": (cnt1/dim)*100, "40-55": (cnt2/dim)*100, "56-68": (cnt3/dim)*100}

def getAge(bdate):
    days_in_year = 365.2425
    age = int((datetime.date.today() - bdate).days / days_in_year)
    return age


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
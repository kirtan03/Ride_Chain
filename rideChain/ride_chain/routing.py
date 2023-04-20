from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/<str:ipfs_hash>/', consumers.rideConsumer.as_asgi()),
]	
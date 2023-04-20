"""
ASGI config for rideChain project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import ride_chain.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rideChain.settings')

django_asgi_app = get_asgi_application()
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket" : URLRouter(ride_chain.routing.websocket_urlpatterns)
})

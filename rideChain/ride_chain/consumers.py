import json

from channels.generic.websocket import AsyncWebsocketConsumer

class rideConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['ipfs_hash']
        self.room_group_name = 'ride'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        print("Connected to room: " + self.room_group_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print("Message received: " + text_data)
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_message',
                'message': text_data_json
            }
        )

    # Receive message from room group
    async def send_message(self, event):
        print("FFFFFFFFFFFFFF")

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event
        }))
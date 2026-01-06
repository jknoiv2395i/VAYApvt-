import asyncio
from app.main import app
from fastapi.routing import APIRoute

def print_routes():
    print("Registered Routes:")
    for route in app.routes:
        if isinstance(route, APIRoute):
            print(f"Path: {route.path} | Methods: {route.methods} | Name: {route.name}")

if __name__ == "__main__":
    print_routes()

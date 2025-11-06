from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],  
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Prefix API routes with /api
app.include_router(routes.router, prefix="/api")

# @app.get("/")
# async def read_root():
#     return {"message": "Hello from FastAPI!"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.db import models, database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],  
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Prefix API routes 
app.include_router(routes.router,)

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI!"}
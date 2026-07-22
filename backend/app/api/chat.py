from app.services.brain.graph import agent
from fastapi import APIRouter
from app.schemas.chat import ChatRequest
chat_router=APIRouter()

@chat_router.post("/chat")
async def chat(data:ChatRequest):
    result = agent.invoke({"company_name": data.company_name})
    return {"summary": result["final_summary"]}  

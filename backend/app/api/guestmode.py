from fastapi import APIRouter
from uuid import uuid4

from app.services.guestmode import GuestModeInput, agent

guest_mode_router = APIRouter()


@guest_mode_router.post("/guestmode")
def guest_mode(state: GuestModeInput):

    thread_id = str(uuid4())

    config = {
        "configurable": {
            "thread_id": thread_id
        }
    }

    result = agent.invoke(
        {
            "target_company_industry": state.target_company_industry,
            "target_company_name": state.target_company_name,
            "your_services": state.your_services,
            "target_company_website": state.target_company_website,
        },
        config=config,
    )

    return {
        "output": result["output"]
    }
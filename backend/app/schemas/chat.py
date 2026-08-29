from pydantic import BaseModel
class ChatRequest(BaseModel):
    company_name:str
    industry:str
    your_service:str
    

    


    
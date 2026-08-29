from langgraph.checkpoint.postgres import PostgresSaver
from app.services.brain.graph import agent
DB_URI = "postgresql://neondb_owner:npg_4ZNkJpFLAq9I@ep-small-cake-axcolb66-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
with PostgresSaver.from_conn_string(DB_URI) as checkpointer:
    builder = StateGraph(...)
    graph = builder.compile(checkpointer=checkpointer)
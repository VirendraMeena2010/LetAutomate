from langfuse.langchain import CallbackHandler


def create_langfuse_handler() -> CallbackHandler:
    return CallbackHandler()
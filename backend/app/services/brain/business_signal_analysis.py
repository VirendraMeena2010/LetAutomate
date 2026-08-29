from typing import List

from pydantic import BaseModel, Field

from app.services.brain.state import AgentState
from app.services.brain.llm import llm


class BusinessSignal(BaseModel):

    signal: str = Field(
        description="Name of the business signal."
    )

    category: str = Field(
        description="Category such as funding, growth, product, partnership, expansion, hiring, market, technology, or risk."
    )

    evidence: str = Field(
        description="Evidence from the supplied research, news, or website information."
    )

    interpretation: str = Field(
        description="Why this signal matters from a B2B sales perspective."
    )


class BusinessSignalOutput(BaseModel):

    business_signals: List[BusinessSignal]


llm_with_business_signal_output = llm.with_structured_output(
    BusinessSignalOutput
)


def business_signal_agent(state: AgentState):

    prompt = f"""
You are the Business Signal Analysis Agent.

Analyze the company:

Company:
{state['company_name']}

Industry:
{state['industry']}

Your service:
{state['your_service']}

Research:
{state['research_summary']}

News:
{state['news_articles']}

Website:
{state['company_website_details']}

Identify meaningful business signals.

Look for:

- growth
- funding
- hiring
- product launches
- partnerships
- acquisitions
- geographic expansion
- enterprise expansion
- technology investment
- new customer segments
- market leadership
- strategic changes
- potential risks

For every signal:

1. Name the signal.
2. Categorize it.
3. Give supporting evidence.
4. Explain why it matters commercially.

IMPORTANT:

Business signals do NOT determine ICP fit.

Do not say a company matches the ICP simply because it is growing,
well-funded, or successful.

Use only evidence present in the supplied information.
Do not invent facts.
"""

    result = llm_with_business_signal_output.invoke(prompt)

    return {
        "business_signals": result
    }
from typing import List

from pydantic import BaseModel, Field

from app.services.brain.state import AgentState
from app.services.brain.llm import llm
from app.services.brain.icp_matcher_agent import ICPMatcherOutput
from app.services.brain.business_signal_analysis import BusinessSignal


class DecisionMaker(BaseModel):

    name: str = Field(
        description="Decision maker's name if available."
    )

    role: str = Field(
        description="Decision maker's role."
    )

    reason_relevant: str = Field(
        description="Why this person may be relevant to the service."
    )


class Conclusion(BaseModel):

    icp: ICPMatcherOutput

    business_signals: List[BusinessSignal]

    decision_makers: List[DecisionMaker]

    overall_priority: str = Field(
        description="One of: Very High, High, Medium, Low, Very Low."
    )

    final_recommendation: str

    reasoning: str


class ConcluderAgentResult(BaseModel):

    conclusion: Conclusion


llm_with_concluder = llm.with_structured_output(
    ConcluderAgentResult
)


def concluder_agent(state: AgentState):

    prompt = f"""
You are the Supervisor / Concluder Agent for AgentReach AI.

Your job is to produce the final prospect assessment.

==================================================
COMPANY
==================================================

{state['company_name']}

Industry:
{state['industry']}

Our service:
{state['your_service']}

==================================================
ICP MATCH RESULT
==================================================

{state['icp_matcher_output']}

==================================================
BUSINESS SIGNALS
==================================================

{state['business_signals']}

==================================================
COMPANY WEBSITE
==================================================

{state['company_website_details']}

==================================================
YOUR TASK
==================================================

Combine the available information into a final prospect assessment.

IMPORTANT:

1. Preserve the ICP match result.
2. Do not arbitrarily change the ICP score.
3. Separate ICP fit from business attractiveness.
4. Business signals should support prioritization, not redefine ICP fit.
5. Identify potential decision makers only when supported by available evidence.
6. Never invent a person's name.
7. If a specific decision maker is not found, use an empty list.
8. Do not treat a generic employee as a decision maker without evidence.
9. Recommend whether AgentReach should prioritize this company.

The final assessment should answer:

- Is this company our ICP?
- Why?
- What business signals make it attractive?
- Who are the relevant decision makers?
- Should sales prioritize this company?
"""
    
    result = llm_with_concluder.invoke(prompt)

    return {
        "conclusion": result
    }
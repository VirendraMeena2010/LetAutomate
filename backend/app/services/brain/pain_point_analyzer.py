from app.services.brain.llm import llm
from app.services.brain.state import AgentState


def Business_Opportunity_Analyze(state: AgentState):
    prompt = f"""
You are a senior B2B Strategy Analyst.

Your job is NOT to invent pain points.

Your job is to analyze publicly available evidence and identify BUSINESS SIGNALS,
LIKELY BUSINESS PRIORITIES, and AI AUTOMATION OPPORTUNITIES.

Company
-------
{state["company_name"]}

News & Research
---------------
{state["news_articles"]}

Instructions
------------
Use ONLY the information provided above.

DO NOT use prior knowledge.

DO NOT hallucinate.

DO NOT make generic startup assumptions.

If something is not supported by evidence, explicitly say:
"No evidence found."

For every finding, explain WHY you reached that conclusion.

Output in Markdown using exactly this format.

# Company Signals

List important business events.

Example:
- Raised Series B
- Hiring AI Engineers
- Expanding to Europe
- Launched new product
- Partnership with Microsoft

If nothing is found write:
"No evidence found."

# Likely Business Priorities

Infer priorities ONLY from the evidence.

Example:

Evidence:
Company hiring 40 engineers.

Inference:
Scaling engineering operations.

Evidence:
Launching in Europe.

Inference:
Localization and multilingual support.

Each priority must contain:

- Priority
- Supporting evidence
- Confidence (High / Medium / Low)

If there is insufficient evidence write:
"No evidence found."

# AI Automation Opportunities

Suggest opportunities ONLY if supported by evidence.

For each opportunity include:

- Opportunity
- Why it makes sense
- Supporting evidence

Example:

Opportunity:
AI Customer Support Assistant

Reason:
Company expanding internationally.

Evidence:
Article announcing expansion into Europe.

If no opportunities are supported by evidence write:
"No evidence found."

# Risks / Challenges

Only mention challenges directly supported by the provided information.

Do NOT invent challenges.

If none exist write:

"No evidence found."

# Executive Summary

Write a concise 5-10 sentence summary describing:

- What the company appears to be focusing on
- Its current business momentum
- Where AI automation could realistically provide value

Base everything ONLY on the supplied evidence.
"""

    response = llm.invoke(prompt)

    return {
        "final_summary": response.content
    }
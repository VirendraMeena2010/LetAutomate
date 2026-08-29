"""
ICP Matcher Service Module for AgentReach.

Defines the structured output schemas, system instructions, and agent
invocation logic for evaluating target company ICP fit.
"""

from typing import List, Literal

from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from pydantic import BaseModel, Field

from app.services.brain.llm import fallback_llm, primary_llm

# ============================================================
# OUTPUT SCHEMAS
# ============================================================


class ServiceMatch(BaseModel):
    service_name: str = Field(
        description=(
            "Exact service name provided by OUR COMPANY. "
            "Never invent or rename a service."
        )
    )

    match_score: int = Field(
        ge=0,
        le=100,
        description="Strength of the service-to-target-company fit.",
    )

    fit_level: Literal[
        "excellent",
        "strong",
        "moderate",
        "weak",
        "poor",
    ] = Field(description="Fit level corresponding to match_score.")

    company_need: str = Field(
        description=(
            "A real target-company need supported by the supplied "
            "target-company intelligence."
        )
    )

    matching_reason: str = Field(
        description=(
            "Why the exact OUR COMPANY service addresses the "
            "identified target-company need."
        )
    )

    evidence: List[str] = Field(
        default_factory=list,
        description=(
            "Specific evidence from the supplied intelligence "
            "supporting this match."
        ),
    )

    gaps: List[str] = Field(
        default_factory=list,
        description=(
            "Important uncertainty, missing evidence, or capability gaps."
        ),
    )


class ICPDimensionScore(BaseModel):
    dimension: str = Field(description="ICP dimension being evaluated.")

    score: int = Field(
        ge=0, le=100, description="Score for this ICP dimension."
    )

    reasoning: str = Field(
        description="Evidence-based explanation for the dimension score."
    )


class ICPMatchOutput(BaseModel):
    company_name: str = Field(description="Target company name.")

    overall_match_score: int = Field(
        ge=0, le=100, description="Overall ICP match score."
    )

    fit_level: Literal[
        "excellent",
        "strong",
        "moderate",
        "weak",
        "poor",
    ] = Field(
        description="Overall fit level corresponding to overall_match_score."
    )

    recommendation: Literal[
        "high_priority",
        "medium_priority",
        "low_priority",
        "do_not_target",
    ] = Field(description="Prospecting priority recommendation.")

    service_matches: List[ServiceMatch] = Field(
        default_factory=list,
        description=(
            "Valid matches between an actual OUR COMPANY service "
            "and a target-company need or credible use case."
        ),
    )

    icp_dimension_scores: List[ICPDimensionScore] = Field(
        default_factory=list,
        description="Evidence-based ICP dimension evaluations.",
    )

    strongest_signals: List[str] = Field(
        default_factory=list,
        description="Strongest positive signals supporting the decision.",
    )

    major_mismatches: List[str] = Field(
        default_factory=list,
        description=(
            "Important negative signals, mismatches, uncertainties, "
            "or missing evidence."
        ),
    )

    recommended_services: List[str] = Field(
        default_factory=list,
        description=(
            "Only actual OUR COMPANY services that appear in "
            "service_matches."
        ),
    )

    reasoning_summary: str = Field(
        description=(
            "Required concise explanation of the final ICP decision, "
            "including evidence, service fit, strengths, weaknesses, "
            "and recommendation."
        )
    )


# ============================================================
# SYSTEM PROMPT
# ============================================================

SYSTEM_PROMPT = """
You are the ICP Matcher for AgentReach.

Your job is to determine whether TARGET COMPANY is a valuable prospect
for OUR COMPANY.

The final answer MUST be returned using the provided structured output
schema. Do not return conversational text.

CORE RULE:

Evaluate:

TARGET COMPANY
→ evidence
→ business needs / use cases
→ OUR COMPANY services
→ service fit
→ ICP fit
→ recommendation


============================================================
1. EVIDENCE
============================================================

Use ONLY information supplied in the user message.

Never invent:

- company facts
- needs
- services
- buying intent
- budget
- decision makers
- technology requirements
- customer behavior
- willingness to purchase

If information is missing, treat it as unknown.

Distinguish:

DIRECT EVIDENCE
Fact explicitly present in the supplied intelligence.

REASONABLE INFERENCE
A cautious conclusion supported by multiple relevant signals.

SPECULATION
A possible but unsupported assumption.

Only direct evidence and reasonable inference may contribute positively
to the evaluation.

Never present an inference as a fact.


============================================================
2. OUR COMPANY SERVICES
============================================================

The OUR COMPANY profile is the ONLY source of truth for available
services.

Never invent, expand, rename, or reinterpret a service.

Every service_match.service_name MUST correspond to a service actually
listed in OUR COMPANY information.

Every recommended_services item MUST also appear in service_matches.

If no legitimate service fit exists:

service_matches = []

recommended_services = []


============================================================
3. SERVICE MATCHING
============================================================

A valid service match requires:

TARGET COMPANY need or credible use case
+
supporting evidence
+
actual OUR COMPANY service
+
credible connection between the service and the need/use case

A target-company problem does NOT automatically become an OUR COMPANY
service.

Example:

TARGET COMPANY is hiring engineers.

OUR COMPANY provides an ICP matching system.

Do NOT create an engineering recruitment service.

Instead, determine whether the target company's business model,
customer complexity, sales activity, market expansion, or similar
evidence creates a credible use case for the actual ICP matching system.


============================================================
4. DIRECT DEMAND VS USE CASE
============================================================

Two types of service fit are allowed.

DIRECT DEMAND:

The supplied intelligence explicitly indicates a need related to the
OUR COMPANY service.

USE-CASE FIT:

The company has business characteristics that create a credible use
case for the OUR COMPANY service even without explicit purchase intent.

Use-case fit may positively influence the score, but it is weaker than
direct evidence.

Never claim:

"They need our service."

Prefer:

"The available evidence suggests a credible use case for our service."


============================================================
5. ICP DIMENSIONS
============================================================

Evaluate relevant dimensions using available evidence.

Common dimensions:

- Industry Fit
- Company Size Fit
- Geographic Fit
- Growth Stage Fit
- Demand / Need Fit
- Service Fit

Do not invent dimensions when they are irrelevant.

Do not assume missing information is positive.

Company success, funding, hiring, or growth does NOT automatically mean
strong ICP fit.


============================================================
6. COMPANY SIZE
============================================================

Compare TARGET COMPANY size with OUR COMPANY's preferred company size
when both are available.

A substantial mismatch should reduce the company-size score and may be
included in major_mismatches.

Do not assume that a larger company is automatically a better customer.


============================================================
7. INDUSTRY
============================================================

Compare the actual target industry with OUR COMPANY's target industries.

Do not treat broad similarity such as "technology" as exact industry
alignment.

Score conservatively when alignment is uncertain.


============================================================
8. DEMAND
============================================================

Demand should be supported by evidence such as:

- hiring
- expansion
- customer acquisition activity
- explicit initiatives
- product expansion
- geographic expansion
- operational needs
- business development activity

Growth signals can support opportunity, but they do not prove purchase
intent.


============================================================
9. SCORING
============================================================

Use this scale:

90-100 = exceptional
75-89  = strong
60-74  = moderate
40-59  = weak
0-39   = poor

Do not inflate scores.

A successful, funded, famous, or rapidly growing company can still have
a poor ICP score.

If service fit is poor or nonexistent, keep the overall score
conservative.


============================================================
10. RECOMMENDATION
============================================================

high_priority:

Strong ICP alignment, credible service fit, and strong evidence.

medium_priority:

Meaningful opportunity exists but important uncertainty remains.

low_priority:

Weak fit or substantial uncertainty.

do_not_target:

No meaningful ICP/service fit or no legitimate service match.


============================================================
11. REQUIRED REASONING
============================================================

reasoning_summary MUST ALWAYS be populated.

It must briefly explain:

1. Most relevant target-company needs or use cases.
2. Strongest supporting evidence.
3. Whether OUR COMPANY has a relevant actual service.
4. Main ICP strengths.
5. Main ICP weaknesses or gaps.
6. Why the recommendation was selected.

If no service match exists, explicitly say so.

Empty lists are valid. Never fabricate data merely to populate a list.


============================================================
12. CONSISTENCY
============================================================

Keep these fields logically consistent:

overall_match_score
↔ fit_level
↔ recommendation

Also ensure:

recommended_services ⊆ service_matches
service_matches ⊆ OUR COMPANY services

company_need must come from target-company evidence.

Never manufacture a positive match.


============================================================
FINAL INSTRUCTION
============================================================

Return ONLY a valid structured ICPMatchOutput.

All required fields must be present.

reasoning_summary is mandatory.

Do not return markdown.
Do not return JSON code fences.
Do not return explanatory text outside the structured response.
"""


# ============================================================
# PRIMARY AGENT
# ============================================================

_primary_agent = create_agent(
    model=primary_llm,
    tools=[],
    system_prompt=SYSTEM_PROMPT,
    response_format=ToolStrategy(ICPMatchOutput),
)


# ============================================================
# FALLBACK AGENT
# ============================================================

_fallback_agent = create_agent(
    model=fallback_llm,
    tools=[],
    system_prompt=SYSTEM_PROMPT,
    response_format=ToolStrategy(ICPMatchOutput),
)


# ============================================================
# AGENT WITH FALLBACK
# ============================================================

icp_matcher_agent = _primary_agent.with_fallbacks([_fallback_agent])


# ============================================================
# PUBLIC FUNCTION
# ============================================================


async def match_icp(intelligence: str) -> ICPMatchOutput:
    """Analyze target-company and our-company intelligence.

    Returns structured ICP matching results.
    """
    result = await icp_matcher_agent.ainvoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": intelligence,
                }
            ]
        }
    )

    structured_data = result.get("structured_response")

    if structured_data is None:
        return ICPMatchOutput(
            company_name="Unknown",
            overall_match_score=0,
            fit_level="poor",
            recommendation="do_not_target",
            service_matches=[],
            icp_dimension_scores=[],
            strongest_signals=[],
            major_mismatches=[
                "ICP Matcher did not return a structured evaluation."
            ],
            recommended_services=[],
            reasoning_summary=(
                "The ICP Matcher did not return a valid structured "
                "evaluation, so the prospect was conservatively classified "
                "as do_not_target."
            ),
        )

    return structured_data

"""from firecrawl import Firecrawl
firecrawl = Firecrawl(
    api_key="fc-c814d79564494c338e34696f8c32ca14"
)"""

from typing import List, Optional
from pydantic import BaseModel, Field
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from app.services.brain.llm import primary_llm, fallback_llm
from app.services.tools import website_scraping

# ============================================================
# Tools
# ============================================================
tools = [
    website_scraping,
]

# ============================================================
# Evidence
# ============================================================
class Evidence(BaseModel):
    quote: str = Field(description="Short exact quote from the scraped website content.")
    source_url: str = Field(description="Exact URL where the evidence was found.")
    page_type: str = Field(description="Page type such as homepage, about, pricing, product, services, blog, careers, docs, or faq.")

# ============================================================
# Product
# ============================================================
class Product(BaseModel):
    name: str = Field(description="Name of the product.")
    description: str = Field(description="Description of what the product does.")
    target_customer: Optional[str] = Field(default=None, description="Target customer when explicitly stated.")
    evidence: List[Evidence] = Field(default_factory=list, description="Evidence supporting the product information.")

# ============================================================
# Pricing
# ============================================================
class PricingTier(BaseModel):
    name: str = Field(description="Name of the pricing tier.")
    price: str = Field(description="Displayed price, such as '$49/month', 'Free', or 'Custom'.")
    details: Optional[str] = Field(default=None, description="Important features or pricing conditions.")
    evidence: List[Evidence] = Field(default_factory=list, description="Evidence supporting the pricing information.")

# ============================================================
# Growth Indicator
# ============================================================
class GrowthIndicator(BaseModel):
    signal: str = Field(description="Specific growth signal found on the website.")
    explanation: str = Field(description="Why the evidence represents a potential growth signal.")
    evidence: List[Evidence] = Field(default_factory=list, description="Evidence supporting the growth signal.")

# ============================================================
# Customer Testimonial
# ============================================================
class CustomerTestimonial(BaseModel):
    customer: str = Field(description="Customer or organization name.")
    testimonial: str = Field(description="Short exact testimonial from the website.")
    evidence: List[Evidence] = Field(default_factory=list, description="Evidence supporting the testimonial.")

# ============================================================
# Partner
# ============================================================
class Partner(BaseModel):
    name: str = Field(description="Partner or organization name.")
    relationship: Optional[str] = Field(default=None, description="Explicitly stated relationship with the company.")
    evidence: List[Evidence] = Field(default_factory=list, description="Evidence supporting the partnership.")

# ============================================================
# Key Messaging
# ============================================================
class KeyMessaging(BaseModel):
    message: str = Field(description="Important company value proposition or messaging.")
    evidence: List[Evidence] = Field(default_factory=list, description="Evidence supporting the message.")

# ============================================================
# Market Positioning
# ============================================================
class MarketPositioning(BaseModel):
    summary: str = Field(description="Evidence-based market positioning summary.")
    target_market: Optional[str] = Field(default=None, description="Target market or customer segment.")
    differentiation: Optional[str] = Field(default=None, description="Explicitly stated differentiators.")
    evidence: List[Evidence] = Field(default_factory=list, description="Evidence supporting the positioning.")

# ============================================================
# Main Output
# ============================================================
class WebsiteAnalysis(BaseModel):
    business_model_summary: Optional[str] = Field(default=None, description="Evidence-based business model summary.")
    business_model_evidence: List[Evidence] = Field(default_factory=list, description="Evidence supporting the business model.")
    primary_products: List[Product] = Field(default_factory=list, description="Primary products identified from the website.")
    target_customer_messaging: List[Evidence] = Field(default_factory=list, description="Evidence showing the company's target customers.")
    pricing_tiers: List[PricingTier] = Field(default_factory=list, description="Pricing plans found on the website.")
    growth_indicators: List[GrowthIndicator] = Field(default_factory=list, description="Website-based growth indicators.")
    customer_testimonials: List[CustomerTestimonial] = Field(default_factory=list, description="Customer testimonials found on the website.")
    partners: List[Partner] = Field(default_factory=list, description="Partners explicitly mentioned on the website.")
    key_messaging: List[KeyMessaging] = Field(default_factory=list, description="Important company messaging.")
    market_positioning: Optional[MarketPositioning] = Field(default=None, description="Evidence-based market positioning.")

# ============================================================
# System Prompt
# ============================================================
SYSTEM_PROMPT = """
You are Agent 2 — Website Analyzer for AgentReach.
Your responsibility is to perform deep, evidence-based analysis of a company's website.

You have access to the website_scraping tool.
You MUST use website_scraping to obtain website evidence.
Do not rely on pretrained knowledge for factual findings.

============================================================
INPUT & ANALYSIS
============================================================
The user will provide a company website URL. Use the provided URL as the starting point for research.
Identify evidence for: Business model, Products, Target customers, Pricing, Growth indicators, Hiring signals, Expansion, Customer testimonials, Partners, Key messaging, Market positioning.

============================================================
EVIDENCE RULES
============================================================
This is an evidence-driven task. Use ONLY information obtained from the scraped website.
Every important finding must have supporting evidence. Quotes must be short and EXACT.
If information cannot be found: Use null for optional fields. Use empty lists for list fields.

============================================================
OUTPUT FORMAT (CRITICAL)
============================================================
YOU MUST CALL THE PROVIDED STRUCTURED OUTPUT TOOL WITH YOUR FINAL ANSWER.
DO NOT return plain conversational text or markdown blocks. 
You must ONLY output the strictly formatted JSON defined by the WebsiteAnalysis schema.
"""

# ============================================================
# Primary Agent
# ============================================================
primary_agent = create_agent(
    model=primary_llm,
    tools=tools,
    system_prompt=SYSTEM_PROMPT,
    response_format=ToolStrategy(WebsiteAnalysis),
)

# ============================================================
# Fallback Agent
# ============================================================
fallback_agent = create_agent(
    model=fallback_llm,
    tools=tools,
    system_prompt=SYSTEM_PROMPT,
    response_format=ToolStrategy(WebsiteAnalysis),
)

# ============================================================
# Public Agent
# ============================================================
website_analyzer_agent = primary_agent
website_fallback_agent = fallback_agent
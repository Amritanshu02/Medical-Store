from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .recommender import suggest_alternatives
from .schemas import SuggestionRequest, SuggestionResponse

app = FastAPI(
    title="Medical Store AI Alternatives",
    description="Suggests in-stock alternative medicines using TF-IDF cosine similarity.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-alternatives"}


@app.post("/suggest-alternatives", response_model=SuggestionResponse)
def suggest(request: SuggestionRequest) -> SuggestionResponse:
    return suggest_alternatives(request)

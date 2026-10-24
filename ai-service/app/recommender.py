from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .schemas import Alternative, MedicineItem, SuggestionGroup, SuggestionRequest, SuggestionResponse

MODEL_NAME = "tfidf-cosine-composition-v1"


def _text(item: MedicineItem) -> str:
    parts = [
        item.name or "",
        item.brand or "",
        item.composition or "",
        item.description or "",
        (item.substitutes or "").replace(",", " "),
    ]
    return " ".join(part.strip() for part in parts if part).lower()


def _matches_query(item: MedicineItem, query: str) -> bool:
    q = query.lower().strip()
    haystack = " ".join(
        filter(None, [item.name, item.brand, item.composition, item.description, item.substitutes])
    ).lower()
    return q in haystack


def _reason(source: MedicineItem, candidate: MedicineItem, score: float) -> str:
    if source.composition and candidate.composition:
        source_comp = source.composition.lower()
        candidate_comp = candidate.composition.lower()
        if source_comp and (source_comp in candidate_comp or candidate_comp in source_comp):
            return f"Same salt/composition as {source.name}: {candidate.composition}"
    if source.substitutes:
        names = [part.strip().lower() for part in source.substitutes.split(",") if part.strip()]
        if candidate.name and candidate.name.lower() in names:
            return f"Listed substitute for {source.name}"
    if score >= 0.45:
        return f"Similar active ingredients and use-case to {source.name}"
    return f"Closest in-stock match for {source.name}"


def _suggest_for(source: MedicineItem, available: list[MedicineItem], top_k: int) -> list[Alternative]:
    candidates = [item for item in available if item.id != source.id and item.name.lower() != source.name.lower()]
    if not candidates:
        return []

    documents = [_text(source)] + [_text(item) for item in candidates]
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
    matrix = vectorizer.fit_transform(documents)
    scores = cosine_similarity(matrix[0:1], matrix[1:]).flatten()

    ranked = sorted(zip(candidates, scores), key=lambda pair: pair[1], reverse=True)
    alternatives: list[Alternative] = []
    for item, score in ranked[:top_k]:
        if score <= 0:
            continue
        alternatives.append(
            Alternative(
                id=item.id,
                name=item.name,
                brand=item.brand,
                composition=item.composition,
                description=item.description,
                price=item.price,
                available=item.available,
                score=round(float(score), 4),
                reason=_reason(source, item, float(score)),
            )
        )
    return alternatives


def suggest_alternatives(request: SuggestionRequest) -> SuggestionResponse:
    catalog = request.catalog
    available = [item for item in catalog if item.available]
    groups: list[SuggestionGroup] = []
    seen_ids: set[str] = set()

    def add_group(source: MedicineItem, query: str | None = None):
        key = source.id or f"{source.name}|{source.brand}"
        if key in seen_ids:
            return
        seen_ids.add(key)
        groups.append(
            SuggestionGroup(
                for_medicine=source.name,
                for_query=query,
                out_of_stock=not source.available,
                alternatives=_suggest_for(source, available, request.top_k),
            )
        )

    if request.medicine:
        add_group(request.medicine, request.query)

    if request.query:
        matches = [item for item in catalog if _matches_query(item, request.query)]
        unavailable_matches = [item for item in matches if not item.available]
        for item in unavailable_matches:
            add_group(item, request.query)

        if not unavailable_matches and not request.medicine and matches:
            # Query matched in-stock items only; still offer related options for the search term.
            synthetic = MedicineItem(
                name=request.query,
                composition=request.query,
                description=request.query,
                available=False,
            )
            groups.append(
                SuggestionGroup(
                    for_medicine=None,
                    for_query=request.query,
                    out_of_stock=False,
                    alternatives=_suggest_for(synthetic, available, request.top_k),
                )
            )

    if not groups and request.query:
        synthetic = MedicineItem(
            name=request.query,
            composition=request.query,
            description=request.query,
            available=False,
        )
        groups.append(
            SuggestionGroup(
                for_medicine=None,
                for_query=request.query,
                out_of_stock=True,
                alternatives=_suggest_for(synthetic, available, request.top_k),
            )
        )

    return SuggestionResponse(groups=groups, model=MODEL_NAME)

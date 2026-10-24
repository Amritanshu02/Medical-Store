from app.recommender import suggest_alternatives
from app.schemas import MedicineItem, SuggestionRequest


CATALOG = [
    MedicineItem(
        id="1",
        name="Dolo 650",
        brand="Micro Labs",
        composition="Paracetamol 650mg",
        description="Fever and pain",
        available=False,
        price=30,
        substitutes="Crocin 650, Calpol 650",
    ),
    MedicineItem(
        id="2",
        name="Crocin 650",
        brand="GSK",
        composition="Paracetamol 650mg",
        description="Fever tablet",
        available=True,
        price=32.5,
    ),
    MedicineItem(
        id="3",
        name="Azee 500",
        brand="Cipla",
        composition="Azithromycin 500mg",
        description="Antibiotic",
        available=True,
        price=108,
    ),
]


def test_suggests_paracetamol_alternative_for_out_of_stock_dolo():
    response = suggest_alternatives(
        SuggestionRequest(medicine=CATALOG[0], catalog=CATALOG, top_k=3)
    )
    assert response.groups
    names = [alt.name for alt in response.groups[0].alternatives]
    assert "Crocin 650" in names
    assert "Dolo 650" not in names


def test_search_query_finds_unavailable_and_suggests_stocked_match():
    response = suggest_alternatives(
        SuggestionRequest(query="dolo", catalog=CATALOG, top_k=3)
    )
    assert response.groups[0].for_medicine == "Dolo 650"
    assert response.groups[0].out_of_stock is True
    assert any(alt.name == "Crocin 650" for alt in response.groups[0].alternatives)

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_suggest_alternatives_endpoint():
    payload = {
        "query": "dolo",
        "catalog": [
            {
                "id": "1",
                "name": "Dolo 650",
                "brand": "Micro Labs",
                "composition": "Paracetamol 650mg",
                "available": False,
                "price": 30,
            },
            {
                "id": "2",
                "name": "Crocin 650",
                "brand": "GSK",
                "composition": "Paracetamol 650mg",
                "available": True,
                "price": 32.5,
            },
        ],
        "top_k": 3,
    }
    response = client.post("/suggest-alternatives", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["groups"]
    names = [alt["name"] for alt in body["groups"][0]["alternatives"]]
    assert "Crocin 650" in names

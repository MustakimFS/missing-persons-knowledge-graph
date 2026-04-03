from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from rdflib import Graph, Namespace, RDF
from urllib.parse import unquote
import re

MPR = Namespace("http://www.semanticweb.org/ser531/ontologies/MissingPersonReport#")
RDFS = Namespace("http://www.w3.org/2000/01/rdf-schema#")

g = Graph()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading RDF graph...")
    g.parse("data/result-triples.ttl", format="turtle")
    print(f"Loaded {len(g)} triples")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_local(uri):
    val = str(uri).split("#")[-1]
    return unquote(val)

def parse_victim(subj):
    def get(pred):
        for o in g.objects(subj, pred):
            return extract_local(o) if str(o).startswith("http") else str(o)
        return ""

    coords = get(RDFS.Coordinates)
    lat, lng = "", ""
    if coords and "," in coords:
        parts = coords.split(",")
        lat, lng = parts[0].strip(), parts[1].strip()

    image = get(MPR.hasImageURL)
    if image == "Error":
        image = ""

    return {
        "id": extract_local(subj),
        "name": get(RDFS.Legal_Name),
        "city": get(RDFS.hasCityOfOrigin),
        "county": get(RDFS.hasCountyOfOrigin),
        "age": get(RDFS.Missing_Age),
        "sex": get(RDFS.Bio_Sex),
        "race": get(RDFS.Race_Ethnicity),
        "dlc": get(RDFS.DLC),
        "case_number": get(RDFS.Case_Number),
        "circumstance": get(MPR.hasCircumstanceOfDisappearance),
        "namus_url": next((str(o) for o in g.objects(subj, MPR.columnURI)), ""),
        "image_url": image,
        "lat": lat,
        "lng": lng,
    }

@app.get("/cases")
def get_all_cases(
    name: str = Query(default=""),
    city: str = Query(default=""),
    county: str = Query(default=""),
    sex: str = Query(default=""),
    race: str = Query(default=""),
    min_age: int = Query(default=0),
    max_age: int = Query(default=120),
    page: int = Query(default=1),
    limit: int = Query(default=50),
):
    results = []
    for subj in g.subjects(RDF.type, MPR.Victim):
        v = parse_victim(subj)

        if name and name.lower() not in v["name"].lower():
            continue
        if city and city.lower() not in v["city"].lower():
            continue
        if county and county.lower() not in v["county"].lower():
            continue
        if sex and sex.lower() != v["sex"].lower():
            continue
        if race and race.lower() not in v["race"].lower():
            continue
        try:
            age = int(v["age"])
            if not (min_age <= age <= max_age):
                continue
        except:
            pass

        results.append(v)

    total = len(results)
    start = (page - 1) * limit
    end = start + limit

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "cases": results[start:end]
    }

@app.get("/cases/{case_id}")
def get_case(case_id: str):
    for subj in g.subjects(RDF.type, MPR.Victim):
        if extract_local(subj) == case_id:
            return parse_victim(subj)
    return {"error": "Not found"}

@app.get("/stats")
def get_stats():
    victims = list(g.subjects(RDF.type, MPR.Victim))
    sex_counts = {}
    race_counts = {}
    city_counts = {}

    for subj in victims:
        for o in g.objects(subj, RDFS.Bio_Sex):
            k = extract_local(o)
            sex_counts[k] = sex_counts.get(k, 0) + 1
        for o in g.objects(subj, RDFS.Race_Ethnicity):
            k = str(o)
            race_counts[k] = race_counts.get(k, 0) + 1
        for o in g.objects(subj, RDFS.hasCityOfOrigin):
            k = extract_local(o)
            city_counts[k] = city_counts.get(k, 0) + 1

    top_cities = sorted(city_counts.items(), key=lambda x: x[1], reverse=True)[:10]

    return {
        "total": len(victims),
        "by_sex": sex_counts,
        "by_race": race_counts,
        "top_cities": dict(top_cities),
    }
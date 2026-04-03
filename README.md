# Missing Persons Knowledge Graph Tracker

A full-stack web application for tracking and searching missing persons cases in California using Knowledge Graph and Semantic Web technologies.

## Live Demo
https://missing-persons-knowledge-graph.vercel.app

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** FastAPI, Python
- **Knowledge Graph:** RDF/OWL Ontology, RDFLib, SPARQL
- **Data:** NamUs (National Missing and Unidentified Persons System) - 3,559 real cases

## Features
- Search missing persons by name, case ID, city, county, race, sex, and age range
- Detailed case view with photo, demographics, circumstances, and Google Maps location
- Table and card view toggle for search results
- Calculated current age based on date of last contact
- Direct link to official NamUs case page

## Architecture
The data is modeled as an RDF Knowledge Graph using a custom OWL ontology (`protege/`). The FastAPI backend loads the RDF triples at startup and serves SPARQL-style filtered queries via REST endpoints. The React frontend consumes the API and renders results.

## Local Setup

### Backend (FastAPI)
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```
API runs at `http://localhost:8000`
Docs at `http://localhost:8000/docs`

### Frontend (React)
```bash
cd app/client
npm install
npm run dev
```
App runs at `http://localhost:5173`

### Environment Variables
Create `app/client/.env`:
```
VITE_API_URL=http://localhost:8000
```

## Data
The knowledge graph is built from NamUs data for California, Texas, and Alaska. The RDF ontology is located in `protege/` and the compiled triples are in `api/data/result-triples.ttl`.

## Contributors
Originally developed as part of SER531 at Arizona State University.
This repository contains my continued development and enhancements.
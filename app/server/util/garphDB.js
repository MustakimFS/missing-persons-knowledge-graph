const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");

// connection data to the run GraphDB instance
const GRAPHDB_BASE_URL = "http://20.55.43.23:7200/",
      GRAPHDB_REPOSITORY = "SER531-GraphDB-Repo",
      GRAPHDB_USERNAME = "admin",
      GRAPHDB_PASSWORD = "Team@17",
      GRAPHDB_CONTEXT_TEST = "http://20.55.43.23:7200/repositories/SER531-GraphDB-Repo";

const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    EnapsoGraphDBClient.PREFIX_PROTONS,
    {
        prefix: "entest",
        iri: "http://ont.enapso.com/test#",
    },
    {
        prefix: "mpr",
        iri: "http://www.semanticweb.org/ser531/ontologies/MissingPersonReport#"
    }
];

// Create the endpoint instance
const graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
    baseURL: GRAPHDB_BASE_URL,
    repository: GRAPHDB_REPOSITORY,
    prefixes: DEFAULT_PREFIXES,
    transform: 'toJSON'
});

// Connect and authenticate
graphDBEndpoint.login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
    .then((result) => {
        console.log("GraphDB login successful:", result);
    })
    .catch((err) => {
        console.error("GraphDB login failed:", err);
    });

// Export the endpoint for use in other files
module.exports = graphDBEndpoint;

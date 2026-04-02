const graphDBEndpoint = require('../util/garphDB.js');
const { generateSummary } = require('../util/gpt.js');

module.exports.allCases = async (req, res) => {
    try {
        const result = await graphDBEndpoint.query(`
			SELECT *
			WHERE {
				?victim a mpr:Victim;
				rdfs:Legal_Name ?name;
				rdfs:hasCityOfOrigin ?city_of_origin;
				rdfs:hasCountyOfOrigin ?county_of_origin;
				rdfs:Missing_Age ?missing_age;
				rdfs:isOfAge ?age;
				rdfs:Case_Number ?case_number;
				rdfs:Bio_Sex ?sex;
				mpr:hasCircumstanceOfDisappearance ?cod;
				rdfs:Race_Ethnicity ?race;
				rdfs:hasMapData ?map;
				rdfs:Coordinates ?cords;
				rdfs:DLC ?DLC;
				mpr:columnURI ?namUS;
				mpr:hasImageURL ?image.
			}
        `);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports.sidebar = async (req, res) => {
    const {
        victimName,
        city_of_origin,
        county_of_origin,
        missing_age,
        isOfAge,
        Bio_Sex,
        caseID,
        cod,
        Race_Ethnicity,
    } = req.body;

    try {
        let query = `
            SELECT *
            WHERE {
                ?victim a mpr:Victim;
                rdfs:Legal_Name ?name;
                rdfs:hasCityOfOrigin ?city_of_origin;
                rdfs:hasCountyOfOrigin ?county_of_origin;
                rdfs:Missing_Age ?missing_age;
                rdfs:isOfAge ?age;
                rdfs:Case_Number ?case_number;
                rdfs:Bio_Sex ?sex;
                mpr:hasCircumstanceOfDisappearance ?cod;
                rdfs:Race_Ethnicity ?race;
                rdfs:hasMapData ?map;
                rdfs:Coordinates ?cords;
                rdfs:DLC ?DLC;
                mpr:columnURI ?namUS;
                mpr:hasImageURL ?image.`;

        if (victimName) {
            query += `FILTER REGEX(STR(?name), "${(victimName)}", "i") `;
        }
        if (caseID) {
            query += `FILTER REGEX(STR(?case_number), "${encodeURIComponent(caseID)}", "i") `;
        }
        if (city_of_origin) {
            query += `FILTER REGEX(STR(?city_of_origin), "${encodeURIComponent(city_of_origin)}") `;
        }
        if (county_of_origin) {
            query += `FILTER REGEX(STR(?county_of_origin), "${encodeURIComponent(county_of_origin)}") `;
        }
        if (missing_age) {
            console.log(missing_age);
            query += `BIND(xsd:integer(REPLACE(STR(?missing_age), "^.*#", "")) AS ?filter_age) `
            if(missing_age.length == 0){
                query += `FILTER CONTAINS(STR(?missing_age), "")`;
            }
            else{
                query += `FILTER (`;
                for (let i = 0; i < missing_age.length; i++) {
                    const [minAge, maxAge] = missing_age[i];
                    if (i === missing_age.length - 1) {
                        query += `(?filter_age >= ${minAge} && ?filter_age <= ${maxAge}) `;
                    } else {
                        query += `(?filter_age >= ${minAge} && ?filter_age <= ${maxAge}) || `;
                    }
                }
                query += ')';
            }
        }
        
        if (cod) {
            query += `FILTER REGEX(LCASE(STR(?cod)), LCASE("${(cod)}"), "i")`;
            
        }
        if (isOfAge) {
            query += `FILTER REGEX(STR(?age), "") `;
        }
        if (Bio_Sex) {
            query += `FILTER REGEX(STR(?sex), "${encodeURIComponent(Bio_Sex)}") `;
        }
        if (Race_Ethnicity) {
            const racelength = Race_Ethnicity.length;
            if(racelength == 0){
                query += `FILTER CONTAINS(STR(?race), "")`;
            }
            else{
                query += `FILTER (`;
                for (let i = 0; i < racelength; i++) {
                    if (i === racelength - 1) {
                        query += `REGEX ( LCASE(STR(?race)), "\\\\b${Race_Ethnicity[i].toLowerCase()}\\\\b")`;
                    } else {
                        query += `REGEX ( LCASE(STR(?race)), "\\\\b${Race_Ethnicity[i].toLowerCase()}\\\\b") || `;
                    }
                }
                query += ')';
            }
        }
        query += '}';
        console.log(query)
        const result = await graphDBEndpoint.query(query);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch Data' });
    }
};

module.exports.caseView = async (req, res) => {
    const { caseNumber } = req.body;

    try {
        if (caseNumber) {
            const query = `
                SELECT *
                WHERE {
                    ?victim a mpr:Victim;
                    rdfs:Legal_Name ?name;
                    rdfs:hasCityOfOrigin ?city_of_origin;
                    rdfs:hasCountyOfOrigin ?county_of_origin;
                    rdfs:Missing_Age ?missing_age;
                    rdfs:isOfAge ?age;
                    rdfs:Case_Number ?case_number;
                    rdfs:Bio_Sex ?sex;
                    mpr:hasCircumstanceOfDisappearance ?cod;
                    rdfs:Race_Ethnicity ?race;
                    rdfs:hasMapData ?map;
                    rdfs:Coordinates ?cords;
                    rdfs:DLC ?DLC;
                    mpr:columnURI ?namUS;
                    mpr:hasImageURL ?image.
                    FILTER REGEX(STR(?case_number), "${caseNumber}")
                }
            `;
            const result = await graphDBEndpoint.query(query);

            res.status(200).json(result);
        } else {
            console.log("Case Number not provided, skipping query.");
            res.status(400).json({ error: 'CaseNumber is required' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.aiSummary = async (req, res) => {
    try {
        const jsonData = req.body;
        const summary = await generateSummary(jsonData);

        res.status(200).json({ summary });
    } catch (error) {
        console.error('Error in AI Summary endpoint:', error.message || error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
};
import pandas as pd
import re

NAMUS_CSV_PATH_CA = "../../input/EntireCaliforniaFinal.csv"

NAMUS_CSV_PATH_AK = "../../input/EntireAlaskaFinal.csv"

NAMUS_CSV_PATH_TX = "../../input/EntireTexasFinal.csv"


def cleanup_age(age_string):
    if age_string == "Missing Age":
        return None
    elif isinstance(age_string, str) and "< 1 Year" in age_string:
        return 0
    elif isinstance(age_string, str) and ("Years" in age_string or "Year" in age_string):
        return int(age_string.split()[0])
    else:
        return age_string


def place_urls(mp_string):
    mp_string = re.search(r"\d+", mp_string).group(0)

    url = "https://www.namus.gov/MissingPersons/Case#/" + mp_string + "?nav"
    return url


def write_to_csv(file, state):
    df = pd.read_csv(file)
    df = df[df.columns[:17]]

    df.iloc[:, 4] = df.iloc[:, 4].apply(cleanup_age)
    if state != "cali":
        df.iloc[:, 12] = df.iloc[:, 12].apply(cleanup_age)
    else:
        df.iloc[:, 11] = df.iloc[:, 11].apply(cleanup_age)
    df['Legal Name'] = df['Legal First Name'] + " " + df['Legal Last Name']
    df = df.drop(columns=['Legal Last Name', 'Legal First Name'])
    col = df.pop('Legal Name')
    df.insert(2, 'Legal Name', col)
    df = df.drop(columns=['State', 'Height', 'Weight', 'Date Modified'])
    df['URL'] = df.iloc[:, 0].apply(place_urls)
    df['DLC'] = pd.to_datetime(df['DLC'], format='%m/%d/%Y').dt.strftime('%Y-%m-%d')
    df.insert(0, 'Victim_ID', range(len(df)))

    output_csv_file = "../../output/cleaned_up_"+state+".csv"
    df.to_csv(output_csv_file, index=False)


if __name__ == "__main__":
    write_to_csv(NAMUS_CSV_PATH_CA, "cali")
    write_to_csv(NAMUS_CSV_PATH_AK, "alaska")
    write_to_csv(NAMUS_CSV_PATH_TX, "texas")

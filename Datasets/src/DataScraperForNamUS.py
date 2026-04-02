import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

csv_path = 'change_it_accordingly'
data = pd.read_csv(csv_path)

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
wait = WebDriverWait(driver, 10)

current_ages, heights, weights, biological_sex = [], [], [], []
map_data, lat_long, circumstances = [], [], []
hair_colors, left_eye_colors, right_eye_colors, eye_description, body_marks, tattoos, clothing_desc = [], [], [], [], [], [], []

for idx, case_number in enumerate(data['Case Number']):
    try:
        case_number_numeric = case_number[2:]

        url = f"https://www.namus.gov/MissingPersons/Case#/{case_number_numeric}?nav"
        driver.get(url)

        wait.until(EC.presence_of_element_located((By.ID, "summary")))

        try:
            current_age = driver.find_element(By.XPATH,
                                              "//div[@id='Demographics']//span[text()='Current Age']/parent::div").text.replace(
                "Current Age", "").strip()
            current_ages.append(current_age)
        except:
            current_ages.append("N/A")

        try:
            height = driver.find_element(By.XPATH,
                                         "//div[@id='Demographics']//span[text()='Height']/parent::div").text.replace(
                "Height", "").strip()
            heights.append(height)
        except:
            heights.append("N/A")

        try:
            weight = driver.find_element(By.XPATH,
                                         "//div[@id='Demographics']//span[text()='Weight']/parent::div").text.replace(
                "Weight", "").strip()
            weights.append(weight)
        except:
            weights.append("N/A")

        try:
            sex = driver.find_element(By.XPATH,
                                      "//div[@id='Demographics']//span[text()='Biological Sex']/parent::div").text.replace(
                "Biological Sex", "").strip()
            biological_sex.append(sex)
        except:
            biological_sex.append("N/A")

        try:
            circumstance_desc = driver.find_element(By.XPATH, "//div[@id='Circumstances']//span[text()='Circumstances of Disappearance']/following-sibling::span").text
            circumstances.append(circumstance_desc)
        except:
            circumstances.append("N/A")

        try:
            map_link = driver.find_element(By.CSS_SELECTOR, "div#Circumstances .icon-text-link")
            map_data_text = map_link.get_attribute('href')
            lat_long_text = map_data_text.split('/')[-1]
            map_data.append(map_data_text)
            lat_long.append(lat_long_text)
        except:
            map_data.append("Map data not found")
            lat_long.append("Latitude/Longitude not found")

        try:
            hair_color = driver.find_element(By.XPATH, "//div[@id='PhysicalDescription']//span[text()='Hair Color']/parent::div").text.replace("Hair Color", "").strip()
            hair_colors.append(hair_color)
        except:
            hair_colors.append("N/A")

        try:
            left_eye_color = driver.find_element(By.XPATH, "//div[@id='PhysicalDescription']//span[text()='Left Eye Color']/following-sibling::span").text
            left_eye_colors.append(left_eye_color)
        except:
            left_eye_colors.append("N/A")

        try:
            right_eye_color = driver.find_element(By.XPATH, "//div[@id='PhysicalDescription']//span[text()='Right Eye Color']/following-sibling::span").text
            right_eye_colors.append(right_eye_color)
        except:
            right_eye_colors.append("N/A")

        try:
            eye_desc = driver.find_element(By.XPATH, "//div[@id='PhysicalDescription']//span[text()='Eye Description']/following-sibling::span").text
            eye_description.append(eye_desc)
        except:
            eye_description.append("N/A")

        try:
            features = driver.find_elements(By.XPATH, "//div[@id='PhysicalDescription']//div[@class='card-small']")
            marks = []
            tattoos_list = []
            for feature in features:
                item_type = feature.find_element(By.XPATH, ".//div[contains(@class, 'small-3') and (text()='Scar/mark' or text()='Tattoo')]").text
                description = feature.find_element(By.XPATH, ".//div[contains(@class, 'large-7')]").text
                if 'Scar/mark' in item_type:
                    marks.append(description)
                elif 'Tattoo' in item_type:
                    tattoos_list.append(description)
            body_marks.append("; ".join(marks) if marks else "N/A")
            tattoos.append("; ".join(tattoos_list) if tattoos_list else "N/A")
        except:
            body_marks.append("N/A")
            tattoos.append("N/A")

        try:
            clothing = driver.find_element(By.XPATH, "//div[@id='ClothingAndAccessories']//div[contains(text(), 'Clothing')]/following-sibling::div").text
            clothing_desc.append(clothing)
        except:
            clothing_desc.append("N/A")

    except Exception as e:
        print(f"Error for case {case_number}: {e}")
        current_ages.append("Error")
        heights.append("Error")
        weights.append("Error")
        biological_sex.append("Error")
        map_data.append("Error")
        lat_long.append("Error")
        circumstances.append("Error")
        hair_colors.append("Error")
        left_eye_colors.append("Error")
        right_eye_colors.append("Error")
        eye_description.append("Error")
        body_marks.append("Error")
        tattoos.append("Error")
        clothing_desc.append("Error")

    time.sleep(1)

driver.quit()

data['Current Age'] = current_ages
data['Height'] = heights
data['Weight'] = weights
data['Biological Sex'] = biological_sex
data['Map Data'] = map_data
data['Latitude/Longitude'] = lat_long
data['Circumstances of Disappearance'] = circumstances
data['Hair Color'] = hair_colors
data['Left Eye Color'] = left_eye_colors
data['Right Eye Color'] = right_eye_colors
data['Eye Description'] = eye_description
data['Scar/Mark'] = body_marks
data['Tattoo'] = tattoos
data['Clothing Description'] = clothing_desc

output_path = 'change_it_accordingly'
data.to_csv(output_path, index=False)


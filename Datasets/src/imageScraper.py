import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

csv_path = 'C:/Users/shika/Downloads/cleaned_up_cali.csv'
data = pd.read_csv(csv_path)

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
wait = WebDriverWait(driver, 10)

image_urls = []

for idx, case_number in enumerate(data['Case Number']):
    try:
        case_number_numeric = case_number[2:]

        url = f"https://www.namus.gov/MissingPersons/Case#/{case_number_numeric}?nav"
        driver.get(url)

        wait.until(EC.presence_of_element_located((By.ID, "summary")))

        try:
            image_element = driver.find_element(By.XPATH, "//div[@class='case-summary-image-frame']/img")
            image_url = "https://www.namus.gov" + image_element.get_attribute('ng-src')
            image_urls.append(image_url)
        except:
            image_urls.append("N/A")

    except Exception as e:
        print(f"Error for case {case_number}: {e}")
        image_urls.append("Error")
    time.sleep(1)

driver.quit()

data['Image URL'] = image_urls
data.to_csv(csv_path, index=False)

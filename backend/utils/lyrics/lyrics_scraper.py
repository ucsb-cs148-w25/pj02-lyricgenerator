from selenium.webdriver.chrome.options import Options

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

from selenium.webdriver.common.by import By

import re

def initChromeDriver(options) -> webdriver.Chrome:
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    return driver

class GeniusLyricsScraper:
    def __init__(self, driver=None) -> None:
        if driver is None:
            self.driver = initChromeDriver(self.__getChromeDriverOptions())
        else:
            self.driver = driver
    
    def getLyrics(self, url: str, clean: bool) -> str:
        lyrics = ""
        
        self.driver.get(url)
        
        try:
            containers = self.driver.find_elements(By.CSS_SELECTOR, "[data-lyrics-container='true']")
            for container in containers:
                lyrics += container.text
        except:
            pass
        
        if clean:
            lyrics = self.cleanLyrics(lyrics)
        
        return lyrics

    def cleanLyrics(self, lyrics: str) -> str:
        cleaned = re.sub("\\([^\\)]+\\)", "", lyrics) # clean out ()
        cleaned = re.sub("\\[[^\\]]+\\]", "", cleaned) # clean out []
        
        cleaned = re.sub("\n+", "\n", cleaned) # clean out multiple newlines
        cleaned = cleaned.strip() # remove leading and trailing whitespace
        return cleaned
    
    def __repr__(self) -> str:
        return f"<GeniusLyricsScraper>"
    
    def __del__(self) -> None:
        self.driver.quit()

    def __getChromeDriverOptions(self) -> Options:
        options = Options()
        # options.add_argument("--headless=new") # Cloudflare blocks headless browsers
        options.add_experimental_option("detach", True)
        
        return options

if __name__ == "__main__":
    print(f"{__name__} is being run directly;;test run has started\n##############################################")
    scraper = GeniusLyricsScraper()
    print(scraper.getLyrics("https://genius.com/Lady-gaga-and-bruno-mars-die-with-a-smile-lyrics", True))
    print(scraper.getLyrics("https://genius.com/Eminem-rap-god-lyrics", True))
import pytesseract
import pyautogui
import pygetwindow as gw
import os
import webbrowser
from pathlib import Path
import sys
parent_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(parent_dir))
tesseract_path = os.path.join(parent_dir, "Tesseract-OCR", "tesseract.exe")
pytesseract.pytesseract.tesseract_cmd = tesseract_path

from RepostUtil.walkthrough import walkthrough

MAX_ITERATIONS = 10
print("Welcome to AutoRE!")
chromeWindows = gw.getWindowsWithTitle("Google Chrome")
if len(chromeWindows) == 0:
    webbrowser.open("https://repostexchange.com", new=1, autoraise=True)
else:
    chromeWindows[0].activate()
    pyautogui.hotkey('ctrl', 'n')
    webbrowser.open("https://repostexchange.com", new=1, autoraise=True)
pyautogui.hotkey('f11')
walkthrough(MAX_ITERATIONS)

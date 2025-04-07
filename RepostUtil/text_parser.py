import pyautogui
import pytesseract
from PIL import ImageGrab


def text_parser():
    x, y = pyautogui.position()
    left = x - 100
    top = y - 30
    right = x + 50
    bottom = y + 30

    img = ImageGrab.grab(bbox=(left, top, right, bottom))
    img.show()
    text = pytesseract.image_to_string(img)
    return text.strip()

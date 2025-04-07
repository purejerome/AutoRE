from .locators import locate_items, locate_item
from .text_parser import text_parser
import pyautogui
import time
import pygetwindow as gw
from PIL import Image

def campaigns(max_iterations):
    MAX_BOTTOM_ATTTEMPTS = 3
    iteration = 0
    # campaigns = locate_item("../Images/NavBar/campaigns.png")
    campaigns = locate_item("../Images/InForm/skip1.png", confidence=0.6)
    # campaigns = locate_item("../Images/NavBar/requests.png", 0.5)
    # campaigns = locate_item("../Images/InForm/failed_to_repost.png")
    pyautogui.moveTo(campaigns, duration=0.5)
    # pyautogui.click(campaigns)
    # while iteration < max_iterations:
    #     play_buttons = locate_items("../Images/OutOfForm/play_button.png")
        
    #     if play_buttons == None:
    #         raise Exception("Error locatiing play buttons")
        
    #     for play_button in play_buttons:
    #         y_position = play_button[1]
    #         pyautogui.moveTo(x=play_button[0], y=y_position, duration=0.5)
            
    #         attempts = 0
    #         orange_button = None
    #         while attempts < MAX_BOTTOM_ATTTEMPTS:
    #             pyautogui.click()
    #             time.sleep(6)
    #             orange_button = locate_item("../Images/OutOfForm/orange_repost5.png", 0.1)
                
    #             if orange_button != None:
    #                 break
                
    #             print("Error clicking play button, retrying...")
    #             pyautogui.scroll(-4)
    #             y_position = play_button[1] - 4
    #             pyautogui.moveTo(x=play_button[0], y=y_position, duration=0.5)
    #             attempts += 1
    #             time.sleep(0.3)
                
    #         if orange_button == None or attempts == MAX_BOTTOM_ATTTEMPTS:
    #             raise Exception("Error clicking play button")
            
    #         pyautogui.moveTo(orange_button, duration=0.5)
    #         pyautogui.click()

    #         time.sleep(2)
    #     iteration = 10

def walkthrough(max_camp_iterations):
    campaigns(max_camp_iterations)

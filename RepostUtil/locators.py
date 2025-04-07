import pyautogui
import time
import os
import pygetwindow as gw
import threading
from concurrent.futures import ThreadPoolExecutor, TimeoutError

# time before you can repost is 5 seconds


def locate_items(path, down_time=2, confidence=0.8):
    # Define a maximum number of attempts to avoid an infinite loop
    max_attempts = 10
    attempt = 0
    items = None
    file_name = os.path.basename(path)

    if not os.path.exists(path):
        print(f"Image file \033[36m{file_name}\033[0m does not exist.")
        return None

    print(f"Attempting to locate \033[36m{file_name}\033[0ms...\033[0m")

    # Keep trying until the item is found or the max attempts are reached
    while attempt < max_attempts:
        # Find the position of the item on the screen
        try:
            items = pyautogui.locateAllOnScreen(path, confidence=confidence)
        except:
            print(
                f"Error locating any \033[36m{file_name}\033[0ms, retrying...\033[0m")
            
        if items != None:
            ret_items = list(items)
            item_list_length = len(ret_items)
            print(item_list_length,
                    f"\033[36m{file_name}\033[0ms found\033[0m")
            for i in range(item_list_length):
                ret_items[i] = pyautogui.center(ret_items[i])
            for item in ret_items:
                print(f"Item found at: {item}")
            return ret_items
        
        attempt += 1
        time.sleep(down_time)

    # If the maximum number of attempts is reached without finding the item
    print(
        f"\033[31mNo \033[36m{file_name}\033[31ms found after maximum attempts.\033[0m")
    return items


def locate_item(path, down_time=2, confidence=0.8):
    # Define a maximum number of attempts to avoid an infinite loop
    max_attempts = 10
    attempt = 0
    item = None
    file_name = os.path.basename(path)

    if not os.path.exists(path):
        print(f"Image file \033[36m{file_name}\033[0m does not exist.")
        return None

    print(f"Attempting to locate \033[36m{file_name}\033[0m...\033[0m")
    # Keep trying until the item is found or the max attempts are reached
    while attempt < max_attempts:
        try:
            item = pyautogui.locateOnScreen(path, confidence=confidence)
        except:
            item = None
        
        if item is not None:
            print(f"\033[36m{file_name} found\033[0m")
            return item 
        
        print(f"Error locating \033[36m{file_name}\033[0m, retrying...\033[0m")    
        attempt += 1
        time.sleep(down_time)

    # If the maximum number of attempts is reached without finding the item
    print(
        f"\033[31m\033[36m{file_name}\033[31m not found after maximum attempts.\033[0m")
    return None

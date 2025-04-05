import pyautogui
import time
import pygetwindow as gw
import os
import webbrowser
import subprocess

# time before you can repost is 5 seconds


def locate_items(path):
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
            items = pyautogui.locateAllOnScreen(path)
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
        except:
            print(
                f"Error locating any \033[36m{file_name}\033[0ms, retrying...\033[0m")
            attempt += 1
            time.sleep(2)

        # if item_location:
        #     # If the item is found, move the mouse to its center and click
        #     item_center = pyautogui.center(item_location)
        #     pyautogui.moveTo(item_center, duration=1)
        #     pyautogui.click(item_center)
        #     print("item found and clicked!")
        #     break  # Exit the loop if the item is found and clicked
        # else:
        #     # If the item isn't found, print a message and try again after a short delay
        #     print(f"item not found, attempt {attempt + 1} of {max_attempts}")
        #     attempt += 1
        #     time.sleep(2)  # Wait for 2 seconds before the next attempt

    # If the maximum number of attempts is reached without finding the item
    print(
        f"\033[31mNo \033[36m{file_name}\033[31ms found after maximum attempts.\033[0m")
    return items


def locate_item(path):
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
        # Find the position of the item on the screen
        try:
            item = pyautogui.locateCenterOnScreen(path)
            if item != None:
                print(f"\033[36m{file_name} found\033[0m")
                return item
        except:
            print(
                f"Error locating \033[36m{file_name}\033[0m, retrying...\033[0m")
            attempt += 1
            time.sleep(2)

    # If the maximum number of attempts is reached without finding the item
    print(
        f"\033[31m\033[36m{file_name}\033[31m not found after maximum attempts.\033[0m")
    return item


print("Welcome to AutoRE!")
chromeWindows = gw.getWindowsWithTitle("Google Chrome")
if len(chromeWindows) == 0:
    webbrowser.open("https://repostexchange.com", new=1, autoraise=True)
else:
    chromeWindows[0].activate()
    pyautogui.hotkey('ctrl', 'n')
    webbrowser.open("https://repostexchange.com", new=1, autoraise=True)

# pyautogui.hotkey('ctrl', 'n')
# webbrowser.open("https://repostexchange.com", new=1, autoraise=True)
# print(locate_items("../Images/OutOfForm/play_button.png"))

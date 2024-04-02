import os

folder_path = "./the_griffons_saddlebag"  # Replace with the actual path to your folder

# Iterate over all files in the folder
for file_name in os.listdir(folder_path):
    if file_name.endswith(".txt"):
        txt_file_path = os.path.join(folder_path, file_name)
        jpg_file_path = os.path.join(folder_path, file_name.replace(".txt", ".jpg"))

        # Read the second line from the text file
        with open(txt_file_path, "r") as txt_file:
            lines = txt_file.readlines()
            if len(lines) >= 2:
                new_name = lines[1].strip()

                # Rename the text file
                new_txt_file_path = os.path.join(folder_path, new_name + ".txt")
                os.rename(txt_file_path, new_txt_file_path)

                # Rename the image file
                new_jpg_file_path = os.path.join(folder_path, new_name + ".jpg")
                os.rename(jpg_file_path, new_jpg_file_path)
            else:
                print("Invalid text file:", txt_file_path)

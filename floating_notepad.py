import tkinter as tk

def save_notes():
    with open("notes.txt", "w") as file:
        file.write(text_area.get("1.0", "end"))

def load_notes():
    try:
        with open("notes.txt", "r") as file:
            text_area.insert("1.0", file.read())
    except FileNotFoundError:
        pass

root = tk.Tk()
root.title("Floating Notepad")
root.geometry("300x300")
root.attributes('-topmost', True)

text_area = tk.Text(root, wrap='word', font=("Arial", 12), bg="#fff8b0")  # light yellow
text_area.pack(expand=True, fill='both')

load_notes()

root.protocol("WM_DELETE_WINDOW", lambda: (save_notes(), root.destroy()))
root.attributes('-alpha', 0.95)  # 0.0 (fully transparent) to 1.0 (opaque)


root.mainloop()

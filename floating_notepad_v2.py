import tkinter as tk
import os

# ---------- Functions ----------
def save_notes():
    with open("notes.txt", "w") as file:
        file.write(text_area.get("1.0", "end-1c"))

def load_notes():
    if os.path.exists("notes.txt"):
        with open("notes.txt", "r") as file:
            text_area.insert("1.0", file.read())

def clear_notes():
    text_area.delete("1.0", "end")

def auto_save():
    save_notes()
    root.after(10000, auto_save)  # save every 10 seconds

def on_press(event):
    root.x = event.x
    root.y = event.y

def on_drag(event):
    x = event.x_root - root.x
    y = event.y_root - root.y
    root.geometry(f'+{x}+{y}')

def update_opacity(val):
    root.attributes('-alpha', float(val))

# ---------- Main Window ----------
root = tk.Tk()
root.title("Floating Notepad")
root.geometry("350x400")
#root.overrideredirect(True)  # No title bar
root.attributes('-topmost', True)
root.config(bg="#fefcc2")
root.attributes('-alpha', 0.95)

# ---------- Make draggable ----------
root.bind('<Button-1>', on_press)
root.bind('<B1-Motion>', on_drag)

# ---------- Text Area ----------
text_area = tk.Text(root, wrap='word', font=("Consolas", 12), bg="#fff8b0", fg="#000")
text_area.pack(padx=5, pady=(5, 0), expand=True, fill='both')

# ---------- Button Frame ----------
button_frame = tk.Frame(root, bg="#fefcc2")
button_frame.pack(fill='x', pady=5)

tk.Button(button_frame, text="💾 Save", command=save_notes).pack(side='left', padx=5)
tk.Button(button_frame, text="🧹 Clear", command=clear_notes).pack(side='left')
tk.Button(button_frame, text="❌ Exit", command=lambda: (save_notes(), root.destroy())).pack(side='right', padx=5)

# ---------- Opacity Slider ----------
slider = tk.Scale(root, from_=0.5, to=1.0, resolution=0.05, 
                  orient='horizontal', label="Transparency",
                  command=update_opacity, bg="#fefcc2")
slider.set(0.95)
slider.pack(fill='x', padx=5, pady=(0, 5))

# ---------- Load + Autosave ----------
load_notes()
auto_save()

root.mainloop()

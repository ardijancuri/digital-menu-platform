# Kiosk Auto-Printing Logic

This guide focuses solely on the code required to make the printer work via Buttons and Shortcuts, and how to enable "Silent" Auto-Printing in Chrome.

## 1. The Code (React Logic)

All printing runs through the browser's native `window.print()` command.

### The Function
This function allows us to update the receipt (e.g., set the print time) right before the printer starts.

```javascript
const handlePrint = () => {
  // Optional: Update state here (like a "Printed At" timestamp)
  setDate(new Date().toLocaleString());
  
  // Triggers the browser print dialog
  window.print();
};
```

### The Button Hookup
Connect the function to a standard HTML button.

```javascript
<button onClick={handlePrint}>
  🖨️ Print Receipt
</button>
```

### The Shortcut Hookup (F9 & Ctrl+P)
This listener sits in the background and waits for specific keys.

```javascript
useEffect(() => {
  const handleKeyDown = (event) => {
    // CONDITION 1: F9 Key
    if (event.key === 'F9') {
      handlePrint();
    }
    
    // CONDITION 2: Ctrl + P 
    // We preventDefault() to stop the standard popup so our code handles it
    if (event.ctrlKey && event.key === 'p') {
      event.preventDefault(); 
      handlePrint();
    }
  };

  // Add listener when component mounts
  window.addEventListener('keydown', handleKeyDown);

  // Remove listener when component unmounts
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, []); 
```

---

## 2. The Browser Setup (The "Auto" Part)

By default, `window.print()` opens a "Preview" popup where you have to click "Print" again. **To skip this and print instantly (Kiosk Mode)**, you must configure Chrome.

### How to Enable Auto-Print:

1.  **Stop Chrome**: Close all open Chrome windows.
2.  **Edit Shortcut**:
    *   Find your Chrome shortcut on the Desktop.
    *   Right-click -> **Properties**.
3.  **Add the Flag**:
    *   Look for the **Target** box. It ends with `...chrome.exe"`.
    *   Add a **space**, then type:
        `--kiosk-printing`
    *   *Full example*: `"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk-printing`
4.  **Launch**: Open Chrome using that specific shortcut.

### The Result
Now, whenever your React code calls `window.print()` (via Button or F9), Chrome will silently send the job to the Default Printer immediately.

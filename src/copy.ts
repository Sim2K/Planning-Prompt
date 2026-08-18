export function initCopyButtons(): void {
  const blocks = document.querySelectorAll<HTMLElement>("[data-copy]");
  const status = document.querySelector<HTMLElement>("[data-copy-status]");

  blocks.forEach((block) => {
    const button = block.querySelector<HTMLButtonElement>("[data-copy-button]");
    const source = block.querySelector<HTMLElement>("[data-copy-source]");
    if (!button || !source) return;

    let timer: number | undefined;

    const reset = (): void => {
      button.textContent = "Copy";
      button.classList.remove("is-copied");
    };

    button.addEventListener("click", async () => {
      const text = (source.innerText ?? source.textContent ?? "").trim();
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Copied ✓";
        button.classList.add("is-copied");
        if (status) status.textContent = "Copied to clipboard.";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(source);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        button.textContent = "Press Ctrl+C";
        if (status) status.textContent = "Automatic copy unavailable - the text is selected, press Ctrl+C.";
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(reset, 2200);
    });
  });
}

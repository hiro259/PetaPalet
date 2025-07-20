// このファイルは plasmo が自動で content-script として組み込む
document.addEventListener("copy", () => {
  const text = document.getSelection()?.toString() ?? ""
  if (text.trim().length === 0) return

  chrome.runtime.sendMessage({
    type: "SAVE_CLIP",
    payload: { text, ts: Date.now() }
  })
})


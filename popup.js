document.addEventListener("DOMContentLoaded", () => {
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");
  const saveNoteBtn = document.getElementById("saveNote");
  const notesList = document.getElementById("notesList");

  // Load existing notes on startup
  loadNotes();

  // Save note when button is clicked
  saveNoteBtn.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    // Only save if both title and content are provided
    if (title && content) {
      chrome.storage.sync.get({ notes: [] }, (data) => {
        const notes = data.notes;
        const newNote = {
          id: Date.now(),  // Use timestamp as a unique ID
          title: title,
          content: content
        };
        notes.push(newNote);

        // Save updated notes array to storage
        chrome.storage.sync.set({ notes: notes }, () => {
          // Update the UI with the new note
          addNoteToUI(newNote);
          
          // Clear fields
          noteTitle.value = "";
          noteContent.value = "";
        });
      });
    }
  });

  // Retrieve notes from chrome.storage and add them to the UI
  function loadNotes() {
    chrome.storage.sync.get({ notes: [] }, (data) => {
      const notes = data.notes;
      notesList.innerHTML = "";  // Clear current list
      notes.forEach((note) => {
        addNoteToUI(note);
      });
    });
  }

  // Append a single note to the UI
  function addNoteToUI(note) {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.setAttribute("data-id", note.id);

    noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <pre>${note.content}</pre>
      <button class="deleteNote">Delete</button>
    `;

    notesList.appendChild(noteDiv);

    // Handle delete
    const deleteBtn = noteDiv.querySelector(".deleteNote");
    deleteBtn.addEventListener("click", () => {
      const noteId = noteDiv.getAttribute("data-id");
      removeNote(noteId, noteDiv);
    });
  }

  // Remove note from Chrome storage and from the UI
  function removeNote(noteId, noteDiv) {
    chrome.storage.sync.get({ notes: [] }, (data) => {
      let notes = data.notes;
      notes = notes.filter((n) => n.id != noteId);

      chrome.storage.sync.set({ notes: notes }, () => {
        // Remove from the UI
        noteDiv.remove();
      });
    });
  }
});


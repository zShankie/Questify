import { useState } from "react";
import "./App.css";
import { FaTrash, FaCheck } from "react-icons/fa";

function App() {
  const [quests, setQuests] = useState([]);
  const [filter, setFilter] = useState("todo");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedQuests, setSelectedQuests] = useState([]);

  const handleAddQuest = () => {
    if (!title.trim()) return;
    const newQuest = {
      id: Date.now(),
      title,
      description,
      completed: false,
      completedAt: null,
    };
    setQuests([newQuest, ...quests]);
    setTitle("");
    setDescription("");
  };

  const handleCompleteQuest = (id) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, completed: true, completedAt: new Date().toLocaleString() }
          : q
      )
    );
  };

  const toggleQuestSelection = (id) => {
    setSelectedQuests((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleBulkComplete = () => {
    setQuests((prev) =>
      prev.map((q) =>
        selectedQuests.includes(q.id)
          ? { ...q, completed: true, completedAt: new Date().toLocaleString() }
          : q
      )
    );
    setSelectedQuests([]);
    setMultiSelectMode(false);
  };

  const handleBulkDelete = () => {
    setQuests((prev) => prev.filter((q) => !selectedQuests.includes(q.id)));
    setSelectedQuests([]);
    setMultiSelectMode(false);
  };

  const handleDeleteQuest = (id) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  // helper function: switches tab & clears multi-select
  const switchFilter = (newFilter) => {
    setFilter(newFilter);
    setMultiSelectMode(false);
    setSelectedQuests([]);
  };

  const filteredQuests =
    filter === "todo"
      ? quests.filter((q) => !q.completed)
      : quests.filter((q) => q.completed);

  return (
    <div className="App">
      <h1 className="main-heading">Questify</h1>
      <h2 className="sub-heading">Tap into your Main Character Energy.</h2>

      <div className="quest-wrapper">
        {/* Quest form */}
        <div className="quest-form">
          <div className="input-group">
            <label>Quest Title:</label>
            <input
              type="text"
              placeholder="Next on the agenda..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Quest Objective:</label>
            <input
              type="text"
              placeholder="Quest information..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button onClick={handleAddQuest} className="alpha-button">
            Accept
          </button>
        </div>

        {/* Filters */}
        <div className="quest-filters">
          <button
            onClick={() => switchFilter("todo")}
            className={filter === "todo" ? "active" : ""}
          >
            Active
          </button>
          <button
            onClick={() => switchFilter("completed")}
            className={filter === "completed" ? "active" : ""}
          >
            Completed
          </button>
        </div>

        {/* Bulk actions bar */}
        <div className="bulk-actions">
          <button
            className="bulk-toggle"
            onClick={() => {
              if (multiSelectMode) {
                setSelectedQuests([]);
              }
              setMultiSelectMode(!multiSelectMode);
            }}
          >
            {multiSelectMode ? "Cancel" : "Select"}
          </button>

          {multiSelectMode && (
            <>
              {filter === "todo" && (
                <button className="bulk-complete" onClick={handleBulkComplete}>
                  Complete
                </button>
              )}
              <button className="bulk-delete" onClick={handleBulkDelete}>
                {filter === "todo" ? "Abort" : "Delete"}
              </button>
            </>
          )}
        </div>

        {/* Quest list */}
        <div className="quest-list">
          {filteredQuests.map((quest) => (
            <div
              key={quest.id}
              className={`quest-item ${
                multiSelectMode && selectedQuests.includes(quest.id)
                  ? "selected"
                  : ""
              }`}
            >
              {multiSelectMode && (
                <input
                  type="checkbox"
                  checked={selectedQuests.includes(quest.id)}
                  onChange={() => toggleQuestSelection(quest.id)}
                />
              )}

              <div className="quest-content">
                <h3 className="quest-title">{quest.title}</h3>
                <p className="quest-desc">{quest.description}</p>
                {quest.completed && (
                  <p className="quest-completed">
                    <em>Completed at: {quest.completedAt}</em>
                  </p>
                )}
              </div>

              {/* Normal quest actions */}
              {!multiSelectMode && (
                <div className="quest-actions">
                  {!quest.completed && (
                    <button
                      className="icon-button"
                      data-tooltip="Complete Quest"
                      onClick={() => handleCompleteQuest(quest.id)}
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    className="icon-button"
                    data-tooltip={
                      quest.completed ? "Remove Quest" : "Abort Quest?"
                    }
                    onClick={() => handleDeleteQuest(quest.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

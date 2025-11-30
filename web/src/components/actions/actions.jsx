import React from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import "./actions.scss";

export default function ActionsCell({ data , handleView, onDelete}) {
  return (
    <div className="action-buttons">
      <button className="btn-action view" onClick={handleView}>
        <Eye size={18} />
      </button>
      <button className="btn-action delete" onClick={onDelete}>
        <Trash size={18} />
      </button>
    </div>
  );
}

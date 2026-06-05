"use client";

import { useState } from "react";
import { MessageSquarePlus, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InternalNote } from "@/lib/types";

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface InternalNotesPanelProps {
  notes: InternalNote[];
  onAddNote?: (content: string) => void;
}

export function InternalNotesPanel({ notes, onAddNote }: InternalNotesPanelProps) {
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setSubmitting(true);
    await onAddNote?.(trimmed);
    setDraft("");
    setSubmitting(false);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <MessageSquarePlus className="size-4 text-primary" />
          Internal Notes
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet for this merchant.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note.id}
                className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.07]"
              >
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                    <User className="size-3 text-muted-foreground" />
                    {note.author}
                  </span>
                  <time className="text-[11px] text-muted-foreground shrink-0">
                    {formatTimestamp(note.createdAt)}
                  </time>
                </div>
                <p className="text-sm text-foreground/75 leading-relaxed">{note.content}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-2 pt-1">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add an internal note..."
            rows={3}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleSubmit}
            disabled={!draft.trim() || submitting}
          >
            {submitting ? "Appending..." : "Append Note"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


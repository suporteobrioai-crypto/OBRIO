"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ACTIVE_PROJECT_STORAGE_KEY,
  type ObraView,
  type ShellProject
} from "@/lib/obras";

export function useObraAtiva(shellProjects: ShellProject[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (shellProjects.length === 0) {
      setActiveId(null);
      return;
    }
    const saved = window.localStorage.getItem(ACTIVE_PROJECT_STORAGE_KEY);
    const exists = saved && shellProjects.some((p) => p.id === saved);
    if (exists) {
      setActiveId(saved);
      return;
    }
    const firstActive =
      shellProjects.find((p) => !p.archived) ?? shellProjects[0];
    setActiveId(firstActive.id);
    window.localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, firstActive.id);
  }, [shellProjects]);

  const activeProject =
    shellProjects.find((p) => p.id === activeId) ??
    shellProjects.find((p) => !p.archived) ??
    shellProjects[0] ??
    null;

  const setActive = useCallback((project: ShellProject | ObraView) => {
    setActiveId(project.id);
    window.localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, project.id);
    window.dispatchEvent(
      new CustomEvent("obrio:project-change", { detail: project })
    );
  }, []);

  return { activeProject, activeId, setActive };
}

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { jobService } from "../services/api";

export function useSavedJobIds() {
  const { isAuthenticated, user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "jobSeeker") {
      return;
    }

    let isMounted = true;

    async function loadSavedJobs() {
      try {
        const { data } = await jobService.getSavedJobs();
        if (isMounted) {
          setSavedJobs(data.jobs || []);
        }
      } catch {
        if (isMounted) {
          setSavedJobs([]);
        }
      }
    }

    loadSavedJobs();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.role]);

  return useMemo(
    () => {
      if (!isAuthenticated || user?.role !== "jobSeeker") {
        return new Set();
      }

      return new Set(savedJobs.map((job) => String(job._id)));
    },
    [isAuthenticated, savedJobs, user?.role],
  );
}
